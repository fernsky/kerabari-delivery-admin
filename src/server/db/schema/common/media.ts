import { pgTable } from "../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define media type enum
export const mediaTypeEnum = pgEnum("media_type", [
  "IMAGE",
  "VIDEO",
  "DOCUMENT",
  "OTHER",
]);

// Media table for attachments
export const media = pgTable("media", {
  id: varchar("id", { length: 36 }).primaryKey(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: varchar("file_path", { length: 1024 }).notNull(),
  fileUrl: varchar("file_url", { length: 1024 }), // Direct URL for uploaded files
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 255 }),
  type: mediaTypeEnum("type").notNull(),
  title: text("title"),
  description: text("description"),

  // Metadata
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
