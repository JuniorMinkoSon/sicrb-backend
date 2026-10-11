package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Choix soumis a la gouvernance, avec ses options chiffrees.
 */
@Entity
@Table(name = "arbitrage")
public class Arbitrage extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "contexte")
    public String contexte;

    @Column(name = "option_retenue")
    public String optionRetenue;

    @Column(name = "statut")
    public String statut;

    @Column(name = "decide_le")
    public String decideLe;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "arbitrage_option", joinColumns = @JoinColumn(name = "arbitrage_id"))
    public List<OptionArbitrage> options = new ArrayList<>();
}
