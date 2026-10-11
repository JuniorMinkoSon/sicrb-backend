package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Entreprise attributaire de marches regionaux.
 */
@Entity
@Table(name = "prestataire")
public class Prestataire extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "raison_sociale")
    public String raisonSociale;

    @Column(name = "rccm")
    public String rccm;

    @Column(name = "categorie")
    public String categorie;

    @Column(name = "ville")
    public String ville;

    @Column(name = "statut")
    public String statut;

    @Column(name = "contact")
    public String contact;

    @Column(name = "telephone")
    public String telephone;

    @Column(name = "email")
    public String email;

    @Column(name = "marches_attribues")
    public int marchesAttribues;

    @Column(name = "montant_cumule")
    public long montantCumule;

    @Column(name = "note_performance")
    public double notePerformance;
}
