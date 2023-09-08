BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [discRate] TINYINT NULL;
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [lessTax] BIT NULL;
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [senior] BIT NULL;
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [promo] BIT NULL;
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [claim] BIT NULL;
ALTER TABLE [dbo].[RefDiscount] ALTER COLUMN [hide] BIT NULL;

-- AlterTable
ALTER TABLE [dbo].[RefTerms] ALTER COLUMN [days] TINYINT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
