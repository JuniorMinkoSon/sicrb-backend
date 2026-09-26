package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Trace d'une action : qui a fait quoi, quand, sur quel objet.
 */
@Entity
@Table(name = "audit_entree")
public class AuditEntree extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "horodatage")
    public String horodatage;

    @Column(name = "acteur")
    public String acteur;

    @Column(name = "action")
    public String action;

    @Column(name = "module")
    public String module;

    @Column(name = "cible")
    public String cible;

    @Column(name = "adresse_ip")
    public String adresseIp;

    @Column(name = "resultat")
    public String resultat;
}
