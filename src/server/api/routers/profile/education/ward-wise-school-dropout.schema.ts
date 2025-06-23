import { z } from "zod";

// Define the school dropout cause type enum to match the database enum
export const SchoolDropoutCauseTypeEnum = z.enum([
  "LIMITED_SPACE",
  "EXPENSIVE",
  "FAR",
  "HOUSE_HELP",
  "UNWILLING_PARENTS",
  "WANTED_STUDY_COMPLETED",
  "MARRIAGE",
  "EMPLOYMENT",
  "OTHER",
]);
export type SchoolDropoutCauseType = z.infer<typeof SchoolDropoutCauseTypeEnum>;

// Schema for ward-wise school dropout data
export const wardWiseSchoolDropoutSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  cause: SchoolDropoutCauseTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise school dropout data
export const wardWiseSchoolDropoutFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  cause: SchoolDropoutCauseTypeEnum.optional(),
});

export const updateWardWiseSchoolDropoutSchema = wardWiseSchoolDropoutSchema;

export type WardWiseSchoolDropoutData = z.infer<
  typeof wardWiseSchoolDropoutSchema
>;
export type UpdateWardWiseSchoolDropoutData = WardWiseSchoolDropoutData;
export type WardWiseSchoolDropoutFilter = z.infer<
  typeof wardWiseSchoolDropoutFilterSchema
>;

// Export the dropout cause options for use in UI components
export const schoolDropoutCauseOptions = [
  {
    value: "LIMITED_SPACE",
    label: "अरु पढ्ने ठाउिँ नभएकोले",
  },
  {
    value: "EXPENSIVE",
    label: "धेरै महँगो भएकोले",
  },
  {
    value: "FAR",
    label: "धेरै टाढा भएकोले",
  },
  {
    value: "HOUSE_HELP",
    label: "घरमा काम सघाउनु परेकोले",
  },
  {
    value: "UNWILLING_PARENTS",
    label: "बाबु/आमाले नचाहेकोले",
  },
  {
    value: "WANTED_STUDY_COMPLETED",
    label: "चाहेजति पढिसकेकोले",
  },
  {
    value: "MARRIAGE",
    label: "विवाह भएकोले",
  },
  {
    value: "EMPLOYMENT",
    label: "काम शुर गरेको/जागिर पाएर",
  },
  {
    value: "OTHER",
    label: "अन्य",
  },
];
