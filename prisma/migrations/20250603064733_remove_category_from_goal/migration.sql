/*
  Warnings:

  - You are about to drop the column `category` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `targetDate` on the `goals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "goals" DROP COLUMN "category",
DROP COLUMN "currency",
DROP COLUMN "targetDate";
