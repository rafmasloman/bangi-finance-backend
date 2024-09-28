/*
  Warnings:

  - You are about to drop the column `supplierId` on the `suppliercompany` table. All the data in the column will be lost.
  - Added the required column `supplierCompanyId` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `suppliercompany` DROP FOREIGN KEY `SupplierCompany_supplierId_fkey`;

-- AlterTable
ALTER TABLE `supplier` ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `supplierCompanyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `suppliercompany` DROP COLUMN `supplierId`;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_supplierCompanyId_fkey` FOREIGN KEY (`supplierCompanyId`) REFERENCES `SupplierCompany`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
