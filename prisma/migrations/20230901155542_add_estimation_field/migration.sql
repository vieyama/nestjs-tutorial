/*
  Warnings:

  - Added the required column `remark` to the `ServiceInvoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ServiceInvoices` ADD COLUMN `remark` VARCHAR(191) NOT NULL;
