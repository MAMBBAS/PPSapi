/*
  Warnings:

  - You are about to drop the `_CreatedEvents` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CreatedEvents" DROP CONSTRAINT "_CreatedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_CreatedEvents" DROP CONSTRAINT "_CreatedEvents_B_fkey";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_CreatedEvents";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
