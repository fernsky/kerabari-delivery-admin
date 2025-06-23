import { z } from "zod";

// Define the water purification type enum to match the database enum
export const WaterPurificationTypeEnum = z.enum([
  "BOILING",
  "FILTERING",
  "CHEMICAL_PIYUSH",
  "NO_ANY_FILTERING",
  "OTHER",
]);
export type WaterPurificationType = z.infer<typeof WaterPurificationTypeEnum>;

// Schema for ward-wise water purification data
export const wardWiseWaterPurificationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  waterPurification: WaterPurificationTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise water purification data
export const wardWiseWaterPurificationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  waterPurification: WaterPurificationTypeEnum.optional(),
});

export const updateWardWiseWaterPurificationSchema =
  wardWiseWaterPurificationSchema;

export type WardWiseWaterPurificationData = z.infer<
  typeof wardWiseWaterPurificationSchema
>;
export type UpdateWardWiseWaterPurificationData = WardWiseWaterPurificationData;
export type WardWiseWaterPurificationFilter = z.infer<
  typeof wardWiseWaterPurificationFilterSchema
>;
// Export the water purification options for use in UI components
export const waterPurificationOptions = [
  {
    value: "BOILING",
    label: "उमाल्ने",
  },
  {
    value: "FILTERING",
    label: "फिल्टर गर्ने",
  },
  {
    value: "CHEMICAL_PIYUSH",
    label: "औषधी (पियुष आदि) राख्ने",
  },
  {
    value: "NO_ANY_FILTERING",
    label: "केही नगर्ने/सिधै खाने",
  },
  {
    value: "OTHER",
    label: "अन्य विधि अपनाउने (जस्तै सोडिस)",
  },
];
