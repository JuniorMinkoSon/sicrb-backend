package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Axe strategique d'un PAI, auquel se rattachent les programmes.
 */
@Entity
@Table(name = "pai_axe")
public class PaiAxe extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "budget_prevu")
    public long budgetPrevu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pai_id")
    @JsonIgnore
    public Pai pai;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "pai_axe_programme", joinColumns = @JoinColumn(name = "axe_id"))
    @Column(name = "programme_id")
    public List<String> programmeIds = new ArrayList<>();
}
