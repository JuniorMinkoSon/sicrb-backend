package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Programme annuel d'investissement : le cadre pluriannuel vote par le Conseil.
 */
@Entity
@Table(name = "pai")
public class Pai extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "annee_debut")
    public int anneeDebut;

    @Column(name = "annee_fin")
    public int anneeFin;

    @Column(name = "statut")
    public String statut;

    @Column(name = "budget_prevu")
    public long budgetPrevu;

    @Column(name = "adopte_le")
    public String adopteLe;

    @Column(name = "deliberation")
    public String deliberation;

    /** Axes du PAI, charges avec lui : on ne consulte jamais l'un sans les autres. */
    @OneToMany(mappedBy = "pai", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("code")
    public List<PaiAxe> axes = new ArrayList<>();
}
