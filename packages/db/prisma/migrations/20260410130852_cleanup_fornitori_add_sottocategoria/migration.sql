/*
  Warnings:

  - You are about to drop the column `fornitore_id` on the `fatture` table. All the data in the column will be lost.
  - You are about to drop the `contatti_fornitori` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedback_fornitori` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fornitori` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contatti_fornitori" DROP CONSTRAINT "contatti_fornitori_fornitore_id_fkey";

-- DropForeignKey
ALTER TABLE "fatture" DROP CONSTRAINT "fatture_fornitore_id_fkey";

-- DropForeignKey
ALTER TABLE "feedback_fornitori" DROP CONSTRAINT "feedback_fornitori_fornitore_id_fkey";

-- AlterTable
ALTER TABLE "documenti" ADD COLUMN     "sottocategoria" TEXT;

-- AlterTable
ALTER TABLE "fatture" DROP COLUMN "fornitore_id";

-- DropTable
DROP TABLE "contatti_fornitori";

-- DropTable
DROP TABLE "feedback_fornitori";

-- DropTable
DROP TABLE "fornitori";

-- DropEnum
DROP TYPE "TipoFornitore";
