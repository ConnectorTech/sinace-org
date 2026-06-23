ALTER TABLE `professionalProfiles` ADD `privateAccessEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `passwordAccessStatus` enum('not_started','ready','recovery','managed') DEFAULT 'not_started' NOT NULL;--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `passwordRecoveryChannel` varchar(160);--> statement-breakpoint
ALTER TABLE `professionalProfiles` ADD `passwordLastUpdatedAt` timestamp;