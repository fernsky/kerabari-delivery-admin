import { z } from "zod";

// Define the roof type enum to match the database enum
export const RoofTypeEnum = z.enum([
  "CEMENT",
  "TIN",
  "TILE",
  "STRAW",
  "WOOD",
  "STONE",
  "OTHER",
]);
export type RoofType = z.infer<typeof RoofTypeEnum>;

// Schema for ward-wise household roof data
export const wardWiseHouseholdRoofSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  roofType: RoofTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise household roof data
export const wardWiseHouseholdRoofFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  roofType: RoofTypeEnum.optional(),
});

export const updateWardWiseHouseholdRoofSchema = wardWiseHouseholdRoofSchema;

export type WardWiseHouseholdRoofData = z.infer<
  typeof wardWiseHouseholdRoofSchema
>;
export type UpdateWardWiseHouseholdRoofData = WardWiseHouseholdRoofData;
export type WardWiseHouseholdRoofFilter = z.infer<
  typeof wardWiseHouseholdRoofFilterSchema
>;

// Export the roof type options for use in UI components
export const roofTypeOptions = [
  { value: "CEMENT", label: "Cement concrete (सिमेन्ट ढलान)" },
  { value: "TIN", label: "Tin/Metal sheet (जस्ता/टिन)" },
  { value: "TILE", label: "Tile/Clay tile (टायल/खपडा/झिँगटी)" },
  { value: "STRAW", label: "Thatch/Straw (खर/पराल/छ्वाली)" },
  { value: "WOOD", label: "Wood/Plank (काठ/फल्याक)" },
  { value: "STONE", label: "Stone/Slate (ढुङ्गा/स्लेट)" },
  { value: "OTHER", label: "Other materials (अन्य)" },
];
