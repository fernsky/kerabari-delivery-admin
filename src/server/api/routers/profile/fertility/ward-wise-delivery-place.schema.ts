import { z } from "zod";

// Define the delivery place type enum to match the database enum
export const DeliveryPlaceTypeEnum = z.enum([
  "HOUSE",
  "GOVERNMENTAL_HEALTH_INSTITUTION",
  "PRIVATE_HEALTH_INSTITUTION",
  "OTHER",
]);
export type DeliveryPlaceType = z.infer<typeof DeliveryPlaceTypeEnum>;

// Schema for ward-wise delivery places data
export const wardWiseDeliveryPlaceSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  deliveryPlace: DeliveryPlaceTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise delivery places data
export const wardWiseDeliveryPlaceFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  deliveryPlace: DeliveryPlaceTypeEnum.optional(),
});

export const updateWardWiseDeliveryPlaceSchema = wardWiseDeliveryPlaceSchema;

export type WardWiseDeliveryPlaceData = z.infer<
  typeof wardWiseDeliveryPlaceSchema
>;
export type UpdateWardWiseDeliveryPlaceData = WardWiseDeliveryPlaceData;
export type WardWiseDeliveryPlaceFilter = z.infer<
  typeof wardWiseDeliveryPlaceFilterSchema
>;

// Export the delivery place options for use in UI components
export const deliveryPlaceOptions = [
  {
    value: "HOUSE",
    label: "Home delivery (घरमा)",
  },
  {
    value: "GOVERNMENTAL_HEALTH_INSTITUTION",
    label: "Government health institution (सरकारी स्वास्थ्य संस्थामा)",
  },
  {
    value: "PRIVATE_HEALTH_INSTITUTION",
    label: "Private health institution (नीजी स्वास्थ्य संस्थामा)",
  },
  {
    value: "OTHER",
    label: "Other locations (अन्य)",
  },
];
