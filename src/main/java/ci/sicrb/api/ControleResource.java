package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Le contrôle : les agents, leurs missions de terrain, et les circuits de
 * validation qui en découlent.
 *
 * <p>Un constat de contrôle n'a de valeur que s'il débouche : les circuits de
 * validation sont donc dans la même ressource, puisque c'est par eux que le
 * constat devient une décision.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class ControleResource {

    /* ---------------------------------------------------------- Contrôleurs */

    /** Ils sont une poignée : la liste complète tient à l'écran et sert de sélecteur. */
    @GET
    @Path("/controleurs")
    public List<Controleur> controleurs() {
        return Controleur.listAll(Sort.by("nom"));
    }

    @GET
    @Path("/controle/missions")
    public Page<MissionControle> missions(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("projetId") String projetId,
            @QueryParam("controleurId") String controleurId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("projetId", projetId)
                .egal("controleurId", controleurId)
                .texte(q, "reference", "observations");

        Sort tri = Requetes.tri(sort, "dateVisite:desc",
                "reference", "dateVisite", "statut", "conformite");
        PanacheQuery<MissionControle> query = f.vide()
                ? MissionControle.<MissionControle>findAll(tri)
                : MissionControle.<MissionControle>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /* ------------------------------------------------------------ Workflows */

    @GET
    @Path("/workflows")
    public Page<WorkflowInstance> workflows(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("type") String type,
            @QueryParam("projetId") String projetId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("type", type)
                .egal("projetId", projetId)
                .texte(q, "objet", "reference");

        Sort tri = Requetes.tri(sort, "ouvertLe:desc", "reference", "objet", "type", "statut", "ouvertLe");
        PanacheQuery<WorkflowInstance> query = f.vide()
                ? WorkflowInstance.<WorkflowInstance>findAll(tri)
                : WorkflowInstance.<WorkflowInstance>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    @GET
    @Path("/workflows/{id}")
    public Response workflow(@PathParam("id") String id) {
        WorkflowInstance w = WorkflowInstance.findById(id);
        if (w == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Circuit introuvable : " + id))
                    .build();
        }
        return Response.ok(w).build();
    }

    public static class Decision {
        public String decision;
        public String commentaire;
    }

    /**
     * Traitement d'une étape.
     *
     * <p>Un rejet clôt le circuit : c'est le sens d'un circuit de validation, et
     * laisser les étapes suivantes ouvertes donnerait à croire qu'il se poursuit.
     * Une validation ne clôt le circuit que s'il ne reste rien après elle ;
     * sinon, elle ouvre l'étape suivante, qui devient celle qu'on attend.
     */
    @POST
    @Path("/workflows/{workflowId}/etapes/{etapeId}/decision")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response traiterEtape(
            @PathParam("workflowId") String workflowId,
            @PathParam("etapeId") String etapeId,
            Decision decision) {

        WorkflowInstance w = WorkflowInstance.findById(workflowId);
        if (w == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Circuit introuvable : " + workflowId))
                    .build();
        }
        if (decision == null || decision.decision == null
                || !(decision.decision.equals("VALIDE") || decision.decision.equals("REJETE"))) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "La décision doit valoir VALIDE ou REJETE."))
                    .build();
        }

        WorkflowEtape cible = w.etapes.stream()
                .filter(e -> e.id.equals(etapeId))
                .findFirst()
                .orElse(null);
        if (cible == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Étape introuvable dans ce circuit : " + etapeId))
                    .build();
        }
        if (!"EN_COURS".equals(w.statut)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("message", "Ce circuit est déjà clos ; son étape ne peut plus être traitée."))
                    .build();
        }

        String aujourdHui = LocalDate.now().toString();
        cible.statut = decision.decision;
        cible.traiteLe = aujourdHui;
        cible.commentaire = decision.commentaire;

        if ("REJETE".equals(decision.decision)) {
            w.statut = "REJETE";
            w.clotureLe = aujourdHui;
        } else {
            WorkflowEtape suivante = w.etapes.stream()
                    .filter(e -> e.ordre > cible.ordre && "A_FAIRE".equals(e.statut))
                    .min((a, b) -> Integer.compare(a.ordre, b.ordre))
                    .orElse(null);
            if (suivante == null) {
                w.statut = "VALIDE";
                w.clotureLe = aujourdHui;
            } else {
                suivante.statut = "EN_COURS";
            }
        }
        w.persist();

        return Response.ok(w).build();
    }
}
