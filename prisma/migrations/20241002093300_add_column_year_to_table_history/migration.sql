/*
  Warnings:

  - Added the required column `year` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `history` ADD COLUMN `year` VARCHAR(191) NOT NULL;
