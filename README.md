# BAGOUÉ 360

Plateforme intégrée de pilotage des investissements régionaux du **Conseil
Régional de la Bagoué** — Côte d'Ivoire.

*Planifier · Décider · Suivre · Contrôler · Valoriser · Rendre compte*

Le dépôt réunit les deux moitiés de la plateforme :

| Dossier | Rôle | Pile |
|---|---|---|
| `src/` | API et base de données | Quarkus 3.38, Hibernate Panache, Flyway, PostgreSQL |
| `web/` | Interface | React 19, Vite, TypeScript, Tailwind |

---

## Démarrer

Il faut **Java 21**, **Maven**, **Node 20+** et **Docker** en service — Quarkus
lève lui-même un PostgreSQL jetable pour le développement, rien à installer.

```bash
# 1. L'API, sur http://localhost:8081
./mvnw quarkus:dev

# 2. L'interface, sur http://localhost:5174   (dans un second terminal)
cd web && npm install && npm run dev
```

Au premier démarrage, Flyway crée le schéma puis charge le jeu de données
initial : dix-sept territoires, cent trente-deux projets, deux cent dix
engagements. Comptez une minute.

### Pourquoi le port 8081

Le 8080 est occupé par Apache sur beaucoup de postes de développement. Le port
se change par la variable `SICRB_PORT` ; pensez alors à `VITE_API_TARGET` côté
interface, que le proxy Vite lit.

---

## Où regarder

| Adresse | Contenu |
|---|---|
| <http://localhost:5174> | l'application |
| <http://localhost:8081/api/doc> | la documentation OpenAPI des 27 endpoints |
| <http://localhost:8081/q/dev/> | la console de développement Quarkus |
| <http://localhost:8081/q/health> | l'état de santé du service |

---

## Comment c'est construit

**Le contrat vient de l'interface.** `web/src/types/domain.ts` décrit le modèle
et `web/src/services/contracts.ts` les opérations. Les entités et les ressources
Java reprennent ces champs et ces chemins un à un. Une divergence ne casserait
pas la compilation : elle produirait un `undefined` silencieux à l'écran.

**Deux sources de données, un seul écran.** L'interface sait parler à l'API
(`VITE_API_MODE=http`) ou à un jeu en mémoire (`mock`). Les deux servent les
mêmes données — la migration `V2` est la transposition SQL du jeu de
démonstration, lui-même produit par une graine fixe. Basculer de l'un à l'autre
ne change donc rien à l'affichage, et c'est précisément ce qui permet de
vérifier que le branchement est correct.

**Le schéma appartient à Flyway**, pas à Hibernate. Une migration se relit, se
rejoue et se versionne ; un « update » automatique modifie la base à chaque
déploiement sans laisser de trace.

**La pagination est celle de l'interface** : page à partir de 1, taille bornée à
200, tri `champ:sens`. Le même écran doit afficher la même page quelle que soit
la source. Les champs de tri sont vérifiés contre une liste blanche — un
paramètre d'URL n'a pas à choisir une expression HQL.

---

## Les dix modules

La chaîne de valeur de l'investissement régional, du besoin exprimé au rapport :

1. **Besoins citoyens** — dépôt et instruction des requêtes
2. **Programmes & PAI** — programmation annuelle des investissements
3. **Gouvernance & Délibérations** — sessions, ordre du jour, votes
4. **Projets / Projet 360°** — la fiche qui réunit tout ce qui touche un projet
5. **Entreprises & Marchés** — prestataires, engagements, démarches
6. **Finances & Suivi** — lignes budgétaires, exécution
7. **Territoire & Carte** — le découpage administratif et la carte des projets
8. **Patrimoine** — ouvrages livrés, maintenance, inventaire
9. **Documents & Audit** — pièces et journal de traçabilité
10. **Analyse & Décision** — indicateurs, impacts, alertes, arbitrages, rapports

---

## Mise en production

Le développement s'appuie sur le PostgreSQL éphémère de Quarkus. En production,
la base est déclarée par variables d'environnement :

```bash
DB_URL=jdbc:postgresql://serveur:5432/bagoue360
DB_USER=bagoue360
DB_PASSWORD=...
SICRB_CORS_ORIGINS=https://bagoue360.ci
```

```bash
./mvnw package
java -jar target/quarkus-app/quarkus-run.jar
```

L'interface se construit avec `cd web && npm run build` ; le contenu de
`web/dist/` est un site statique.

---

## Données

**Aucune donnée de ce dépôt n'est officielle.** Les montants, les découpages et
les coordonnées reprennent le jeu de démonstration et servent à éprouver
l'ergonomie et les volumes. Ils devront être remplacés par les données réelles
du Conseil régional à la mise en service.

Le favicon porte la marque de la plateforme, pas l'emblème du Conseil régional :
le sceau d'une collectivité doit venir d'elle.
