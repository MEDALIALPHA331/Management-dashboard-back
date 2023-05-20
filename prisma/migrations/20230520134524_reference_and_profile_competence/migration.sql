/*
  Warnings:

  - You are about to drop the `_CompetenceToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[_CompetenceToProfile] DROP CONSTRAINT [_CompetenceToProfile_A_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[_CompetenceToProfile] DROP CONSTRAINT [_CompetenceToProfile_B_fkey];

-- AlterTable
ALTER TABLE [dbo].[Bootcamp] ADD [date_obtained] DATETIME2;

-- DropTable
DROP TABLE [dbo].[_CompetenceToProfile];

-- CreateTable
CREATE TABLE [dbo].[ProfileCompetence] (
    [level] INT NOT NULL,
    [competenceId] INT NOT NULL,
    [profileId] INT NOT NULL,
    CONSTRAINT [ProfileCompetence_pkey] PRIMARY KEY CLUSTERED ([competenceId],[profileId])
);

-- CreateTable
CREATE TABLE [dbo].[Task] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nom_tache] NVARCHAR(1000) NOT NULL,
    [desc_tache] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Task_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Task_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Reference] (
    [id] INT NOT NULL IDENTITY(1,1),
    [projectId] INT NOT NULL,
    [client] NVARCHAR(1000) NOT NULL,
    [start_date] DATETIME2 NOT NULL,
    [end_date] DATETIME2 NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Reference_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Reference_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TeamMember] (
    [profileId] INT NOT NULL,
    [referenceId] INT NOT NULL,
    [post] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [TeamMember_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [TeamMember_pkey] PRIMARY KEY CLUSTERED ([referenceId],[profileId])
);

-- CreateTable
CREATE TABLE [dbo].[_ReferenceToTask] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_ReferenceToTask_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ReferenceToTask_B_index] ON [dbo].[_ReferenceToTask]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_competenceId_fkey] FOREIGN KEY ([competenceId]) REFERENCES [dbo].[Competence]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProfileCompetence] ADD CONSTRAINT [ProfileCompetence_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Reference] ADD CONSTRAINT [Reference_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TeamMember] ADD CONSTRAINT [TeamMember_profileId_fkey] FOREIGN KEY ([profileId]) REFERENCES [dbo].[Profile]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TeamMember] ADD CONSTRAINT [TeamMember_referenceId_fkey] FOREIGN KEY ([referenceId]) REFERENCES [dbo].[Reference]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ReferenceToTask] ADD CONSTRAINT [_ReferenceToTask_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Reference]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ReferenceToTask] ADD CONSTRAINT [_ReferenceToTask_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Task]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
