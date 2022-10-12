/*
  Warnings:

  - You are about to drop the column `text_unique` on the `text_ru_texts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "text_ru_texts" DROP COLUMN "text_unique",
ADD COLUMN     "textUnique" DOUBLE PRECISION;
