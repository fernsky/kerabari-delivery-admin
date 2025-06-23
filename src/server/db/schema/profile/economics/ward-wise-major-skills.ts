import {
  pgTable,
  varchar,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const skillTypeEnum = pgEnum("skill_type", [
  "TEACHING_RELATED",
  "PHOTOGRAPHY_RELATED",
  "HANDICRAFT_RELATED",
  "MUSIC_DRAMA_RELATED",
  "STONEWORK_WOODWORK",
  "CARPENTERY_RELATED",
  "PLUMBING",
  "HUMAN_HEALTH_RELATED",
  "ANIMAL_HEALTH_RELATED",
  "ELECTRICITY_INSTALLMENT_RELATED",
  "HOTEL_RESTAURANT_RELATED",
  "AGRICULTURE_RELATED",
  "PRINTING_RELATED",
  "DRIVING_RELATED",
  "MECHANICS_RELATED",
  "FURNITURE_RELATED",
  "SHOEMAKING_RELATED",
  "SEWING_RELATED",
  "JWELLERY_MAKING_RELATED",
  "BEUATICIAN_RELATED",
  "SELF_PROTECTION_RELATED",
  "LAND_SURVEY_RELATED",
  "COMPUTER_SCIENCE_RELATED",
  "ENGINEERING_DESIGN_RELATED",
  "RADIO_TELEVISION_ELECTRICAL_REPAIR",
  "LITERARY_CREATION_RELATED",
  "OTHER",
  "NONE",
]);

export const wardWiseMajorSkills = pgTable("acme_ward_wise_major_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  wardNumber: integer("ward_number").notNull(),
  skill: skillTypeEnum("skill").notNull(),
  population: integer("population").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type WardWiseMajorSkills = typeof wardWiseMajorSkills.$inferSelect;
export type NewWardWiseMajorSkills = typeof wardWiseMajorSkills.$inferInsert;
