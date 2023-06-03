BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[ProfileCompetence] DROP CONSTRAINT [ProfileCompetence_competenceId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[ProfileCompetence] DROP CONSTRAINT [ProfileCompetence_profileId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Profile] ADD [about] NVARCHAR(1000);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_competenceId_fkey] FOREIGN KEY ([competenceId]) REFERENCES [dbo].[Competence]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
