package ci.sicrb.api;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Traduction des paramètres d'URL en requêtes.
 *
 * <p>Le frontend envoie toujours la même chose : {@code page}, {@code size},
 * {@code sort} et une poignée de filtres propres à chaque écran. Les règles de
 * pagination reprennent exactement celles de l'adaptateur de démonstration
 * ({@code web/src/services/query.ts}), sans quoi le même écran afficherait des
 * pages différentes selon la source de données.
 */
public final class Requetes {

    /** Au-delà, une page cesse d'être une page : on protège la base et le navigateur. */
    private static final int TAILLE_MAX = 200;
    private static final int TAILLE_DEFAUT = 10;

    private Requetes() {
    }

    public static int page(Integer page) {
        return page == null || page < 1 ? 1 : page;
    }

    public static int taille(Integer size) {
        if (size == null) {
            return TAILLE_DEFAUT;
        }
        return Math.min(Math.max(size, 1), TAILLE_MAX);
    }

    /**
     * Tri au format « champ » ou « champ:desc », tel que l'envoie le frontend.
     *
     * <p>Le champ demandé est vérifié contre la liste des colonnes triables de
     * l'écran : le passer tel quel à Hibernate laisserait un paramètre d'URL
     * choisir une expression HQL. Un champ inconnu retombe sur le tri par
     * défaut plutôt que d'échouer — un lien partagé avec un ancien tri doit
     * continuer d'ouvrir la page.
     *
     * <p>Le résultat n'est jamais nul : l'ordre d'une table sans ORDER BY n'est
     * garanti par aucun moteur, et deux appels identiques rendraient alors des
     * pages différentes.
     */
    public static Sort tri(String sort, String defaut, String... champsAutorises) {
        String demande = sort == null || sort.isBlank() ? defaut : sort;
        String[] parts = demande.split(":", 2);
        String champ = parts[0].trim();
        boolean descendant = parts.length > 1 && parts[1].trim().equalsIgnoreCase("desc");

        boolean autorise = false;
        for (String c : champsAutorises) {
            if (c.equals(champ)) {
                autorise = true;
                break;
            }
        }
        if (!autorise) {
            return Sort.by(defaut.split(":")[0]);
        }
        return descendant ? Sort.by(champ, Sort.Direction.Descending) : Sort.by(champ);
    }

    /** Découpe une requête Panache en page, en conservant le total. */
    public static <T extends PanacheEntityBase> Page<T> paginer(PanacheQuery<T> query, Integer page, Integer size) {
        int p = page(page);
        int t = taille(size);
        long total = query.count();
        List<T> items = query.page(p - 1, t).list();
        return new Page<>(items, total, p, t);
    }

    /**
     * Clause d'un écran : des égalités simples, plus une recherche textuelle
     * optionnelle sur les colonnes désignées.
     *
     * <p>La recherche du frontend balaie tout l'enregistrement sérialisé ; ici
     * elle porte sur les colonnes qui portent du sens — un identifiant technique
     * ou une coordonnée ne se cherchent pas au clavier.
     */
    public static final class Filtre {

        private final List<String> clauses = new ArrayList<>();
        private final Map<String, Object> params = new LinkedHashMap<>();
        private int compteur = 0;

        /** Ignore les valeurs absentes : un filtre non renseigné ne filtre pas. */
        public Filtre egal(String champ, Object valeur) {
            if (valeur == null || (valeur instanceof String s && s.isBlank())) {
                return this;
            }
            String cle = "p" + (compteur++);
            clauses.add(champ + " = :" + cle);
            params.put(cle, valeur);
            return this;
        }

        public Filtre texte(String q, String... colonnes) {
            if (q == null || q.isBlank() || colonnes.length == 0) {
                return this;
            }
            String cle = "q" + (compteur++);
            List<String> ou = new ArrayList<>();
            for (String c : colonnes) {
                ou.add("lower(" + c + ") like :" + cle);
            }
            clauses.add("(" + String.join(" or ", ou) + ")");
            params.put(cle, "%" + q.trim().toLowerCase() + "%");
            return this;
        }

        public boolean vide() {
            return clauses.isEmpty();
        }

        /** Clause HQL, vide si aucun filtre n'a été posé. */
        public String hql() {
            return String.join(" and ", clauses);
        }

        /** Valeurs nommées correspondantes ; Panache accepte la map telle quelle. */
        public Map<String, Object> valeurs() {
            return params;
        }
    }
}
