-- SICRB : schema initial.
--
-- Le modele reprend a l'identique le contrat publie au frontend
-- (web/src/types/domain.ts) : meme noms de champs, memes types. Toute
-- divergence produirait un null silencieux a l'ecran plutot qu'une erreur.
--
-- Les identifiants sont des chaines et non des sequences : ils viennent du
-- metier (codes de projet, references de marche) et doivent rester lisibles
-- dans une URL comme dans un echange telephonique.

-- Decoupage administratif : region, departement, sous-prefecture ou commune.
CREATE TABLE territoire (
    id varchar(64) PRIMARY KEY,
    nom text,
    type text,
    parent_id text,
    chef_lieu text,
    population bigint,
    superficie_km2 double precision,
    latitude double precision,
    longitude double precision,
    taux_acces_eau double precision,
    taux_electrification double precision,
    nb_localites integer
);

-- Seance du Conseil regional : pleniere, bureau ou commission.
CREATE TABLE session_deliberante (
    id varchar(64) PRIMARY KEY,
    intitule text,
    type text,
    date text,
    statut text,
    presents integer,
    quorum integer,
    deliberations integer
);

-- Programme annuel d'investissement : le cadre pluriannuel vote par le Conseil.
CREATE TABLE pai (
    id varchar(64) PRIMARY KEY,
    intitule text,
    annee_debut integer,
    annee_fin integer,
    statut text,
    budget_prevu bigint,
    adopte_le text,
    deliberation text
);

-- Axe strategique d'un PAI, auquel se rattachent les programmes.
CREATE TABLE pai_axe (
    id varchar(64) PRIMARY KEY,
    code text,
    libelle text,
    budget_prevu bigint,
    pai_id varchar(64) REFERENCES pai(id) ON DELETE CASCADE
);

-- Programme sectoriel rattache a un axe du PAI. Regroupe des projets.
CREATE TABLE programme (
    id varchar(64) PRIMARY KEY,
    code text,
    intitule text,
    pai_id text,
    axe_id text,
    secteur text,
    statut text,
    budget_prevu bigint,
    budget_engage bigint,
    budget_paye bigint,
    date_debut text,
    date_fin text,
    responsable text,
    nb_projets integer,
    avancement double precision
);

-- Operation d'investissement localisee : l'unite de suivi du SICRB.
CREATE TABLE projet (
    id varchar(64) PRIMARY KEY,
    code text,
    intitule text,
    programme_id text,
    territoire_id text,
    secteur text,
    statut text,
    avancement_physique double precision,
    avancement_financier double precision,
    budget_prevu bigint,
    budget_engage bigint,
    budget_paye bigint,
    date_debut text,
    date_fin_prevue text,
    date_fin_reelle text,
    prestataire_id text,
    controleur_id text,
    risque text,
    latitude double precision,
    longitude double precision,
    beneficiaires integer,
    maitre_ouvrage text
);

-- Etape datee d'un projet, qui sert a mesurer le retard.
CREATE TABLE jalon (
    id varchar(64) PRIMARY KEY,
    projet_id text,
    libelle text,
    date_prevue text,
    date_reelle text,
    statut text,
    commentaire text
);

-- Ouvrage livre et entre au patrimoine regional.
CREATE TABLE infrastructure (
    id varchar(64) PRIMARY KEY,
    code text,
    designation text,
    type text,
    territoire_id text,
    projet_id text,
    etat text,
    mise_en_service_le text,
    latitude double precision,
    longitude double precision,
    valeur_patrimoniale bigint,
    derniere_visite text,
    prochaine_visite text
);

-- Intervention sur un ouvrage : preventive, corrective ou d'urgence.
CREATE TABLE maintenance (
    id varchar(64) PRIMARY KEY,
    reference text,
    infrastructure_id text,
    type text,
    statut text,
    signale_le text,
    planifie_le text,
    cloture_le text,
    cout bigint,
    description text,
    prestataire_id text
);

-- Agent charge des missions de controle sur le terrain.
CREATE TABLE controleur (
    id varchar(64) PRIMARY KEY,
    nom text,
    fonction text,
    zone text,
    telephone text,
    email text,
    missions_en_cours integer
);

