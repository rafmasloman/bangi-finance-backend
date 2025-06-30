-- AlterTable
ALTER TABLE `supplier` MODIFY `totalAmount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `nomorFaktur` VARCHAR(191) NOT NULL DEFAULT '';
