/*
  Warnings:

  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "description",
DROP COLUMN "place",
ADD COLUMN     "notes" TEXT;
