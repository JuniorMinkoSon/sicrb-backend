package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Compte d'acces a la plateforme, rattache a une direction.
 */
@Entity
@Table(name = "utilisateur")
public class Utilisateur extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "nom")
    public String nom;

    @Column(name = "email")
    public String email;

    @Column(name = "role")
    public String role;

    @Column(name = "direction")
    public String direction;

    @Column(name = "actif")
    public boolean actif;

    @Column(name = "dernier_acces")
    public String dernierAcces;
}
