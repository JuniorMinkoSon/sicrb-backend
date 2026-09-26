package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Piece de la gestion electronique des documents.
 */
@Entity
@Table(name = "ged_document")
public class GedDocument extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "titre")
    public String titre;

    @Column(name = "type")
    public String type;

    @Column(name = "version")
    public int version;

    @Column(name = "taillek_b")
    public int taillekB;

    @Column(name = "depose_le")
    public String deposeLe;

    @Column(name = "depose_par")
    public String deposePar;

    @Column(name = "projet_id")
    public String projetId;

    @Column(name = "programme_id")
    public String programmeId;

    @Column(name = "engagement_id")
    public String engagementId;

    @Column(name = "mission_id")
    public String missionId;

    @Column(name = "confidentiel")
    public boolean confidentiel;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "ged_document_tag", joinColumns = @JoinColumn(name = "document_id"))
    @Column(name = "tag")
    public List<String> tags = new ArrayList<>();
}
