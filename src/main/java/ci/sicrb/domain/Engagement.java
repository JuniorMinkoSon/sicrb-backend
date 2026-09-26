package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Engagement de depense impute sur une ligne budgetaire.
 */
@Entity
@Table(name = "engagement")
public class Engagement extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "ligne_id")
    public String ligneId;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "prestataire_id")
    public String prestataireId;

    @Column(name = "objet")
    public String objet;

    @Column(name = "montant")
    public long montant;

    @Column(name = "statut")
    public String statut;

    @Column(name = "date_creation")
    public String dateCreation;

    @Column(name = "date_paiement")
    public String datePaiement;
}
