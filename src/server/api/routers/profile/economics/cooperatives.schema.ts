import { z } from "zod";

// Define the cooperative type enum to match the database enum
export const CooperativeTypeEnum = z.enum([
  "SAVINGS_CREDIT", // बचत तथा ऋण
  "MULTI_PURPOSE", // बहुउद्देश्यीय
  "AGRICULTURE", // कृषि
  "DAIRY", // दुग्ध
  "COMMUNITY", // सामुदायिक
  "WOMENS", // महिला
  "FARMERS", // किसान
  "VEGETABLE", // तरकारी
  "OTHER", // अन्य
]);
export type CooperativeType = z.infer<typeof CooperativeTypeEnum>;

// Schema for cooperative data
export const cooperativeSchema = z.object({
  id: z.string().optional(),
  cooperativeName: z.string().min(1, "Name is required"),
  wardNumber: z.number().int().min(1).max(9, "Ward number must be between 1 and 9"),
  cooperativeType: CooperativeTypeEnum,
  phoneNumber: z.string().optional(),
  remarks: z.string().optional(),
});

// Schema for filtering
export const cooperativeFilterSchema = z.object({
  cooperativeName: z.string().optional(),
  wardNumber: z.number().int().min(1).max(9).optional(),
  cooperativeType: CooperativeTypeEnum.optional(),
});

export const updateCooperativeSchema = cooperativeSchema;

export type CooperativeData = z.infer<typeof cooperativeSchema>;
export type UpdateCooperativeData = CooperativeData;
export type CooperativeFilter = z.infer<typeof cooperativeFilterSchema>;

// Export the cooperative type options for use in UI components
export const cooperativeTypeOptions = [
  { value: "SAVINGS_CREDIT", label: "बचत तथा ऋण" },
  { value: "MULTI_PURPOSE", label: "बहुउद्देश्यीय" },
  { value: "AGRICULTURE", label: "कृषि" },
  { value: "DAIRY", label: "दुग्ध" },
  { value: "COMMUNITY", label: "सामुदायिक" },
  { value: "WOMENS", label: "महिला" },
  { value: "FARMERS", label: "किसान" },
  { value: "VEGETABLE", label: "तरकारी" },
  { value: "OTHER", label: "अन्य" },
];
