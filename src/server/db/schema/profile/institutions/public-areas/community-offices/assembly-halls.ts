import { pgTable } from "../../../../../schema/basic";
import {
  integer,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  decimal,
  jsonb,
  time,
  date,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { geometry } from "../../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";
import {
  accessibilityLevelEnum,
  buildingConditionEnum,
  usageFrequencyEnum,
} from "../../common";

import {
  buildingConstructionMaterialEnum,
  managementTypeEnum,
} from "./community-buildings";

// Define assembly hall type enum
export const assemblyHallTypeEnum = pgEnum("assembly_hall_type", [
  "PUBLIC_ASSEMBLY_HALL",
  "COMMUNITY_AUDITORIUM",
  "CONFERENCE_CENTER",
  "PERFORMANCE_HALL",
  "TOWN_HALL",
  "MULTIPURPOSE_HALL",
  "CONVENTION_CENTER",
  "EVENT_VENUE",
  "WEDDING_HALL",
  "CULTURAL_PROGRAM_HALL",
  "EXHIBITION_HALL",
  "OTHER",
]);

// Define assembly hall size enum
export const hallSizeCategoryEnum = pgEnum("hall_size_category", [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "EXTRA_LARGE",
]);

// Define event type enum
export const eventTypeEnum = pgEnum("event_type", [
  "MEETINGS",
  "CONFERENCES",
  "WEDDINGS",
  "CULTURAL_PERFORMANCES",
  "RELIGIOUS_GATHERINGS",
  "GOVERNMENT_FUNCTIONS",
  "TRAINING_PROGRAMS",
  "EXHIBITIONS",
  "CONCERTS",
  "POLITICAL_GATHERINGS",
  "COMMUNITY_GATHERINGS",
  "MIXED_USE",
  "OTHER",
]);

// Assembly Hall table
export const assemblyHall = pgTable("assembly_hall", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(), // For SEO-friendly URLs
  description: text("description"),
  hallType: assemblyHallTypeEnum("hall_type").notNull(),
  primaryUse: eventTypeEnum("primary_use").notNull(),
  sizeCategory: hallSizeCategoryEnum("size_category").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  landmark: text("landmark"), // Nearby landmark

  // Basic information
  establishedYear: integer("established_year"),
  managementType: managementTypeEnum("management_type").notNull(),
  managingBody: text("managing_body"), // Name of the committee/organization managing
  hasNecessaryPermits: boolean("has_necessary_permits").default(true),
  permitsDetails: text("permits_details"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with

  // Physical infrastructure
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingCondition: buildingConditionEnum("building_condition"),
  constructionYear: integer("construction_year"),
  constructionMaterial: buildingConstructionMaterialEnum(
    "construction_material",
  ),
  lastRenovatedYear: integer("last_renovated_year"),
  totalFloors: integer("total_floors"),
  numberOfHalls: integer("number_of_halls"),
  mainHallCapacitySqm: decimal("main_hall_capacity_sqm", {
    precision: 10,
    scale: 2,
  }),
  mainHallCapacityPeople: integer("main_hall_capacity_people"), // Seating capacity
  standingCapacity: integer("standing_capacity"),
  maxOccupancyLimit: integer("max_occupancy_limit"),
  hasStage: boolean("has_stage").default(true),
  stageSizeSqm: decimal("stage_size_sqm", { precision: 10, scale: 2 }),
  hasBackstage: boolean("has_backstage").default(false),
  hasDressingRooms: boolean("has_dressing_rooms").default(false),
  chairsCount: integer("chairs_count"),
  tablesCount: integer("tables_count"),
  hasElevator: boolean("has_elevator").default(false),
  hasFlexibleSeating: boolean("has_flexible_seating").default(false),
  seatingArrangements: text("seating_arrangements"), // Theater, classroom, banquet, etc.

  // Facilities and amenities
  hasAirConditioning: boolean("has_air_conditioning").default(false),
  hasHeating: boolean("has_heating").default(false),
  hasAudioSystem: boolean("has_audio_system").default(true),
  audioSystemDetails: text("audio_system_details"),
  hasLightingSystem: boolean("has_lighting_system").default(true),
  lightingSystemDetails: text("lighting_system_details"),
  hasProjectionSystem: boolean("has_projection_system").default(false),
  projectionSystemDetails: text("projection_system_details"),
  hasWifi: boolean("has_wifi").default(false),
  internetBandwidthMbps: integer("internet_bandwidth_mbps"),
  hasKitchen: boolean("has_kitchen").default(false),
  kitchenFacilities: text("kitchen_facilities"),
  hasDiningArea: boolean("has_dining_area").default(false),
  diningAreaCapacity: integer("dining_area_capacity"),
  hasBar: boolean("has_bar").default(false),
  hasVIPLounge: boolean("has_vip_lounge").default(false),
  hasGreenRoom: boolean("has_green_room").default(false),
  hasControlRoom: boolean("has_control_room").default(false),
  hasTicketingArea: boolean("has_ticketing_area").default(false),
  hasLobby: boolean("has_lobby").default(false),

  // Basic utilities
  hasElectricity: boolean("has_electricity").default(true),
  hasPowerBackup: boolean("has_power_backup").default(false),
  powerBackupType: text("power_backup_type"), // Generator, UPS, Solar, etc.
  hasWaterSupply: boolean("has_water_supply").default(true),
  hasToilets: boolean("has_toilets").default(true),
  maleToiletsCount: integer("male_toilets_count"),
  femaleToiletsCount: integer("female_toilets_count"),
  neutralToiletsCount: integer("neutral_toilets_count"),
  hasHandicapToilets: boolean("has_handicap_toilets").default(false),

  // Accessibility and parking
  accessibilityLevel: accessibilityLevelEnum("accessibility_level"),
  hasWheelchairRamps: boolean("has_wheelchair_ramps").default(false),
  hasAccessibleSeating: boolean("has_accessible_seating").default(false),
  hasParking: boolean("has_parking").default(true),
  parkingCapacity: integer("parking_capacity"),
  hasBusParking: boolean("has_bus_parking").default(false),
  busParakingCapacity: integer("bus_parking_capacity"),
  distanceFromMainRoadKm: decimal("distance_from_main_road_km", {
    precision: 6,
    scale: 2,
  }),
  publicTransportAccessibility: text("public_transport_accessibility"),

  // Usage and operations
  usageFrequency: usageFrequencyEnum("usage_frequency"),
  weeklyBookingsAverage: integer("weekly_bookings_average"),
  monthlyEventsCount: integer("monthly_events_count"),
  annualEventsCount: integer("annual_events_count"),
  peakBookingMonths: text("peak_booking_months"),
  majorAnnualEvents: text("major_annual_events"),
  regularActivities: text("regular_activities"),
  allowsExternalCatering: boolean("allows_external_catering").default(true),
  allowsAlcohol: boolean("allows_alcohol").default(false),
  hasNoiseRestrictions: boolean("has_noise_restrictions").default(true),
  noiseRestrictions: text("noise_restrictions"),
  operatingHours: text("operating_hours"),

  // Booking and fees
  bookingProcedure: text("booking_procedure"),
  hasOnlineBooking: boolean("has_online_booking").default(false),
  onlineBookingUrl: text("online_booking_url"),
  rentalFeeStructure: text("rental_fee_structure"),
  fullDayRateNPR: decimal("full_day_rate_npr", { precision: 10, scale: 2 }),
  halfDayRateNPR: decimal("half_day_rate_npr", { precision: 10, scale: 2 }),
  hourlyRateNPR: decimal("hourly_rate_npr", { precision: 10, scale: 2 }),
  hasDiscountRates: boolean("has_discount_rates").default(false),
  discountCategories: text("discount_categories"), // Community, government, NGO, etc.
  securityDepositRequired: boolean("security_deposit_required").default(true),
  securityDepositAmountNPR: decimal("security_deposit_amount_npr", {
    precision: 10,
    scale: 2,
  }),
  cancellationPolicy: text("cancellation_policy"),
  cancellationFeeNPR: decimal("cancellation_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  additionalServicesOffered: text("additional_services_offered"),
  additionalServicesRates: text("additional_services_rates"),

  // Management and staff
  hasFullTimeManager: boolean("has_full_time_manager").default(false),
  managerContactInfo: text("manager_contact_info"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  cleaningStaffCount: integer("cleaning_staff_count"),
  securityStaffCount: integer("security_staff_count"),
  eventStaffAvailable: boolean("event_staff_available").default(false),
  eventStaffRatesNPR: decimal("event_staff_rates_npr", {
    precision: 10,
    scale: 2,
  }),

  // Security and safety
  hasFireSafetySystem: boolean("has_fire_safety_system").default(true),
  fireSafetyDetails: text("fire_safety_details"),
  hasEmergencyExits: boolean("has_emergency_exits").default(true),
  emergencyExitsCount: integer("emergency_exits_count"),
  hasEvacuationPlan: boolean("has_evacuation_plan").default(false),
  hasFirstAidFacilities: boolean("has_first_aid_facilities").default(false),
  hasDefibrillator: boolean("has_defibrillator").default(false),
  hasSecurity: boolean("has_security").default(true),
  securityType: text("security_type"),
  hasCCTV: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasInsurance: boolean("has_insurance").default(false),
  insuranceType: text("insurance_type"),

  // Financial aspects
  annualOperatingCostNPR: decimal("annual_operating_cost_npr", {
    precision: 18,
    scale: 2,
  }),
  annualRevenueNPR: decimal("annual_revenue_npr", { precision: 18, scale: 2 }),
  maintenanceBudgetNPR: decimal("maintenance_budget_npr", {
    precision: 14,
    scale: 2,
  }),
  utilityBudgetNPR: decimal("utility_budget_npr", { precision: 14, scale: 2 }),
  profitableOperation: boolean("profitable_operation").default(false),
  receivesSubsidies: boolean("receives_subsidies").default(false),
  subsidySourceDetails: text("subsidy_source_details"),
  hasEndowmentFund: boolean("has_endowment_fund").default(false),
  endowmentFundSizeNPR: decimal("endowment_fund_size_npr", {
    precision: 18,
    scale: 2,
  }),
  hasBank: boolean("has_bank_account").default(true),
  bankAccountDetails: text("bank_account_details"),

  // Partnerships and collaborations
  hasRegularPartners: boolean("has_regular_partners").default(false),
  regularPartnerDetails: text("regular_partner_details"),
  hasGovernmentPartnerships: boolean("has_government_partnerships").default(
    false,
  ),
  governmentPartnershipDetails: text("government_partnership_details"),
  hasCorporateSponsors: boolean("has_corporate_sponsors").default(false),
  corporateSponsorDetails: text("corporate_sponsor_details"),
  hasCommunityPartnerships: boolean("has_community_partnerships").default(
    false,
  ),
  communityPartnershipDetails: text("community_partnership_details"),

  // Event support services
  providesEventPlanning: boolean("provides_event_planning").default(false),
  providesCateringServices: boolean("provides_catering_services").default(
    false,
  ),
  cateringOptions: text("catering_options"),
  providesDecorServices: boolean("provides_decor_services").default(false),
  providesAVTechnician: boolean("provides_av_technician").default(false),
  providesPhotographyServices: boolean("provides_photography_services").default(
    false,
  ),
  providesAccommodationInfo: boolean("provides_accommodation_info").default(
    false,
  ),
  nearbyAccommodationDetails: text("nearby_accommodation_details"),

  // Maintenance and renovations
  maintenanceSchedule: text("maintenance_schedule"),
  lastMajorRenovation: date("last_major_renovation"),
  plannedUpgrades: text("planned_upgrades"),
  currentConditionNotes: text("current_condition_notes"),
  cleaningSchedule: text("cleaning_schedule"),

  // Challenges and needs
  operationalChallenges: text("operational_challenges"),
  maintenanceChallenges: text("maintenance_challenges"),
  upgradeNeeds: text("upgrade_needs"),
  competitionChallenges: text("competition_challenges"),

  // Future plans
  expansionPlans: text("expansion_plans"),
  technologicalUpgradePlans: text("technological_upgrade_plans"),
  serviceImprovementPlans: text("service_improvement_plans"),
  sustainabilityPlans: text("sustainability_plans"),

  // Environmental considerations
  environmentalImpactMeasures: text("environmental_impact_measures"),
  energyEfficientFeatures: text("energy_efficient_features"),
  wasteManagementSystem: text("waste_management_system"),
  hasGreenCertification: boolean("has_green_certification").default(false),
  greenCertificationDetails: text("green_certification_details"),

  // Marketing and promotion
  marketingStrategy: text("marketing_strategy"),
  hasDedicatedWebsite: boolean("has_dedicated_website").default(false),
  websiteURL: text("website_url"),
  socialMediaPresence: boolean("social_media_presence").default(false),
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  otherSocialMedia: text("other_social_media"),
  listedOnBookingPlatforms: boolean("listed_on_booking_platforms").default(
    false,
  ),
  bookingPlatformsList: text("booking_platforms_list"),

  // Reviews and reputation
  averageRating: decimal("average_rating", { precision: 3, scale: 1 }), // Out of 5
  reviewSources: text("review_sources"),
  hasTestimonials: boolean("has_testimonials").default(false),
  notableEvents: text("notable_events"), // High-profile events hosted
  awardsReceived: text("awards_received"),

  // Contact information
  bookingContactName: text("booking_contact_name"),
  bookingContactPhone: text("booking_contact_phone"),
  bookingEmailAddress: text("booking_email_address"),
  managerName: text("manager_name"),
  managerPhone: text("manager_phone"),
  managerEmail: text("manager_email"),
  alternateContactName: text("alternate_contact_name"),
  alternateContactPhone: text("alternate_contact_phone"),
  emergencyContactDetails: text("emergency_contact_details"),

  // Linkages to other entities
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),
  linkedCommunityGroups: jsonb("linked_community_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedCulturalGroups: jsonb("linked_cultural_groups").default(
    sql`'[]'::jsonb`,
  ),
  linkedHotels: jsonb("linked_hotels").default(sql`'[]'::jsonb`),
  linkedCateringServices: jsonb("linked_catering_services").default(
    sql`'[]'::jsonb`,
  ),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  buildingFootprint: geometry("building_footprint", { type: "Polygon" }),
  compoundArea: geometry("compound_area", { type: "Polygon" }),
  parkingArea: geometry("parking_area", { type: "Polygon" }),

  // Status and metadata
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  verificationDate: timestamp("verification_date"),
  verifiedBy: varchar("verified_by", { length: 36 }),
  createdAt: timestamp("created_at").default(sql`NOW()`),
  updatedAt: timestamp("updated_at").default(sql`NOW()`),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
});

export type AssemblyHall = typeof assemblyHall.$inferSelect;
export type NewAssemblyHall = typeof assemblyHall.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
