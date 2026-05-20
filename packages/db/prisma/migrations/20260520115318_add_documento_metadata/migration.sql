-- AlterTable
ALTER TABLE "documenti" ADD COLUMN "dati_estratti_json" TEXT;
ALTER TABLE "documenti" ADD COLUMN "sottocategoria" TEXT;
ALTER TABLE "documenti" ADD COLUMN "stato" TEXT DEFAULT 'APPROVATO';
