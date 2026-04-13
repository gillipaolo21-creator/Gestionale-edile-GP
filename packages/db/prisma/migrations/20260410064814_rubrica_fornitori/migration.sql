-- CreateEnum
CREATE TYPE "StatoCommessa" AS ENUM ('IN_PREVENTIVAZIONE', 'APERTO', 'SOSPESO', 'CHIUSO');

-- CreateEnum
CREATE TYPE "StatoAttivita" AS ENUM ('PROGRAMMATA', 'IN_CORSO', 'COMPLETATA', 'SOSPESA');

-- CreateEnum
CREATE TYPE "StatoSAL" AS ENUM ('BOZZA', 'APPROVATO_DL', 'FATTURABILE');

-- CreateEnum
CREATE TYPE "TipoDocumentoFiscale" AS ENUM ('FATTURA_ATTIVA', 'FATTURA_PASSIVA', 'NOTA_CREDITO');

-- CreateEnum
CREATE TYPE "StatoPagamento" AS ENUM ('DA_PAGARE', 'PARZIALE', 'PAGATO');

-- CreateEnum
CREATE TYPE "TipoEntitaDocumento" AS ENUM ('COMMESSA', 'SAL', 'FATTURA', 'FORNITORE');

-- CreateEnum
CREATE TYPE "StatoOCR" AS ENUM ('NON_RICHIESTO', 'IN_ELABORAZIONE', 'COMPLETATO', 'FALLITO');

-- CreateEnum
CREATE TYPE "EntitaTargetImport" AS ENUM ('FORNITORI', 'LISTINO_PREZZI', 'COMPUTO_METRICO');

-- CreateEnum
CREATE TYPE "StatoJob" AS ENUM ('IN_CODA', 'IN_ELABORAZIONE', 'COMPLETATO', 'COMPLETATO_CON_ERRORI', 'FALLITO');

-- CreateEnum
CREATE TYPE "TipoFornitore" AS ENUM ('MATERIALI', 'SERVIZI_SUBAPPALTO', 'ENTRAMBI');

-- CreateTable
CREATE TABLE "commesse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codice_identificativo" TEXT NOT NULL,
    "tipo_lavori" TEXT NOT NULL,
    "nome_cantiere" TEXT NOT NULL,
    "nome_cliente" TEXT,
    "indirizzo" TEXT,
    "citta" TEXT,
    "cap" TEXT,
    "responsabile" TEXT,
    "budget_iniziale" DECIMAL(12,2) NOT NULL,
    "data_inizio" DATE NOT NULL,
    "data_fine_prevista" DATE,
    "stato" "StatoCommessa" NOT NULL DEFAULT 'IN_PREVENTIVAZIONE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commesse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appalto_voci" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commessa_id" UUID NOT NULL,
    "parent_id" UUID,
    "descrizione" TEXT NOT NULL,
    "unita_misura" TEXT NOT NULL,
    "quantita" DECIMAL(12,3) NOT NULL,
    "prezzo_unitario" DECIMAL(12,4) NOT NULL,
    "avanzamento_percent" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appalto_voci_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attivita_commessa" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commessa_id" UUID NOT NULL,
    "parent_id" UUID,
    "codice_wbs" TEXT,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT,
    "importo_previsto" DECIMAL(12,2) NOT NULL,
    "data_inizio" DATE,
    "data_fine" DATE,
    "responsabile" TEXT,
    "stato" "StatoAttivita" NOT NULL DEFAULT 'PROGRAMMATA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attivita_commessa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornitori" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ragione_sociale" TEXT NOT NULL,
    "partita_iva" TEXT,
    "tipo" "TipoFornitore" NOT NULL DEFAULT 'MATERIALI',
    "categoria_merceologica" TEXT,
    "email" TEXT,
    "sito_web" TEXT,
    "indirizzo" TEXT,
    "citta" TEXT,
    "cap" TEXT,
    "note" TEXT,
    "rating_affidabilita" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornitori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contatti_fornitori" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fornitore_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "ruolo" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "is_primario" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contatti_fornitori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_fornitori" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fornitore_id" UUID NOT NULL,
    "commessa_riferimento" TEXT,
    "valutazione" INTEGER NOT NULL,
    "commento" TEXT,
    "autore" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_fornitori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forniture_materiali" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commessa_id" UUID NOT NULL,
    "fornitore_nome" TEXT NOT NULL,
    "importo_fornitura" DECIMAL(12,2) NOT NULL,
    "descrizione" TEXT,
    "preventivo_riferimento" TEXT NOT NULL,
    "data_preventivo" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forniture_materiali_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forniture_servizi" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commessa_id" UUID NOT NULL,
    "fornitore_nome" TEXT NOT NULL,
    "importo_fornitura" DECIMAL(12,2) NOT NULL,
    "descrizione" TEXT,
    "preventivo_riferimento" TEXT NOT NULL,
    "data_preventivo" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forniture_servizi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commessa_id" UUID NOT NULL,
    "progressivo" INTEGER NOT NULL,
    "data_certificazione" DATE NOT NULL,
    "percentuale_completamento" DECIMAL(5,2) NOT NULL,
    "importo_maturato" DECIMAL(12,2) NOT NULL,
    "stato_approvazione" "StatoSAL" NOT NULL DEFAULT 'BOZZA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fatture" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo_documento" "TipoDocumentoFiscale" NOT NULL,
    "fornitore_id" UUID,
    "commessa_id" UUID NOT NULL,
    "sal_id" UUID,
    "importo_imponibile" DECIMAL(12,2) NOT NULL,
    "iva" DECIMAL(12,2) NOT NULL,
    "data_scadenza" DATE NOT NULL,
    "stato_pagamento" "StatoPagamento" NOT NULL DEFAULT 'DA_PAGARE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fatture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documenti" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entita_tipo" "TipoEntitaDocumento" NOT NULL,
    "entita_id" UUID NOT NULL,
    "nome_file" TEXT NOT NULL,
    "storage_url" TEXT NOT NULL,
    "hash_file" TEXT NOT NULL,
    "categoria" TEXT,
    "stato_ocr" "StatoOCR" NOT NULL DEFAULT 'NON_RICHIESTO',
    "dati_estratti_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documenti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs_importazione" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "documento_id" UUID NOT NULL,
    "entita_target" "EntitaTargetImport" NOT NULL,
    "stato" "StatoJob" NOT NULL DEFAULT 'IN_CODA',
    "totale_record" INTEGER NOT NULL DEFAULT 0,
    "record_processati" INTEGER NOT NULL DEFAULT 0,
    "errori_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_importazione_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "commesse_codice_identificativo_key" ON "commesse"("codice_identificativo");

