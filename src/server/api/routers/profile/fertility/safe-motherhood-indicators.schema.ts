import { z } from "zod";

// डेटाबेस इनमसँग मिल्ने सुरक्षित मातृत्व सूचक प्रकार इनम परिभाषा
export const SafeMotherhoodIndicatorTypeEnum = z.enum([
  "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS",         // 1.18 - सुत्केरी आमाले दुई पीएनसी घर भ्रमणमा प्राप्त गर्ने प्रतिशत
  "PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP",        // 1.1 - कम्तीमा एक एएनसी जाँच गराउने गर्भवती महिलाको प्रतिशत
  "PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS",         // 1.4 - एन्थेल्मिन्थिक्स प्राप्त गर्ने गर्भवती महिलाको प्रतिशत
  "POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS", // 1.31 - प्रसूतिशास्त्रीय जटिलताका कारण रिफर गरिएका सुत्केरी महिलाको प्रतिशत
  "NORMAL_VAGINAL_DELIVERIES",                      // 1.11 - रिपोर्ट गरिएका प्रसवहरू मध्ये सामान्य योनि प्रसवको प्रतिशत
  "NEWBORNS_CHX_APPLIED_AFTER_BIRTH",               // 1.39 - जन्मेपछि तुरुन्त सीएचएक्स लगाइएका नवजातकको प्रतिशत
  "POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID",      // 1.19 - ४५ दिनको फोलिक एसिड पूरक प्राप्त गर्ने सुत्केरी आमाको प्रतिशत
  "POSTPARTUM_MOTHERS_VITAMIN_A",                   // 1.20 - भिटामिन ए पूरक प्राप्त गर्ने सुत्केरी आमाको प्रतिशत
  "WOMEN_CONTRACEPTIVES_AFTER_ABORTION",            // 1.45 - गर्भपात पछि गर्भरोधक प्राप्त गर्ने महिलाको प्रतिशत
  "WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY",        // 1.3 - गर्भावस्थामा १८० दिनको फोलिक एसिड प्राप्त गर्ने महिलाको प्रतिशत
  "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL",      // गर्भवती महिलाले प्रोटोकल अनुसार चार एएनसी जाँच गराउने प्रतिशत
  "WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",               // 1.47 प्रोटोकल अनुसार पहिलो एएनसी जाँच गराउने महिलाको प्रतिशत
  "WOMEN_180_CALCIUM_TABLETS_PREGNANCY",            // 1.5 - गर्भावस्थामा १८० क्याल्सियम ट्याब्लेट प्राप्त गर्ने महिलाको प्रतिशत
  "INSTITUTIONAL_DELIVERIES",                       // 1.6 - संस्थागत प्रसवको प्रतिशत
  "BIRTHS_ATTENDED_SBA_TRAINED_ANMS",               // 1.8 - दक्ष जन्म सहायक (एसबीए प्रशिक्षित एएनएम) द्वारा सहायता प्राप्त जन्मको प्रतिशत
  "WOMEN_PNC_WITHIN_24HRS_DELIVERY",                // 1.16 - प्रसव पछि २४ घण्टामा पीएनसी प्राप्त गर्ने महिलाको प्रतिशत
  "NEWBORNS_CHECKUP_24HRS_BIRTH",                   // 1.40 - जन्मेको २४ घण्टामा जाँच गराउने नवजातकको प्रतिशत
  "WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL",         // 1.17 - प्रोटोकल अनुसार चार सुत्केरीमा जाँच गराउने महिलाको प्रतिशत
  "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL",            // 1.41 - पीएनसी प्रोटोकल अनुसार चार जाँच प्राप्त गर्ने नवजातकको प्रतिशत
  "PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL",       // 1.2 - प्रोटोकल अनुसार कम्तीमा आठ एएनसी भ्रमण गर्ने गर्भवती महिलाको प्रतिशत
  "PREGNANCIES_TERMINATED_INDUCED_PROCEDURE",       // 1.44 - स्वास्थ्य संस्थामा प्रेरित प्रविधिबाट अन्त्य गरिएका गर्भको प्रतिशत
  "NEWBORNS_LOW_BIRTH_WEIGHT",                      // 1.35 - कम जन्म तौल (<२.५ केजी) भएका नवजातकको प्रतिशत
  "DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL",        // 1.7 - कुल संस्थागत प्रसवमध्ये २० वर्ष मुनिका प्रसवको प्रतिशत
  "NEONATES_BIRTH_ASPHYXIA",                        // 1.37 - जन्म श्वासप्रश्वास भएका नवजातकको प्रतिशत
  "PRETERM_BIRTH",                                  // 1.36 - समय अगाडि जन्मको प्रतिशत
  "STILL_BIRTHS",                                   // 1.42 - मृत जन्मको प्रतिशत
  "BIRTHS_ATTENDED_NON_SBA_SHP",                    // 1.10 - एसबीए र एसएचपी बाहेक अन्य स्वास्थ्यकर्ताबाट सहायता प्राप्त जन्मको प्रतिशत
  "NEONATES_CONGENITAL_ANOMALIES",                  // 1.38 - जन्मजात विकृति भएका नवजातकको प्रतिशत
  "NEONATAL_MORTALITY_HEALTH_FACILITY",             // 1.43 - स्वास्थ्य संस्थानमा नवजातक मृत्युको प्रतिशत
  "ASSISTED_VACUUM_FORCEPS_DELIVERIES",             // 1.12 - सहायोगपूर्ण (भ्याकुम वा फोर्सेप्स) प्रसवको प्रतिशत
  "DELIVERIES_CAESAREAN_SECTION_REPORTED",          // 1.13 - रिपोर्ट गरिएका प्रसवमध्ये सिजेरियन सेक्शन प्रसवको प्रतिशत
  "DELIVERY_BY_CAESAREAN_SECTION",                  // 1.14 - सिजेरियन सेक्शन प्रसवको प्रतिशत
  "PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL",          // 1.15 - घरमा जन्म दिएर मिसोप्रोस्टल प्रयोग गर्ने गर्भवती महिलाको प्रतिशत
  "WOMEN_TREATED_HAEMORRHAGE",                      // 1.22 - रक्तस्रावको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE",           // 1.22.1 प्रसव पूर्व रक्तस्राव (APH) को उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE",           // 1.22.2 प्रसव पछि रक्तस्राव (PPH) को उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_ECTOPIC_PREGNANCY",                // 1.23 - एक्टोपिक गर्भको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_RUPTURED_UTERUS",                  // 1.25 - गर्भाशय फाटेकोको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_PREECLAMPSIA",                     // 1.26 - प्रि-एक्लाम्पसियाको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_ECLAMPSIA",                        // 1.27 - एक्लाम्पसियाको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_RETAINED_PLACENTA",                // 1.28 - उल प्लासेन्टाको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_PUERPERAL_SEPSIS",                 // 1.29 - प्यूर्पेरल सेप्सिसको उपचार गरिएका महिलाको संख्या
  "WOMEN_TREATED_ABORTION_COMPLICATIONS",           // 1.30 - गर्भपात जटिलताको उपचार गरिएका महिलाको संख्या
  "WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION", // 1.32 - प्रसूति जटिलताका कारण रगत चढाएका महिलाको प्रतिशत
  "REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY",       // 1.34 - स्वास्थ्य संस्थानमा रिपोर्ट गरिएका मातृत्व मृत्युको संख्या
  "WOMEN_COMPLICATIONS_INDUCED_ABORTION",           // 1.46 - प्रेरित गर्भपातबाट जटिलता भएका महिलाको प्रतिशत
  "BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL",       // 1.9 - दक्ष स्वास्थ्य कर्मचारी (एसएचपी) द्वारा सहायता प्राप्त जन्मको प्रतिशत
  "PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL",      // गर्भवती महिलाले प्रोटोकल अनुसार पहिलो एएनसी जाँच गराउने प्रतिशत
  "MET_NEED_EMERGENCY_OBSTETRIC_CARE",              // 1.21 - आकस्मिक प्रसूति सेवा आवश्यकता पूर्ति
  "WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR",       // 1.24 - दीर्घ/रोकिएको प्रसवको उपचार गरिएका महिलाको संख्या
  "POSTPARTUM_MOTHERS_CS_WOUND_INFECTION"           // 1.33 - सी/एस घाउ संक्रमण भएका सुत्केरी आमाको प्रतिशत
]);

