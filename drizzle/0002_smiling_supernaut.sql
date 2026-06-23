CREATE TABLE `governmentContracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`partnerId` int,
	`institutionId` int,
	`specialtyId` int,
	`contractType` enum('state_program','municipal_program','federal_program','oss_agreement','service_contract') NOT NULL DEFAULT 'service_contract',
	`scope` text,
	`estimatedProcedures` int NOT NULL DEFAULT 0,
	`status` enum('pipeline','active','completed','paused') NOT NULL DEFAULT 'pipeline',
	`startDate` timestamp,
	`endDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `governmentContracts_id` PRIMARY KEY(`id`),
	CONSTRAINT `government_contracts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `institutionSpecialties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`institutionId` int NOT NULL,
	`specialtyId` int NOT NULL,
	`serviceModel` enum('elective','high_complexity','ambulatory','training','diagnostic') NOT NULL DEFAULT 'elective',
	`status` enum('planned','active','paused') NOT NULL DEFAULT 'planned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `institutionSpecialties_id` PRIMARY KEY(`id`),
	CONSTRAINT `institution_specialty_idx` UNIQUE(`institutionId`,`specialtyId`)
);
--> statement-breakpoint
CREATE TABLE `patientQueueEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientCode` varchar(80) NOT NULL,
	`specialtyId` int NOT NULL,
	`institutionId` int,
	`contractId` int,
	`priority` enum('low','moderate','high','urgent') NOT NULL DEFAULT 'moderate',
	`pathway` enum('ambulatory','hospital','high_complexity') NOT NULL DEFAULT 'hospital',
	`status` enum('waiting','scheduled','performed','cancelled') NOT NULL DEFAULT 'waiting',
	`waitingDays` int NOT NULL DEFAULT 0,
	`originCity` varchar(120),
	`originState` varchar(120),
	`scheduledAt` timestamp,
	`performedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientQueueEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `patient_queue_entries_code_idx` UNIQUE(`patientCode`)
);
--> statement-breakpoint
CREATE TABLE `professionalProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`institutionId` int,
	`specialtyId` int,
	`fullName` varchar(180) NOT NULL,
	`roleTitle` varchar(120) NOT NULL,
	`professionalType` enum('surgeon','anesthesiologist','nurse','coordinator','faculty','resident','student','manager') NOT NULL DEFAULT 'surgeon',
	`credentialNumber` varchar(80),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professionalProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `surgicalTeamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surgicalTeamId` int NOT NULL,
	`professionalProfileId` int NOT NULL,
	`membershipRole` varchar(120) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surgicalTeamMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `team_professional_idx` UNIQUE(`surgicalTeamId`,`professionalProfileId`)
);
--> statement-breakpoint
CREATE TABLE `surgicalTeams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(180) NOT NULL,
	`institutionId` int,
	`specialtyId` int,
	`teamType` enum('fixed','mobile','regional','teaching') NOT NULL DEFAULT 'fixed',
	`operationalProfile` varchar(180),
	`membersCount` int NOT NULL DEFAULT 0,
	`status` enum('planning','active','inactive') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surgicalTeams_id` PRIMARY KEY(`id`),
	CONSTRAINT `surgical_teams_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `institutions` ADD `capacityProfile` varchar(160);--> statement-breakpoint
ALTER TABLE `institutions` ADD `teachingProfile` varchar(160);--> statement-breakpoint
ALTER TABLE `governmentContracts` ADD CONSTRAINT `governmentContracts_partnerId_partners_id_fk` FOREIGN KEY (`partnerId`) REFERENCES `partners`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `governmentContracts` ADD CONSTRAINT `governmentContracts_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `governmentContracts` ADD CONSTRAINT `governmentContracts_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `institutionSpecialties` ADD CONSTRAINT `institutionSpecialties_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `institutionSpecialties` ADD CONSTRAINT `institutionSpecialties_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientQueueEntries` ADD CONSTRAINT `patientQueueEntries_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientQueueEntries` ADD CONSTRAINT `patientQueueEntries_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `patientQueueEntries` ADD CONSTRAINT `patientQueueEntries_contractId_governmentContracts_id_fk` FOREIGN KEY (`contractId`) REFERENCES `governmentContracts`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD CONSTRAINT `professionalProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD CONSTRAINT `professionalProfiles_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD CONSTRAINT `professionalProfiles_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surgicalTeamMembers` ADD CONSTRAINT `surgicalTeamMembers_surgicalTeamId_surgicalTeams_id_fk` FOREIGN KEY (`surgicalTeamId`) REFERENCES `surgicalTeams`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surgicalTeamMembers` ADD CONSTRAINT `surgicalTeamMembers_professionalProfileId_professionalProfiles_id_fk` FOREIGN KEY (`professionalProfileId`) REFERENCES `professionalProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surgicalTeams` ADD CONSTRAINT `surgicalTeams_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surgicalTeams` ADD CONSTRAINT `surgicalTeams_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;