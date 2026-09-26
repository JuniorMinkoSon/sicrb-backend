package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Signalement automatique porte au tableau de bord de decision.
 */
@Entity
@Table(name = "alerte")
public class Alerte extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "niveau")
    public String niveau;

    @Column(name = "titre")
    public String titre;

    @Column(name = "detail")
    public String detail;

    @Column(name = "module_cible")
    public String moduleCible;

    @Column(name = "lien_id")
    public String lienId;

    @Column(name = "detecte_le")
    public String detecteLe;
}
