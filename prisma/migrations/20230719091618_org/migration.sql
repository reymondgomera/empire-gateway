BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[MasterUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userName] NVARCHAR(100) NOT NULL,
    [password] NVARCHAR(100) NOT NULL,
    [email] NVARCHAR(100),
    [firstName] NVARCHAR(100) NOT NULL,
    [lastName] NVARCHAR(100) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [MasterUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL CONSTRAINT [MasterUser_updatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [deletedAt] DATETIME2,
    [refreshToken] NVARCHAR(100),
    CONSTRAINT [PK_MasterUser] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [MasterUser_id_key] UNIQUE NONCLUSTERED ([id]),
    CONSTRAINT [MasterUser_userName_key] UNIQUE NONCLUSTERED ([userName]),
    CONSTRAINT [MasterUser_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Organization] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(50) NOT NULL,
    [userId] NVARCHAR(50) NOT NULL,
    [createdAt] NVARCHAR(15) NOT NULL,
    [updatedAt] NVARCHAR(15) NOT NULL,
    CONSTRAINT [Organization_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
