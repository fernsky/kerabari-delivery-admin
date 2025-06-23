import { z } from "zod";

// Define the time to active road type enum to match the database enum
export const TimeToActiveRoadTypeEnum = z.enum([
  "UNDER_15_MIN",
  "UNDER_30_MIN",
  "UNDER_1_HOUR",
  "1_HOUR_OR_MORE",
]);
export type TimeToActiveRoadType = z.infer<typeof TimeToActiveRoadTypeEnum>;

// Schema for ward-wise time to active road data
export const wardWiseTimeToActiveRoadSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  timeToActiveRoad: TimeToActiveRoadTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise time to active road data
export const wardWiseTimeToActiveRoadFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  timeToActiveRoad: TimeToActiveRoadTypeEnum.optional(),
});

export const updateWardWiseTimeToActiveRoadSchema =
  wardWiseTimeToActiveRoadSchema;

export type WardWiseTimeToActiveRoadData = z.infer<
  typeof wardWiseTimeToActiveRoadSchema
>;
export type UpdateWardWiseTimeToActiveRoadData = WardWiseTimeToActiveRoadData;
export type WardWiseTimeToActiveRoadFilter = z.infer<
  typeof wardWiseTimeToActiveRoadFilterSchema
>;

// Export the time category options for use in UI components
export const timeToActiveRoadOptions = [
  { value: "UNDER_15_MIN", label: "Under 15 minutes (१५ मिनेटभित्र)" },
  { value: "UNDER_30_MIN", label: "Under 30 minutes (३० मिनेटभित्र)" },
  { value: "UNDER_1_HOUR", label: "Under 1 hour (१ घण्टाभित्र)" },
  { value: "1_HOUR_OR_MORE", label: "1 hour or more (१ घण्टाभन्दा बढी)" },
];
