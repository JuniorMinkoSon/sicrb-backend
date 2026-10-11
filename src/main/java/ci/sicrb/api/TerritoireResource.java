package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Map;

/**
 * Le découpage administratif de la région : région, départements,
 * sous-préfectures, communes.
 *
 * <p>La fiche d'un territoire réunit ce qui s'y passe — projets, ouvrages,
 * requêtes des habitants — parce que c'est la question qu'on lui pose : qu'est-ce
 * qui se fait chez nous.
 */
@Path("/territoires")
@Produces(MediaType.APPLICATION_JSON)
public class TerritoireResource {

    private static final String[] TRIABLES = {"nom", "type", "population", "superficieKm2", "nbLocalites"};

    @GET
    public Page<Territoire> liste(
            @QueryParam("page") Integer page,
            @QueryParam("size") Integer size,
            @QueryParam("sort") String sort,
            @QueryParam("q") String q,
            @QueryParam("type") String type,
            @QueryParam("parentId") String parentId) {

        Requetes.Filtre f = new Requetes.Filtre()
                .egal("type", type)
                .egal("parentId", parentId)
                .texte(q, "nom", "chefLieu");

        Sort tri = Requetes.tri(sort, "nom", TRIABLES);
        PanacheQuery<Territoire> query = f.vide()
                ? Territoire.<Territoire>findAll(tri)
                : Territoire.<Territoire>find(f.hql(), tri, f.valeurs());
        return Requetes.paginer(query, page, size);
    }

    @GET
    @Path("/{id}")
    public Response fiche(@PathParam("id") String id) {
        Territoire territoire = Territoire.findById(id);
        if (territoire == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("message", "Territoire introuvable : " + id))
                    .build();
        }

        Vues.TerritoireDetail vue = new Vues.TerritoireDetail();
        vue.territoire = territoire;
        vue.enfants = Territoire.list("parentId", Sort.by("nom"), id);
        vue.projets = Projet.list("territoireId", Sort.by("code"), id);
        vue.infrastructures = Infrastructure.list("territoireId", Sort.by("code"), id);
        vue.requetes = RequeteCitoyenne.list("territoireId",
                Sort.by("deposeeLe", Sort.Direction.Descending), id);

        return Response.ok(vue).build();
    }
}
