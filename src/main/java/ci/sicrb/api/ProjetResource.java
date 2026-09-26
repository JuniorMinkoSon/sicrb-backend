package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

/**
 * Les projets : l'unité de suivi du SICRB.
 *
 * <p>Trois lectures coexistent, parce que trois écrans en ont besoin : la liste
 * paginée du module Projets, la fiche complète, et la couche cartographique —
 * qui veut tous les points d'un coup et rien d'autre que de quoi les placer.
 */
@Path("/projets")
@Produces(MediaType.APPLICATION_JSON)
public class ProjetResource {

    private static final String TRI_DEFAUT = "code";
    private static final String[] TRIABLES = {
        "code", "intitule", "statut", "secteur", "budgetPrevu", "avancementPhysique",
        "dateDebut", "dateFinPrevue", "risque"
    };

    @GET
    public Page<Projet> liste(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("secteur") String secteur,
            @QueryParam("programmeId") String programmeId,
            @QueryParam("territoireId") String territoireId,
            @QueryParam("risque") String risque) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("secteur", secteur)
                .egal("programmeId", programmeId)
                .egal("territoireId", territoireId)
                .egal("risque", risque)
                .texte(q, "intitule", "code", "maitreOuvrage");

        Sort tri = Requetes.tri(sort, TRI_DEFAUT, TRIABLES);
        PanacheQuery<Projet> query = f.vide()
                ? Projet.<Projet>findAll(tri)
                : Projet.<Projet>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /**
     * Couche cartographique.
     *
     * <p>Sans pagination : une carte qui n'afficherait que dix points sur cent
     * trente donnerait une lecture fausse de la répartition territoriale, qui
     * est précisément ce qu'on vient y chercher. Le plafond protège malgré tout
     * le navigateur si le parc grossit.
     */
    @GET
    @Path("/geo")
    public List<Projet> geo(
            @QueryParam("statut") String statut,
            @QueryParam("secteur") String secteur,
            @QueryParam("territoireId") String territoireId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("secteur", secteur)
                .egal("territoireId", territoireId);

        Sort tri = Sort.by("code");
        PanacheQuery<Projet> query = f.vide()
                ? Projet.<Projet>findAll(tri)
                : Projet.<Projet>find(f.hql(), tri, f.valeurs());
        return query.page(0, 2000).list();
    }

    /** Fiche complète : tout ce qui se rattache au projet, en une réponse. */
    @GET
    @Path("/{id}")
    public Response fiche(@PathParam("id") String id) {
        Projet projet = Projet.findById(id);
        if (projet == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Projet introuvable : " + id))
                    .build();
        }

        Vues.ProjetDetail vue = new Vues.ProjetDetail();
        vue.projet = projet;
        vue.programme = projet.programmeId == null ? null : Programme.findById(projet.programmeId);
        vue.territoire = projet.territoireId == null ? null : Territoire.findById(projet.territoireId);
        vue.prestataire = projet.prestataireId == null ? null : Prestataire.findById(projet.prestataireId);
        vue.controleur = projet.controleurId == null ? null : Controleur.findById(projet.controleurId);

        vue.jalons = Jalon.list("projetId", Sort.by("datePrevue"), id);
        vue.engagements = Engagement.list("projetId", Sort.by("dateCreation"), id);
        vue.documents = GedDocument.list("projetId", Sort.by("deposeLe", Sort.Direction.Descending), id);
        vue.missions = MissionControle.list("projetId", Sort.by("dateVisite", Sort.Direction.Descending), id);
        vue.infrastructures = Infrastructure.list("projetId", Sort.by("code"), id);
        vue.workflows = WorkflowInstance.list("projetId", Sort.by("ouvertLe", Sort.Direction.Descending), id);

        return Response.ok(vue).build();
    }
}
