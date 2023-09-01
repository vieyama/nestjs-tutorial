/*
  Warnings:

  - Added the required column `estimation_code` to the `ServiceInvoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ServiceInvoices` ADD COLUMN `estimation_code` VARCHAR(191) NOT NULL;
