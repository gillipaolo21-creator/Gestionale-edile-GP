-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "ruolo" TEXT NOT NULL DEFAULT 'VIEWER',
    "nome" TEXT,
    "cognome" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "commesse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice_identificativo" TEXT NOT NULL,
    "nome_cantiere" TEXT NOT NULL,
    "committente" TEXT,
    "tipo_opera" TEXT NOT NULL DEFAULT 'ALTRO',
    "indirizzo" TEXT,
    "citta" TEXT,
    "cap" TEXT,
    "provincia" TEXT,
    "gps_lat" REAL,
    "gps_lng" REAL,
    "responsabile" TEXT,
    "importo_contratto" REAL NOT NULL DEFAULT 0,
    "importo_lavori_propri" REAL NOT NULL DEFAULT 0,
    "stato" TEXT NOT NULL DEFAULT 'PREVENTIVO',
    "data_inizio" DATETIME,
    "data_fine_prevista" DATETIME,
    "data_fine_effettiva" DATETIME,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "personale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricola" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "qualifica" TEXT NOT NULL DEFAULT 'OPERAIO_COMUNE',
    "costo_orario" REAL NOT NULL DEFAULT 0,
    "telefono" TEXT,
    "email" TEXT,
    "codice_fiscale" TEXT,
    "data_assunzione" DATETIME,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "presenze_giornaliere" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personale_id" TEXT NOT NULL,
    "commessa_id" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "ore_ordinarie" REAL NOT NULL DEFAULT 8,
    "ore_extra" REAL NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "presenze_giornaliere_personale_id_fkey" FOREIGN KEY ("personale_id") REFERENCES "personale" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "presenze_giornaliere_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scadenze_corsi_sicurezza" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personale_id" TEXT NOT NULL,
    "tipo_corso" TEXT NOT NULL,
    "data_corso" DATETIME NOT NULL,
    "scadenza" DATETIME NOT NULL,
    "ente" TEXT,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scadenze_corsi_sicurezza_personale_id_fkey" FOREIGN KEY ("personale_id") REFERENCES "personale" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dpi_assegnati" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personale_id" TEXT NOT NULL,
    "tipo_dpi" TEXT NOT NULL,
    "data_consegna" DATETIME NOT NULL,
    "scadenza" DATETIME,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dpi_assegnati_personale_id_fkey" FOREIGN KEY ("personale_id") REFERENCES "personale" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "mezzi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codice" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ALTRO',
    "targa" TEXT,
    "anno_immatricolazione" INTEGER,
    "costo_orario" REAL NOT NULL DEFAULT 0,
    "proprietario" TEXT,
    "stato" TEXT NOT NULL DEFAULT 'OPERATIVO',
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "assegnazioni_mezzi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mezzo_id" TEXT NOT NULL,
    "commessa_id" TEXT NOT NULL,
    "data_inizio" DATETIME NOT NULL,
    "data_fine" DATETIME,
    "ore_impiegate" REAL NOT NULL DEFAULT 0,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "assegnazioni_mezzi_mezzo_id_fkey" FOREIGN KEY ("mezzo_id") REFERENCES "mezzi" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "assegnazioni_mezzi_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scadenze_mezzi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mezzo_id" TEXT NOT NULL,
    "tipo_scadenza" TEXT NOT NULL,
    "scadenza" DATETIME NOT NULL,
    "completata" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "scadenze_mezzi_mezzo_id_fkey" FOREIGN KEY ("mezzo_id") REFERENCES "mezzi" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "materiali" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commessa_id" TEXT NOT NULL,
    "fornitore_nome" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "unita_misura" TEXT NOT NULL,
    "quantita" REAL NOT NULL,
    "prezzo_unitario" REAL NOT NULL,
    "data_consegna" DATETIME,
    "ddt" TEXT,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "materiali_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subappaltatori" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ragione_sociale" TEXT NOT NULL,
    "piva" TEXT,
    "codice_fiscale" TEXT,
    "referente" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "indirizzo" TEXT,
    "citta" TEXT,
    "specializzazione" TEXT,
    "attivo" BOOLEAN NOT NULL DEFAULT true,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "contratti_subappalto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commessa_id" TEXT NOT NULL,
    "subappaltatore_id" TEXT NOT NULL,
    "descrizione_opera" TEXT NOT NULL,
    "importo_affidato" REAL NOT NULL,
    "data_inizio" DATETIME,
    "data_fine_prevista" DATETIME,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "contratti_subappalto_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "contratti_subappalto_subappaltatore_id_fkey" FOREIGN KEY ("subappaltatore_id") REFERENCES "subappaltatori" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commessa_id" TEXT NOT NULL,
    "contratto_subappalto_id" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'ATTIVO',
    "progressivo" INTEGER NOT NULL,
    "data_certificazione" DATETIME NOT NULL,
    "percentuale_completamento" REAL NOT NULL,
    "importo_maturato" REAL NOT NULL,
    "importo_ritenuta" REAL NOT NULL DEFAULT 0,
    "stato" TEXT NOT NULL DEFAULT 'BOZZA',
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sal_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sal_contratto_subappalto_id_fkey" FOREIGN KEY ("contratto_subappalto_id") REFERENCES "contratti_subappalto" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fatture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo_documento" TEXT NOT NULL,
    "commessa_id" TEXT NOT NULL,
    "sal_id" TEXT,
    "numero" TEXT,
    "fornitore_cliente" TEXT,
    "importo_imponibile" REAL NOT NULL,
    "iva" REAL NOT NULL DEFAULT 0,
    "data_emissione" DATETIME,
    "data_scadenza" DATETIME,
    "stato_pagamento" TEXT NOT NULL DEFAULT 'DA_PAGARE',
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "fatture_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fatture_sal_id_fkey" FOREIGN KEY ("sal_id") REFERENCES "sal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documenti_sicurezza" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commessa_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'ALTRO',
    "titolo" TEXT NOT NULL,
    "data_emissione" DATETIME,
    "scadenza" DATETIME,
    "file_url" TEXT,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "documenti_sicurezza_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documenti" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "commessa_id" TEXT,
    "entita_tipo" TEXT NOT NULL,
    "entita_id" TEXT NOT NULL,
    "nome_file" TEXT NOT NULL,
    "storage_url" TEXT NOT NULL,
    "hash_file" TEXT NOT NULL,
    "categoria" TEXT,
    "mime_type" TEXT,
    "dimensione" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "documenti_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "user_email" TEXT,
    "azione" TEXT NOT NULL,
    "entita" TEXT NOT NULL,
    "entita_id" TEXT NOT NULL,
    "data_precedente" TEXT,
    "data_nuova" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "commesse_codice_identificativo_key" ON "commesse"("codice_identificativo");

