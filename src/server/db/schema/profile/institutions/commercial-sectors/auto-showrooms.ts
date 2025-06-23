import { pgTable } from "../../../../schema/basic";
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
import { geometry } from "../../../../geographical";
import { generateSlug } from "@/server/utils/slug-helpers";

// Define showroom type enum
export const showroomTypeEnum = pgEnum("showroom_type", [
  "NEW_VEHICLES",
  "USED_VEHICLES",
  "MIXED_VEHICLES",
  "TWO_WHEELER",
  "FOUR_WHEELER",
  "COMMERCIAL_VEHICLES",
  "HEAVY_EQUIPMENT",
  "MULTI_BRAND",
  "SINGLE_BRAND",
  "OTHER",
]);

// Define showroom size category enum
export const showroomSizeCategoryEnum = pgEnum("showroom_size_category", [
  "SMALL",
  "MEDIUM",
  "LARGE",
  "FLAGSHIP",
]);

// Define business volume enum
export const businessVolumeEnum = pgEnum("business_volume", [
  "VERY_HIGH",
  "HIGH",
  "MODERATE",
  "LOW",
  "VERY_LOW",
]);

// Define facility condition enum
export const facilityConditionEnum = pgEnum("facility_condition", [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
  "UNDER_RENOVATION",
]);

