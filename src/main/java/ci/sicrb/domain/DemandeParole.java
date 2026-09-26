package ci.sicrb.domain;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

/**
 * Une demande de parole, dans la file d'attente d'un point en discussion.
 *
 * <p>La file ne s'alimente que pendant l'examen d'un point : une seance close
 * ou non commencee n'en a pas.
 */
@Entity
@Table(name = "demande_parole")
public class DemandeParole extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "session_id", length = 64)
    public String sessionId;

    @Column(name = "point_id", length = 64)
    public String pointId;

    @Column(name = "demandeur")
    public String demandeur;

    @Column(name = "fonction")
    public String fonction;

    /** Heure de la demande, telle qu'elle est portee au proces-verbal. */
    @Column(name = "demandee_a", length = 8)
    public String demandeeA;

    @Column(name = "statut")
    public String statut;
}
