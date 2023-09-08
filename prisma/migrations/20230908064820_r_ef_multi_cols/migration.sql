/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `NVarChar(50)`.
  - You are about to alter the column `createdAt` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(15)` to `DateTime`.
  - You are about to alter the column `updatedAt` on the `Organization` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(15)` to `DateTime`.
  - A unique constraint covering the columns `[id]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bgOrganizationCode]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDefault` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Organization] DROP CONSTRAINT [Organization_pkey];
ALTER TABLE [dbo].[Organization] ALTER COLUMN [id] NVARCHAR(50) NOT NULL;
ALTER TABLE [dbo].[Organization] ALTER COLUMN [createdAt] DATETIME NOT NULL;
ALTER TABLE [dbo].[Organization] ALTER COLUMN [updatedAt] DATETIME NOT NULL;
ALTER TABLE [dbo].[Organization] ADD [bgOrganizationCode] NVARCHAR(1000) NOT NULL CONSTRAINT [Organization_bgOrganizationCode_df] DEFAULT '',
[code] NVARCHAR(30) NOT NULL,
[isActive] BIT NOT NULL,
[isDefault] BIT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[PortalUser] (
    [id] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(1000),
    [username] NVARCHAR(1000),
    [password] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [createdAt] DATETIME NOT NULL,
    [updatedAt] DATETIME NOT NULL,
    CONSTRAINT [PortalUser_id_key] UNIQUE NONCLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Business] (
    [id] NVARCHAR(50) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [isActive] BIT NOT NULL,
    [isDefault] BIT NOT NULL,
    [status] NVARCHAR(10) NOT NULL,
    [organizationId] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIME NOT NULL,
    [updatedAt] DATETIME NOT NULL,
    [bgBusinessCode] NVARCHAR(30) NOT NULL CONSTRAINT [Business_bgBusinessCode_df] DEFAULT '',
    [apiKey] NVARCHAR(max),
    CONSTRAINT [Business_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Business_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [Business_bgBusinessCode_key] UNIQUE NONCLUSTERED ([bgBusinessCode])
);

-- CreateTable
CREATE TABLE [dbo].[Location] (
    [id] NVARCHAR(50) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [isActive] BIT NOT NULL,
    [businessId] NVARCHAR(50) NOT NULL,
    [organizationId] NVARCHAR(50) NOT NULL,
    [createdAt] DATETIME NOT NULL,
    [updatedAt] DATETIME NOT NULL,
    [bgLocationCode] NVARCHAR(30) NOT NULL CONSTRAINT [Location_bgLocationCode_df] DEFAULT '',
    CONSTRAINT [Location_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [Location_code_key] UNIQUE NONCLUSTERED ([code]),
    CONSTRAINT [Location_bgLocationCode_key] UNIQUE NONCLUSTERED ([bgLocationCode])
);

-- CreateTable
CREATE TABLE [dbo].[RegistrationStatus] (
    [id] NVARCHAR(30) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(100) NOT NULL,
    [isActive] BIT NOT NULL,
    CONSTRAINT [PK_RegistrationStatus] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RegistrationStatus_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [RegistrationStatus_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[Registration] (
    [locationCode] NVARCHAR(30) NOT NULL,
    [cpuId] NVARCHAR(100) NOT NULL,
    [macAddress] NVARCHAR(100) NOT NULL,
    [mbSerial] NVARCHAR(100) NOT NULL,
    [hddSerial] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Registration_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [Registration_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [statusId] NVARCHAR(30) NOT NULL CONSTRAINT [Registration_statusId_df] DEFAULT 'whitelisted',
    CONSTRAINT [IDX_Registration] UNIQUE NONCLUSTERED ([locationCode],[cpuId],[macAddress],[mbSerial],[hddSerial])
);

-- CreateTable
CREATE TABLE [dbo].[Inventory] (
    [locationCode] NVARCHAR(30) NOT NULL,
    [itemCode] NVARCHAR(50) NOT NULL,
    [qty] DECIMAL(18,2) NOT NULL,
    [cost] DECIMAL(18,2) NOT NULL,
    [price] DECIMAL(18,2) NOT NULL,
    CONSTRAINT [Inventory_locationCode_itemCode_key] UNIQUE NONCLUSTERED ([locationCode],[itemCode])
);

-- CreateTable
CREATE TABLE [dbo].[MasterItem] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [itemCode] NVARCHAR(50) NOT NULL,
    [code] NVARCHAR(50) NOT NULL,
    [name] NVARCHAR(200) NOT NULL,
    [brand] NVARCHAR(50),
    [category] NVARCHAR(50),
    [generic] NVARCHAR(50),
    [uom] NVARCHAR(50),
    [cost] DECIMAL(18,2),
    [price] DECIMAL(18,2),
    CONSTRAINT [IDX_MasterItem] UNIQUE NONCLUSTERED ([itemCode])
);

-- CreateTable
CREATE TABLE [dbo].[SalesDetails] (
    [locationCode] NVARCHAR(30) NOT NULL,
    [tranDate] DATE NOT NULL,
    [tranCode] NVARCHAR(20) NOT NULL,
    [cashierCode] NVARCHAR(50) NOT NULL,
    [itemCode] NVARCHAR(50) NOT NULL,
    [qty] DECIMAL(18,2) NOT NULL,
    [total] DECIMAL(18,2) NOT NULL,
    CONSTRAINT [IDX_SalesDetails] UNIQUE NONCLUSTERED ([locationCode],[tranDate],[tranCode],[cashierCode],[itemCode]),
    CONSTRAINT [UQ_SalesDetails] UNIQUE NONCLUSTERED ([locationCode],[tranDate],[tranCode],[cashierCode],[itemCode])
);

-- CreateTable
CREATE TABLE [dbo].[ModTransferHeader] (
    [businessCode] NVARCHAR(50) NOT NULL,
    [tran_ty] TINYINT NOT NULL,
    [flocid_no] INT NOT NULL,
    [tlocid_no] INT,
    [direct_yn] BIT,
    [transitid_no] INT,
    [statid_no] INT,
    [doc_nb] NVARCHAR(20) NOT NULL,
    [doc_dt] SMALLDATETIME,
    [post_dt] SMALLDATETIME,
    [userid_no] INT,
    [pi_nm] NVARCHAR(50),
    [ship_dt] SMALLDATETIME,
    [shipid_no] INT,
    [shipagentid_no] INT,
    [receipt_dt] DATE,
    [locid_no] INT,
    [contact_nm] NVARCHAR(50),
    [phone_nb] NVARCHAR(20),
    [mobile_nb] NVARCHAR(20),
    [approverid_no] INT,
    [approvalid_no] INT,
    [createid_no] INT,
    [postid_no] INT,
    [actid_no] INT,
    [link_nb] NVARCHAR(50),
    [produce_yn] BIT,
    [audit_yn] BIT,
    [audit_dt] SMALLDATETIME,
    [year_tx] NVARCHAR(4),
    [ystatid_no] INT,
    [brtran_ty] INT,
    [remarks_tx] NVARCHAR(200),
    [sttrantyid_no] INT,
    [refid_no] INT,
    [isGet] BIT NOT NULL CONSTRAINT [ModTransferHeader_isGet_df] DEFAULT 0,
    CONSTRAINT [uq_InventoryTransferHeader] UNIQUE NONCLUSTERED ([businessCode],[doc_nb])
);

-- CreateTable
CREATE TABLE [dbo].[ModStockDetails] (
    [businessCode] NVARCHAR(50) NOT NULL,
    [doc_nb] NVARCHAR(20) NOT NULL,
    [typeid_no] INT,
    [itemid_no] INT NOT NULL,
    [item_cd] NVARCHAR(30),
    [item_nm] NVARCHAR(200),
    [locid_no] INT NOT NULL,
    [qty_am] DECIMAL(18,2) NOT NULL,
    [uomid_no] INT,
    [cost_am] DECIMAL(18,4) NOT NULL,
    [tcost_am] DECIMAL(18,4) NOT NULL,
    [tax_yn] BIT,
    [taxid_no] INT,
    [tax_am] DECIMAL(18,4),
    [disc_rt] DECIMAL(18,4),
    [disc_am] DECIMAL(18,4),
    [tran_am] DECIMAL(18,4),
    [qtypost_am] DECIMAL(18,2) NOT NULL,
    [lot_yn] BIT NOT NULL,
    [count_am] DECIMAL(18,2),
    [sourceid_no] INT NOT NULL,
    [qtyprod_am] DECIMAL(18,2),
    [line_no] INT,
    [beginv_am] DECIMAL(18,2),
    [in_am] DECIMAL(18,2),
    [out_am] DECIMAL(18,2),
    [transfer_am] DECIMAL(18,2),
    [sold_am] DECIMAL(18,2),
    [production_am] DECIMAL(18,2),
    [remarks_tx] NVARCHAR(200),
    [update_yn] BIT,
    [recvdt_tx] NVARCHAR(100),
    [invdt_tx] NVARCHAR(100),
    [inv_nb] NVARCHAR(100),
    CONSTRAINT [uq_InventoryStockDetails] UNIQUE NONCLUSTERED ([businessCode],[doc_nb],[locid_no],[itemid_no])
);

-- CreateTable
CREATE TABLE [dbo].[ModPosting] (
    [businessCode] NVARCHAR(50) NOT NULL,
    [line_no] INT NOT NULL,
    [tran_ty] TINYINT NOT NULL,
    [module_nm] NVARCHAR(50) NOT NULL,
    [source_nb] NVARCHAR(20) NOT NULL,
    [post_nb] NVARCHAR(20),
    [locid_no] INT NOT NULL,
    [itemid_no] INT NOT NULL,
    [qty_am] DECIMAL(18,2) NOT NULL,
    [brrecvd_am] DECIMAL(18,2),
    [uomid_no] INT,
    [serial_nb] NVARCHAR(20) NOT NULL,
    [batch_nb] NVARCHAR(20) NOT NULL,
    [lot_nb] NVARCHAR(20) NOT NULL,
    [exp_dt] DATE NOT NULL,
    [postedid_no] INT NOT NULL,
    [tran_dt] SMALLDATETIME,
    [userid_no] INT,
    [count_am] DECIMAL(18,2),
    [variance_am] DECIMAL(18,2),
    [child_yn] BIT,
    [year_tx] NVARCHAR(4),
    [recvdt_tx] NVARCHAR(100),
    [invdt_tx] NVARCHAR(100),
    [inv_nb] NVARCHAR(100),
    CONSTRAINT [uq_ModPosting] UNIQUE NONCLUSTERED ([businessCode],[source_nb],[locid_no],[itemid_no],[serial_nb],[batch_nb],[lot_nb],[exp_dt])
);

-- CreateTable
CREATE TABLE [dbo].[sysdiagrams] (
    [name] NVARCHAR(128) NOT NULL,
    [principal_id] INT NOT NULL,
    [diagram_id] INT NOT NULL IDENTITY(1,1),
    [version] INT,
    [definition] VARBINARY(max),
    CONSTRAINT [PK__sysdiagr__C2B05B614F412E55] PRIMARY KEY CLUSTERED ([diagram_id]),
    CONSTRAINT [UK_principal_name] UNIQUE NONCLUSTERED ([principal_id],[name])
);

-- CreateTable
CREATE TABLE [dbo].[RefBrand] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefBrand_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefBrand_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefBrand_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefBrand_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefBrand_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefDivision] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefDivision_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefDivision_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefDivision_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefDivision_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefDivision_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefFamily] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefFamily_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefFamily_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefFamily_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefFamily_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefFamily_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefGenericType] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefGenericType_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefGenericType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefGenericType_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefGenericType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefGenericType_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefUOM] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefUOM_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefUOM_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefUOM_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefUOM_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefUOM_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefBank] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefBank_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefBank_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefBank_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefBank_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefBank_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefCardType] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefCardType_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefCardType_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefCardType_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefCardType_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefCardType_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefShippingMethod] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefShippingMethod_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefShippingMethod_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefShippingMethod_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefShippingMethod_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefShippingMethod_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefCategory] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefCategory_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefCategory_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefCategory_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [colorCode] NVARCHAR(50),
    CONSTRAINT [RefCategory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefCategory_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefPayment] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefPayment_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefPayment_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefPayment_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [operator] TINYINT CONSTRAINT [RefPayment_operator_df] DEFAULT 0,
    [hide] BIT CONSTRAINT [RefPayment_hide_df] DEFAULT 0,
    CONSTRAINT [RefPayment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefPayment_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefDiscount] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefDiscount_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefDiscount_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefDiscount_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [discRate] TINYINT NOT NULL CONSTRAINT [RefDiscount_discRate_df] DEFAULT 0,
    [lessTax] BIT NOT NULL CONSTRAINT [RefDiscount_lessTax_df] DEFAULT 0,
    [senior] BIT NOT NULL CONSTRAINT [RefDiscount_senior_df] DEFAULT 0,
    [promo] BIT NOT NULL CONSTRAINT [RefDiscount_promo_df] DEFAULT 0,
    [claim] BIT NOT NULL CONSTRAINT [RefDiscount_claim_df] DEFAULT 0,
    [hide] BIT NOT NULL CONSTRAINT [RefDiscount_hide_df] DEFAULT 0,
    CONSTRAINT [RefDiscount_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefDiscount_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefTerms] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefTerms_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefTerms_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefTerms_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [days] TINYINT NOT NULL CONSTRAINT [RefTerms_days_df] DEFAULT 0,
    CONSTRAINT [RefTerms_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefTerms_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Business_organizationId_idx] ON [dbo].[Business]([organizationId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Location_businessId_idx] ON [dbo].[Location]([businessId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Location_organizationId_idx] ON [dbo].[Location]([organizationId]);

-- CreateIndex
ALTER TABLE [dbo].[Organization] ADD CONSTRAINT [Organization_id_key] UNIQUE NONCLUSTERED ([id]);

-- CreateIndex
ALTER TABLE [dbo].[Organization] ADD CONSTRAINT [Organization_code_key] UNIQUE NONCLUSTERED ([code]);

-- CreateIndex
ALTER TABLE [dbo].[Organization] ADD CONSTRAINT [Organization_bgOrganizationCode_key] UNIQUE NONCLUSTERED ([bgOrganizationCode]);

-- AddForeignKey
ALTER TABLE [dbo].[Business] ADD CONSTRAINT [Business_organizationId_fkey] FOREIGN KEY ([organizationId]) REFERENCES [dbo].[Organization]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Location] ADD CONSTRAINT [Location_businessId_fkey] FOREIGN KEY ([businessId]) REFERENCES [dbo].[Business]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Registration] ADD CONSTRAINT [Registration_statusId_fkey] FOREIGN KEY ([statusId]) REFERENCES [dbo].[RegistrationStatus]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [FK_Inventory_Location] FOREIGN KEY ([locationCode]) REFERENCES [dbo].[Location]([bgLocationCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inventory] ADD CONSTRAINT [FK_Inventory_MasterItem] FOREIGN KEY ([itemCode]) REFERENCES [dbo].[MasterItem]([itemCode]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MasterItem] ADD CONSTRAINT [FK_MasterItem_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ModStockDetails] ADD CONSTRAINT [ModStockDetails_businessCode_doc_nb_fkey] FOREIGN KEY ([businessCode], [doc_nb]) REFERENCES [dbo].[ModTransferHeader]([businessCode],[doc_nb]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ModPosting] ADD CONSTRAINT [ModPosting_businessCode_source_nb_locid_no_itemid_no_fkey] FOREIGN KEY ([businessCode], [source_nb], [locid_no], [itemid_no]) REFERENCES [dbo].[ModStockDetails]([businessCode],[doc_nb],[locid_no],[itemid_no]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[RefBrand] ADD CONSTRAINT [FK_RefBrand_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefDivision] ADD CONSTRAINT [FK_RefDivision_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefFamily] ADD CONSTRAINT [FK_RefFamily_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefGenericType] ADD CONSTRAINT [FK_RefGenericType_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefUOM] ADD CONSTRAINT [FK_RefUOM_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefBank] ADD CONSTRAINT [FK_RefBank_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefCardType] ADD CONSTRAINT [FK_RefCardType_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefShippingMethod] ADD CONSTRAINT [FK_RefShippingMethod_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefCategory] ADD CONSTRAINT [FK_RefCategory_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefPayment] ADD CONSTRAINT [FK_RefPayment_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefDiscount] ADD CONSTRAINT [FK_RefDiscount_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefTerms] ADD CONSTRAINT [FK_RefTerms_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
