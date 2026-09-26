package ci.sicrb.api;

import ci.sicrb.domain.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Réponses composites du contrat.
 *
 * <p>Une fiche de projet réunit onze collections liées. Les charger par onze
 * appels ferait onze allers-retours, onze états de chargement et autant de
 * moments où l'écran est incohérent : le serveur les assemble en une réponse,
 * exactement comme {@code ProjetDetail} le décrit côté frontend.
 *
 * <p>Regroupées dans un seul fichier : ce sont des formes de transport, sans
 * comportement, et les éparpiller ferait treize fichiers d'une dizaine de
 * lignes qu'il faudrait ouvrir ensemble pour relire un contrat.
 */
public final class Vues {

    private Vues() {
    }

    /** Fiche complète d'un projet : le « Projet 360° » du dossier de cadrage. */
    public static class ProjetDetail {
        public Projet projet;
        public Programme programme;
        public Territoire territoire;
        public Prestataire prestataire;
        public Controleur controleur;
        public List<Jalon> jalons = new ArrayList<>();
        public List<Engagement> engagements = new ArrayList<>();
        public List<GedDocument> documents = new ArrayList<>();
        public List<MissionControle> missions = new ArrayList<>();
        public List<Infrastructure> infrastructures = new ArrayList<>();
        public List<WorkflowInstance> workflows = new ArrayList<>();
    }

    public static class ProgrammeDetail {
        public Programme programme;
        public Pai pai;
        public List<Projet> projets = new ArrayList<>();
        public List<Indicateur> indicateurs = new ArrayList<>();
        public List<LigneBudgetaire> lignes = new ArrayList<>();
    }

    public static class TerritoireDetail {
        public Territoire territoire;
        public List<Territoire> enfants = new ArrayList<>();
        public List<Projet> projets = new ArrayList<>();
        public List<Infrastructure> infrastructures = new ArrayList<>();
        public List<RequeteCitoyenne> requetes = new ArrayList<>();
    }

    public static class PrestataireDetail {
        public Prestataire prestataire;
        public List<Projet> projets = new ArrayList<>();
        public List<Engagement> engagements = new ArrayList<>();
    }

    /** Une entrée de la recherche globale, telle que la barre du haut l'affiche. */
    public static class ResultatRecherche {
        public String module;
        public String libelle;
        public String sousTitre;
        public String href;

        public ResultatRecherche() {
        }

        public ResultatRecherche(String module, String libelle, String sousTitre, String href) {
            this.module = module;
            this.libelle = libelle;
            this.sousTitre = sousTitre;
            this.href = href;
        }
    }

    /* ------------------------------------------------------------ Tableau de bord */

    public static class PartSecteur {
        public String secteur;
        public long budget;
        public long projets;

        public PartSecteur(String secteur, long budget, long projets) {
            this.secteur = secteur;
            this.budget = budget;
            this.projets = projets;
        }
    }

    public static class PartStatut {
        public String statut;
        public long projets;

        public PartStatut(String statut, long projets) {
            this.statut = statut;
            this.projets = projets;
        }
    }

    public static class PointExecution {
        public String periode;
        public long engage;
        public long paye;

        public PointExecution(String periode, long engage, long paye) {
            this.periode = periode;
            this.engage = engage;
            this.paye = paye;
        }
    }

    public static class PartTerritoire {
        public String territoireId;
        public String nom;
        public long projets;
        public long budget;

        public PartTerritoire(String territoireId, String nom, long projets, long budget) {
            this.territoireId = territoireId;
            this.nom = nom;
            this.projets = projets;
            this.budget = budget;
        }
    }

    /** Synthèse d'ouverture : ce que le Président voit en arrivant. */
    public static class DashboardSynthese {
        public long budgetPrevu;
        public long budgetEngage;
        public long budgetPaye;
        public long nbProgrammes;
        public long nbProjets;
        public long nbProjetsEnTravaux;
        public long nbProjetsEnRetard;
        public long nbInfrastructures;
        public long beneficiaires;
        public long tauxExecutionPhysique;
        public long tauxExecutionFinanciere;
        public List<PartSecteur> parSecteur = new ArrayList<>();
        public List<PartStatut> parStatut = new ArrayList<>();
        public List<PointExecution> executionMensuelle = new ArrayList<>();
        public List<PartTerritoire> parTerritoire = new ArrayList<>();
    }
}
