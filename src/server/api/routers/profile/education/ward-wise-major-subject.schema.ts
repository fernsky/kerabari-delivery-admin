import { z } from "zod";

// Define the major subject type enum to match the database enum
export const MajorSubjectTypeEnum = z.enum([
  "ENGLISH",
  "ECONOMICS",
  "ENGINEERING",
  "HISTORY",
  "HOME_ECONOMICS",
  "RURAL_DEVELOPMENT",
  "MEDICINE",
  "POPULATION_STUDY",
  "BIOLOGY",
  "STATISTICS",
  "NEPALI",
  "TOURISM",
  "GEOGRAPHY",
  "PHYSICS",
  "PSYCHOLOGY",
  "HUMANITIES",
  "CHEMISTRY",
  "POLITICAL_SCIENCE",
  "FORESTRY_AND_AGRICULTURE",
  "BOTANY",
  "COMMERCE",
  "SCIENCE",
  "MANAGEMENT",
  "EDUCATION",
  "EDUCATIONAL_SCIENCE",
  "SANSKRIT",
  "ARTS",
  "SOCIAL_SCIENCES",
  "INFORMATION_TECHNOLOGY",
  "HINDI",
  "OTHER",
]);
export type MajorSubjectType = z.infer<typeof MajorSubjectTypeEnum>;

// Schema for ward-wise major subject data
export const wardWiseMajorSubjectSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int().positive(),
  subjectType: MajorSubjectTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major subject data
export const wardWiseMajorSubjectFilterSchema = z.object({
  wardNumber: z.number().int().positive().optional(),
  subjectType: MajorSubjectTypeEnum.optional(),
});

export const updateWardWiseMajorSubjectSchema = wardWiseMajorSubjectSchema;

export type WardWiseMajorSubjectData = z.infer<
  typeof wardWiseMajorSubjectSchema
>;
export type UpdateWardWiseMajorSubjectData = WardWiseMajorSubjectData;
export type WardWiseMajorSubjectFilter = z.infer<
  typeof wardWiseMajorSubjectFilterSchema
>;

// Export the subject type options for use in UI components
export const majorSubjectOptions = [
  { value: "ENGLISH", label: "English (अंग्रेजी)" },
  { value: "ECONOMICS", label: "Economics (अर्थशास्त्र)" },
  { value: "ENGINEERING", label: "Engineering (इन्जिनियरङ्गि)" },
  { value: "HISTORY", label: "History (इतिहास)" },
  { value: "HOME_ECONOMICS", label: "Home Economics (गृहविज्ञान)" },
  { value: "RURAL_DEVELOPMENT", label: "Rural Development (ग्रामीण विकास)" },
  { value: "MEDICINE", label: "Medicine (चिकित्सा)" },
  { value: "POPULATION_STUDY", label: "Population Studies (जनसंख्या अध्ययन)" },
  { value: "BIOLOGY", label: "Biology (जीवशास्त्र)" },
  { value: "STATISTICS", label: "Statistics (तथ्यांकशास्त्र)" },
  { value: "NEPALI", label: "Nepali (नेपाली)" },
  { value: "TOURISM", label: "Tourism (पर्यटन)" },
  { value: "GEOGRAPHY", label: "Geography (भूगोल)" },
  { value: "PHYSICS", label: "Physics (भौतिकशास्त्र)" },
  { value: "PSYCHOLOGY", label: "Psychology (मनोविज्ञान)" },
  { value: "HUMANITIES", label: "Humanities (मानविकी)" },
  { value: "CHEMISTRY", label: "Chemistry (रसायनशास्त्र)" },
  { value: "POLITICAL_SCIENCE", label: "Political Science (राजनीतिकशास्त्र)" },
  {
    value: "FORESTRY_AND_AGRICULTURE",
    label: "Forestry and Agriculture (वन, कृषि तथा पशुविज्ञान)",
  },
  { value: "BOTANY", label: "Botany (वनस्पतिशास्त्र)" },
  { value: "COMMERCE", label: "Commerce (वाणिज्य)" },
  { value: "SCIENCE", label: "Science (विज्ञान)" },
  { value: "MANAGEMENT", label: "Management (व्यवस्थापन)" },
  { value: "EDUCATION", label: "Education (शिक्षा)" },
  {
    value: "EDUCATIONAL_SCIENCE",
    label: "Educational Science (शिक्षाशास्त्र)",
  },
  { value: "SANSKRIT", label: "Sanskrit (संस्कृत)" },
  { value: "ARTS", label: "Arts (संस्कृति)" },
  { value: "SOCIAL_SCIENCES", label: "Social Sciences (समाजशास्त्र)" },
  {
    value: "INFORMATION_TECHNOLOGY",
    label: "Information Technology (सूचना प्रविधि)",
  },
  { value: "HINDI", label: "Hindi (हिन्दी)" },
  { value: "OTHER", label: "Other subjects (अन्य)" },
];