-- Visite de controle d'un projet, avec son taux de conformite.
CREATE TABLE mission_controle (
    id varchar(64) PRIMARY KEY,
    reference text,
    projet_id text,
    controleur_id text,
    statut text,
    date_visite text,
    conformite double precision,
    observations text,
    reserves_levees boolean
);

-- Ligne du budget regional pour un exercice et une source de financement.
CREATE TABLE ligne_budgetaire (
    id varchar(64) PRIMARY KEY,
    code text,
    libelle text,
    exercice integer,
    source text,
    dotation bigint,
    engage bigint,
    paye bigint,
    programme_id text
);

-- Engagement de depense impute sur une ligne budgetaire.
CREATE TABLE engagement (
    id varchar(64) PRIMARY KEY,
    reference text,
    ligne_id text,
    projet_id text,
    prestataire_id text,
    objet text,
    montant bigint,
    statut text,
    date_creation text,
    date_paiement text
);

-- Entreprise attributaire de marches regionaux.
CREATE TABLE prestataire (
    id varchar(64) PRIMARY KEY,
    raison_sociale text,
    rccm text,
    categorie text,
    ville text,
    statut text,
    contact text,
    telephone text,
    email text,
    marches_attribues integer,
    montant_cumule bigint,
    note_performance double precision
);

-- Materiel inscrit a l'inventaire du Conseil regional.
CREATE TABLE equipement (
    id varchar(64) PRIMARY KEY,
    code text,
    designation text,
    categorie text,
    statut text,
    affectation text,
    territoire_id text,
    acquis_le text,
    valeur_acquisition bigint,
    immatriculation text
);

-- Piece de la gestion electronique des documents.
CREATE TABLE ged_document (
    id varchar(64) PRIMARY KEY,
    reference text,
    titre text,
    type text,
    version integer,
    taillek_b integer,
    depose_le text,
    depose_par text,
    projet_id text,
    programme_id text,
    engagement_id text,
    mission_id text,
    confidentiel boolean
);

-- Circuit de validation en cours : passation, engagement, reception...
CREATE TABLE workflow_instance (
    id varchar(64) PRIMARY KEY,
    reference text,
    type text,
    objet text,
    projet_id text,
    statut text,
    ouvert_le text,
    cloture_le text
);

-- Etape d'un circuit de validation, portee par un responsable.
CREATE TABLE workflow_etape (
    id varchar(64) PRIMARY KEY,
    ordre integer,
    libelle text,
    responsable text,
    statut text,
    traite_le text,
    commentaire text,
    workflow_id varchar(64) REFERENCES workflow_instance(id) ON DELETE CASCADE
);

-- Indicateur de suivi sectoriel, avec sa cible et sa serie historique.
CREATE TABLE indicateur (
    id varchar(64) PRIMARY KEY,
    code text,
    libelle text,
    unite text,
    secteur text,
    cible double precision,
    valeur double precision,
    tendance text,
    territoire_id text,
    programme_id text,
    source text
);

-- Mesure avant / apres d'un effet sur le territoire.
CREATE TABLE impact_mesure (
    id varchar(64) PRIMARY KEY,
    libelle text,
    secteur text,
    territoire_id text,
    beneficiaires integer,
    avant_intervention double precision,
    apres_intervention double precision,
    unite text,
    mesure_le text
);

-- Signalement automatique porte au tableau de bord de decision.
CREATE TABLE alerte (
    id varchar(64) PRIMARY KEY,
    niveau text,
    titre text,
    detail text,
    module_cible text,
    lien_id text,
    detecte_le text
);

-- Choix soumis a la gouvernance, avec ses options chiffrees.
CREATE TABLE arbitrage (
    id varchar(64) PRIMARY KEY,
    intitule text,
    contexte text,
    option_retenue text,
    statut text,
    decide_le text
);

-- Modele de rapport publiable, et sa periodicite.
CREATE TABLE rapport_modele (
    id varchar(64) PRIMARY KEY,
    intitule text,
    perimetre text,
    periodicite text,
    dernier_genere_le text
);

