package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Programme sectoriel rattache a un axe du PAI. Regroupe des projets.
 */
@Entity
@Table(name = "programme")
public class Programme extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "code")
    public String code;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "pai_id")
    public String paiId;

    @Column(name = "axe_id")
    public String axeId;

    @Column(name = "secteur")
    public String secteur;

    @Column(name = "statut")
    public String statut;

    @Column(name = "budget_prevu")
    public long budgetPrevu;

    @Column(name = "budget_engage")
    public long budgetEngage;

    @Column(name = "budget_paye")
    public long budgetPaye;

    @Column(name = "date_debut")
    public String dateDebut;

    @Column(name = "date_fin")
    public String dateFin;

    @Column(name = "responsable")
    public String responsable;

    @Column(name = "nb_projets")
    public int nbProjets;

    @Column(name = "avancement")
    public double avancement;
}
