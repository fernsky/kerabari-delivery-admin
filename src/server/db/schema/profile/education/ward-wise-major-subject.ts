import { pgTable } from "../../../schema/basic";
import { integer, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";

// Define major subject type enum
export const majorSubjectTypeEnum = pgEnum("major_subject_type", [
  "ENGLISH",
  "ECONOMICS",
  "ENGINEERING",
  "HISTORY",
  "HOME_ECONOMICS",
  "RURAL_DEVELOPMENT",
  "MEDICINE",
  "POPULATION_STUDY",
  "BIOLOGY",
  "STATISTICS",
  "NEPALI",
  "TOURISM",
  "GEOGRAPHY",
  "PHYSICS",
  "PSYCHOLOGY",
  "HUMANITIES",
  "CHEMISTRY",
  "POLITICAL_SCIENCE",
  "FORESTRY_AND_AGRICULTURE",
  "BOTANY",
  "COMMERCE",
  "SCIENCE",
  "MANAGEMENT",
  "EDUCATION",
  "EDUCATIONAL_SCIENCE",
  "SANSKRIT",
  "ARTS",
  "SOCIAL_SCIENCES",
  "INFORMATION_TECHNOLOGY",
  "HINDI",
  "OTHER",
]);

export const wardWiseMajorSubject = pgTable("ward_wise_major_subject", {
  id: varchar("id", { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer("ward_number").notNull(),

  // Subject type
  subjectType: majorSubjectTypeEnum("subject_type").notNull(),

  // Number of people studying this subject in the ward
  population: integer("population").notNull(),

  // Metadata
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").defaultNow(),
});

export type WardWiseMajorSubject = typeof wardWiseMajorSubject.$inferSelect;
export type NewWardWiseMajorSubject = typeof wardWiseMajorSubject.$inferInsert;
