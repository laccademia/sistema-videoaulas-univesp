ALTER TABLE `users` MODIFY COLUMN `role` enum('viewer','admin') NOT NULL DEFAULT 'viewer';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `status`;