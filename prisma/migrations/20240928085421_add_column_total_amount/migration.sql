/*
  Warnings:

  - Added the required column `totalAmount` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `totalAmount` INTEGER NOT NULL;