-- Trace d'une action : qui a fait quoi, quand, sur quel objet.
CREATE TABLE audit_entree (
    id varchar(64) PRIMARY KEY,
    horodatage text,
    acteur text,
    action text,
    module text,
    cible text,
    adresse_ip text,
    resultat text
);

-- Compte d'acces a la plateforme, rattache a une direction.
CREATE TABLE utilisateur (
    id varchar(64) PRIMARY KEY,
    nom text,
    email text,
    role text,
    direction text,
    actif boolean,
    dernier_acces text
);

-- Besoin ou reclamation depose par un habitant de la region.
CREATE TABLE requete_citoyenne (
    id varchar(64) PRIMARY KEY,
    reference text,
    objet text,
    territoire_id text,
    categorie text,
    statut text,
    deposee_le text,
    traitee_le text,
    canal text
);

-- Dossier depose par une entreprise au guichet regional.
CREATE TABLE demarche_entreprise (
    id varchar(64) PRIMARY KEY,
    reference text,
    entreprise text,
    objet text,
    statut text,
    deposee_le text,
    echeance text,
    pieces_fournies integer,
    pieces_requises integer
);

-- Collections rattachees : une ligne par element, plutot qu'une chaine a decouper.
CREATE TABLE session_document (
    session_id varchar(64) NOT NULL REFERENCES session_deliberante(id) ON DELETE CASCADE,
    document_id varchar(64) NOT NULL
);

CREATE TABLE pai_axe_programme (
    axe_id varchar(64) NOT NULL REFERENCES pai_axe(id) ON DELETE CASCADE,
    programme_id varchar(64) NOT NULL
);

CREATE TABLE mission_document (
    mission_id varchar(64) NOT NULL REFERENCES mission_controle(id) ON DELETE CASCADE,
    document_id varchar(64) NOT NULL
);

CREATE TABLE ged_document_tag (
    document_id varchar(64) NOT NULL REFERENCES ged_document(id) ON DELETE CASCADE,
    tag text NOT NULL
);

CREATE TABLE indicateur_serie (
    indicateur_id varchar(64) NOT NULL REFERENCES indicateur(id) ON DELETE CASCADE,
    periode text NOT NULL,
    valeur double precision NOT NULL
);

CREATE TABLE arbitrage_option (
    arbitrage_id varchar(64) NOT NULL REFERENCES arbitrage(id) ON DELETE CASCADE,
    libelle text NOT NULL,
    cout bigint NOT NULL,
    impact double precision NOT NULL,
    delai_mois integer NOT NULL
);

CREATE TABLE rapport_format (
    rapport_id varchar(64) NOT NULL REFERENCES rapport_modele(id) ON DELETE CASCADE,
    format text NOT NULL
);

-- Index sur les cles de rattachement les plus filtrees : sans eux, chaque
-- fiche de projet declenche un parcours complet des tables liees.
CREATE INDEX idx_projet_programme ON projet(programme_id);
CREATE INDEX idx_projet_territoire ON projet(territoire_id);
CREATE INDEX idx_projet_statut ON projet(statut);
CREATE INDEX idx_projet_secteur ON projet(secteur);
CREATE INDEX idx_jalon_projet ON jalon(projet_id);
CREATE INDEX idx_engagement_projet ON engagement(projet_id);
CREATE INDEX idx_engagement_ligne ON engagement(ligne_id);
CREATE INDEX idx_document_projet ON ged_document(projet_id);
CREATE INDEX idx_mission_projet ON mission_controle(projet_id);
CREATE INDEX idx_infrastructure_territoire ON infrastructure(territoire_id);
CREATE INDEX idx_maintenance_infra ON maintenance(infrastructure_id);
CREATE INDEX idx_requete_territoire ON requete_citoyenne(territoire_id);
CREATE INDEX idx_programme_pai ON programme(pai_id);
CREATE INDEX idx_territoire_parent ON territoire(parent_id);
CREATE INDEX idx_workflow_projet ON workflow_instance(projet_id);
