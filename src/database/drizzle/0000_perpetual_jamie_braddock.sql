CREATE TABLE `messages` (
	`date` integer NOT NULL,
	`fromId` text NOT NULL,
	`id` integer PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`text` text
);
