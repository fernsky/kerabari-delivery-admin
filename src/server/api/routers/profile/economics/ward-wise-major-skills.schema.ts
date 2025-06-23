import { z } from "zod";

// Define the skill type enum to match the database enum
export const skillTypeEnum = z.enum([
  "TEACHING_RELATED",
  "PHOTOGRAPHY_RELATED",
  "HANDICRAFT_RELATED",
  "MUSIC_DRAMA_RELATED",
  "STONEWORK_WOODWORK",
  "CARPENTERY_RELATED",
  "PLUMBING",
  "HUMAN_HEALTH_RELATED",
  "ANIMAL_HEALTH_RELATED",
  "ELECTRICITY_INSTALLMENT_RELATED",
  "HOTEL_RESTAURANT_RELATED",
  "AGRICULTURE_RELATED",
  "PRINTING_RELATED",
  "DRIVING_RELATED",
  "MECHANICS_RELATED",
  "FURNITURE_RELATED",
  "SHOEMAKING_RELATED",
  "SEWING_RELATED",
  "JWELLERY_MAKING_RELATED",
  "BEUATICIAN_RELATED",
  "SELF_PROTECTION_RELATED",
  "LAND_SURVEY_RELATED",
  "COMPUTER_SCIENCE_RELATED",
  "ENGINEERING_DESIGN_RELATED",
  "RADIO_TELEVISION_ELECTRICAL_REPAIR",
  "LITERARY_CREATION_RELATED",
  "OTHER",
  "NONE",
]);

export type SkillType = z.infer<typeof skillTypeEnum>;

// Define Nepali skill names for display
export const skillLabels: Record<string, string> = {
  TEACHING_RELATED: "शिक्षण शिकाई सम्बन्धी",
  PHOTOGRAPHY_RELATED: "श्रव्यदृष्य तथा फोटोग्राफी सम्बन्धी",
  HANDICRAFT_RELATED: "हस्तकला / चित्रकला सम्बन्धी",
  MUSIC_DRAMA_RELATED: "गीत, संगीत, नाटक तथा कलाकारिता",
  STONEWORK_WOODWORK: "मूर्तिकला, प्रस्तरकला, काष्ठकला",
  CARPENTERY_RELATED: "सिकर्मी, डकर्मी सम्बन्धी",
  PLUMBING: "प्लम्बिङ सम्बन्धी",
  HUMAN_HEALTH_RELATED: "मानव स्वास्थ्यसँग सम्बन्धी",
  ANIMAL_HEALTH_RELATED: "पशुचिकित्सा तथा पशुस्वास्थ्य सम्बन्धी",
  ELECTRICITY_INSTALLMENT_RELATED: "बिजुली जडान सम्बन्धी",
  HOTEL_RESTAURANT_RELATED: "होटल तथा रेष्टुरेन्ट सम्बन्धी",
  AGRICULTURE_RELATED: "कृषि, पशुपालन, माछापालन, मौरी पालन सम्बन्धी",
  PRINTING_RELATED: "छपाई सम्बन्धी",
  DRIVING_RELATED: "सवारी चालक सम्बन्धी",
  MECHANICS_RELATED: "यान्त्रिक (मेकानिक्स) सम्बन्धी",
  FURNITURE_RELATED: "फर्निचर बनाउने सम्बन्धी",
  SHOEMAKING_RELATED: "जुत्ता चप्पल बनाउने",
  SEWING_RELATED: "पोशाक बनाउने / सिउने",
  JWELLERY_MAKING_RELATED: "गरगहना बनाउने / मर्मत गर्ने",
  BEUATICIAN_RELATED: "केश सजावट / श्रृंगार सम्बन्धी",
  SELF_PROTECTION_RELATED: "आत्मसुरक्षा सम्बन्धी / शारीरिक सुगठन",
  LAND_SURVEY_RELATED: "जमिनको सर्भेक्षण सम्बन्धी",
  COMPUTER_SCIENCE_RELATED: "कम्प्युटर विज्ञान सम्बन्धी",
  ENGINEERING_DESIGN_RELATED: "इन्जिनियरिङ डिजाईन सम्बन्धी",
  RADIO_TELEVISION_ELECTRICAL_REPAIR: "रेडियो, टेलिभिजन, मोबाईल, तथा अन्य ईलेक्ट्रिक बस्तुको मर्मत",
  LITERARY_CREATION_RELATED: "साहित्य श्रृजना सम्बन्धी",
  OTHER: "अन्य",
  NONE: "विशेष सीप / दक्षता नभएको",
};

// Schema for ward-wise major skills data
export const wardWiseMajorSkillsSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.number().int(),
  skill: skillTypeEnum,
  population: z.number().int().nonnegative(),
});

// Schema for filtering ward-wise major skills data
export const wardWiseMajorSkillsFilterSchema = z.object({
  wardNumber: z.number().int().optional(),
  skill: skillTypeEnum.optional(),
});

export const updateWardWiseMajorSkillsSchema = wardWiseMajorSkillsSchema;

export type WardWiseMajorSkillsData = z.infer<typeof wardWiseMajorSkillsSchema>;
export type UpdateWardWiseMajorSkillsData = WardWiseMajorSkillsData;
export type WardWiseMajorSkillsFilter = z.infer<
  typeof wardWiseMajorSkillsFilterSchema
>;
