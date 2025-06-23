import { z } from "zod";

// Define the toilet type enum to match the database enum
export const ToiletTypeEnum = z.enum([
  "FLUSH_WITH_SEPTIC_TANK",
  "NORMAL",
  "PUBLIC_EILANI",
  "NO_TOILET",
  "OTHER",
]);
export type ToiletType = z.infer<typeof ToiletTypeEnum>;

// Schema for ward-wise toilet type data
export const wardWiseToiletTypeSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  toiletType: ToiletTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise toilet type data
export const wardWiseToiletTypeFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  toiletType: ToiletTypeEnum.optional(),
});

export const updateWardWiseToiletTypeSchema = wardWiseToiletTypeSchema;

export type WardWiseToiletTypeData = z.infer<typeof wardWiseToiletTypeSchema>;
export type UpdateWardWiseToiletTypeData = WardWiseToiletTypeData;
export type WardWiseToiletTypeFilter = z.infer<
  typeof wardWiseToiletTypeFilterSchema
>;

// Export the toilet type options for use in UI components
export const toiletTypeOptions = [
  {
    value: "FLUSH_WITH_SEPTIC_TANK",
    label: "फ्लस भएको (सेप्टिक ट्याङ्क)",
  },
  {
    value: "NORMAL",
    label: "साधारण",
  },
  {
    value: "PUBLIC_EILANI",
    label: "सार्वजनिक",
  },
  {
    value: "NO_TOILET",
    label: "चर्पी नभएको",
  },
  {
    value: "OTHER",
    label: "अन्य",
  },
];
