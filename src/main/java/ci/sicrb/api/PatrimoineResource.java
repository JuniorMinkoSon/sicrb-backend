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
 * Le patrimoine régional : les ouvrages livrés, leur entretien, et le matériel
 * inscrit à l'inventaire.
 *
 * <p>Un projet se termine, l'ouvrage reste : c'est ce passage du suivi de
 * chantier à la gestion patrimoniale que ce module porte.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class PatrimoineResource {

    /* ---------------------------------------------------------- Infrastructures */

    @GET
    @Path("/infrastructures")
    public Page<Infrastructure> infrastructures(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("etat") String etat,
            @QueryParam("type") String type,
            @QueryParam("territoireId") String territoireId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("etat", etat)
                .egal("type", type)
                .egal("territoireId", territoireId)
                .texte(q, "designation", "code", "type");

        Sort tri = Requetes.tri(sort, "code",
                "code", "designation", "type", "etat", "valeurPatrimoniale", "prochaineVisite");
        PanacheQuery<Infrastructure> query = f.vide()
                ? Infrastructure.<Infrastructure>findAll(tri)
                : Infrastructure.<Infrastructure>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /* ------------------------------------------------------------- Maintenances */

    @GET
    @Path("/maintenances")
    public Page<Maintenance> maintenances(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("statut") String statut,
            @QueryParam("type") String type,
            @QueryParam("infrastructureId") String infrastructureId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("statut", statut)
                .egal("type", type)
                .egal("infrastructureId", infrastructureId)
                .texte(q, "reference", "description");

        Sort tri = Requetes.tri(sort, "signaleLe:desc",
                "reference", "signaleLe", "statut", "type", "cout");
        PanacheQuery<Maintenance> query = f.vide()
                ? Maintenance.<Maintenance>findAll(tri)
                : Maintenance.<Maintenance>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /** Ce que le frontend envoie pour signaler une intervention à faire. */
    public static class DemandeMaintenance {
        public String infrastructureId;
        public String type;
        public String description;
    }

    /**
     * Signalement d'une intervention.
     *
     * <p>La demande entre au statut « DEMANDEE » et rien d'autre : la
     * planification et le chiffrage relèvent du service technique, pas de
     * celui qui signale. Lui laisser fixer un coût ou une date donnerait une
     * information que personne n'a validée.
     */
    @POST
    @Path("/maintenances")
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response demanderMaintenance(DemandeMaintenance demande) {
        if (demande == null || demande.infrastructureId == null || demande.infrastructureId.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("message", "L'ouvrage concerné est requis."))
                    .build();
        }
        Infrastructure ouvrage = Infrastructure.findById(demande.infrastructureId);
        if (ouvrage == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Ouvrage introuvable : " + demande.infrastructureId))
                    .build();
        }

        Maintenance m = new Maintenance();
        m.id = "mnt-" + UUID.randomUUID().toString().substring(0, 8);
        m.reference = "MNT-" + LocalDate.now().getYear() + "-"
                + String.format("%04d", Maintenance.count() + 1);
        m.infrastructureId = demande.infrastructureId;
        m.type = demande.type == null || demande.type.isBlank() ? "CORRECTIVE" : demande.type;
        m.statut = "DEMANDEE";
        m.signaleLe = LocalDate.now().toString();
        m.description = demande.description == null ? "" : demande.description;
        m.cout = 0;
        m.persist();

        return Response.status(Response.Status.CREATED).entity(m).build();
    }

    /* -------------------------------------------------------------- Équipements */

    @GET
    @Path("/equipements")
    public Page<Equipement> equipements(
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
                .texte(q, "designation", "code", "immatriculation", "affectation");

        Sort tri = Requetes.tri(sort, "code",
                "code", "designation", "categorie", "statut", "valeurAcquisition", "acquisLe");
        PanacheQuery<Equipement> query = f.vide()
                ? Equipement.<Equipement>findAll(tri)
                : Equipement.<Equipement>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }
}
