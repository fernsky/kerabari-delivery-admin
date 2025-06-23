import { z } from "zod";

// Define the time to market center type enum to match the database enum
export const TimeToMarketCenterTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);
export type TimeToMarketCenterType = z.infer<typeof TimeToMarketCenterTypeEnum>;

// Schema for ward-wise time to market center data
export const wardWiseTimeToMarketCenterSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToMarketCenter: TimeToMarketCenterTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to market center data
export const wardWiseTimeToMarketCenterFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToMarketCenter: TimeToMarketCenterTypeEnum.optional(),
});

export const updateWardWiseTimeToMarketCenterSchema =
  wardWiseTimeToMarketCenterSchema;

export type WardWiseTimeToMarketCenterData = z.infer<
  typeof wardWiseTimeToMarketCenterSchema
>;
export type UpdateWardWiseTimeToMarketCenterData =
  WardWiseTimeToMarketCenterData;
export type WardWiseTimeToMarketCenterFilter = z.infer<
  typeof wardWiseTimeToMarketCenterFilterSchema
>;

// Export the time category options for use in UI components
export const timeToMarketCenterOptions = [
  { value: "UNDER_15_MIN", label: "Under 15 minutes (१५ मिनेटभित्र)" },
  { value: "UNDER_30_MIN", label: "Under 30 minutes (३० मिनेटभित्र)" },
  { value: "UNDER_1_HOUR", label: "Under 1 hour (१ घण्टाभित्र)" },
  { value: "1_HOUR_OR_MORE", label: "1 hour or more (१ घण्टाभन्दा बढी)" },
];
