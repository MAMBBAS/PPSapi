/*
  Warnings:

  - You are about to drop the `_AccountToEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccountToEvent" DROP CONSTRAINT "_AccountToEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToEvent" DROP CONSTRAINT "_AccountToEvent_B_fkey";

-- DropTable
DROP TABLE "_AccountToEvent";
