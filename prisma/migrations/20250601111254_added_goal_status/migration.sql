-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('Pending', 'Completed');

-- AlterTable
ALTER TABLE "goals" ADD COLUMN     "status" "GoalStatus" NOT NULL DEFAULT 'Pending';
