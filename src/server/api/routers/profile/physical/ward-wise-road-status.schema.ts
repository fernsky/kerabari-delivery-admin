import { z } from "zod";

// Define the road status type enum to match the database enum
export const RoadStatusTypeEnum = z.enum([
  "BLACK_TOPPED",
  "GRAVELED",
  "DIRT",
  "GORETO",
  "OTHER",
]);
export type RoadStatusType = z.infer<typeof RoadStatusTypeEnum>;

// Schema for ward-wise road status data
export const wardWiseRoadStatusSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  roadStatus: RoadStatusTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise road status data
export const wardWiseRoadStatusFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  roadStatus: RoadStatusTypeEnum.optional(),
});

export const updateWardWiseRoadStatusSchema = wardWiseRoadStatusSchema;

export type WardWiseRoadStatusData = z.infer<typeof wardWiseRoadStatusSchema>;
export type UpdateWardWiseRoadStatusData = WardWiseRoadStatusData;
export type WardWiseRoadStatusFilter = z.infer<
  typeof wardWiseRoadStatusFilterSchema
>;

// Export the road status options for use in UI components
export const roadStatusOptions = [
  { value: "BLACK_TOPPED", label: "Black-topped road (कालोपत्रे सडक)" },
  { value: "GRAVELED", label: "Graveled road (ग्राभेल सडक)" },
  { value: "DIRT", label: "Dirt road (कच्ची सडक)" },
  { value: "GORETO", label: "Footpath (गोरेटो)" },
  { value: "OTHER", label: "Other (अन्य)" },
];
