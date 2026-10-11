package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Ligne du budget regional pour un exercice et une source de financement.
 */
@Entity
@Table(name = "ligne_budgetaire")
public class LigneBudgetaire extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "exercice")
    public int exercice;

    @Column(name = "source")
    public String source;

    @Column(name = "dotation")
    public long dotation;

    @Column(name = "engage")
    public long engage;

    @Column(name = "paye")
    public long paye;

    @Column(name = "programme_id")
    public String programmeId;
}
