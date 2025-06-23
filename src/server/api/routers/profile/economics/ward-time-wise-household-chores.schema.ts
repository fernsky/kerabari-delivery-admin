import { z } from "zod";

// Time spent enum values matching the database
export const TimeSpentEnum = z.enum([
  "LESS_THAN_1_HOUR",
  "HOURS_1_TO_3",
  "HOURS_4_TO_6",
  "HOURS_7_TO_9",
  "HOURS_10_TO_12",
  "MORE_THAN_12_HOURS",
]);

export const timeSpentLabels = {
  LESS_THAN_1_HOUR: "Less than 1 hour",
  HOURS_1_TO_3: "1-3 hours",
  HOURS_4_TO_6: "4-6 hours",
  HOURS_7_TO_9: "7-9 hours",
  HOURS_10_TO_12: "10-12 hours",
  MORE_THAN_12_HOURS: "More than 12 hours",
};

// Base schema for ward time wise household chores
export const wardTimeWiseHouseholdChoresBaseSchema = z.object({
  timeSpent: TimeSpentEnum,
  population: z.number(),
});

// Schema for adding ward time wise household chores
export const addWardTimeWiseHouseholdChoresSchema = z.object({
  wardNumber: z.number(),
  data: z.array(wardTimeWiseHouseholdChoresBaseSchema),
});

// Schema for getting ward time wise household chores
export const getWardTimeWiseHouseholdChoresSchema = z.object({
  wardNumber: z.number().optional(),
});

// Schema for batch adding ward time wise household chores
export const batchAddWardTimeWiseHouseholdChoresSchema = z.object({
  palika: z.string(), // Kept for reference but not used in DB operations
  data: z.array(
    z.object({
      wardNumber: z.number(),
      timeSpent: TimeSpentEnum,
      population: z.number(),
    }),
  ),
});
