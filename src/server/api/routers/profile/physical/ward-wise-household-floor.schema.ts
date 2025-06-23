import { z } from "zod";

// Define the floor type enum to match the database enum
export const FloorTypeEnum = z.enum([
  "CONCRETE",
  "MUD",
  "WOOD",
  "BRICK",
  "TILE",
  "OTHER",
]);
export type FloorType = z.infer<typeof FloorTypeEnum>;

// Schema for ward-wise household floor data
export const wardWiseHouseholdFloorSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  floorType: FloorTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise household floor data
export const wardWiseHouseholdFloorFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  floorType: FloorTypeEnum.optional(),
});

export const updateWardWiseHouseholdFloorSchema = wardWiseHouseholdFloorSchema;

export type WardWiseHouseholdFloorData = z.infer<
  typeof wardWiseHouseholdFloorSchema
>;
export type UpdateWardWiseHouseholdFloorData = WardWiseHouseholdFloorData;
export type WardWiseHouseholdFloorFilter = z.infer<
  typeof wardWiseHouseholdFloorFilterSchema
>;

// Export the floor type options for use in UI components
export const floorTypeOptions = [
  { value: "CONCRETE", label: "Cement concrete (सिमेन्ट ढलान)" },
  { value: "MUD", label: "Mud (माटो)" },
  { value: "WOOD", label: "Wood plank/Bamboo (काठको फल्याक/बाँस)" },
  { value: "BRICK", label: "Brick/Stone (इँटा/ढुङ्गा)" },
  { value: "TILE", label: "Ceramic tile (सेरामिक टायल)" },
  { value: "OTHER", label: "Other materials (अन्य)" },
];
