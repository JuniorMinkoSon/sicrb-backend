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
 * L'analyse et la décision : indicateurs, mesures d'impact, alertes,
 * arbitrages et modèles de rapport.
 *
 * <p>C'est la dernière étape de la chaîne décrite au dossier de cadrage —
 * « Réalisation, impact et rapport » — et celle qui remonte à la gouvernance
 * ce que le terrain a produit.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class AnalyseResource {

    /* ------------------------------------------------------------ Indicateurs */

    @GET
    @Path("/indicateurs")
    public Page<Indicateur> indicateurs(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("secteur") String secteur,
            @QueryParam("territoireId") String territoireId,
            @QueryParam("programmeId") String programmeId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("secteur", secteur)
                .egal("territoireId", territoireId)
                .egal("programmeId", programmeId)
                .texte(q, "libelle", "code", "source");

        Sort tri = Requetes.tri(sort, "code", "code", "libelle", "secteur", "valeur", "cible");
        PanacheQuery<Indicateur> query = f.vide()
                ? Indicateur.<Indicateur>findAll(tri)
                : Indicateur.<Indicateur>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    @GET
    @Path("/impact/mesures")
    public Page<ImpactMesure> impacts(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("secteur") String secteur,
            @QueryParam("territoireId") String territoireId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("secteur", secteur)
                .egal("territoireId", territoireId)
                .texte(q, "libelle");

        Sort tri = Requetes.tri(sort, "mesureLe:desc", "libelle", "secteur", "beneficiaires", "mesureLe");
        PanacheQuery<ImpactMesure> query = f.vide()
                ? ImpactMesure.<ImpactMesure>findAll(tri)
                : ImpactMesure.<ImpactMesure>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /* --------------------------------------------------------------- Décision */

    /** Les alertes ouvrent le tableau de bord : les plus graves d'abord. */
    @GET
    @Path("/decision/alertes")
    public List<Alerte> alertes() {
        return Alerte.listAll(Sort.by("detecteLe", Sort.Direction.Descending));
    }

    @GET
    @Path("/decision/arbitrages")
    public List<Arbitrage> arbitrages() {
        return Arbitrage.listAll(Sort.by("statut").and("intitule"));
    }

    public static class ChoixArbitrage {
        public String option;
    }

    /**
     * Arbitrage rendu.
     *
     * <p>Un arbitrage déjà tranché n'est pas rejoué : la décision est datée et
     * archivée, la rouvrir silencieusement effacerait qui a décidé quoi et
     * quand — ce que le module de traçabilité est précisément là pour garder.
     */
    @POST
    @Path("/decision/arbitrages/{id}/decision")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response arbitrer(@PathParam("id") String id, ChoixArbitrage choix) {
        Arbitrage a = Arbitrage.findById(id);
        if (a == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Arbitrage introuvable : " + id))
                    .build();
        }
        if (choix == null || choix.option == null || choix.option.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "L'option retenue est requise."))
                    .build();
        }
        if ("ARBITRE".equals(a.statut)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(Map.of("message", "Cet arbitrage a déjà été rendu le " + a.decideLe + "."))
                    .build();
        }

        boolean connue = a.options.stream().anyMatch(o -> o.libelle.equals(choix.option));
        if (!connue) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Cette option ne figure pas parmi celles soumises."))
                    .build();
        }

        a.optionRetenue = choix.option;
        a.statut = "ARBITRE";
        a.decideLe = LocalDate.now().toString();
        a.persist();

        return Response.ok(a).build();
    }

    /* --------------------------------------------------------------- Rapports */

    @GET
    @Path("/rapports/modeles")
    public List<RapportModele> rapports() {
        return RapportModele.listAll(Sort.by("intitule"));
    }
}
