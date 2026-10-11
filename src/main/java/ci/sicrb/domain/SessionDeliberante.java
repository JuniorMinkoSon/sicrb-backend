package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Seance du Conseil regional : pleniere, bureau ou commission.
 */
@Entity
@Table(name = "session_deliberante")
public class SessionDeliberante extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "intitule")
    public String intitule;

    @Column(name = "type")
    public String type;

    @Column(name = "date")
    public String date;

    @Column(name = "statut")
    public String statut;

    @Column(name = "presents")
    public int presents;

    @Column(name = "quorum")
    public int quorum;

    @Column(name = "deliberations")
    public int deliberations;

    /** Pieces examinees en seance. Table dediee : leur nombre varie d'une session a l'autre. */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "session_document", joinColumns = @JoinColumn(name = "session_id"))
    @Column(name = "document_id")
    public List<String> documentIds = new ArrayList<>();
}
