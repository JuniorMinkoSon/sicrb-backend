package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Besoin ou reclamation depose par un habitant de la region.
 */
@Entity
@Table(name = "requete_citoyenne")
public class RequeteCitoyenne extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "objet")
    public String objet;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "categorie")
    public String categorie;

    @Column(name = "statut")
    public String statut;

    @Column(name = "deposee_le")
    public String deposeeLe;

    @Column(name = "traitee_le")
    public String traiteeLe;

    @Column(name = "canal")
    public String canal;
}
