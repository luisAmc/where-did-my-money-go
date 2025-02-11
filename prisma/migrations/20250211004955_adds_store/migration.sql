/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(19,2)` to `Decimal(9,2)`.
  - Added the required column `store` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "store" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(9,2);
