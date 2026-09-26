package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Indicateur de suivi sectoriel, avec sa cible et sa serie historique.
 */
@Entity
@Table(name = "indicateur")
public class Indicateur extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "unite")
    public String unite;

    @Column(name = "secteur")
    public String secteur;

    @Column(name = "cible")
    public double cible;

    @Column(name = "valeur")
    public double valeur;

    @Column(name = "tendance")
    public String tendance;

    @Column(name = "territoire_id")
    public String territoireId;

    @Column(name = "programme_id")
    public String programmeId;

    @Column(name = "source")
    public String source;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "indicateur_serie", joinColumns = @JoinColumn(name = "indicateur_id"))
    @OrderBy("periode")
    public List<PointSerie> serie = new ArrayList<>();
}
