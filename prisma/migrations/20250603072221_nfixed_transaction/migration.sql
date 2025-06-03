/*
  Warnings:

  - You are about to drop the column `accountId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "accountId",
DROP COLUMN "categoryId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
