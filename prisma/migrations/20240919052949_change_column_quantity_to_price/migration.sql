/*
  Warnings:

  - You are about to drop the column `quantity` on the `expense` table. All the data in the column will be lost.
  - Added the required column `price` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expense` DROP COLUMN `quantity`,
    ADD COLUMN `price` INTEGER NOT NULL;
