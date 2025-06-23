import { pgTable } from '../../../schema/basic';
import { integer, timestamp, varchar, decimal } from 'drizzle-orm/pg-core';

export const wardWiseIrrigatedArea = pgTable('ward_wise_irrigated_area', {
  id: varchar('id', { length: 36 }).primaryKey(),

  // Ward reference
  wardNumber: integer('ward_number').notNull(),

  // Area measurements
  irrigatedAreaHectares: decimal('irrigated_area_hectares', { precision: 10, scale: 2 }).notNull(),
  unirrigatedAreaHectares: decimal('unirrigated_area_hectares', { precision: 10, scale: 2 }).notNull(),

  // Metadata
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  createdAt: timestamp('created_at').defaultNow(),
});

export type WardWiseIrrigatedArea = typeof wardWiseIrrigatedArea.$inferSelect;
export type NewWardWiseIrrigatedArea = typeof wardWiseIrrigatedArea.$inferInsert;
