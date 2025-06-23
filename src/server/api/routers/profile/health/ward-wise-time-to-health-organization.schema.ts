import { z } from "zod";

// Define the time to health organization type enum to match the database enum
export const TimeToHealthOrganizationTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);
export type TimeToHealthOrganizationType = z.infer<
  typeof TimeToHealthOrganizationTypeEnum
>;

// Schema for ward-wise time to health organization data
export const wardWiseTimeToHealthOrganizationSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToHealthOrganization: TimeToHealthOrganizationTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to health organization data
export const wardWiseTimeToHealthOrganizationFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToHealthOrganization: TimeToHealthOrganizationTypeEnum.optional(),
});

export const updateWardWiseTimeToHealthOrganizationSchema =
  wardWiseTimeToHealthOrganizationSchema;

export type WardWiseTimeToHealthOrganizationData = z.infer<
  typeof wardWiseTimeToHealthOrganizationSchema
>;
export type UpdateWardWiseTimeToHealthOrganizationData =
  WardWiseTimeToHealthOrganizationData;
export type WardWiseTimeToHealthOrganizationFilter = z.infer<
  typeof wardWiseTimeToHealthOrganizationFilterSchema
>;

// Export the time category options for use in UI components
export const timeToHealthOrganizationOptions = [
  { value: "UNDER_15_MIN", label: "Under 15 minutes (१५ मिनेटभित्र)" },
  { value: "UNDER_30_MIN", label: "Under 30 minutes (३० मिनेटभित्र)" },
  { value: "UNDER_1_HOUR", label: "Under 1 hour (१ घण्टाभित्र)" },
  { value: "1_HOUR_OR_MORE", label: "1 hour or more (१ घण्टाभन्दा बढी)" },
];
