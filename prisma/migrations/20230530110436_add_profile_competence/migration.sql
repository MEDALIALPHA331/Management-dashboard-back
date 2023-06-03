BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ProfileCompetence] (
    [id] INT NOT NULL IDENTITY(1,1),
    [level] INT NOT NULL,
    [competenceId] INT NOT NULL,
    [profileId] INT NOT NULL,
    CONSTRAINT [ProfileCompetence_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_competenceId_fkey] FOREIGN KEY ([competenceId]) REFERENCES [dbo].[Competence]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
