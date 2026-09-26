package ci.sicrb.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

/**
 * Un point inscrit a l'ordre du jour d'une seance.
 *
 * <p>Le compteur {@code deliberations} de la session ne dit que le nombre
 * d'actes produits ; ce sont ces points qui disent ce qui a ete decide, par
 * combien de voix, et sous quel numero d'acte.
 *
 * <p>Les voix sont des entiers boxes : elles n'existent pas tant que le point
 * n'a pas ete mis aux voix, et un zero signifierait « aucune voix pour », ce
 * qui n'est pas la meme chose que « pas encore vote ».
 */
@Entity
@Table(name = "point_ordre_du_jour")
public class PointOrdreDuJour extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "session_id", length = 64)
    public String sessionId;

    @Column(name = "ordre")
    public int ordre;

    @Column(name = "intitule", length = 400)
    public String intitule;

    @Column(name = "rapporteur")
    public String rapporteur;

    @Column(name = "statut")
    public String statut;

    @Column(name = "projet_id", length = 64)
    public String projetId;

    @Column(name = "programme_id", length = 64)
    public String programmeId;

    @Column(name = "duree_prevue_min")
    public int dureePrevueMin;

    @Column(name = "pour")
    public Integer pour;

    @Column(name = "contre")
    public Integer contre;

    @Column(name = "abstention")
    public Integer abstention;

    /** Numero de l'acte, une fois la deliberation adoptee. */
    @Column(name = "deliberation")
    public String deliberation;
}
