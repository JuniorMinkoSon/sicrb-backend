package ci.sicrb.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/** Un point de la serie historique d'un indicateur. */
@Embeddable
public class PointSerie {

    @Column(name = "periode")
    public String periode;

    @Column(name = "valeur")
    public double valeur;
}
