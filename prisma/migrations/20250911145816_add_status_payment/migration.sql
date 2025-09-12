-- AlterTable
ALTER TABLE `order` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    MODIFY `payment` VARCHAR(191) NOT NULL DEFAULT 'unpaid';
