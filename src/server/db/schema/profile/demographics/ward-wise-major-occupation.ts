// import {
//   pgTable,
//   varchar,
//   uuid,
//   integer,
//   text,
//   timestamp,
// } from "drizzle-orm/pg-core";

// export const wardWiseMajorOccupation = pgTable("kera", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   wardNumber: integer("ward_number").notNull(),
//   occupation: text("occupation").notNull(),
//   population: integer("population").notNull().default(0),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export type WardWiseMajorOccupation =
//   typeof wardWiseMajorOccupation.$inferSelect;
// export type NewWardWiseMajorOccupation =
//   typeof wardWiseMajorOccupation.$inferInsert;
