package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Mesure avant / apres d'un effet sur le territoire.
 */
@Entity
@Table(name = "impact_mesure")
public class ImpactMesure extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "secteur")
    public String secteur;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "beneficiaires")
    public int beneficiaires;

    @Column(name = "avant_intervention")
    public double avantIntervention;

    @Column(name = "apres_intervention")
    public double apresIntervention;

    @Column(name = "unite")
    public String unite;

    @Column(name = "mesure_le")
    public String mesureLe;
}
