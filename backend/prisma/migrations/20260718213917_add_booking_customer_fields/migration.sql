-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "phone" TEXT;
