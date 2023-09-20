BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[MasterSupplier] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id_no] NVARCHAR(50) NOT NULL,
    [ref_cd] NVARCHAR(30) NOT NULL,
    [ref_nm] NVARCHAR(100) NOT NULL,
    [active_yn] BIT NOT NULL,
    [default_yn] BIT,
    [groupid_no] INT,
    [classid_no] INT,
    [trade_nm] NVARCHAR(50),
    [tin_nb] NVARCHAR(20),
    [address_tx] NVARCHAR(max),
    [address2_tx] NVARCHAR(max),
    [province_nm] NVARCHAR(100),
    [city_nm] NVARCHAR(100),
    [postal_nb] NVARCHAR(5),
    [contact_nm] NVARCHAR(100),
    [position_nm] NVARCHAR(100),
    [tel1_nb] NVARCHAR(30),
    [tel2_nb] NVARCHAR(30),
    [mobile1_nb] NVARCHAR(30),
    [mobile2_nb] NVARCHAR(30),
    [email_ad] NVARCHAR(100),
    [website_tx] NVARCHAR(100),
    [priceid_no] INT,
    [discid_no] INT,
    [tax_yn] BIT,
    [taxid_no] INT,
    [termsid_no] INT,
    [paymentid_no] INT,
    [limit_am] DECIMAL(18,0) NOT NULL,
    [locid_no] INT,
    [shipid_no] INT,
    [leadtime_no] INT,
    [create_dt] NVARCHAR(30),
    [create_nm] NVARCHAR(30),
    [modi_dt] NVARCHAR(30),
    [modi_nm] NVARCHAR(30),
    [whlocid_no] INT,
    [glacctid_no] INT,
    [bankid_no] INT,
    CONSTRAINT [IDX_MasterSupplier] UNIQUE NONCLUSTERED ([id_no])
);

-- CreateTable
CREATE TABLE [dbo].[CompanyDetails] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id_no] NVARCHAR(50) NOT NULL,
    [ref_cd] NVARCHAR(30) NOT NULL,
    [ref_nm] NVARCHAR(100),
    [address_tx] NVARCHAR(max),
    [address2_tx] NVARCHAR(max),
    [city_nm] NVARCHAR(100),
    [province_nm] NVARCHAR(100),
    [postal_nb] NVARCHAR(5),
    [contact_nm] NVARCHAR(100),
    [position_nm] NVARCHAR(100),
    [tel1_nb] NVARCHAR(20),
    [tel2_nb] NVARCHAR(20),
    [mobile1_nb] NVARCHAR(20),
    [mobile2_nb] NVARCHAR(20),
    [email_ad] NVARCHAR(100),
    [website_tx] NVARCHAR(100),
    [taxliable_yn] BIT,
    [taxid_no] INT,
    [trade_nm] NVARCHAR(100),
    [operator_nm] NVARCHAR(100),
    [acc_nb] NVARCHAR(30),
    [tin_nb] NVARCHAR(30),
    [logo_im] NVARCHAR(max),
    [create_dt] NVARCHAR(30),
    [create_nm] NVARCHAR(30),
    [modi_dt] NVARCHAR(30),
    [modi_nm] NVARCHAR(30),
    [oasis_cd] NVARCHAR(50),
    CONSTRAINT [IDX_CompanyDetails] UNIQUE NONCLUSTERED ([id_no])
);

-- CreateTable
CREATE TABLE [dbo].[Principal] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id_no] NVARCHAR(50) NOT NULL,
    [ref_cd] NVARCHAR(100) NOT NULL,
    [ref_nm] NVARCHAR(100),
    [default_yn] BIT NOT NULL,
    [create_nm] NVARCHAR(30),
    [modi_dt] NVARCHAR(30),
    [modi_nm] NVARCHAR(30),
    CONSTRAINT [IDX_Principal] UNIQUE NONCLUSTERED ([id_no])
);

-- CreateTable
CREATE TABLE [dbo].[RefSupplierClass] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefSupplierClass_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefSupplierClass_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefSupplierClass_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefSupplierClass_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefSupplierClass_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- CreateTable
CREATE TABLE [dbo].[RefSupplierGroup] (
    [businessCode] NVARCHAR(30) NOT NULL,
    [id] NVARCHAR(1000) NOT NULL,
    [code] NVARCHAR(30) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [default] BIT NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [RefSupplierGroup_active_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [RefSupplierGroup_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [RefSupplierGroup_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [RefSupplierGroup_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [RefSupplierGroup_businessCode_code_key] UNIQUE NONCLUSTERED ([businessCode],[code])
);

-- AddForeignKey
ALTER TABLE [dbo].[MasterSupplier] ADD CONSTRAINT [FK_MasterSupplier_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyDetails] ADD CONSTRAINT [FK_CompanyDetails_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Principal] ADD CONSTRAINT [FK_Principal_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefSupplierClass] ADD CONSTRAINT [FK_RefSupplierClass_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[RefSupplierGroup] ADD CONSTRAINT [FK_RefSupplierGroup_Business] FOREIGN KEY ([businessCode]) REFERENCES [dbo].[Business]([bgBusinessCode]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
