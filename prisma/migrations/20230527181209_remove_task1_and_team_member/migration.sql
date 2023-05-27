/*
  Warnings:

  - You are about to drop the `_LanguageToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProfileToProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReferenceToTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_LanguageToProfile] DROP CONSTRAINT [_LanguageToProfile_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_LanguageToProfile] DROP CONSTRAINT [_LanguageToProfile_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_ProfileToProject] DROP CONSTRAINT [_ProfileToProject_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_ProfileToProject] DROP CONSTRAINT [_ProfileToProject_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_ReferenceToTask] DROP CONSTRAINT [_ReferenceToTask_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_ReferenceToTask] DROP CONSTRAINT [_ReferenceToTask_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TeamMember] DROP CONSTRAINT [TeamMember_profileId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[TeamMember] DROP CONSTRAINT [TeamMember_referenceId_fkey];

-- DropTable
DROP TABLE [dbo].[_LanguageToProfile];

-- DropTable
DROP TABLE [dbo].[_ProfileToProject];

-- DropTable
DROP TABLE [dbo].[_ReferenceToTask];

-- DropTable
DROP TABLE [dbo].[Language];

-- DropTable
DROP TABLE [dbo].[Task];

-- DropTable
DROP TABLE [dbo].[TeamMember];

-- CreateTable
CREATE TABLE [dbo].[_ProfileToReference] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_ProfileToReference_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ProfileToReference_B_index] ON [dbo].[_ProfileToReference]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToReference] ADD CONSTRAINT [_ProfileToReference_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToReference] ADD CONSTRAINT [_ProfileToReference_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Reference]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
