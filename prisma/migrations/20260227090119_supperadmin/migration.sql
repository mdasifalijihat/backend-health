-- AlterTable
ALTER TABLE "super_admin" ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
