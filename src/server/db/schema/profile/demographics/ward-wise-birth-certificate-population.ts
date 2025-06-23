import { pgTable } from "../../basic";
import { integer, timestamp, varchar } from "drizzle-orm/pg-core";

export const wardWiseBirthCertificatePopulation = pgTable(
  "ward_wise_birth_certificate_population",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    // Reference to the ward entity
    wardNumber: integer("ward_number").notNull(),
    
    // Birth certificate counts - separate columns for each status
    withBirthCertificate: integer("with_birth_certificate").notNull(),
    withoutBirthCertificate: integer("without_birth_certificate").notNull(),
    
    // Computed total population under 5 (generated column)
    totalPopulationUnder5: integer("total_population_under_5").notNull(),

    // Metadata
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export type WardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferSelect;
export type NewWardWiseBirthCertificatePopulation = 
  typeof wardWiseBirthCertificatePopulation.$inferInsert;
