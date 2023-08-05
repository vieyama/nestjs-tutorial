-- CreateTable
CREATE TABLE `PurchaseProducts` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_code` VARCHAR(191) NOT NULL,
    `purchase_date` DATETIME(3) NOT NULL,
    `qty` INTEGER NOT NULL,
    `purchase_price` DOUBLE NOT NULL,
    `payment_method` ENUM('CASH', 'TRANSFER', 'DEBIT') NOT NULL,
    `payment_status` ENUM('PAID', 'WAITING', 'DEBT') NOT NULL,
    `transfer_detail` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `supplierId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PurchaseProducts_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchaseProducts` ADD CONSTRAINT `PurchaseProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseProducts` ADD CONSTRAINT `PurchaseProducts_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
