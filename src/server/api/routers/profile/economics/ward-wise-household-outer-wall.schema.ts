import { z } from "zod";

// Define the outer wall type enum to match the database enum
export const OuterWallTypeEnum = z.enum([
  "CEMENT_JOINED",
  "UNBAKED_BRICK",
  "MUD_JOINED",
  "TIN",
  "BAMBOO",
  "WOOD",
  "PREFAB",
  "OTHER",
]);
export type OuterWallType = z.infer<typeof OuterWallTypeEnum>;

// Schema for ward-wise household outer wall data
export const wardWiseHouseholdOuterWallSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  wallType: OuterWallTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise household outer wall data
export const wardWiseHouseholdOuterWallFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  wallType: OuterWallTypeEnum.optional(),
});

export const updateWardWiseHouseholdOuterWallSchema =
  wardWiseHouseholdOuterWallSchema;

export type WardWiseHouseholdOuterWallData = z.infer<
  typeof wardWiseHouseholdOuterWallSchema
>;
export type UpdateWardWiseHouseholdOuterWallData =
  WardWiseHouseholdOuterWallData;
export type WardWiseHouseholdOuterWallFilter = z.infer<
  typeof wardWiseHouseholdOuterWallFilterSchema
>;

// Export the outer wall type options for use in UI components
export const outerWallOptions = [
  {
    value: "CEMENT_JOINED",
    label: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  },
  { value: "UNBAKED_BRICK", label: "काँचो इँटा" },
  {
    value: "MUD_JOINED",
    label: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  },
  { value: "TIN", label: "जस्ता/टिन/च्यादर" },
  { value: "BAMBOO", label: "बाँसजन्य सामग्री" },
  { value: "WOOD", label: "काठ/फल्याक" },
  { value: "PREFAB", label: "प्रि फ्याब" },
  { value: "OTHER", label: "अन्य" },
];
