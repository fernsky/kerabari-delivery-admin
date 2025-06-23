import { z } from "zod";

// Define the household base type enum to match the database enum
export const HouseholdBaseTypeEnum = z.enum([
  "CONCRETE_PILLAR",
  "CEMENT_JOINED",
  "MUD_JOINED",
  "WOOD_POLE",
  "OTHER",
]);
export type HouseholdBaseType = z.infer<typeof HouseholdBaseTypeEnum>;

// Schema for ward-wise household base data
export const wardWiseHouseholdBaseSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  baseType: HouseholdBaseTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise household base data
export const wardWiseHouseholdBaseFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  baseType: HouseholdBaseTypeEnum.optional(),
});

export const updateWardWiseHouseholdBaseSchema = wardWiseHouseholdBaseSchema;

export type WardWiseHouseholdBaseData = z.infer<
  typeof wardWiseHouseholdBaseSchema
>;
export type UpdateWardWiseHouseholdBaseData = WardWiseHouseholdBaseData;
export type WardWiseHouseholdBaseFilter = z.infer<
  typeof wardWiseHouseholdBaseFilterSchema
>;

// Export the base type options for use in UI components
export const householdBaseOptions = [
  {
    value: "CONCRETE_PILLAR",
    label: "ढलान पिल्लरसहितको",
  },
  {
    value: "CEMENT_JOINED",
    label: "सिमेन्टको जोडाइ भएको इँटा/ढुङ्गा",
  },
  {
    value: "MUD_JOINED",
    label: "माटोको जोडाइ भएको इँटा/ढुङ्गा",
  },
  { value: "WOOD_POLE", label: "काठको खम्बा गाडेको" },
  { value: "OTHER", label: "अन्य" },
];
