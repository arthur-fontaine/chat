CREATE TABLE `profiles` (
	`color` text NOT NULL,
	`displayName` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE messages ADD `color` text;