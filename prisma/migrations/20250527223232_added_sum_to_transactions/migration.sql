/*
  Warnings:

  - You are about to drop the column `amount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `linkedTransactionId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurringTransactionId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transferDirection` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recurring_transactions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `sum` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "recurring_transactions" DROP CONSTRAINT "recurring_transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "recurring_transactions" DROP CONSTRAINT "recurring_transactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "recurring_transactions" DROP CONSTRAINT "recurring_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_recurringTransactionId_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "amount",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "description",
DROP COLUMN "exchangeRate",
DROP COLUMN "linkedTransactionId",
DROP COLUMN "recurringTransactionId",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "transferDirection",
DROP COLUMN "updatedAt",
ADD COLUMN     "sum" DECIMAL(65,30) NOT NULL;

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "recurring_transactions";
