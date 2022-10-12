-- CreateTable
CREATE TABLE "textRuTexts" (
    "uid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "words_count" INTEGER NOT NULL,
    "uniqueness" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "textRuTexts_pkey" PRIMARY KEY ("uid")
);
