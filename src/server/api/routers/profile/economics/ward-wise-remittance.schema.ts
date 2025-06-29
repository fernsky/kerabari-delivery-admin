import { z } from "zod";

// Define the remittance amount group enum - match database schema values
export const RemittanceAmountGroupEnum = z.enum([
  "200k_to_500k",
  "100k_to_200k",
  "above_500k",
  "50k_to_100k",
  "below_50k",
  "no_remittance"
]);
export type RemittanceAmountGroupType = z.infer<typeof RemittanceAmountGroupEnum>;

// Schema for ward-wise remittance data
export const wardWiseRemittanceSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  amountGroup: RemittanceAmountGroupEnum,
  sendingPopulation: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise remittance data
export const wardWiseRemittanceFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  amountGroup: RemittanceAmountGroupEnum.optional(),
});

export const updateWardWiseRemittanceSchema = wardWiseRemittanceSchema;

export type WardWiseRemittanceData = z.infer<
  typeof wardWiseRemittanceSchema
>;
export type UpdateWardWiseRemittanceData = WardWiseRemittanceData;
export type WardWiseRemittanceFilter = z.infer<
  typeof wardWiseRemittanceFilterSchema
>;

// Export the remittance amount group options for use in UI components
export const remittanceAmountGroupOptions = [
  { value: "200k_to_500k", label: "२ लाखदेखि ५ लाखसम्म" },
  { value: "100k_to_200k", label: "१ लाखदेखि २ लाखसम्म" },
  { value: "above_500k", label: "५ लाखभन्दा बढी" },
  { value: "50k_to_100k", label: "५० हजारदेखि १ लाखसम्म" },
  { value: "below_50k", label: "५० हजारभन्दा कम" },
  { value: "no_remittance", label: "रेमिट्यान्स नभएको" },
];