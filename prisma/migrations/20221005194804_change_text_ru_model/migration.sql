/*
  Warnings:

  - You are about to drop the `textRuTexts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "textRuTexts";

-- CreateTable
CREATE TABLE "text_ru_texts" (
    "uid" TEXT NOT NULL,
    "name" TEXT,
    "text" TEXT,
    "words_count" INTEGER,
    "uniqueness" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "text_ru_texts_uid_key" ON "text_ru_texts"("uid");
