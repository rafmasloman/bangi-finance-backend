/*
  Warnings:

  - You are about to drop the column `discount` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `evidence` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `ppn` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `supplier` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `supplier` table. All the data in the column will be lost.
  - Added the required column `nomorFaktur` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `discount`,
    DROP COLUMN `evidence`,
    DROP COLUMN `ppn`,
    DROP COLUMN `price`,
    DROP COLUMN `quantity`,
    ADD COLUMN `nomorFaktur` VARCHAR(191) NOT NULL;