-- CreateIndex
CREATE INDEX "appalto_voci_commessa_id_idx" ON "appalto_voci"("commessa_id");

-- CreateIndex
CREATE INDEX "appalto_voci_parent_id_idx" ON "appalto_voci"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "fornitori_partita_iva_key" ON "fornitori"("partita_iva");

-- CreateIndex
CREATE UNIQUE INDEX "sals_commessa_id_progressivo_key" ON "sals"("commessa_id", "progressivo");

-- CreateIndex
CREATE INDEX "documenti_entita_tipo_entita_id_idx" ON "documenti"("entita_tipo", "entita_id");

-- AddForeignKey
ALTER TABLE "appalto_voci" ADD CONSTRAINT "appalto_voci_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "appalto_voci"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appalto_voci" ADD CONSTRAINT "appalto_voci_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attivita_commessa" ADD CONSTRAINT "attivita_commessa_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "attivita_commessa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attivita_commessa" ADD CONSTRAINT "attivita_commessa_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contatti_fornitori" ADD CONSTRAINT "contatti_fornitori_fornitore_id_fkey" FOREIGN KEY ("fornitore_id") REFERENCES "fornitori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_fornitori" ADD CONSTRAINT "feedback_fornitori_fornitore_id_fkey" FOREIGN KEY ("fornitore_id") REFERENCES "fornitori"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forniture_materiali" ADD CONSTRAINT "forniture_materiali_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forniture_servizi" ADD CONSTRAINT "forniture_servizi_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sals" ADD CONSTRAINT "sals_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatture" ADD CONSTRAINT "fatture_fornitore_id_fkey" FOREIGN KEY ("fornitore_id") REFERENCES "fornitori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatture" ADD CONSTRAINT "fatture_commessa_id_fkey" FOREIGN KEY ("commessa_id") REFERENCES "commesse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fatture" ADD CONSTRAINT "fatture_sal_id_fkey" FOREIGN KEY ("sal_id") REFERENCES "sals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs_importazione" ADD CONSTRAINT "jobs_importazione_documento_id_fkey" FOREIGN KEY ("documento_id") REFERENCES "documenti"("id") ON DELETE CASCADE ON UPDATE CASCADE;
