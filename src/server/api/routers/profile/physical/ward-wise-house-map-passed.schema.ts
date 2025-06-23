import { z } from "zod";

// Define the map passed status type enum to match the database enum
export const MapPassedStatusTypeEnum = z.enum([
  "PASSED",
  "ARCHIVED",
  "NEITHER_PASSED_NOR_ARCHIVED",
]);
export type MapPassedStatusType = z.infer<typeof MapPassedStatusTypeEnum>;

// Schema for ward-wise house map passed data
export const wardWiseHouseMapPassedSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  mapPassedStatus: MapPassedStatusTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise house map passed data
export const wardWiseHouseMapPassedFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  mapPassedStatus: MapPassedStatusTypeEnum.optional(),
});

export const updateWardWiseHouseMapPassedSchema = wardWiseHouseMapPassedSchema;

export type WardWiseHouseMapPassedData = z.infer<
  typeof wardWiseHouseMapPassedSchema
>;
export type UpdateWardWiseHouseMapPassedData = WardWiseHouseMapPassedData;
export type WardWiseHouseMapPassedFilter = z.infer<
  typeof wardWiseHouseMapPassedFilterSchema
>;

// Export the map passed status options for use in UI components
export const mapPassedStatusOptions = [
  { value: "PASSED", label: "Map passed (नक्सा पास भएको)" },
  { value: "ARCHIVED", label: "Map archived (नक्सा संग्रहित भएको)" },
  {
    value: "NEITHER_PASSED_NOR_ARCHIVED",
    label: "Not applicable (लागु नहुने)",
  },
];
