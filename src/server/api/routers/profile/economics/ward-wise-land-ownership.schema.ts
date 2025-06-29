import { z } from "zod";

// Define the land ownership type enum to match the database enum
export const LandOwnershipTypeEnum = z.enum([
  "PRIVATE",
  "GUTHI",
  "PUBLIC_EILANI",
  "VILLAGE_BLOCK",
  "OTHER"
]);
export type LandOwnershipType = z.infer<typeof LandOwnershipTypeEnum>;

// Schema for ward-wise land ownership data
export const wardWiseLandOwnershipSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  landOwnershipType: LandOwnershipTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise land ownership data
export const wardWiseLandOwnershipFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  landOwnershipType: LandOwnershipTypeEnum.optional(),
});

export const updateWardWiseLandOwnershipSchema = wardWiseLandOwnershipSchema;

export type WardWiseLandOwnershipData = z.infer<
  typeof wardWiseLandOwnershipSchema
>;
export type UpdateWardWiseLandOwnershipData = WardWiseLandOwnershipData;
export type WardWiseLandOwnershipFilter = z.infer<
  typeof wardWiseLandOwnershipFilterSchema
>;

// Export the land ownership options for use in UI components
export const landOwnershipTypeOptions = [
  { value: "PRIVATE", label: "निजी" },
  { value: "GUTHI", label: "गुठी" },
  { value: "PUBLIC_EILANI", label: "सार्वजनिक/ऐलानी" },
  { value: "VILLAGE_BLOCK", label: "गाउँ ब्लक" },
  { value: "NOT_STATED", label: "उल्लेख नभएको" },
  { value: "OTHER", label: "अन्य (खुलाउने)" },
];
