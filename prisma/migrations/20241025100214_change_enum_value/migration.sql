/*
  Warnings:

  - The values [SERVICE_MANAGEMENT] on the enum `Expense_expenseCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `expense` MODIFY `expenseCategory` ENUM('SALES', 'SERVICE_KARYAWAN', 'SERVICE_MANAJEMEN', 'PPN', 'GAJI_KARYAWAN', 'PENGEMBALIAN_MODAL', 'OPERASIONAL') NOT NULL;
