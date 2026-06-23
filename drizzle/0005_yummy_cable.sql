ALTER TABLE `documents` ADD `fileName` varchar(255);--> statement-breakpoint
ALTER TABLE `documents` ADD `mimeType` varchar(160);--> statement-breakpoint
ALTER TABLE `documents` ADD `fileSizeBytes` int;--> statement-breakpoint
ALTER TABLE `documents` ADD `folderLabel` varchar(160) DEFAULT 'Geral' NOT NULL;--> statement-breakpoint
ALTER TABLE `documents` ADD `contributorName` varchar(180);--> statement-breakpoint
ALTER TABLE `documents` ADD `contributorInstitution` varchar(180);--> statement-breakpoint
ALTER TABLE `documents` ADD `contributorCredential` varchar(120);--> statement-breakpoint
ALTER TABLE `documents` ADD `contributorType` enum('internal','external') DEFAULT 'external' NOT NULL;--> statement-breakpoint
ALTER TABLE `documents` ADD `uploadSource` enum('workspace','submission') DEFAULT 'submission' NOT NULL;