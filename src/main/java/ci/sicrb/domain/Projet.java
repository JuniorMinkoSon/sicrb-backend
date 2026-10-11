package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Operation d'investissement localisee : l'unite de suivi du SICRB.
 */
@Entity
@Table(name = "projet")
public class Projet extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "programme_id")
    public String programmeId;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "secteur")
    public String secteur;

    @Column(name = "statut")
    public String statut;

    @Column(name = "avancement_physique")
    public double avancementPhysique;

    @Column(name = "avancement_financier")
    public double avancementFinancier;

    @Column(name = "budget_prevu")
    public long budgetPrevu;

    @Column(name = "budget_engage")
    public long budgetEngage;

    @Column(name = "budget_paye")
    public long budgetPaye;

    @Column(name = "date_debut")
    public String dateDebut;

    @Column(name = "date_fin_prevue")
    public String dateFinPrevue;

    @Column(name = "date_fin_reelle")
    public String dateFinReelle;

    @Column(name = "prestataire_id")
    public String prestataireId;

    @Column(name = "controleur_id")
    public String controleurId;

    @Column(name = "risque")
    public String risque;

    @Column(name = "latitude")
    public double latitude;

    @Column(name = "longitude")
    public double longitude;

    @Column(name = "beneficiaires")
    public int beneficiaires;

    @Column(name = "maitre_ouvrage")
    public String maitreOuvrage;
}
