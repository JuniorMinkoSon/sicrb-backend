package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Materiel inscrit a l'inventaire du Conseil regional.
 */
@Entity
@Table(name = "equipement")
public class Equipement extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "designation")
    public String designation;

    @Column(name = "categorie")
    public String categorie;

    @Column(name = "statut")
    public String statut;

    @Column(name = "affectation")
    public String affectation;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "acquis_le")
    public String acquisLe;

    @Column(name = "valeur_acquisition")
    public long valeurAcquisition;

    @Column(name = "immatriculation")
    public String immatriculation;
}
