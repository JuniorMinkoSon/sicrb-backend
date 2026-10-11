package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Etape d'un circuit de validation, portee par un responsable.
 */
@Entity
@Table(name = "workflow_etape")
public class WorkflowEtape extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "ordre")
    public int ordre;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "responsable")
    public String responsable;

    @Column(name = "statut")
    public String statut;

    @Column(name = "traite_le")
    public String traiteLe;

    @Column(name = "commentaire")
    public String commentaire;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id")
    @JsonIgnore
    public WorkflowInstance workflow;
}
