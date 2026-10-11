package ci.sicrb.api;

import ci.sicrb.domain.*;
import jakarta.persistence.EntityManager;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * La synthèse d'ouverture.
 *
 * <p>C'est le premier écran de la gouvernance : investissements cumulés,
 * exécution physique et financière, répartition par secteur et par territoire.
 *
 * <p>Tout est agrégé en base. Le jeu de démonstration du frontend répartissait
 * l'exécution mensuelle par une formule, faute d'avoir les dates sous la main ;
 * ici les engagements les portent réellement — un engagement a une date de
 * création et une date de paiement. La courbe montre donc l'exécution telle
 * qu'elle s'est faite, et non une silhouette plausible.
 */
@Path("/dashboard")
@Produces(MediaType.APPLICATION_JSON)
public class DashboardResource {

    @Inject
    EntityManager em;

    @GET
    @Path("/synthese")
    public Vues.DashboardSynthese synthese() {
        Vues.DashboardSynthese s = new Vues.DashboardSynthese();

        Object[] budgets = (Object[]) em.createQuery(
                "select coalesce(sum(p.budgetPrevu),0), coalesce(sum(p.budgetEngage),0), "
                        + "coalesce(sum(p.budgetPaye),0) from Programme p").getSingleResult();
        s.budgetPrevu = ((Number) budgets[0]).longValue();
        s.budgetEngage = ((Number) budgets[1]).longValue();
        s.budgetPaye = ((Number) budgets[2]).longValue();

        s.nbProgrammes = Programme.count();
        s.nbProjets = Projet.count();
        s.nbProjetsEnTravaux = Projet.count("statut", "EN_TRAVAUX");
        // Le retard n'est pas une colonne : c'est le risque élevé qui le signale,
        // comme sur les écrans de pilotage.
        s.nbProjetsEnRetard = Projet.count("risque", "ELEVE");
        s.nbInfrastructures = Infrastructure.count();

        Number beneficiaires = (Number) em.createQuery(
                "select coalesce(sum(p.beneficiaires),0) from Projet p").getSingleResult();
        s.beneficiaires = beneficiaires.longValue();

        Number moyenne = (Number) em.createQuery(
                "select coalesce(avg(p.avancementPhysique),0) from Projet p").getSingleResult();
        s.tauxExecutionPhysique = Math.round(moyenne.doubleValue());
        s.tauxExecutionFinanciere = s.budgetPrevu == 0
                ? 0
                : Math.round((double) s.budgetPaye / s.budgetPrevu * 100);

        @SuppressWarnings("unchecked")
        List<Object[]> parSecteur = em.createQuery(
                "select p.secteur, coalesce(sum(p.budgetPrevu),0), count(p) from Projet p "
                        + "group by p.secteur order by sum(p.budgetPrevu) desc").getResultList();
        for (Object[] r : parSecteur) {
            s.parSecteur.add(new Vues.PartSecteur(
                    (String) r[0], ((Number) r[1]).longValue(), ((Number) r[2]).longValue()));
        }

        @SuppressWarnings("unchecked")
        List<Object[]> parStatut = em.createQuery(
                "select p.statut, count(p) from Projet p group by p.statut order by count(p) desc")
                .getResultList();
        for (Object[] r : parStatut) {
            s.parStatut.add(new Vues.PartStatut((String) r[0], ((Number) r[1]).longValue()));
        }

        s.executionMensuelle = executionMensuelle();

        @SuppressWarnings("unchecked")
        List<Object[]> parTerritoire = em.createQuery(
                "select t.id, t.nom, count(p), coalesce(sum(p.budgetPrevu),0) "
                        + "from Projet p join Territoire t on t.id = p.territoireId "
                        + "group by t.id, t.nom order by sum(p.budgetPrevu) desc").getResultList();
        for (Object[] r : parTerritoire) {
            s.parTerritoire.add(new Vues.PartTerritoire(
                    (String) r[0], (String) r[1], ((Number) r[2]).longValue(), ((Number) r[3]).longValue()));
        }

        return s;
    }

    /**
     * Exécution mois par mois, sur les douze derniers mois où il s'est passé
     * quelque chose.
     *
     * <p>Les dates sont stockées en texte ISO : les six premiers caractères
     * donnent le mois, ce qui évite une conversion coûteuse et reste juste tant
     * que le format ne change pas — c'est celui que le contrat impose.
     */
    private List<Vues.PointExecution> executionMensuelle() {
        Map<String, long[]> parMois = new LinkedHashMap<>();

        @SuppressWarnings("unchecked")
        List<Object[]> engages = em.createQuery(
                "select substring(e.dateCreation, 1, 7), coalesce(sum(e.montant),0) from Engagement e "
                        + "where e.dateCreation is not null group by substring(e.dateCreation, 1, 7)")
                .getResultList();
        for (Object[] r : engages) {
            parMois.computeIfAbsent((String) r[0], k -> new long[2])[0] = ((Number) r[1]).longValue();
        }

        @SuppressWarnings("unchecked")
        List<Object[]> payes = em.createQuery(
                "select substring(e.datePaiement, 1, 7), coalesce(sum(e.montant),0) from Engagement e "
                        + "where e.datePaiement is not null group by substring(e.datePaiement, 1, 7)")
                .getResultList();
        for (Object[] r : payes) {
            parMois.computeIfAbsent((String) r[0], k -> new long[2])[1] = ((Number) r[1]).longValue();
        }

        List<String> mois = new ArrayList<>(parMois.keySet());
        mois.sort(String::compareTo);
        if (mois.size() > 12) {
            mois = mois.subList(mois.size() - 12, mois.size());
        }

        List<Vues.PointExecution> points = new ArrayList<>();
        for (String m : mois) {
            long[] v = parMois.get(m);
            points.add(new Vues.PointExecution(m, v[0], v[1]));
        }
        return points;
    }
}
