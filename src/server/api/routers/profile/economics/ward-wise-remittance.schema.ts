import { z } from "zod";

// Define the remittance amount group enum - match database schema values
export const RemittanceAmountGroupEnum = z.enum([
  "RS_0_TO_49999",
  "RS_50000_TO_99999",
  "RS_100000_TO_149999",
  "RS_150000_TO_199999",
  "RS_200000_TO_249999",
  "RS_250000_TO_299999",
  "RS_300000_TO_349999",
  "RS_350000_TO_399999",
  "RS_400000_TO_449999",
  "RS_450000_TO_499999",
  "RS_500000_PLUS",
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
  { value: "RS_0_TO_49999", label: "रु. ० देखि ४९,९९९ सम्म" },
  { value: "RS_50000_TO_99999", label: "रु. ५०,००० देखि ९९,९९९ सम्म" },
  { value: "RS_100000_TO_149999", label: "रु. १,००,००० देखि १,४९,९९९ सम्म" },
  { value: "RS_150000_TO_199999", label: "रु. १,५०,००० देखि १,९९,९९९ सम्म" },
  { value: "RS_200000_TO_249999", label: "रु. २,००,००० देखि २,४९,९९९ सम्म" },
  { value: "RS_250000_TO_299999", label: "रु. २,५०,००० देखि २,९९,९९९ सम्म" },
  { value: "RS_300000_TO_349999", label: "रु. ३,००,००० देखि ३,४९,९९९ सम्म" },
  { value: "RS_350000_TO_399999", label: "रु. ३,५०,००० देखि ३,९९,९९९ सम्म" },
  { value: "RS_400000_TO_449999", label: "रु. ४,००,००० देखि ४,४९,९९९ सम्म" },
  { value: "RS_450000_TO_499999", label: "रु. ४,५०,००० देखि ४,९९,९९९ सम्म" },
  { value: "RS_500000_PLUS", label: "रु. ५,००,००० भन्दा बढी" },
];