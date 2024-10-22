/*
  Warnings:

  - You are about to drop the column `amount` on the `Expenses` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Expenses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Expenses_id_idx";

-- AlterTable
ALTER TABLE "Expenses" DROP COLUMN "amount",
ADD COLUMN     "accountId" TEXT NOT NULL,
ALTER COLUMN "stock" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Stock" ALTER COLUMN "quantity" SET DEFAULT 0.0,
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_accountName_key" ON "Account"("accountName");

-- CreateIndex
CREATE INDEX "Account_id_accountName_idx" ON "Account"("id", "accountName");

-- CreateIndex
CREATE INDEX "Expenses_id_accountId_createdAt_itemId_userId_idx" ON "Expenses"("id", "accountId", "createdAt", "itemId", "userId");

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
