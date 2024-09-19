/*
  Warnings:

  - Added the required column `firstname` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL;
