/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `ppn` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `totalPrice`,
    ADD COLUMN `ppn` INTEGER NOT NULL;
