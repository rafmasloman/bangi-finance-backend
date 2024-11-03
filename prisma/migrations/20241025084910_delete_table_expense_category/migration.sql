/*
  Warnings:

  - You are about to drop the column `expenseCategoryId` on the `expense` table. All the data in the column will be lost.
  - You are about to drop the `expensecategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expenseCategory` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `Expense_expenseCategoryId_fkey`;

-- AlterTable
ALTER TABLE `expense` DROP COLUMN `expenseCategoryId`,
    ADD COLUMN `expenseCategory` ENUM('SALES', 'SERVICE_KARYAWAN', 'SERVICE_MANAGEMENT', 'PPN', 'GAJI_KARYAWAN', 'PENGEMBALIAN_MODAL', 'OPERASIONAL') NOT NULL;

-- DropTable
DROP TABLE `expensecategory`;
