import {
  pgTable,
  timestamp,
  pgEnum,
  text,
  varchar,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { postgis } from "../../postgis";

export const businessStatusEnum = pgEnum("business_status_enum", [
  "approved",
  "pending",
  "requested_for_edit",
  "rejected",
]);

// Main business table based on the JSON schema
export const business = pgTable("acme_khajura_business", {
  // Primary identification
  id: text("id").primaryKey().notNull(),
  wardNo: integer("ward_no").notNull(),
  tenantId: text("tenant_id"),
  deviceId: text("device_id").notNull(),

  // Location and basic information
  businessLocation: text("business_location").array(),
  dateOfInterview: timestamp("date_of_interview"),
  businessName: text("business_name"),
  businessProvince: text("business_province"),
  businessDistrict: text("business_district"),
  businessLocalLevel: text("business_local_level"),
  businessLocality: text("business_locality"),

  // Operator details
  operatorName: text("operator_name"),
  operatorPhone: text("operator_phone"),
  operatorAge: integer("operator_age"),
  operatorGender: text("operator_gender"),
  operatorEducationalLevel: text("operator_educational_level"),

  // Business classification
  businessNature: text("business_nature"),
  businessNatureOther: text("business_nature_other"),
  businessType: text("business_type"),
  businessTypeOther: text("business_type_other"),

  // Registration and legal information
  isBusinessRegistered: text("is_business_registered"),
  registeredBodies: text("registered_bodies").array(),
  registeredBodiesOther: text("registered_bodies_other").array(),
  statutoryStatus: text("statutory_status"),
  statutoryStatusOther: text("statutory_status_other"),
  hasPanNumber: text("has_pan_number"),
  panNumber: integer("pan_number"),

  // Ownership and property information
  businessOwnershipStatus: text("business_ownership_status"),
  businessOwnershipStatusOther: text("business_ownership_status_other"),
  businessLocationOwnership: text("business_location_ownership"),
  businessLocationOwnershipOther: text("business_location_ownership_other"),

  // Hotel-specific information
  hotelAccomodationType: text("hotel_accomodation_type"),
  hotelRoomNumbers: integer("hotel_room_numbers"),
  hotelBedNumbers: integer("hotel_bed_numbers"),
  hotelRoomTypes: text("hotel_room_types").array(),

  // Agricultural business details
  agriculturalBusinesses: text("agricultural_businesses").array(),
  businessFoodCrops: text("business_food_crops").array(),
  businessPulses: text("business_pulses").array(),
  businessOilSeeds: text("business_oil_seeds").array(),
  businessVegetables: text("business_vegetables").array(),
  businessFruits: text("business_fruits").array(),
  businessSpices: text("business_spices").array(),
  businessCashCrops: text("business_cash_crops").array(),
  businessAnimals: text("business_animals").array(),
  businessAnimalProducts: text("business_animal_products").array(),

  // Financial information
  businessInvestment: real("business_investment"),
  businessProfit: real("business_profit"),
  businessPastYearInvestment: real("business_past_year_investment"),

  // Partner information
  hasBusinessPartners: text("has_business_partners"),
  totalPartners: integer("total_partners"),
  nepaliMalePartners: integer("nepali_male_partners"),
  nepaliFemalePartners: integer("nepali_female_partners"),
  hasForeignPartners: text("has_foreign_partners"),
  foreignMalePartners: integer("foreign_male_partners"),
  foreignFemalePartners: integer("foreign_female_partners"),

  // Family involvement
  hasInvolvedFamily: text("has_involved_family"),
  totalInvolvedFamily: integer("total_involved_family"),
  maleInvolvedFamily: integer("male_involved_family"),
  femaleInvolvedFamily: integer("female_involved_family"),

  // Permanent employee information
  hasPermanentEmployees: text("has_permanent_employees"),
  totalPermanentEmployees: integer("total_permanent_employees"),
  nepaliMalePermanentEmployees: integer("nepali_male_permanent_employees"),
  nepaliFemalePermanentEmployees: integer("nepali_female_permanent_employees"),
  hasForeignPermanentEmployees: text("has_foreign_permanent_employees"),
  foreignMalePermanentEmployees: integer("foreign_male_permanent_employees"),
  foreignFemalePermanentEmployees: integer("foreign_female_permanent_employees"),
  foreignPermanentEmployeeCountries: text("foreign_permanent_employee_countries").array(),

  // Temporary employee information
  hasTemporaryEmployees: text("has_temporary_employees"),
  totalTemporaryEmployees: integer("total_temporary_employees"),
  nepaliMaleTemporaryEmployees: integer("nepali_male_temporary_employees"),
  nepaliTemporaryFemaleEmployees: integer("nepali_female_temporary_employees"),
  hasForeignTemporaryEmployees: text("has_foreign_temporary_employees"),
  foreignMaleTemporaryEmployees: integer("foreign_male_temporary_employees"),
  foreignFemaleTemporaryEmployees: integer("foreign_female_temporary_employees"),
  foreignTemporaryEmployeeCountries: text("foreign_temporary_employee_countries").array(),

  // Geospatial data
  geom: postgis("geom"),
  name: text("name"),

  // Status field
  status: businessStatusEnum("status").default("pending"),
});

// Staging table for business data validation
export const stagingBusiness = pgTable("staging_acme_khajura_businesses", {
  // Primary identification
  id: text("id").primaryKey().notNull(),
  wardNo: integer("ward_no").notNull(),
  tenantId: text("tenant_id"),
  deviceId: text("device_id").notNull(),

  // Location and basic information
  businessLocation: text("business_location").array(),
  dateOfInterview: timestamp("date_of_interview"),
  businessName: text("business_name"),
  businessProvince: text("business_province"),
  businessDistrict: text("business_district"),
  businessLocalLevel: text("business_local_level"),
  businessLocality: text("business_locality"),

  // Operator details
  operatorName: text("operator_name"),
  operatorPhone: text("operator_phone"),
  operatorAge: integer("operator_age"),
  operatorGender: text("operator_gender"),
  operatorEducationalLevel: text("operator_educational_level"),

  // Business classification
  businessNature: text("business_nature"),
  businessNatureOther: text("business_nature_other"),
  businessType: text("business_type"),
  businessTypeOther: text("business_type_other"),

  // Registration and legal information
  isBusinessRegistered: text("is_business_registered"),
  registeredBodies: text("registered_bodies").array(),
  registeredBodiesOther: text("registered_bodies_other").array(),
  statutoryStatus: text("statutory_status"),
  statutoryStatusOther: text("statutory_status_other"),
  hasPanNumber: text("has_pan_number"),
  panNumber: integer("pan_number"),

  // Ownership and property information
  businessOwnershipStatus: text("business_ownership_status"),
  businessOwnershipStatusOther: text("business_ownership_status_other"),
  businessLocationOwnership: text("business_location_ownership"),
  businessLocationOwnershipOther: text("business_location_ownership_other"),

  // Hotel-specific information
  hotelAccomodationType: text("hotel_accomodation_type"),
  hotelRoomNumbers: integer("hotel_room_numbers"),
  hotelBedNumbers: integer("hotel_bed_numbers"),
  hotelRoomTypes: text("hotel_room_types").array(),

  // Agricultural business details
  agriculturalBusinesses: text("agricultural_businesses").array(),
  businessFoodCrops: text("business_food_crops").array(),
  businessPulses: text("business_pulses").array(),
  businessOilSeeds: text("business_oil_seeds").array(),
  businessVegetables: text("business_vegetables").array(),
  businessFruits: text("business_fruits").array(),
  businessSpices: text("business_spices").array(),
  businessCashCrops: text("business_cash_crops").array(),
  businessAnimals: text("business_animals").array(),
  businessAnimalProducts: text("business_animal_products").array(),

  // Financial information
  businessInvestment: real("business_investment"),
  businessProfit: real("business_profit"),
  businessPastYearInvestment: real("business_past_year_investment"),

  // Partner information
  hasBusinessPartners: text("has_business_partners"),
  totalPartners: integer("total_partners"),
  nepaliMalePartners: integer("nepali_male_partners"),
  nepaliFemalePartners: integer("nepali_female_partners"),
  hasForeignPartners: text("has_foreign_partners"),
  foreignMalePartners: integer("foreign_male_partners"),
  foreignFemalePartners: integer("foreign_female_partners"),

  // Family involvement
  hasInvolvedFamily: text("has_involved_family"),
  totalInvolvedFamily: integer("total_involved_family"),
  maleInvolvedFamily: integer("male_involved_family"),
  femaleInvolvedFamily: integer("female_involved_family"),

  // Permanent employee information
  hasPermanentEmployees: text("has_permanent_employees"),
  totalPermanentEmployees: integer("total_permanent_employees"),
  nepaliMalePermanentEmployees: integer("nepali_male_permanent_employees"),
  nepaliFemalePermanentEmployees: integer("nepali_female_permanent_employees"),
  hasForeignPermanentEmployees: text("has_foreign_permanent_employees"),
  foreignMalePermanentEmployees: integer("foreign_male_permanent_employees"),
  foreignFemalePermanentEmployees: integer("foreign_female_permanent_employees"),
  foreignPermanentEmployeeCountries: text("foreign_permanent_employee_countries").array(),

  // Temporary employee information
  hasTemporaryEmployees: text("has_temporary_employees"),
  totalTemporaryEmployees: integer("total_temporary_employees"),
  nepaliMaleTemporaryEmployees: integer("nepali_male_temporary_employees"),
  nepaliTemporaryFemaleEmployees: integer("nepali_female_temporary_employees"),
  hasForeignTemporaryEmployees: text("has_foreign_temporary_employees"),
  foreignMaleTemporaryEmployees: integer("foreign_male_temporary_employees"),
  foreignFemaleTemporaryEmployees: integer("foreign_female_temporary_employees"),
  foreignTemporaryEmployeeCountries: text("foreign_temporary_employee_countries").array(),

  // Geospatial data
  geom: postgis("geom"),
  name: text("name"),
});

// Edit requests table for business
export const businessEditRequests = pgTable("acme_khajura_business_edit_requests", {
  id: varchar("id", { length: 48 }).primaryKey(),
  businessId: varchar("business_id", { length: 48 }).references(() => business.id),
  message: text("message").notNull(),
  requestedAt: timestamp("requested_at").defaultNow(),
});

// Export types for TypeScript
export type Business = typeof business.$inferSelect;
export type NewBusiness = typeof business.$inferInsert;
export type StagingBusiness = typeof stagingBusiness.$inferSelect;
export type BusinessEditRequest = typeof businessEditRequests.$inferSelect;
