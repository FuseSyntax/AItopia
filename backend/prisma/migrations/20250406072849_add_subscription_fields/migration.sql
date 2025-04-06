-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'starter',
ADD COLUMN     "selectedTools" TEXT[] DEFAULT ARRAY[]::TEXT[];
