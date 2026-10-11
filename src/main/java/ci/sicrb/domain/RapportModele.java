package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Modele de rapport publiable, et sa periodicite.
 */
@Entity
@Table(name = "rapport_modele")
public class RapportModele extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "perimetre")
    public String perimetre;

    @Column(name = "periodicite")
    public String periodicite;

    @Column(name = "dernier_genere_le")
    public String dernierGenereLe;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "rapport_format", joinColumns = @JoinColumn(name = "rapport_id"))
    @Column(name = "format")
    public List<String> formats = new ArrayList<>();
}
