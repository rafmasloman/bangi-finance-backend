/*
  Warnings:

  - Added the required column `totalCollection` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSales` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income` ADD COLUMN `totalCollection` INTEGER NOT NULL,
    ADD COLUMN `totalSales` INTEGER NOT NULL;
