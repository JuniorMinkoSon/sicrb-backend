package ci.sicrb.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/** Une option soumise a l'arbitrage, chiffree en cout, impact et delai. */
@Embeddable
public class OptionArbitrage {

    @Column(name = "libelle")
    public String libelle;

    @Column(name = "cout")
    public long cout;

    @Column(name = "impact")
    public double impact;

    @Column(name = "delai_mois")
    public int delaiMois;
}
