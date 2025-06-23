import { z } from "zod";

// Define the facility type enum to match the database enum
export const FacilityTypeEnum = z.enum([
  "RADIO",
  "TELEVISION",
  "COMPUTER",
  "INTERNET",
  "MOBILE_PHONE",
  "CAR_JEEP",
  "MOTORCYCLE",
  "BICYCLE",
  "REFRIGERATOR",
  "WASHING_MACHINE",
  "AIR_CONDITIONER",
  "ELECTRICAL_FAN",
  "MICROWAVE_OVEN",
  "DAILY_NATIONAL_NEWSPAPER_ACCESS",
  "NONE",
]);
export type FacilityType = z.infer<typeof FacilityTypeEnum>;

// Schema for ward-wise facilities data
export const wardWiseFacilitiesSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  facility: FacilityTypeEnum,
  households: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise facilities data
export const wardWiseFacilitiesFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  facility: FacilityTypeEnum.optional(),
});

export const updateWardWiseFacilitiesSchema = wardWiseFacilitiesSchema;

export type WardWiseFacilitiesData = z.infer<typeof wardWiseFacilitiesSchema>;
export type UpdateWardWiseFacilitiesData = WardWiseFacilitiesData;
export type WardWiseFacilitiesFilter = z.infer<
  typeof wardWiseFacilitiesFilterSchema
>;

// Export the facility options for use in UI components
export const facilityOptions = [
  { value: "RADIO", label: "Radio (रेडियो सुविधा)" },
  { value: "TELEVISION", label: "Television (टेलिभिजन)" },
  { value: "COMPUTER", label: "Computer/Laptop (कम्प्युटर/ल्यापटप)" },
  { value: "INTERNET", label: "Internet service (इन्टरनेट सुविधा)" },
  { value: "MOBILE_PHONE", label: "Mobile phone (मोबाईल फोन)" },
  { value: "CAR_JEEP", label: "Car/Jeep/Van (कार/जीप/भ्यान)" },
  { value: "MOTORCYCLE", label: "Motorcycle/Scooter (मोटरसाईकल/स्कुटर)" },
  { value: "BICYCLE", label: "Bicycle (साईकल)" },
  { value: "REFRIGERATOR", label: "Refrigerator (रेफ्रिजेरेटर/फ्रिज)" },
  { value: "WASHING_MACHINE", label: "Washing machine (वासिङ मेसिन)" },
  { value: "AIR_CONDITIONER", label: "Air conditioner (एयर कन्डिसनर)" },
  { value: "ELECTRICAL_FAN", label: "Electrical fan (विद्युतीय पंखा)" },
  { value: "MICROWAVE_OVEN", label: "Microwave oven (माइक्रोवेभ ओभन)" },
  {
    value: "DAILY_NATIONAL_NEWSPAPER_ACCESS",
    label:
      "Access to daily national newspaper (राष्ट्रिय दैनिक पत्रिकाको पहुँच)",
  },
  { value: "NONE", label: "None of the above (माथिका कुनै पनि नभएको)" },
];
