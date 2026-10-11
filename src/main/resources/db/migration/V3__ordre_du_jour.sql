-- L'ordre du jour des seances et la file des demandes de parole.
--
-- Le registre des sessions disait combien d'actes une seance avait produits,
-- jamais lesquels. Ces deux tables portent ce qui manquait : ce qui a ete
-- examine, par qui, et par combien de voix.
--
-- Nouvelle migration plutot que modification de V1 : une migration deja jouee
-- ne se reecrit pas, sans quoi les bases en service et les bases neuves
-- divergent en silence.

-- Un point inscrit a l'ordre du jour d'une seance.
CREATE TABLE point_ordre_du_jour (
    id varchar(64) PRIMARY KEY,
    session_id varchar(64),
    ordre integer,
    intitule varchar(400),
    rapporteur text,
    statut text,
    projet_id varchar(64),
    programme_id varchar(64),
    duree_prevue_min integer,
    -- Nullables a dessein : un zero dirait « aucune voix pour », ce qui n'est
    -- pas « pas encore mis aux voix ».
    pour integer,
    contre integer,
    abstention integer,
    deliberation text
);

-- Une demande de parole, dans la file d'attente du point en discussion.
CREATE TABLE demande_parole (
    id varchar(64) PRIMARY KEY,
    session_id varchar(64),
    point_id varchar(64),
    demandeur text,
    fonction text,
    demandee_a varchar(8),
    statut text
);

-- L'ecran d'une seance lit toujours par la seance : c'est le seul acces.
CREATE INDEX idx_point_session ON point_ordre_du_jour (session_id);
CREATE INDEX idx_parole_session ON demande_parole (session_id);
