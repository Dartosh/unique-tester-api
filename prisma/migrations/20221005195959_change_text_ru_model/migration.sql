/*
  Warnings:

  - You are about to drop the column `uniqueness` on the `text_ru_texts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "text_ru_texts" DROP COLUMN "uniqueness",
ADD COLUMN     "json_result" JSONB,
ADD COLUMN     "spell_check" JSONB,
ADD COLUMN     "text_unique" DOUBLE PRECISION;
