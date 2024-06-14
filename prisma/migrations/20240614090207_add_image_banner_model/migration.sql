-- CreateTable
CREATE TABLE "imageBanner" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imageBanner_pkey" PRIMARY KEY ("id")
);
