import { z } from "zod";

// Define the remittance amount group enum
export const RemittanceAmountGroupEnum = z.enum([
  "NO_REMITTANCE",
  "BELOW_50K",
  "RS_50K_TO_100K",
  "RS_100K_TO_200K",
  "RS_200K_TO_500K",
  "ABOVE_500K",
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
  { value: "NO_REMITTANCE", label: "रेमिट्यान्स नभएको" },
  { value: "BELOW_50K", label: "५० हजारभन्दा कम" },
  { value: "RS_50K_TO_100K", label: "५० हजारदेखि १ लाखसम्म" },
  { value: "RS_100K_TO_200K", label: "१ लाखदेखि २ लाखसम्म" },
  { value: "RS_200K_TO_500K", label: "२ लाखदेखि ५ लाखसम्म" },
  { value: "ABOVE_500K", label: "५ लाखभन्दा बढी" },
];