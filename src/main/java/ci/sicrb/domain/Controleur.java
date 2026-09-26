package ci.sicrb.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Agent charge des missions de controle sur le terrain.
 */
@Entity
@Table(name = "controleur")
public class Controleur extends PanacheEntityBase {

    @Id
    @Column(name = "id", length = 64)
    public String id;

    @Column(name = "nom")
    public String nom;

    @Column(name = "fonction")
    public String fonction;

    @Column(name = "zone")
    public String zone;

    @Column(name = "telephone")
    public String telephone;

    @Column(name = "email")
    public String email;

    @Column(name = "missions_en_cours")
    public int missionsEnCours;
}
