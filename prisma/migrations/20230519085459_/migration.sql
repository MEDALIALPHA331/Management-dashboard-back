BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Profile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstname] NVARCHAR(1000) NOT NULL,
    [lastname] NVARCHAR(1000) NOT NULL,
    [job_title] NVARCHAR(1000) NOT NULL CONSTRAINT [Profile_job_title_df] DEFAULT 'N/A',
    [years_of_experience] INT,
    [email] NVARCHAR(1000),
    [phone_number] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Profile_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Profile_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Profile_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Competence] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Competence_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Competence_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Language] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Language_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Language_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Tool] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Tool_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Tool_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Cert] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [completion_year] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Cert_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Cert_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Diploma] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [source] NVARCHAR(1000),
    [graduation_year] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Diploma_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Diploma_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Project] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Project_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Project_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_ProfileToProject] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_ProfileToProject_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CompetenceToTool] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CompetenceToTool_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CompetenceToProfile] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CompetenceToProfile_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_LanguageToProfile] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_LanguageToProfile_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CertToProfile] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_CertToProfile_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_DiplomaToProfile] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_DiplomaToProfile_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_ProjectToTool] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_ProjectToTool_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ProfileToProject_B_index] ON [dbo].[_ProfileToProject]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CompetenceToTool_B_index] ON [dbo].[_CompetenceToTool]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CompetenceToProfile_B_index] ON [dbo].[_CompetenceToProfile]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_LanguageToProfile_B_index] ON [dbo].[_LanguageToProfile]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CertToProfile_B_index] ON [dbo].[_CertToProfile]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_DiplomaToProfile_B_index] ON [dbo].[_DiplomaToProfile]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_ProjectToTool_B_index] ON [dbo].[_ProjectToTool]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToProject] ADD CONSTRAINT [_ProfileToProject_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ProfileToProject] ADD CONSTRAINT [_ProfileToProject_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Project]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CompetenceToTool] ADD CONSTRAINT [_CompetenceToTool_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Competence]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CompetenceToTool] ADD CONSTRAINT [_CompetenceToTool_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tool]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CompetenceToProfile] ADD CONSTRAINT [_CompetenceToProfile_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Competence]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CompetenceToProfile] ADD CONSTRAINT [_CompetenceToProfile_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LanguageToProfile] ADD CONSTRAINT [_LanguageToProfile_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Language]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_LanguageToProfile] ADD CONSTRAINT [_LanguageToProfile_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CertToProfile] ADD CONSTRAINT [_CertToProfile_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Cert]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CertToProfile] ADD CONSTRAINT [_CertToProfile_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_DiplomaToProfile] ADD CONSTRAINT [_DiplomaToProfile_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Diploma]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_DiplomaToProfile] ADD CONSTRAINT [_DiplomaToProfile_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Profile]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ProjectToTool] ADD CONSTRAINT [_ProjectToTool_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Project]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_ProjectToTool] ADD CONSTRAINT [_ProjectToTool_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tool]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
