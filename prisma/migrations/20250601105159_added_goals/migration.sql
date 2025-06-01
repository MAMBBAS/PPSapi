/*
  Warnings:

  - You are about to drop the column `autoSaveAccountId` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `autoSavePercentage` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `isShared` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the `goal_members` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "goal_members" DROP CONSTRAINT "goal_members_goalId_fkey";

-- DropForeignKey
ALTER TABLE "goal_members" DROP CONSTRAINT "goal_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_autoSaveAccountId_fkey";

-- AlterTable
ALTER TABLE "goals" DROP COLUMN "autoSaveAccountId",
DROP COLUMN "autoSavePercentage",
DROP COLUMN "color",
DROP COLUMN "icon",
DROP COLUMN "isShared";

-- DropTable
DROP TABLE "goal_members";
