package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

/**
 * Les portails ouverts : celui du citoyen, celui de l'entreprise.
 *
 * <p>C'est par là qu'un besoin entre dans le système. Le dossier de cadrage en
 * fait le premier maillon de la chaîne — « Citoyens, Besoins, Qualification,
 * Programmation » : une requête déposée ici peut, après instruction, rejoindre
 * la programmation régionale.
 */
@Path("/portail")
@Produces(MediaType.APPLICATION_JSON)
public class PortailResource {

    /* -------------------------------------------------------------- Citoyens */

    @GET
    @Path("/citoyen/requetes")
    public Page<RequeteCitoyenne> requetes(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("categorie") String categorie,
            @QueryParam("territoireId") String territoireId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("categorie", categorie)
                .egal("territoireId", territoireId)
                .texte(q, "objet", "reference", "categorie");

        Sort tri = Requetes.tri(sort, "deposeeLe:desc",
                "reference", "objet", "statut", "categorie", "deposeeLe");
        PanacheQuery<RequeteCitoyenne> query = f.vide()
                ? RequeteCitoyenne.<RequeteCitoyenne>findAll(tri)
                : RequeteCitoyenne.<RequeteCitoyenne>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    public static class DepotRequete {
        public String objet;
        public String territoireId;
        public String categorie;
    }

    /**
     * Dépôt d'une requête citoyenne.
     *
     * <p>Elle entre au statut « RECUE » et reçoit une référence : c'est elle que
     * l'habitant citera pour suivre son dossier, sans avoir à créer de compte.
     * Le territoire est vérifié — une requête rattachée à une commune qui
     * n'existe pas n'atteindrait jamais le service qui doit l'instruire.
     */
    @POST
    @Path("/citoyen/requetes")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response deposer(DepotRequete depot) {
        if (depot == null || depot.objet == null || depot.objet.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "L'objet de la requête est requis."))
                    .build();
        }
        if (depot.territoireId == null || Territoire.findById(depot.territoireId) == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "Le territoire concerné est requis et doit exister."))
                    .build();
        }

        RequeteCitoyenne r = new RequeteCitoyenne();
        r.id = "req-" + UUID.randomUUID().toString().substring(0, 8);
        r.reference = "REQ-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", RequeteCitoyenne.count() + 1);
        r.objet = depot.objet.trim();
        r.territoireId = depot.territoireId;
        r.categorie = depot.categorie == null || depot.categorie.isBlank() ? "AUTRE" : depot.categorie;
        r.statut = "RECUE";
        r.deposeeLe = LocalDate.now().toString();
        r.canal = "PORTAIL";
        r.persist();

        return Response.status(Response.Status.CREATED).entity(r).build();
    }

    /* ----------------------------------------------------------- Entreprises */

    @GET
    @Path("/entrepreneur/demarches")
    public Page<DemarcheEntreprise> demarches(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .texte(q, "objet", "reference", "entreprise");

        Sort tri = Requetes.tri(sort, "deposeeLe:desc",
                "reference", "entreprise", "objet", "statut", "deposeeLe", "echeance");
        PanacheQuery<DemarcheEntreprise> query = f.vide()
                ? DemarcheEntreprise.<DemarcheEntreprise>findAll(tri)
                : DemarcheEntreprise.<DemarcheEntreprise>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }
}
