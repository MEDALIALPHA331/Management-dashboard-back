BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Bootcamp] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [source] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Bootcamp_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Bootcamp_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_BootcampToProfile] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_BootcampToProfile_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_BootcampToProfile_B_index] ON [dbo].[_BootcampToProfile]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_BootcampToProfile] ADD CONSTRAINT [_BootcampToProfile_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Bootcamp]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_BootcampToProfile] ADD CONSTRAINT [_BootcampToProfile_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
