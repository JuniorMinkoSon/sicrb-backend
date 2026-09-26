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
 * La planification : programmes annuels d'investissement, programmes
 * sectoriels, et les séances du Conseil qui les adoptent.
 *
 * <p>Les trois vivent ensemble : un PAI se vote en séance, se décline en
 * programmes, et chaque programme porte ses projets. Les séparer en trois
 * ressources obligerait à ouvrir trois fichiers pour relire un même circuit.
 */
@Path("/")
@Produces(MediaType.APPLICATION_JSON)
public class PlanificationResource {

    /* --------------------------------------------------------------------- PAI */

    /**
     * Les PAI, tous d'un coup : il y en a un par mandature, jamais assez pour
     * mériter une pagination, et le sélecteur de l'écran les veut tous.
     */
    @GET
    @Path("/planification/pai")
    public List<Pai> pais() {
        return Pai.listAll(Sort.by("anneeDebut", Sort.Direction.Descending));
    }

    /* -------------------------------------------------------------- Programmes */

    private static final String[] PROGRAMME_TRIABLES = {
        "code", "intitule", "secteur", "statut", "budgetPrevu", "avancement", "dateDebut"
    };

    @GET
    @Path("/programmes")
    public Page<Programme> programmes(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("secteur") String secteur,
            @QueryParam("statut") String statut,
            @QueryParam("paiId") String paiId,
            @QueryParam("axeId") String axeId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("secteur", secteur)
                .egal("statut", statut)
                .egal("paiId", paiId)
                .egal("axeId", axeId)
                .texte(q, "intitule", "code", "responsable");

        Sort tri = Requetes.tri(sort, "code", PROGRAMME_TRIABLES);
        PanacheQuery<Programme> query = f.vide()
                ? Programme.<Programme>findAll(tri)
                : Programme.<Programme>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    @GET
    @Path("/programmes/{id}")
    public Response programme(@PathParam("id") String id) {
        Programme programme = Programme.findById(id);
        if (programme == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Programme introuvable : " + id))
                    .build();
        }

        Vues.ProgrammeDetail vue = new Vues.ProgrammeDetail();
        vue.programme = programme;
        vue.pai = programme.paiId == null ? null : Pai.findById(programme.paiId);
        vue.projets = Projet.list("programmeId", Sort.by("code"), id);
        vue.indicateurs = Indicateur.list("programmeId", Sort.by("code"), id);
        vue.lignes = LigneBudgetaire.list("programmeId", Sort.by("code"), id);

        return Response.ok(vue).build();
    }

    /* -------------------------------------------------------------- Gouvernance */

    private static final String[] SESSION_TRIABLES = {"date", "intitule", "type", "statut"};

    @GET
    @Path("/gouvernance/sessions")
    public Page<SessionDeliberante> sessions(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("type") String type,
            @QueryParam("statut") String statut) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("type", type)
                .egal("statut", statut)
                .texte(q, "intitule");

        Sort tri = Requetes.tri(sort, "date:desc", SESSION_TRIABLES);
        PanacheQuery<SessionDeliberante> query = f.vide()
                ? SessionDeliberante.<SessionDeliberante>findAll(tri)
                : SessionDeliberante.<SessionDeliberante>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }
}
