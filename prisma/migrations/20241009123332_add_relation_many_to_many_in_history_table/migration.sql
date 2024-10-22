/*
  Warnings:

  - Added the required column `title` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `expense` ADD COLUMN `historyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `history` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `income` ADD COLUMN `historyId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `historyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Income` ADD CONSTRAINT `Income_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `History`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `History`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_historyId_fkey` FOREIGN KEY (`historyId`) REFERENCES `History`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
