-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tokens_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Engineer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Engineer_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Foreman` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Foreman_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Supplier_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NOT NULL,
    `bank_name` VARCHAR(191) NULL,
    `bank_number` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Customer_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` VARCHAR(191) NOT NULL,
    `workshop_name` VARCHAR(191) NOT NULL,
    `workshop_logo` VARCHAR(191) NULL,
    `workshop_npwp` VARCHAR(191) NULL,
    `workshop_address` VARCHAR(191) NOT NULL,
    `tax_services` INTEGER NULL,
    `tax_products` INTEGER NULL,

    UNIQUE INDEX `Setting_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `plat_number` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `mileage` DOUBLE NULL,
    `chassis_number` VARCHAR(191) NULL,
    `engine_number` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Car_id_key`(`id`),
    UNIQUE INDEX `Car_plat_number_key`(`plat_number`),
    INDEX `Car_customerId_fkey`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Products` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NULL,
    `location` VARCHAR(191) NOT NULL,
    `purchase_price` DOUBLE NOT NULL,
    `selling_price` DOUBLE NOT NULL,
    `product_type` ENUM('MATERIAL', 'OIL', 'SPAREPART', 'SUBLET') NOT NULL,
    `stock` DOUBLE NOT NULL,
    `min_stock_alert` INTEGER NOT NULL,
    `supplierId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Products_id_key`(`id`),
    UNIQUE INDEX `Products_code_key`(`code`),
    INDEX `Products_supplierId_fkey`(`supplierId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Services` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `cost` DOUBLE NOT NULL,
    `engineer_payment` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Services_id_key`(`id`),
    UNIQUE INDEX `Services_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellProducts` (
    `id` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `selling_price` DOUBLE NOT NULL,
    `is_guarantee` BOOLEAN NULL DEFAULT false,
    `discount` DOUBLE NULL,
    `productId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `productInvoicesId` VARCHAR(191) NULL,
    `serviceInvoicesId` VARCHAR(191) NULL,

    UNIQUE INDEX `SellProducts_id_key`(`id`),
    INDEX `SellProducts_customerId_fkey`(`customerId`),
    INDEX `SellProducts_productId_fkey`(`productId`),
    INDEX `SellProducts_productInvoicesId_fkey`(`productInvoicesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductInvoices` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_code` VARCHAR(191) NOT NULL,
    `transaction_date` DATETIME(3) NULL,
    `payment_date` DATETIME(3) NULL,
    `transfer_detail` VARCHAR(191) NULL,
    `payment_method` ENUM('CASH', 'TRANSFER', 'DEBIT') NULL,
    `payment_status` ENUM('PAID', 'WAITING', 'DEBT') NULL DEFAULT 'WAITING',
    `tax` INTEGER NULL,
    `paid_amount` DOUBLE NULL,
    `discount` DOUBLE NULL,
    `paid_total` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ProductInvoices_id_key`(`id`),
    UNIQUE INDEX `ProductInvoices_invoice_code_key`(`invoice_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellServices` (
    `id` VARCHAR(191) NOT NULL,
    `discount` DOUBLE NULL,
    `cost` DOUBLE NOT NULL,
    `total_cost` DOUBLE NULL,
    `servicesId` VARCHAR(191) NULL,
    `engineerId` VARCHAR(191) NULL,
    `serviceInvoicesId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SellServices_id_key`(`id`),
    INDEX `SellServices_engineerId_fkey`(`engineerId`),
    INDEX `SellServices_serviceInvoicesId_fkey`(`serviceInvoicesId`),
    INDEX `SellServices_servicesId_fkey`(`servicesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceInvoices` (
    `id` VARCHAR(191) NOT NULL,
    `invoice_code` VARCHAR(191) NOT NULL,
    `date_in` DATETIME(3) NULL,
    `date_out` DATETIME(3) NULL,
    `request_job` JSON NULL,
    `carId` VARCHAR(191) NULL,
    `status` ENUM('QUEUE', 'PROGRESS', 'PENDING', 'CLOSE', 'QCPASSED', 'DONE') NULL DEFAULT 'QUEUE',
    `cost_service` DOUBLE NULL,
    `cost_product` DOUBLE NULL,
    `transaction_type` ENUM('EXTERNAL', 'INTERNAL', 'GUARANTEE') NULL,
    `tax` DOUBLE NULL,
    `work_order_number` VARCHAR(191) NOT NULL,
    `transfer_detail` VARCHAR(191) NULL,
    `payment_date` DATETIME(3) NULL,
    `payment_method` ENUM('CASH', 'TRANSFER', 'DEBIT') NULL DEFAULT 'CASH',
    `payment_status` ENUM('PAID', 'WAITING', 'DEBT') NULL DEFAULT 'WAITING',
    `stay` BOOLEAN NULL DEFAULT false,
    `number_queue` INTEGER NULL,
    `paid_total` DOUBLE NULL,
    `paid_amount` DOUBLE NULL,
    `foremanId` VARCHAR(191) NULL,
    `customerId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ServiceInvoices_id_key`(`id`),
    UNIQUE INDEX `ServiceInvoices_work_order_number_key`(`work_order_number`),
    INDEX `ServiceInvoices_carId_fkey`(`carId`),
    INDEX `ServiceInvoices_customerId_fkey`(`customerId`),
    INDEX `ServiceInvoices_foremanId_fkey`(`foremanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Products` ADD CONSTRAINT `Products_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProducts` ADD CONSTRAINT `SellProducts_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProducts` ADD CONSTRAINT `SellProducts_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProducts` ADD CONSTRAINT `SellProducts_productInvoicesId_fkey` FOREIGN KEY (`productInvoicesId`) REFERENCES `ProductInvoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellProducts` ADD CONSTRAINT `SellProducts_serviceInvoicesId_fkey` FOREIGN KEY (`serviceInvoicesId`) REFERENCES `ServiceInvoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellServices` ADD CONSTRAINT `SellServices_engineerId_fkey` FOREIGN KEY (`engineerId`) REFERENCES `Engineer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellServices` ADD CONSTRAINT `SellServices_serviceInvoicesId_fkey` FOREIGN KEY (`serviceInvoicesId`) REFERENCES `ServiceInvoices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellServices` ADD CONSTRAINT `SellServices_servicesId_fkey` FOREIGN KEY (`servicesId`) REFERENCES `Services`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceInvoices` ADD CONSTRAINT `ServiceInvoices_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceInvoices` ADD CONSTRAINT `ServiceInvoices_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceInvoices` ADD CONSTRAINT `ServiceInvoices_foremanId_fkey` FOREIGN KEY (`foremanId`) REFERENCES `Foreman`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