export type SafeMotherhoodIndicatorType = z.infer<
  typeof SafeMotherhoodIndicatorTypeEnum
>;

// Schema for safe motherhood indicator data
export const safeMotherhoodIndicatorSchema = z.object({
  id: z.string().optional(),
  indicator: SafeMotherhoodIndicatorTypeEnum,
  year: z.number().int().min(2000).max(2100), // Reasonable year range
  value: z.number().nonnegative(),
});

// Schema for filtering safe motherhood indicators data
export const safeMotherhoodIndicatorFilterSchema = z.object({
  indicator: SafeMotherhoodIndicatorTypeEnum.optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const updateSafeMotherhoodIndicatorSchema =
  safeMotherhoodIndicatorSchema;

export type SafeMotherhoodIndicatorData = z.infer<
  typeof safeMotherhoodIndicatorSchema
>;
export type UpdateSafeMotherhoodIndicatorData = SafeMotherhoodIndicatorData;
export type SafeMotherhoodIndicatorFilter = z.infer<
  typeof safeMotherhoodIndicatorFilterSchema
>;

// UI प्रदर्शनका लागि श्रेणी अनुसार सूचकहरू समूहीकरण
export const indicatorCategories = [
  {
    category: "प्रसव पूर्व हेरचाह",
    indicators: [
      { value: "PREGNANT_WOMEN_AT_LEAST_ONE_ANC_CHECKUP", label: "कम्तीमा एक एएनसी जाँच गराउने गर्भवती महिलाको प्रतिशत" },
      { value: "PREGNANT_WOMEN_FIRST_ANC_CHECKUP_PROTOCOL", label: "प्रोटोकल अनुसार पहिलो एएनसी जाँच गराउने महिलाको प्रतिशत" },
      { value: "PREGNANT_WOMEN_FOUR_ANC_CHECKUPS_PROTOCOL", label: "प्रोटोकल अनुसार चार एएनसी जाँच गराउने गर्भवती महिलाको प्रतिशत" },
      { value: "PREGNANT_WOMEN_EIGHT_ANC_VISITS_PROTOCOL", label: "प्रोटोकल अनुसार कम्तीमा आठ एएनसी भ्रमण गर्ने गर्भवती महिलाको प्रतिशत" },
      { value: "PREGNANT_WOMEN_RECEIVED_ANTHELMINTHICS", label: "एन्थेल्मिन्थिक्स प्राप्त गर्ने गर्भवती महिलाको प्रतिशत" },
      { value: "WOMEN_180DAYS_IRON_FOLIC_ACID_PREGNANCY", label: "गर्भावस्थामा १८० दिनको फोलिक एसिड प्राप्त गर्ने महिलाको प्रतिशत" },
      { value: "WOMEN_180_CALCIUM_TABLETS_PREGNANCY", label: "गर्भावस्थामा १८० क्याल्सियम ट्याब्लेट प्राप्त गर्ने महिलाको प्रतिशत" },
      { value: "WOMEN_FIRST_ANC_CHECKUP_PROTOCOL", label: "प्रोटोकल अनुसार पहिलो एएनसी जाँच गराउने महिलाको प्रतिशत" }
    ]
  },
  {
    category: "प्रसव हेरचाह",
    indicators: [
      { value: "INSTITUTIONAL_DELIVERIES", label: "संस्थागत प्रसवको प्रतिशत" },
      { value: "NORMAL_VAGINAL_DELIVERIES", label: "रिपोर्ट गरिएका प्रसवहरू मध्ये सामान्य योनि प्रसवको प्रतिशत" },
      { value: "BIRTHS_ATTENDED_SBA_TRAINED_ANMS", label: "दक्ष जन्म सहायक (एसबीए प्रशिक्षित एएनएम) द्वारा सहायता प्राप्त जन्मको प्रतिशत" },
      { value: "BIRTHS_ATTENDED_SKILLED_HEALTH_PERSONNEL", label: "दक्ष स्वास्थ्य कर्मचारी (एसएचपी) द्वारा सहायता प्राप्त जन्मको प्रतिशत" },
      { value: "BIRTHS_ATTENDED_NON_SBA_SHP", label: "एसबीए र एसएचपी बाहेक अन्य स्वास्थ्यकर्ताबाट सहायता प्राप्त जन्मको प्रतिशत" },
      { value: "ASSISTED_VACUUM_FORCEPS_DELIVERIES", label: "सहायोगपूर्ण (भ्याकुम वा फोर्सेप्स) प्रसवको प्रतिशत" },
      { value: "DELIVERIES_CAESAREAN_SECTION_REPORTED", label: "रिपोर्ट गरिएका प्रसवमध्ये सिजेरियन सेक्शन प्रसवको प्रतिशत" },
      { value: "DELIVERY_BY_CAESAREAN_SECTION", label: "सिजेरियन सेक्शन प्रसवको प्रतिशत" },
      { value: "PREGNANT_WOMEN_HOME_BIRTH_MISOPROSTAL", label: "घरमा जन्म दिएर मिसोप्रोस्टल प्रयोग गर्ने गर्भवती महिलाको प्रतिशत" },
      { value: "DELIVERIES_BELOW_20_YEARS_INSTITUTIONAL", label: "कुल संस्थागत प्रसवमध्ये २० वर्ष मुनिका प्रसवको प्रतिशत" }
    ]
  },
  {
    category: "प्रसव पछि हेरचाह",
    indicators: [
      { value: "WOMEN_PNC_WITHIN_24HRS_DELIVERY", label: "प्रसव पछि २४ घण्टामा पीएनसी प्राप्त गर्ने महिलाको प्रतिशत" },
      { value: "WOMEN_FOUR_POSTNATAL_CHECKUPS_PROTOCOL", label: "प्रोटोकल अनुसार चार सुत्केरीमा जाँच गराउने महिलाको प्रतिशत" },
      { value: "POSTPARTUM_MOTHERS_TWO_PNC_HOME_VISITS", label: "सुत्केरी आमाले दुई पीएनसी घर भ्रमणमा प्राप्त गर्ने प्रतिशत" },
      { value: "POSTPARTUM_MOTHERS_45DAYS_IRON_FOLIC_ACID", label: "४५ दिनको फोलिक एसिड पूरक प्राप्त गर्ने सुत्केरी आमाको प्रतिशत" },
      { value: "POSTPARTUM_MOTHERS_VITAMIN_A", label: "भिटामिन ए पूरक प्राप्त गर्ने सुत्केरी आमाको प्रतिशत" },
      { value: "POSTPARTUM_WOMEN_REFERRED_OBSTETRIC_COMPLICATIONS", label: "प्रसूतिशास्त्रीय जटिलताका कारण रिफर गरिएका सुत्केरी महिलाको प्रतिशत" },
      { value: "POSTPARTUM_MOTHERS_CS_WOUND_INFECTION", label: "सी/एस घाउ संक्रमण भएका सुत्केरी आमाको प्रतिशत" }
    ]
  },
  {
    category: "नवजातक हेरचाह",
    indicators: [
      { value: "NEWBORNS_CHX_APPLIED_AFTER_BIRTH", label: "जन्मेपछि तुरुन्त सीएचएक्स लगाइएका नवजातकको प्रतिशत" },
      { value: "NEWBORNS_CHECKUP_24HRS_BIRTH", label: "जन्मेको २४ घण्टामा जाँच गराउने नवजातकको प्रतिशत" },
      { value: "NEONATES_FOUR_CHECKUPS_PNC_PROTOCOL", label: "पीएनसी प्रोटोकल अनुसार चार जाँच प्राप्त गर्ने नवजातकको प्रतिशत" },
      { value: "NEWBORNS_LOW_BIRTH_WEIGHT", label: "कम जन्म तौल (<२.५ केजी) भएका नवजातकको प्रतिशत" },
      { value: "NEONATES_BIRTH_ASPHYXIA", label: "जन्म श्वासप्रश्वास भएका नवजातकको प्रतिशत" },
      { value: "PRETERM_BIRTH", label: "समय अगाडि जन्मको प्रतिशत" },
      { value: "NEONATES_CONGENITAL_ANOMALIES", label: "जन्मजात विकृति भएका नवजातकको प्रतिशत" },
      { value: "NEONATAL_MORTALITY_HEALTH_FACILITY", label: "स्वास्थ्य संस्थानमा नवजातक मृत्युको प्रतिशत" },
      { value: "STILL_BIRTHS", label: "मृत जन्मको प्रतिशत" }
    ]
  },
  {
    category: "गर्भपात",
    indicators: [
      { value: "PREGNANCIES_TERMINATED_INDUCED_PROCEDURE", label: "स्वास्थ्य संस्थामा प्रेरित प्रविधिबाट अन्त्य गरिएका गर्भको प्रतिशत" },
      { value: "WOMEN_CONTRACEPTIVES_AFTER_ABORTION", label: "गर्भपात पछि गर्भरोधक प्राप्त गर्ने महिलाको प्रतिशत" },
      { value: "WOMEN_COMPLICATIONS_INDUCED_ABORTION", label: "प्रेरित गर्भपातबाट जटिलता भएका महिलाको प्रतिशत" },
      { value: "WOMEN_TREATED_ABORTION_COMPLICATIONS", label: "गर्भपात जटिलताको उपचार गरिएका महिलाको संख्या" }
    ]
  },
  {
    category: "प्रसूति जटिलताहरू",
    indicators: [
      { value: "WOMEN_TREATED_HAEMORRHAGE", label: "रक्तस्रावको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_ANTEPARTUM_HAEMORRHAGE", label: "प्रसव पूर्व रक्तस्राव (APH) को उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_POSTPARTUM_HAEMORRHAGE", label: "प्रसव पछि रक्तस्राव (PPH) को उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_ECTOPIC_PREGNANCY", label: "एक्टोपिक गर्भको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_RUPTURED_UTERUS", label: "गर्भाशय फाटेकोको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_PREECLAMPSIA", label: "प्रि-एक्लाम्पसियाको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_ECLAMPSIA", label: "एक्लाम्पसियाको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_RETAINED_PLACENTA", label: "उल प्लासेन्टाको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_PUERPERAL_SEPSIS", label: "प्यूर्पेरल सेप्सिसको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_TREATED_PROLONGED_OBSTRUCTED_LABOR", label: "दीर्घ/रोकिएको प्रसवको उपचार गरिएका महिलाको संख्या" },
      { value: "WOMEN_OBSTETRIC_COMPLICATIONS_BLOOD_TRANSFUSION", label: "प्रसूति जटिलताका कारण रगत चढाएका महिलाको प्रतिशत" },
      { value: "MET_NEED_EMERGENCY_OBSTETRIC_CARE", label: "आकस्मिक प्रसूति सेवा आवश्यकता पूर्ति" },
      { value: "REPORTED_MATERNAL_DEATHS_HEALTH_FACILITY", label: "स्वास्थ्य संस्थानमा रिपोर्ट गरिएका मातृत्व मृत्युको संख्या" }
    ]
  }
];

// सरल ड्रपडाउनका लागि श्रेणीहरूलाई एकल विकल्प array मा flatten गर्नुहोस्
export const indicatorOptions = indicatorCategories.flatMap(
  (category) => category.indicators,
);
