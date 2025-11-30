CREATE TABLE `cursosDisciplinas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cursoId` int NOT NULL,
	`disciplinaId` int NOT NULL,
	`anoCurso` int NOT NULL DEFAULT 1,
	`bimestrePedagogico` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cursosDisciplinas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `disciplinas` DROP COLUMN `anoCurso`;--> statement-breakpoint
ALTER TABLE `disciplinas` DROP COLUMN `bimestrePedagogico`;--> statement-breakpoint
ALTER TABLE `disciplinas` DROP COLUMN `cursoId`;