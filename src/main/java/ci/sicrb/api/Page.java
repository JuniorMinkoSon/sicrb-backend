package ci.sicrb.api;

import java.util.List;

/**
 * Une page de résultats.
 *
 * <p>La forme est imposée par le contrat publié au frontend
 * ({@code web/src/types/domain.ts}) : {@code items}, {@code total}, {@code page}
 * et {@code size}. Le numéro de page commence à 1, comme dans l'interface — pas
 * à 0 comme dans la plupart des API : c'est ce que les composants affichent, et
 * traduire d'un côté ou de l'autre aurait fini par se voir à l'écran.
 */
public class Page<T> {

    public List<T> items;
    public long total;
    public int page;
    public int size;

    public Page() {
    }

    public Page(List<T> items, long total, int page, int size) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.size = size;
    }
}
