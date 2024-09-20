/*
  Warnings:

  - Added the required column `ppn` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `income` ADD COLUMN `ppn` INTEGER NOT NULL;