// Auto Showroom table
export const autoShowroom = pgTable("auto_showroom", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  showroomType: showroomTypeEnum("showroom_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestLandmark: text("nearest_landmark"),
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  gpsCoordinates: text("gps_coordinates"),

  // Basic information
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  panVatNumber: varchar("pan_vat_number", { length: 20 }),
  sizeCategory: showroomSizeCategoryEnum("size_category"),
  isFranchise: boolean("is_franchise").default(false),
  franchiseDetails: text("franchise_details"),
  isAuthorizedDealer: boolean("is_authorized_dealer").default(false),
  parentCompanyDistributor: text("parent_company_distributor"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  customerServiceNumber: text("customer_service_number"),
  email: text("email"),
  salesEmail: text("sales_email"),
  serviceEmail: text("service_email"),
  websiteUrl: text("website_url"),

  // Social media presence
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  youtubeChannel: text("youtube_channel"),
  otherSocialMedia: text("other_social_media"),

  // Ownership and management
  ownerName: text("owner_name"),
  ownerContactDetails: text("owner_contact_details"),
  managingDirectorName: text("managing_director_name"),
  parentCompanyName: text("parent_company_name"),
  ownershipType: text("ownership_type"), // Partnership, Private Limited, etc.

  // Operating hours
  openingTime: time("opening_time"),
  closingTime: time("closing_time"),
  weeklyOffDays: text("weekly_off_days"),
  isOpenOnPublicHolidays: boolean("is_open_on_public_holidays").default(false),
  specialOperatingHoursNotes: text("special_operating_hours_notes"),

  // Facility details
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  showroomAreaSqm: decimal("showroom_area_sq_m", { precision: 10, scale: 2 }),
  displayCapacityVehicles: integer("display_capacity_vehicles"),
  facilityCondition: facilityConditionEnum("facility_condition"),
  lastRenovationYear: integer("last_renovation_year"),
  hasMultipleFloors: boolean("has_multiple_floors").default(false),
  totalFloors: integer("total_floors"),
  hasDisplay: boolean("has_display_windows").default(true),
  hasWaitingArea: boolean("has_waiting_area").default(true),
  waitingAreaCapacity: integer("waiting_area_capacity"),
  hasCustomerLounge: boolean("has_customer_lounge").default(false),
  hasRefreshmentArea: boolean("has_refreshment_area").default(false),
  hasKidsPlayArea: boolean("has_kids_play_area").default(false),
  hasDigitalDisplay: boolean("has_digital_display").default(false),
  hasProductionInfoDesk: boolean("has_product_info_desk").default(false),

  // Vehicle information
  vehicleBrands: jsonb("vehicle_brands").default(sql`'[]'::jsonb`),
  primaryVehicleBrand: text("primary_vehicle_brand"),
  vehicleTypes: jsonb("vehicle_types").default(sql`'[]'::jsonb`), // SUV, Sedan, Hatchback, etc.
  vehicleSegments: jsonb("vehicle_segments").default(sql`'[]'::jsonb`), // Luxury, Budget, Mid-range, etc.
  newVehicleDisplayCount: integer("new_vehicle_display_count"),
  usedVehicleDisplayCount: integer("used_vehicle_display_count"),
  topSellingModels: jsonb("top_selling_models").default(sql`'[]'::jsonb`),
  priceRangeMinimumNPR: decimal("price_range_minimum_npr", {
    precision: 14,
    scale: 2,
  }),
  priceRangeMaximumNPR: decimal("price_range_maximum_npr", {
    precision: 14,
    scale: 2,
  }),
  hasElectricVehicles: boolean("has_electric_vehicles").default(false),
  electricVehicleCount: integer("electric_vehicle_count"),

  // Services offered
  hasSalesConsultants: boolean("has_sales_consultants").default(true),
  salesConsultantCount: integer("sales_consultant_count"),
  hasTestDriveFacility: boolean("has_test_drive_facility").default(true),
  testDriveVehicleCount: integer("test_drive_vehicle_count"),
  offersTradingFacility: boolean("offers_trading_facility").default(false),
  hasFinancingOptions: boolean("has_financing_options").default(true),
  financingPartners: jsonb("financing_partners").default(sql`'[]'::jsonb`),
  hasInsuranceServices: boolean("has_insurance_services").default(true),
  insurancePartners: jsonb("insurance_partners").default(sql`'[]'::jsonb`),
  hasVehicleRegistrationAssistance: boolean(
    "has_vehicle_registration_assistance",
  ).default(true),
  hasWarrantyServices: boolean("has_warranty_services").default(true),
  warrantyDetails: text("warranty_details"),
  hasExtendedWarrantyOptions: boolean("has_extended_warranty_options").default(
    false,
  ),
  extendedWarrantyDetails: text("extended_warranty_details"),
  offersDoorDelivery: boolean("offers_door_delivery").default(false),

  // Service center
  hasServiceCenter: boolean("has_service_center").default(false),
  serviceCenter: text("service_center"),
  serviceCenterAtSameLocation: boolean(
    "service_center_at_same_location",
  ).default(false),
  serviceCenterDistanceKm: decimal("service_center_distance_km", {
    precision: 6,
    scale: 2,
  }),
  serviceCenterCapacityPerDay: integer("service_center_capacity_per_day"),
  hasExpressService: boolean("has_express_service").default(false),
  hasMobileService: boolean("has_mobile_service").default(false),
  hasPickupDropService: boolean("has_pickup_drop_service").default(false),
  offersCostEstimateBeforeService: boolean(
    "offers_cost_estimate_before_service",
  ).default(false),
  hasBrandTrainedTechnicians: boolean("has_brand_trained_technicians").default(
    false,
  ),
  trainedTechnicianCount: integer("trained_technician_count"),

  // Spare parts
  hasSpareParts: boolean("has_spare_parts").default(false),
  sparePartsInventoryValueNPR: decimal("spare_parts_inventory_value_npr", {
    precision: 14,
    scale: 2,
  }),
  offersFastMovingParts: boolean("offers_fast_moving_parts").default(false),
  hasOEMParts: boolean("has_oem_parts").default(true),
  hasAftermarketParts: boolean("has_aftermarket_parts").default(false),
  sparePartsDeliveryTimelineDays: decimal(
    "spare_parts_delivery_timeline_days",
    { precision: 5, scale: 2 },
  ),

  // Accessories
  hasAccessoriesShop: boolean("has_accessories_shop").default(false),
  accessoryTypes: jsonb("accessory_types").default(sql`'[]'::jsonb`),
  offerCustomAccessories: boolean("offer_custom_accessories").default(false),

  // Customer service
  hasDedicatedCustomerService: boolean(
    "has_dedicated_customer_service",
  ).default(false),
  customerServiceStaffCount: integer("customer_service_staff_count"),
  has24HourHelpline: boolean("has_24_hour_helpline").default(false),
  helplineNumber: text("helpline_number"),
  hasRoadAssistance: boolean("has_road_assistance").default(false),
  roadAssistanceDetails: text("road_assistance_details"),
  hasCustomerFeedbackSystem: boolean("has_customer_feedback_system").default(
    false,
  ),
  averageCustomerSatisfactionRating: decimal(
    "average_customer_satisfaction_rating",
    { precision: 3, scale: 1 },
  ), // Out of 5

  // Sales information
  averageMonthlyVisitors: integer("average_monthly_visitors"),
  averageMonthlyInquiries: integer("average_monthly_inquiries"),
  averageMonthlySalesCount: integer("average_monthly_sales_count"),
  annualSalesCountPreviousYear: integer("annual_sales_count_previous_year"),
  annualSalesGrowthPercent: decimal("annual_sales_growth_percent", {
    precision: 5,
    scale: 2,
  }),
  marketSharePercentage: decimal("market_share_percentage", {
    precision: 5,
    scale: 2,
  }),
  salesTargetAchievementPercent: decimal("sales_target_achievement_percent", {
    precision: 5,
    scale: 2,
  }),
  topSellingSegment: text("top_selling_segment"),
  businessVolume: businessVolumeEnum("business_volume"),
  peakSalesMonths: text("peak_sales_months"),
  lowSalesMonths: text("low_sales_months"),

  // Staff and human resources
  totalStaffCount: integer("total_staff_count"),
  salesStaffCount: integer("sales_staff_count"),
  administrativeStaffCount: integer("administrative_staff_count"),
  technicalStaffCount: integer("technical_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  staffTrainingFrequency: text("staff_training_frequency"),
  hasIncentiveProgram: boolean("has_incentive_program").default(true),
  incentiveProgramDetails: text("incentive_program_details"),

  // Marketing and promotions
  marketingBudgetPercentage: decimal("marketing_budget_percentage", {
    precision: 5,
    scale: 2,
  }),
  advertisingChannels: jsonb("advertising_channels").default(sql`'[]'::jsonb`),
  hasLoyaltyProgram: boolean("has_loyalty_program").default(false),
  loyaltyProgramDetails: text("loyalty_program_details"),
  organizesCommunityEvents: boolean("organizes_community_events").default(
    false,
  ),
  communityEventDetails: text("community_event_details"),
  hasCarShowsParticipation: boolean("has_car_shows_participation").default(
    false,
  ),
  carShowDetails: text("car_show_details"),

  // Technology adoption
  hasCRM: boolean("has_crm").default(false),
  crmSystem: text("crm_system"),
  hasDigitalSalesTools: boolean("has_digital_sales_tools").default(false),
  digitalSalesToolDetails: text("digital_sales_tool_details"),
  hasOnlineBookingSystem: boolean("has_online_booking_system").default(false),
  hasVirtualShowroomTour: boolean("has_virtual_showroom_tour").default(false),
  hasDigitalCatalog: boolean("has_digital_catalog").default(false),

  // Security and facilities
  hasCCTV: boolean("has_cctv").default(true),
  cctvCameraCount: integer("cctv_camera_count"),
  hasSecurityPersonnel: boolean("has_security_personnel").default(true),
  securityPersonnelCount: integer("security_personnel_count"),
  hasFireSafetySystem: boolean("has_fire_safety_system").default(true),
  fireSafetyEquipment: text("fire_safety_equipment"),
  hasParking: boolean("has_parking").default(true),
  customerParkingSpaces: integer("customer_parking_spaces"),
  staffParkingSpaces: integer("staff_parking_spaces"),
  hasDisplayVehicleParking: boolean("has_display_vehicle_parking").default(
    true,
  ),
  displayVehicleParkingCapacity: integer("display_vehicle_parking_capacity"),
  hasEVChargingStation: boolean("has_ev_charging_station").default(false),
  evChargingStationCount: integer("ev_charging_station_count"),

  // Financial aspects
  annualTurnoverNPR: decimal("annual_turnover_npr", {
    precision: 18,
    scale: 2,
  }),
  profitMarginPercentage: decimal("profit_margin_percentage", {
    precision: 5,
    scale: 2,
  }),
  inventoryValueNPR: decimal("inventory_value_npr", {
    precision: 18,
    scale: 2,
  }),
  averageInventoryDays: integer("average_inventory_days"),
  paymentMethodsAccepted: jsonb("payment_methods_accepted").default(
    sql`'[]'::jsonb`,
  ),
  acceptsDigitalPayments: boolean("accepts_digital_payments").default(true),
  digitalPaymentOptions: jsonb("digital_payment_options").default(
    sql`'[]'::jsonb`,
  ),
  offerEMIOptions: boolean("offer_emi_options").default(true),
  minimumDownPaymentPercentage: decimal("minimum_down_payment_percentage", {
    precision: 5,
    scale: 2,
  }),

  // Sustainability practices
  hasGreenInitiatives: boolean("has_green_initiatives").default(false),
  greenInitiativeDetails: text("green_initiative_details"),
  hasWasteManagement: boolean("has_waste_management").default(false),
  wasteManagementDetails: text("waste_management_details"),
  usesRenewableEnergy: boolean("uses_renewable_energy").default(false),
  renewableEnergyDetails: text("renewable_energy_details"),
  hasWaterConservation: boolean("has_water_conservation").default(false),
  waterConservationDetails: text("water_conservation_details"),
  offersPaperlessTransactions: boolean("offers_paperless_transactions").default(
    false,
  ),

  // Regulatory compliance
  hasAllRequiredPermits: boolean("has_all_required_permits").default(true),
  requiredPermits: jsonb("required_permits").default(sql`'[]'::jsonb`),
  lastComplianceCheckDate: date("last_compliance_check_date"),
  complianceIssues: text("compliance_issues"),
  regulatoryChallenges: text("regulatory_challenges"),

  // Future plans and developments
  expansionPlans: text("expansion_plans"),
  upcomingVehicleModels: jsonb("upcoming_vehicle_models").default(
    sql`'[]'::jsonb`,
  ),
  plannedFacilityUpgrades: text("planned_facility_upgrades"),
  futureInvestmentPlansNPR: decimal("future_investment_plans_npr", {
    precision: 18,
    scale: 2,
  }),
  anticipatedMarketTrends: text("anticipated_market_trends"),

  // Challenges and competition
  majorChallenges: text("major_challenges"),
  competitorAnalysis: text("competitor_analysis"),
  nearestCompetitorDistanceKm: decimal("nearest_competitor_distance_km", {
    precision: 6,
    scale: 2,
  }),
  marketDifferentiators: text("market_differentiators"),

  // Local economic impact
  employmentGenerated: integer("employment_generated"),
  localEmploymentPercentage: integer("local_employment_percentage"),
  contributionToLocalEconomyNPR: decimal("contribution_to_local_economy_npr", {
    precision: 18,
    scale: 2,
  }),
  communityDevelopmentInitiatives: text("community_development_initiatives"),

  // Linkages to other entities
  linkedServiceCenters: jsonb("linked_service_centers").default(
    sql`'[]'::jsonb`,
  ),
  linkedSparePartsDealers: jsonb("linked_spare_parts_dealers").default(
    sql`'[]'::jsonb`,
  ),
  linkedFinancialInstitutions: jsonb("linked_financial_institutions").default(
    sql`'[]'::jsonb`,
  ),
  linkedInsuranceProviders: jsonb("linked_insurance_providers").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  showroomArea: geometry("showroom_area", { type: "Polygon" }),

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

export type AutoShowroom = typeof autoShowroom.$inferSelect;
export type NewAutoShowroom = typeof autoShowroom.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
