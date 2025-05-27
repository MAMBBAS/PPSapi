/*
  Warnings:

  - You are about to drop the column `initialBalance` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `convertedAmount` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `receiptImage` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurringId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account_members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_userId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AccountToEvent" DROP CONSTRAINT "_AccountToEvent_B_fkey";

-- DropForeignKey
ALTER TABLE "_CreatedEvents" DROP CONSTRAINT "_CreatedEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "account_members" DROP CONSTRAINT "account_members_accountId_fkey";

-- DropForeignKey
ALTER TABLE "account_members" DROP CONSTRAINT "account_members_userId_fkey";

-- DropForeignKey
ALTER TABLE "recurring_transactions" DROP CONSTRAINT "recurring_transactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_recurringId_fkey";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "initialBalance",
DROP COLUMN "isActive",
DROP COLUMN "type",
ADD COLUMN     "cashbackCategories" TEXT[],
ADD COLUMN     "description" TEXT,
ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "convertedAmount",
DROP COLUMN "currency",
DROP COLUMN "location",
DROP COLUMN "receiptImage",
DROP COLUMN "recurringId",
ADD COLUMN     "exchangeRate" DECIMAL(65,30) DEFAULT 1.0,
ADD COLUMN     "linkedTransactionId" TEXT,
ADD COLUMN     "recurringTransactionId" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "transferDirection" TEXT,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "EventParticipant";

-- DropTable
DROP TABLE "account_members";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_participants" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "event_participants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurringTransactionId_fkey" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_transactions" ADD CONSTRAINT "recurring_transactions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountToEvent" ADD CONSTRAINT "_AccountToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CreatedEvents" ADD CONSTRAINT "_CreatedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
