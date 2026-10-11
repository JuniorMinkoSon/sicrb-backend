package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Intervention sur un ouvrage : preventive, corrective ou d'urgence.
 */
@Entity
@Table(name = "maintenance")
public class Maintenance extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "infrastructure_id")
    public String infrastructureId;

    @Column(name = "type")
    public String type;

    @Column(name = "statut")
    public String statut;

    @Column(name = "signale_le")
    public String signaleLe;

    @Column(name = "planifie_le")
    public String planifieLe;

    @Column(name = "cloture_le")
    public String clotureLe;

    @Column(name = "cout")
    public long cout;

    @Column(name = "description")
    public String description;

    @Column(name = "prestataire_id")
    public String prestataireId;
}
