package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Dossier depose par une entreprise au guichet regional.
 */
@Entity
@Table(name = "demarche_entreprise")
public class DemarcheEntreprise extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "reference")
    public String reference;

    @Column(name = "entreprise")
    public String entreprise;

    @Column(name = "objet")
    public String objet;

    @Column(name = "statut")
    public String statut;

    @Column(name = "deposee_le")
    public String deposeeLe;

    @Column(name = "echeance")
    public String echeance;

    @Column(name = "pieces_fournies")
    public int piecesFournies;

    @Column(name = "pieces_requises")
    public int piecesRequises;
}
