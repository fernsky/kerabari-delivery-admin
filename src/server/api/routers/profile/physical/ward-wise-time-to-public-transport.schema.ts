import { z } from "zod";

// Define the time to public transport type enum to match the database enum
export const TimeToPublicTransportTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);
export type TimeToPublicTransportType = z.infer<
  typeof TimeToPublicTransportTypeEnum
>;

// Schema for ward-wise time to public transport data
export const wardWiseTimeToPublicTransportSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToPublicTransport: TimeToPublicTransportTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to public transport data
export const wardWiseTimeToPublicTransportFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToPublicTransport: TimeToPublicTransportTypeEnum.optional(),
});

export const updateWardWiseTimeToPublicTransportSchema =
  wardWiseTimeToPublicTransportSchema;

export type WardWiseTimeToPublicTransportData = z.infer<
  typeof wardWiseTimeToPublicTransportSchema
>;
export type UpdateWardWiseTimeToPublicTransportData =
  WardWiseTimeToPublicTransportData;
export type WardWiseTimeToPublicTransportFilter = z.infer<
  typeof wardWiseTimeToPublicTransportFilterSchema
>;

// Export the time category options for use in UI components
export const timeToPublicTransportOptions = [
  { value: "UNDER_15_MIN", label: "Under 15 minutes (१५ मिनेटभित्र)" },
  { value: "UNDER_30_MIN", label: "Under 30 minutes (३० मिनेटभित्र)" },
  { value: "UNDER_1_HOUR", label: "Under 1 hour (१ घण्टाभित्र)" },
  { value: "1_HOUR_OR_MORE", label: "1 hour or more (१ घण्टाभन्दा बढी)" },
];