-- CreateIndex
CREATE INDEX "commesse_stato_idx" ON "commesse"("stato");

-- CreateIndex
CREATE INDEX "commesse_responsabile_idx" ON "commesse"("responsabile");

-- CreateIndex
CREATE UNIQUE INDEX "personale_matricola_key" ON "personale"("matricola");

-- CreateIndex
CREATE UNIQUE INDEX "personale_codice_fiscale_key" ON "personale"("codice_fiscale");

-- CreateIndex
CREATE INDEX "presenze_giornaliere_commessa_id_idx" ON "presenze_giornaliere"("commessa_id");

-- CreateIndex
CREATE INDEX "presenze_giornaliere_data_idx" ON "presenze_giornaliere"("data");

-- CreateIndex
CREATE UNIQUE INDEX "presenze_giornaliere_personale_id_commessa_id_data_key" ON "presenze_giornaliere"("personale_id", "commessa_id", "data");

-- CreateIndex
CREATE INDEX "scadenze_corsi_sicurezza_personale_id_idx" ON "scadenze_corsi_sicurezza"("personale_id");

-- CreateIndex
CREATE INDEX "scadenze_corsi_sicurezza_scadenza_idx" ON "scadenze_corsi_sicurezza"("scadenza");

-- CreateIndex
CREATE INDEX "dpi_assegnati_personale_id_idx" ON "dpi_assegnati"("personale_id");

-- CreateIndex
CREATE UNIQUE INDEX "mezzi_codice_key" ON "mezzi"("codice");

-- CreateIndex
CREATE INDEX "assegnazioni_mezzi_mezzo_id_idx" ON "assegnazioni_mezzi"("mezzo_id");

-- CreateIndex
CREATE INDEX "assegnazioni_mezzi_commessa_id_idx" ON "assegnazioni_mezzi"("commessa_id");

-- CreateIndex
CREATE INDEX "scadenze_mezzi_mezzo_id_idx" ON "scadenze_mezzi"("mezzo_id");

-- CreateIndex
CREATE INDEX "scadenze_mezzi_scadenza_idx" ON "scadenze_mezzi"("scadenza");

-- CreateIndex
CREATE INDEX "materiali_commessa_id_idx" ON "materiali"("commessa_id");

-- CreateIndex
CREATE UNIQUE INDEX "subappaltatori_piva_key" ON "subappaltatori"("piva");

-- CreateIndex
CREATE UNIQUE INDEX "subappaltatori_codice_fiscale_key" ON "subappaltatori"("codice_fiscale");

-- CreateIndex
CREATE INDEX "contratti_subappalto_commessa_id_idx" ON "contratti_subappalto"("commessa_id");

-- CreateIndex
CREATE INDEX "contratti_subappalto_subappaltatore_id_idx" ON "contratti_subappalto"("subappaltatore_id");

-- CreateIndex
CREATE INDEX "sal_commessa_id_idx" ON "sal"("commessa_id");

-- CreateIndex
CREATE UNIQUE INDEX "sal_commessa_id_tipo_progressivo_key" ON "sal"("commessa_id", "tipo", "progressivo");

-- CreateIndex
CREATE INDEX "fatture_commessa_id_idx" ON "fatture"("commessa_id");

-- CreateIndex
CREATE INDEX "fatture_stato_pagamento_idx" ON "fatture"("stato_pagamento");

-- CreateIndex
CREATE INDEX "documenti_sicurezza_commessa_id_idx" ON "documenti_sicurezza"("commessa_id");

-- CreateIndex
CREATE INDEX "documenti_sicurezza_scadenza_idx" ON "documenti_sicurezza"("scadenza");

-- CreateIndex
CREATE INDEX "documenti_entita_tipo_entita_id_idx" ON "documenti"("entita_tipo", "entita_id");

-- CreateIndex
CREATE INDEX "documenti_commessa_id_idx" ON "documenti"("commessa_id");

-- CreateIndex
CREATE INDEX "audit_logs_entita_entita_id_idx" ON "audit_logs"("entita", "entita_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
