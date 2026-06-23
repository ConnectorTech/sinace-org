CREATE TABLE `clinicalCases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`synopsis` text,
	`learningObjectives` text,
	`discussion` text,
	`specialtyId` int,
	`difficulty` enum('intro','intermediate','advanced') NOT NULL DEFAULT 'intermediate',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByUserId` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clinicalCases_id` PRIMARY KEY(`id`),
	CONSTRAINT `clinical_cases_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`documentType` enum('protocol','guideline','manual','article','checklist','video','other') NOT NULL DEFAULT 'protocol',
	`specialtyId` int,
	`trackId` int,
	`sourceUrl` varchar(2048),
	`fileKey` varchar(255),
	`fileUrl` varchar(2048),
	`visibility` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByUserId` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `documents_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `encyclopediaEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text,
	`body` text,
	`specialtyId` int,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByUserId` int,
	`reviewedByUserId` int,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `encyclopediaEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `encyclopedia_entries_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `institutions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text,
	`institutionType` enum('hospital','santa_casa','clinic','surgical_center','teaching_center','other') NOT NULL DEFAULT 'hospital',
	`city` varchar(120),
	`state` varchar(120),
	`partnerId` int,
	`status` enum('planning','active','inactive') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `institutions_id` PRIMARY KEY(`id`),
	CONSTRAINT `institutions_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `learningModules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackId` int NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text,
	`position` int NOT NULL DEFAULT 0,
	`estimatedMinutes` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `learningModules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_track_slug_idx` UNIQUE(`trackId`,`slug`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(180) NOT NULL,
	`description` text,
	`partnerType` enum('government','oss','hospital_network','supplier','academic','other') NOT NULL DEFAULT 'other',
	`websiteUrl` varchar(2048),
	`city` varchar(120),
	`state` varchar(120),
	`status` enum('prospect','active','inactive') NOT NULL DEFAULT 'prospect',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`),
	CONSTRAINT `partners_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `specialties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`name` varchar(160) NOT NULL,
	`shortLabel` varchar(80),
	`description` text,
	`category` enum('cirurgica','clinica','apoio') NOT NULL DEFAULT 'cirurgica',
	`status` enum('draft','active','archived') NOT NULL DEFAULT 'draft',
	`displayOrder` int NOT NULL DEFAULT 0,
	`coordinationModel` varchar(160),
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `specialties_id` PRIMARY KEY(`id`),
	CONSTRAINT `specialties_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `trackEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`progressPercent` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`lastAccessedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trackEnrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `track_enrollments_user_track_idx` UNIQUE(`userId`,`trackId`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text,
	`specialtyId` int,
	`difficulty` enum('intro','intermediate','advanced') NOT NULL DEFAULT 'intro',
	`estimatedHours` int NOT NULL DEFAULT 0,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`),
	CONSTRAINT `tracks_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `clinicalCases` ADD CONSTRAINT `clinicalCases_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clinicalCases` ADD CONSTRAINT `clinicalCases_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `encyclopediaEntries` ADD CONSTRAINT `encyclopediaEntries_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `encyclopediaEntries` ADD CONSTRAINT `encyclopediaEntries_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `encyclopediaEntries` ADD CONSTRAINT `encyclopediaEntries_reviewedByUserId_users_id_fk` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `institutions` ADD CONSTRAINT `institutions_partnerId_partners_id_fk` FOREIGN KEY (`partnerId`) REFERENCES `partners`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `learningModules` ADD CONSTRAINT `learningModules_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `specialties` ADD CONSTRAINT `specialties_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trackEnrollments` ADD CONSTRAINT `trackEnrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trackEnrollments` ADD CONSTRAINT `trackEnrollments_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tracks` ADD CONSTRAINT `tracks_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;