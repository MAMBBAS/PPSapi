-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('Pending', 'Completed');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'Pending';
