package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

/**
 * Les finances et les entreprises : lignes budgétaires, engagements de
 * dépense, prestataires attributaires.
 *
 * <p>Le SICRB n'exécute aucun paiement : il suit le circuit — proposition,
 * visa, engagement, liquidation, paiement — et conserve la trace de chaque
 * passage. Le dossier de cadrage est explicite sur ce point.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class FinanceResource {

    /* --------------------------------------------------------------- Budget */

    @GET
    @Path("/finances/lignes")
    public Page<LigneBudgetaire> lignes(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("exercice") Integer exercice,
            @QueryParam("source") String source,
            @QueryParam("programmeId") String programmeId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("exercice", exercice)
                .egal("source", source)
                .egal("programmeId", programmeId)
                .texte(q, "libelle", "code");

        Sort tri = Requetes.tri(sort, "code", "code", "libelle", "exercice", "dotation", "engage", "paye");
        PanacheQuery<LigneBudgetaire> query = f.vide()
                ? LigneBudgetaire.<LigneBudgetaire>findAll(tri)
                : LigneBudgetaire.<LigneBudgetaire>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    @GET
    @Path("/finances/engagements")
    public Page<Engagement> engagements(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("ligneId") String ligneId,
            @QueryParam("projetId") String projetId,
            @QueryParam("prestataireId") String prestataireId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("ligneId", ligneId)
                .egal("projetId", projetId)
                .egal("prestataireId", prestataireId)
                .texte(q, "objet", "reference");

        Sort tri = Requetes.tri(sort, "dateCreation:desc",
                "reference", "objet", "montant", "statut", "dateCreation", "datePaiement");
        PanacheQuery<Engagement> query = f.vide()
                ? Engagement.<Engagement>findAll(tri)
                : Engagement.<Engagement>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /* ---------------------------------------------------------- Prestataires */

    @GET
    @Path("/prestataires")
    public Page<Prestataire> prestataires(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("categorie") String categorie,
            @QueryParam("ville") String ville) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("categorie", categorie)
                .egal("ville", ville)
                .texte(q, "raisonSociale", "rccm", "contact", "ville");

        Sort tri = Requetes.tri(sort, "raisonSociale",
                "raisonSociale", "statut", "categorie", "ville", "marchesAttribues",
                "montantCumule", "notePerformance");
        PanacheQuery<Prestataire> query = f.vide()
                ? Prestataire.<Prestataire>findAll(tri)
                : Prestataire.<Prestataire>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /** Fiche d'une entreprise : ses chantiers et ses engagements. */
    @GET
    @Path("/prestataires/{id}")
    public Response prestataire(@PathParam("id") String id) {
        Prestataire prestataire = Prestataire.findById(id);
        if (prestataire == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Prestataire introuvable : " + id))
                    .build();
        }

        Vues.PrestataireDetail vue = new Vues.PrestataireDetail();
        vue.prestataire = prestataire;
        vue.projets = Projet.list("prestataireId", Sort.by("code"), id);
        vue.engagements = Engagement.list("prestataireId",
                Sort.by("dateCreation", Sort.Direction.Descending), id);

        return Response.ok(vue).build();
    }
}
