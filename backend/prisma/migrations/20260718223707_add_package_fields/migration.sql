-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "durationDays" INTEGER,
ADD COLUMN     "excluded" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "included" TEXT;
