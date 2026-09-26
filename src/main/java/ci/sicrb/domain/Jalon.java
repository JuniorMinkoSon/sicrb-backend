package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Etape datee d'un projet, qui sert a mesurer le retard.
 */
@Entity
@Table(name = "jalon")
public class Jalon extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "date_prevue")
    public String datePrevue;

    @Column(name = "date_reelle")
    public String dateReelle;

    @Column(name = "statut")
    public String statut;

    @Column(name = "commentaire")
    public String commentaire;
}
