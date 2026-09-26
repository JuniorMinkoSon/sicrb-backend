package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Visite de controle d'un projet, avec son taux de conformite.
 */
@Entity
@Table(name = "mission_controle")
public class MissionControle extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "controleur_id")
    public String controleurId;

    @Column(name = "statut")
    public String statut;

    @Column(name = "date_visite")
    public String dateVisite;

    @Column(name = "conformite")
    public double conformite;

    @Column(name = "observations")
    public String observations;

    @Column(name = "reserves_levees")
    public boolean reservesLevees;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "mission_document", joinColumns = @JoinColumn(name = "mission_id"))
    @Column(name = "document_id")
    public List<String> documentIds = new ArrayList<>();
}
