package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Decoupage administratif : region, departement, sous-prefecture ou commune.
 * Le parent porte la hierarchie ; la region est le seul enregistrement sans parent.
 */
@Entity
@Table(name = "territoire")
public class Territoire extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "nom")
    public String nom;

    @Column(name = "type")
    public String type;

    @Column(name = "parent_id")
    public String parentId;

    @Column(name = "chef_lieu")
    public String chefLieu;

    @Column(name = "population")
    public long population;

    @Column(name = "superficie_km2")
    public double superficieKm2;

    @Column(name = "latitude")
    public double latitude;

    @Column(name = "longitude")
    public double longitude;

    @Column(name = "taux_acces_eau")
    public double tauxAccesEau;

    @Column(name = "taux_electrification")
    public double tauxElectrification;

    @Column(name = "nb_localites")
    public int nbLocalites;
}
