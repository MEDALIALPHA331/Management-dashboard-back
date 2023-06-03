/*
  Warnings:

  - You are about to drop the `_BootcampToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CertToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DiplomaToProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileCompetence` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_BootcampToProfile] DROP CONSTRAINT [_BootcampToProfile_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_BootcampToProfile] DROP CONSTRAINT [_BootcampToProfile_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_CertToProfile] DROP CONSTRAINT [_CertToProfile_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_CertToProfile] DROP CONSTRAINT [_CertToProfile_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_DiplomaToProfile] DROP CONSTRAINT [_DiplomaToProfile_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_DiplomaToProfile] DROP CONSTRAINT [_DiplomaToProfile_B_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileCompetence] DROP CONSTRAINT [ProfileCompetence_competenceId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileCompetence] DROP CONSTRAINT [ProfileCompetence_profileId_fkey];

-- DropTable
DROP TABLE [dbo].[_BootcampToProfile];

-- DropTable
DROP TABLE [dbo].[_CertToProfile];

-- DropTable
DROP TABLE [dbo].[_DiplomaToProfile];

-- DropTable
DROP TABLE [dbo].[ProfileCompetence];

-- CreateTable
CREATE TABLE [dbo].[_ProfileToDiploma] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_ProfileToDiploma_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ProfileToDiploma_B_index] ON [dbo].[_ProfileToDiploma]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToDiploma] ADD CONSTRAINT [_ProfileToDiploma_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Diploma]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToDiploma] ADD CONSTRAINT [_ProfileToDiploma_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
