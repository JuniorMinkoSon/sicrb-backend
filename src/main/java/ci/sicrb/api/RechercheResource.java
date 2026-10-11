package ci.sicrb.api;

import ci.sicrb.domain.*;
import io.quarkus.panache.common.Sort;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

/**
 * La recherche globale de la barre du haut.
 *
 * <p>Elle balaie les objets qu'on cherche par leur nom — un projet, un
 * territoire, une entreprise, un ouvrage, un document — et rend de quoi y aller
 * directement. Pas les journaux ni les lignes budgétaires : on ne les cherche
 * pas au clavier, on les filtre dans leur module.
 *
 * <p>Quelques résultats par famille suffisent : une recherche qui rend trois
 * cents lignes oblige à chercher dans la recherche.
 */
@Path("/recherche")
@Produces(MediaType.APPLICATION_JSON)
public class RechercheResource {

    /** Au-delà, la liste déroulante cesse d'aider. */
    private static final int PAR_FAMILLE = 5;

    @GET
    public List<Vues.ResultatRecherche> rechercher(@QueryParam("q") String q) {
        List<Vues.ResultatRecherche> out = new ArrayList<>();
        if (q == null || q.trim().length() < 2) {
            // Une lettre unique renverrait presque tout : on attend d'avoir de
            // quoi discriminer plutôt que d'inonder l'utilisateur.
            return out;
        }
        String motif = "%" + q.trim().toLowerCase() + "%";

        List<Projet> projets = Projet
                .find("lower(intitule) like ?1 or lower(code) like ?1", Sort.by("code"), motif)
                .page(0, PAR_FAMILLE).list();
        for (Projet p : projets) {
            out.add(new Vues.ResultatRecherche("Projets", p.intitule, p.code + " · " + p.statut,
                    "/projets/" + p.id));
        }

        List<Territoire> territoires = Territoire
                .find("lower(nom) like ?1 or lower(chefLieu) like ?1", Sort.by("nom"), motif)
                .page(0, PAR_FAMILLE).list();
        for (Territoire t : territoires) {
            out.add(new Vues.ResultatRecherche("Territoires", t.nom, t.type + " · " + t.chefLieu,
                    "/territoires/" + t.id));
        }

        List<Programme> programmes = Programme
                .find("lower(intitule) like ?1 or lower(code) like ?1", Sort.by("code"), motif)
                .page(0, PAR_FAMILLE).list();
        for (Programme p : programmes) {
            out.add(new Vues.ResultatRecherche("Programmes", p.intitule, p.code + " · " + p.secteur,
                    "/programmes/" + p.id));
        }

        List<Prestataire> prestataires = Prestataire
                .find("lower(raisonSociale) like ?1 or lower(rccm) like ?1", Sort.by("raisonSociale"), motif)
                .page(0, PAR_FAMILLE).list();
        for (Prestataire p : prestataires) {
            out.add(new Vues.ResultatRecherche("Prestataires", p.raisonSociale,
                    p.categorie + " · " + p.ville, "/prestataires/" + p.id));
        }

        List<Infrastructure> ouvrages = Infrastructure
                .find("lower(designation) like ?1 or lower(code) like ?1", Sort.by("code"), motif)
                .page(0, PAR_FAMILLE).list();
        for (Infrastructure i : ouvrages) {
            out.add(new Vues.ResultatRecherche("Patrimoine", i.designation, i.type + " · " + i.etat,
                    "/infrastructures/" + i.id));
        }

        List<GedDocument> documents = GedDocument
                .find("lower(titre) like ?1 or lower(reference) like ?1",
                        Sort.by("deposeLe", Sort.Direction.Descending), motif)
                .page(0, PAR_FAMILLE).list();
        for (GedDocument d : documents) {
            out.add(new Vues.ResultatRecherche("Documents", d.titre, d.type + " · " + d.deposeLe,
                    "/ged/" + d.id));
        }

        return out;
    }
}
