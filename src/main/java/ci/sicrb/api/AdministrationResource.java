package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

/**
 * L'administration et la traçabilité : comptes d'accès et journal d'audit.
 *
 * <p>Le dossier de cadrage résume l'attendu en une phrase : savoir qui a fait
 * quoi, quand, sur quel dossier. Le journal est en lecture seule — une trace
 * qu'on peut modifier n'est plus une trace.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class AdministrationResource {

    /* ------------------------------------------------------------ Utilisateurs */

    @GET
    @Path("/administration/utilisateurs")
    public Page<Utilisateur> utilisateurs(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("role") String role,
            @QueryParam("direction") String direction,
            @QueryParam("actif") Boolean actif) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("role", role)
                .egal("direction", direction)
                .egal("actif", actif)
                .texte(q, "nom", "email", "direction");

        Sort tri = Requetes.tri(sort, "nom", "nom", "email", "role", "direction", "dernierAcces");
        PanacheQuery<Utilisateur> query = f.vide()
                ? Utilisateur.<Utilisateur>findAll(tri)
                : Utilisateur.<Utilisateur>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /**
     * Activation ou suspension d'un compte.
     *
     * <p>Bascule plutôt que suppression : un compte effacé emporterait avec lui
     * la lisibilité du journal d'audit, où son nom figure sur des actions
     * passées. Un compte suspendu ne se connecte plus, mais son histoire reste
     * lisible.
     */
    @POST
    @Path("/administration/utilisateurs/{id}/bascule")
    @Transactional
    public Response basculer(@PathParam("id") String id) {
        Utilisateur u = Utilisateur.findById(id);
        if (u == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Compte introuvable : " + id))
                    .build();
        }
        u.actif = !u.actif;
        u.persist();
        return Response.ok(u).build();
    }

    /* ------------------------------------------------------------------ Audit */

    @GET
    @Path("/audit")
    public Page<AuditEntree> audit(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("module") String module,
            @QueryParam("acteur") String acteur,
            @QueryParam("resultat") String resultat) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("module", module)
                .egal("acteur", acteur)
                .egal("resultat", resultat)
                .texte(q, "acteur", "action", "cible", "module");

        Sort tri = Requetes.tri(sort, "horodatage:desc",
                "horodatage", "acteur", "action", "module", "resultat");
        PanacheQuery<AuditEntree> query = f.vide()
                ? AuditEntree.<AuditEntree>findAll(tri)
                : AuditEntree.<AuditEntree>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    /* -------------------------------------------------------------------- GED */

    @GET
    @Path("/ged/documents")
    public Page<GedDocument> documents(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("type") String type,
            @QueryParam("projetId") String projetId,
            @QueryParam("programmeId") String programmeId,
            @QueryParam("confidentiel") Boolean confidentiel) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("type", type)
                .egal("projetId", projetId)
                .egal("programmeId", programmeId)
                .egal("confidentiel", confidentiel)
                .texte(q, "titre", "reference", "deposePar");

        Sort tri = Requetes.tri(sort, "deposeLe:desc",
                "titre", "reference", "type", "deposeLe", "taillekB");
        PanacheQuery<GedDocument> query = f.vide()
                ? GedDocument.<GedDocument>findAll(tri)
                : GedDocument.<GedDocument>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }
}
