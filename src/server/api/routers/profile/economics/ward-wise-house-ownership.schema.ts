import { z } from "zod";

// Define the house ownership type enum to match the database enum
export const HouseOwnershipTypeEnum = z.enum([
  "PRIVATE",
  "RENT",
  "INSTITUTIONAL",
  "OTHER",
]);
export type HouseOwnershipType = z.infer<typeof HouseOwnershipTypeEnum>;

// Schema for ward-wise house ownership data
export const wardWiseHouseOwnershipSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  ownershipType: HouseOwnershipTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise house ownership data
export const wardWiseHouseOwnershipFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  ownershipType: HouseOwnershipTypeEnum.optional(),
});

export const updateWardWiseHouseOwnershipSchema = wardWiseHouseOwnershipSchema;

export type WardWiseHouseOwnershipData = z.infer<
  typeof wardWiseHouseOwnershipSchema
>;
export type UpdateWardWiseHouseOwnershipData = WardWiseHouseOwnershipData;
export type WardWiseHouseOwnershipFilter = z.infer<
  typeof wardWiseHouseOwnershipFilterSchema
>;

// Export the ownership type options for use in UI components
export const ownershipTypeOptions = [
  { value: "PRIVATE", label: "Private ownership (निजी)" },
  { value: "RENT", label: "Rented (भाडामा)" },
  { value: "INSTITUTIONAL", label: "Institutional ownership (संस्थागत)" },
  { value: "OTHER", label: "Other ownership types (अन्य)" },
];
