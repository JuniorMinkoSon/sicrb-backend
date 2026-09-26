package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Ouvrage livre et entre au patrimoine regional.
 */
@Entity
@Table(name = "infrastructure")
public class Infrastructure extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "designation")
    public String designation;

    @Column(name = "type")
    public String type;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "etat")
    public String etat;

    @Column(name = "mise_en_service_le")
    public String miseEnServiceLe;

    @Column(name = "latitude")
    public double latitude;

    @Column(name = "longitude")
    public double longitude;

    @Column(name = "valeur_patrimoniale")
    public long valeurPatrimoniale;

    @Column(name = "derniere_visite")
    public String derniereVisite;

    @Column(name = "prochaine_visite")
    public String prochaineVisite;
}
