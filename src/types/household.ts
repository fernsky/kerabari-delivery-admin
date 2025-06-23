import { z } from "zod";

export const householdSchema = z.object({
  // Basic Information
  id: z.string().optional(),
  tenant_id: z.string().default("khajura"),
  
  // Location Information
  province: z.string().optional(),
  district: z.string().optional(),
  local_level: z.string().optional(),
  ward_no: z.number().int().optional(),
  house_symbol_no: z.string().optional(),
  family_symbol_no: z.string().optional(),
  household_location: z.array(z.number()).optional(),
  locality: z.string().optional(),
  development_organization: z.string().optional(),
  
  // Family Information
  family_head_name: z.string().min(1, "परिवार मूलीको नाम आवश्यक छ"),
  family_head_phone_no: z.string().optional(),
  total_members: z.number().int().min(1, "परिवार सदस्य संख्या आवश्यक छ").optional(),
  are_members_elsewhere: z.string().optional(),
  total_elsewhere_members: z.number().int().optional(),
  
  // House Details
  house_ownership: z.enum(['own', 'rent', 'relative', 'other']).optional(),
  house_ownership_other: z.string().optional(),
  land_ownership: z.enum(['own', 'rent', 'government', 'other']).optional(),
  house_base: z.enum(['concrete', 'stone', 'mud', 'other']).optional(),
  house_base_other: z.string().optional(),
  house_outer_wall: z.enum(['brick', 'concrete', 'wood', 'bamboo', 'other']).optional(),
  house_outer_wall_other: z.string().optional(),
  house_roof: z.enum(['rcc', 'tin', 'tile', 'straw', 'other']).optional(),
  house_roof_other: z.string().optional(),
  house_floor: z.enum(['concrete', 'tile', 'mud', 'wood', 'other']).optional(),
  house_floor_other: z.string().optional(),
  is_house_passed: z.enum(['yes', 'no', 'unknown']).optional(),
  is_earthquake_resistant: z.enum(['yes', 'no', 'unknown']).optional(), // Added this missing field
  disaster_risk_status: z.enum(['safe', 'flood_risk', 'landslide_risk', 'fire_risk', 'other']).optional(), // Added this missing field
  house_floors: z.number().int().optional(), // Added this missing field
  room_count: z.number().int().optional(), // Added this missing field
  
  // Safety and Facilities
  natural_disasters: z.array(z.string()).optional(),
  is_safe: z.string().optional(),
  
  // Water, Sanitation and Energy
  water_source: z.string().optional(),
  water_purification_methods: z.array(z.string()).optional(),
  toilet_type: z.string().optional(),
  solid_waste_management: z.string().optional(),
  primary_cooking_fuel: z.string().optional(),
  primary_energy_source: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  
  // Accessibility
  road_status: z.string().optional(),
  time_to_public_bus: z.string().optional(),
  time_to_market: z.string().optional(),
  distance_to_active_road: z.string().optional(),
  
  // Economic Details
  has_properties_elsewhere: z.string().optional(),
  has_female_named_properties: z.string().optional(),
  organizations_loaned_from: z.array(z.string()).optional(),
  loan_uses: z.array(z.string()).optional(),
  time_to_bank: z.string().optional(),
  financial_accounts: z.array(z.string()).optional(),
  income_sources: z.array(z.string()).optional(),
  have_remittance: z.string().optional(),
  remittance_expenses: z.array(z.string()).optional(),
  
  // Health
  have_health_insurance: z.string().optional(),
  consulting_health_organization: z.string().optional(),
  time_to_health_organization: z.string().optional(),
  
  // Municipal & Suggestions
  municipal_suggestions: z.array(z.string()).optional(),
  
  // Agriculture & Livestock
  have_agricultural_land: z.string().optional(),
  agricultural_lands: z.array(z.string()).optional(),
  are_involved_in_agriculture: z.string().optional(),
  food_crops: z.array(z.string()).optional(),
  pulses: z.array(z.string()).optional(),
  oil_seeds: z.array(z.string()).optional(),
  vegetables: z.array(z.string()).optional(),
  fruits: z.array(z.string()).optional(),
  spices: z.array(z.string()).optional(),
  cash_crops: z.array(z.string()).optional(),
  are_involved_in_husbandry: z.string().optional(),
  animals: z.array(z.string()).optional(),
  animal_products: z.array(z.string()).optional(),
  
  // Aquaculture & Apiary
  have_aquaculture: z.string().optional(),
  pond_number: z.number().int().optional(),
  pond_area: z.number().optional(),
  fish_production: z.number().optional(),
  have_apiary: z.string().optional(),
  hive_number: z.number().int().optional(),
  honey_production: z.number().optional(),
  honey_sales: z.number().optional(),
  honey_revenue: z.number().optional(),
  
  // Agricultural Operations
  has_agricultural_insurance: z.string().optional(),
  months_involved_in_agriculture: z.string().optional(),
  agricultural_machines: z.array(z.string()).optional(),
  
  // Migration Details
  birth_place: z.string().optional(),
  birth_province: z.string().optional(),
  birth_district: z.string().optional(),
  birth_country: z.string().optional(),
  prior_location: z.string().optional(),
  prior_province: z.string().optional(),
  prior_district: z.string().optional(),
  prior_country: z.string().optional(),
  residence_reason: z.string().optional(),
  
  // Business
  has_business: z.string().optional(),
  
  // Survey Details
  date_of_interview: z.date().optional(),
  device_id: z.string().optional(),
});

export type Household = z.infer<typeof householdSchema>;

export const HOUSEHOLD_STEPS = [
  "आधारभूत जानकारी",
  "परिवार विवरण",
  "घरको विवरण",
  "पानी तथा सरसफाई",
  "आर्थिक विवरण",
  "कृषि विवरण",
  "बसाइँसराई विवरण",
  "समीक्षा"
] as const;

export type HouseholdStep = (typeof HOUSEHOLD_STEPS)[number];

// For compatibility with the existing English step names in the component
export const STEP_MAPPING: Record<string, HouseholdStep> = {
  "Basic Information": "आधारभूत जानकारी",
  "Family Details": "परिवार विवरण",
  "House Details": "घरको विवरण",
  "Water & Sanitation": "पानी तथा सरसफाई",
  "Economic Details": "आर्थिक विवरण",
  "Agricultural Details": "कृषि विवरण",
  "Migration Details": "बसाइँसराई विवरण",
  "Review": "समीक्षा",
};
