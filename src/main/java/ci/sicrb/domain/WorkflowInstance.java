package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Circuit de validation en cours : passation, engagement, reception...
 */
@Entity
@Table(name = "workflow_instance")
public class WorkflowInstance extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "type")
    public String type;

    @Column(name = "objet")
    public String objet;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "statut")
    public String statut;

    @Column(name = "ouvert_le")
    public String ouvertLe;

    @Column(name = "cloture_le")
    public String clotureLe;

    /** Les etapes font le circuit : chargees avec lui, et ordonnees. */
    @OneToMany(mappedBy = "workflow", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre")
    public List<WorkflowEtape> etapes = new ArrayList<>();
}
