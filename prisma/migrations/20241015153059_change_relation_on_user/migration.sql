/*
  Warnings:

  - You are about to drop the column `userId` on the `expense` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `income` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `supplier` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_userId_fkey`;

-- DropForeignKey
ALTER TABLE `income` DROP FOREIGN KEY `Income_userId_fkey`;

-- DropForeignKey
ALTER TABLE `supplier` DROP FOREIGN KEY `Supplier_userId_fkey`;

-- AlterTable
ALTER TABLE `expense` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `income` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `supplier` DROP COLUMN `userId`;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
