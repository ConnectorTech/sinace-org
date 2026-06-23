CREATE TABLE `caseStudies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text,
	`clinicalFocus` varchar(180),
	`specialtyId` int,
	`institutionId` int,
	`authorProfileId` int,
	`publicationId` int,
	`complexity` enum('standard','high','advanced') NOT NULL DEFAULT 'standard',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`sourceUrl` varchar(2048),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `caseStudies_id` PRIMARY KEY(`id`),
	CONSTRAINT `case_studies_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `flowcharts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`summary` text,
	`specialtyId` int,
	`institutionId` int,
	`diagramUrl` varchar(2048),
	`fileKey` varchar(255),
	`visibility` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `flowcharts_id` PRIMARY KEY(`id`),
	CONSTRAINT `flowcharts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `libraryAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`assetType` enum('document','video','image','presentation','dataset','protocol','checklist','other') NOT NULL DEFAULT 'document',
	`specialtyId` int,
	`publicationId` int,
	`uploadedByUserId` int,
	`sourceUrl` varchar(2048),
	`fileKey` varchar(255),
	`fileUrl` varchar(2048),
	`visibility` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`featured` enum('no','yes') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `libraryAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `library_assets_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `mediaShowcaseItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`mediaType` enum('image','video','document','other') NOT NULL DEFAULT 'image',
	`moduleKey` varchar(120),
	`sourceUrl` varchar(2048),
	`fileKey` varchar(255),
	`fileUrl` varchar(2048),
	`visibility` enum('public','restricted','private') NOT NULL DEFAULT 'public',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mediaShowcaseItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_showcase_items_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `profileConnections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requesterProfileId` int NOT NULL,
	`targetProfileId` int NOT NULL,
	`connectionType` enum('interest','referral','mentorship','research','institutional') NOT NULL DEFAULT 'interest',
	`status` enum('pending','accepted','declined','blocked') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profileConnections_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_connections_pair_idx` UNIQUE(`requesterProfileId`,`targetProfileId`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(140) NOT NULL,
	`title` varchar(180) NOT NULL,
	`excerpt` text,
	`body` text,
	`publicationType` enum('ceo_update','institutional','report','article','case_highlight','news') NOT NULL DEFAULT 'institutional',
	`featured` enum('no','yes') NOT NULL DEFAULT 'no',
	`visibility` enum('public','restricted','private') NOT NULL DEFAULT 'restricted',
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`specialtyId` int,
	`authorProfileId` int,
	`coverImageUrl` varchar(2048),
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`),
	CONSTRAINT `publications_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `credentialState` varchar(16);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `credentialAuthority` varchar(120);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `rqeNumber` varchar(80);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `publicEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `phone` varchar(40);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `city` varchar(120);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `state` varchar(120);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `regionLabel` varchar(120);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `profileImageUrl` varchar(2048);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `miniBio` text;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `curriculumSummary` text;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `highlights` text;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `practiceAreas` text;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `collaborationInterest` enum('low','medium','high') DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `verificationStatus` enum('pending','verified','rejected') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `visibility` enum('public','restricted','private') DEFAULT 'public' NOT NULL;--> statement-breakpoint
ALTER TABLE `caseStudies` ADD CONSTRAINT `caseStudies_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseStudies` ADD CONSTRAINT `caseStudies_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseStudies` ADD CONSTRAINT `caseStudies_authorProfileId_professionalProfiles_id_fk` FOREIGN KEY (`authorProfileId`) REFERENCES `professionalProfiles`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `caseStudies` ADD CONSTRAINT `caseStudies_publicationId_publications_id_fk` FOREIGN KEY (`publicationId`) REFERENCES `publications`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flowcharts` ADD CONSTRAINT `flowcharts_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `flowcharts` ADD CONSTRAINT `flowcharts_institutionId_institutions_id_fk` FOREIGN KEY (`institutionId`) REFERENCES `institutions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `libraryAssets` ADD CONSTRAINT `libraryAssets_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `libraryAssets` ADD CONSTRAINT `libraryAssets_publicationId_publications_id_fk` FOREIGN KEY (`publicationId`) REFERENCES `publications`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `libraryAssets` ADD CONSTRAINT `libraryAssets_uploadedByUserId_users_id_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profileConnections` ADD CONSTRAINT `profileConnections_requesterProfileId_professionalProfiles_id_fk` FOREIGN KEY (`requesterProfileId`) REFERENCES `professionalProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `profileConnections` ADD CONSTRAINT `profileConnections_targetProfileId_professionalProfiles_id_fk` FOREIGN KEY (`targetProfileId`) REFERENCES `professionalProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publications` ADD CONSTRAINT `publications_specialtyId_specialties_id_fk` FOREIGN KEY (`specialtyId`) REFERENCES `specialties`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `publications` ADD CONSTRAINT `publications_authorProfileId_professionalProfiles_id_fk` FOREIGN KEY (`authorProfileId`) REFERENCES `professionalProfiles`(`id`) ON DELETE set null ON UPDATE no action;