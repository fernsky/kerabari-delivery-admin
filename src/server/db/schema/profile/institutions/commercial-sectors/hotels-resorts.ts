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

// Define hotel type enum
export const hotelTypeEnum = pgEnum("hotel_type", [
  "LUXURY_HOTEL",
  "BUSINESS_HOTEL",
  "RESORT",
  "BOUTIQUE_HOTEL",
  "BUDGET_HOTEL",
  "MOTEL",
  "GUEST_HOUSE",
  "HOMESTAY",
  "HERITAGE_HOTEL",
  "ECO_RESORT",
  "APARTMENT_HOTEL",
  "OTHER",
]);

// Define hotel star rating enum
export const hotelStarRatingEnum = pgEnum("hotel_star_rating", [
  "ONE_STAR",
  "TWO_STAR",
  "THREE_STAR",
  "FOUR_STAR",
  "FIVE_STAR",
  "UNRATED",
]);

// Define hotel size category enum
export const hotelSizeCategoryEnum = pgEnum("hotel_size_category", [
  "SMALL", // < 50 rooms
  "MEDIUM", // 50-150 rooms
  "LARGE", // 151-300 rooms
  "VERY_LARGE", // > 300 rooms
]);

// Define occupancy level enum
export const occupancyLevelEnum = pgEnum("occupancy_level", [
  "VERY_HIGH", // >80%
  "HIGH", // 61-80%
  "MODERATE", // 41-60%
  "LOW", // 20-40%
  "VERY_LOW", // <20%
]);

// Define management type enum
export const hotelManagementTypeEnum = pgEnum("hotel_management_type", [
  "INDEPENDENTLY_OWNED_AND_OPERATED",
  "CHAIN_OPERATED",
  "FRANCHISE",
  "MANAGEMENT_CONTRACT",
  "LEASED",
  "REFERRAL_GROUP",
  "JOINT_VENTURE",
  "OTHER",
]);

// Hotel and Resort table
export const hotelResort = pgTable("hotel_resort", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description"),
  hotelType: hotelTypeEnum("hotel_type").notNull(),

  // Location details
  wardNumber: integer("ward_number"),
  location: text("location"), // Village/Tole/Area name
  address: text("address"),
  nearestLandmark: text("nearest_landmark"),
  distanceFromCityOrBazarKm: decimal("distance_from_city_or_bazar_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromAirportKm: decimal("distance_from_airport_km", {
    precision: 6,
    scale: 2,
  }),
  distanceFromBusStationKm: decimal("distance_from_bus_station_km", {
    precision: 6,
    scale: 2,
  }),
  gpsCoordinates: text("gps_coordinates"),

  // Basic information
  establishedYear: integer("established_year"),
  registrationNumber: varchar("registration_number", { length: 50 }),
  registeredWith: text("registered_with"), // Which govt body it's registered with
  panVatNumber: varchar("pan_vat_number", { length: 20 }),
  tourismLicenseNumber: varchar("tourism_license_number", { length: 50 }),
  starRating: hotelStarRatingEnum("star_rating"),
  managementType: hotelManagementTypeEnum("management_type"),
  chainAffiliation: text("chain_affiliation"),
  managingCompany: text("managing_company"),
  sizeCategory: hotelSizeCategoryEnum("size_category"),

  // Contact information
  phoneNumber: text("phone_number"),
  alternatePhoneNumber: text("alternate_phone_number"),
  emergencyContactNumber: text("emergency_contact_number"),
  reservationPhone: text("reservation_phone"),
  email: text("email"),
  reservationEmail: text("reservation_email"),
  websiteUrl: text("website_url"),

  // Social media presence
  facebookPage: text("facebook_page"),
  instagramHandle: text("instagram_handle"),
  twitterHandle: text("twitter_handle"),
  tripAdvisorUrl: text("trip_advisor_url"),
  bookingComUrl: text("booking_com_url"),
  otherOnlineListings: text("other_online_listings"),

  // Ownership and management
  ownerName: text("owner_name"),
  ownerContactDetails: text("owner_contact_details"),
  generalManagerName: text("general_manager_name"),
  generalManagerContact: text("general_manager_contact"),

  // Property details
  totalAreaSqm: decimal("total_area_sq_m", { precision: 10, scale: 2 }),
  buildingAreaSqm: decimal("building_area_sq_m", { precision: 10, scale: 2 }),
  totalFloors: integer("total_floors"),
  buildingAge: integer("building_age"),
  lastRenovationYear: integer("last_renovation_year"),
  architectureStyle: text("architecture_style"),
  buildingMaterials: text("building_materials"),
  hasElevator: boolean("has_elevator").default(false),
  elevatorCount: integer("elevator_count"),
  hasDisabilityAccess: boolean("has_disability_access").default(false),

  // Accommodation details
  totalRoomCount: integer("total_room_count"),
  standardRoomCount: integer("standard_room_count"),
  deluxeRoomCount: integer("deluxe_room_count"),
  suiteRoomCount: integer("suite_room_count"),
  familyRoomCount: integer("family_room_count"),
  dormitoryBedCount: integer("dormitory_bed_count"),
  totalBedCount: integer("total_bed_count"),
  maximumOccupancy: integer("maximum_occupancy"),
  extraBedAvailable: boolean("extra_bed_available").default(true),
  childrenPolicy: text("children_policy"),
  petPolicy: text("pet_policy"),

  // Room amenities
  roomAmenities: text("room_amenities"), // e.g., TV, AC, minibar, etc.
  hasRoomService: boolean("has_room_service").default(false),
  roomServiceHours: text("room_service_hours"),
  hasWifi: boolean("has_wifi").default(false),
  wifiCoverage: text("wifi_coverage"), // Throughout property, public areas only, etc.
  hasAirConditionedRooms: boolean("has_air_conditioned_rooms").default(false),
  airConditionedRoomCount: integer("air_conditioned_room_count"),
  hasAttachedBathrooms: boolean("has_attached_bathrooms").default(true),
  attachedBathroomCount: integer("attached_bathroom_count"),
  hasHotWater: boolean("has_hot_water").default(false),
  hotWaterAvailability: text("hot_water_availability"), // 24 hours, specific times, etc.

  // Rates and occupancy
  averageRoomRateNPR: decimal("average_room_rate_npr", {
    precision: 10,
    scale: 2,
  }),
  standardRoomRateNPR: decimal("standard_room_rate_npr", {
    precision: 10,
    scale: 2,
  }),
  deluxeRoomRateNPR: decimal("deluxe_room_rate_npr", {
    precision: 10,
    scale: 2,
  }),
  suiteRoomRateNPR: decimal("suite_room_rate_npr", { precision: 10, scale: 2 }),
  averageAnnualOccupancyPercent: decimal("average_annual_occupancy_percent", {
    precision: 5,
    scale: 2,
  }),
  peakSeasonMonths: text("peak_season_months"),
  lowSeasonMonths: text("low_season_months"),
  peakSeasonOccupancyPercent: decimal("peak_season_occupancy_percent", {
    precision: 5,
    scale: 2,
  }),
  lowSeasonOccupancyPercent: decimal("low_season_occupancy_percent", {
    precision: 5,
    scale: 2,
  }),
  averageStayDurationDays: decimal("average_stay_duration_days", {
    precision: 4,
    scale: 2,
  }),

  // Guest demographics
  domesticGuestPercentage: integer("domestic_guest_percentage"),
  internationalGuestPercentage: integer("international_guest_percentage"),
  businessTravelerPercentage: integer("business_traveler_percentage"),
  leisureTravelerPercentage: integer("leisure_traveler_percentage"),
  topForeignerNationalities: text("top_foreigner_nationalities"),
  averageGuestAge: integer("average_guest_age"),

  // Dining and food services
  hasRestaurant: boolean("has_restaurant").default(false),
  restaurantCount: integer("restaurant_count"),
  restaurantNames: text("restaurant_names"),
  restaurantCapacity: integer("restaurant_capacity"),
  cuisineTypes: text("cuisine_types"),
  hasBar: boolean("has_bar").default(false),
  barCount: integer("bar_count"),
  barNames: text("bar_names"),
  hasCafeteria: boolean("has_cafeteria").default(false),
  hasRooftopDining: boolean("has_rooftop_dining").default(false),
  hasBreakfastIncluded: boolean("has_breakfast_included").default(false),
  hasMealPlans: boolean("has_meal_plans").default(false),
  mealPlanOptions: text("meal_plan_options"), // e.g., B&B, Half-board, Full-board, etc.
  specialDietaryOptionsAvailable: boolean(
    "special_dietary_options_available",
  ).default(false),
  specialDietaryOptions: text("special_dietary_options"),

  // Recreation facilities
  hasSwimmingPool: boolean("has_swimming_pool").default(false),
  swimmingPoolCount: integer("swimming_pool_count"),
  hasKidsPool: boolean("has_kids_pool").default(false),
  hasGym: boolean("has_gym").default(false),
  hasSpa: boolean("has_spa").default(false),
  spaServices: text("spa_services"),
  hasYoga: boolean("has_yoga").default(false),
  hasGarden: boolean("has_garden").default(false),
  gardenAreaSqm: decimal("garden_area_sq_m", { precision: 10, scale: 2 }),
  hasIndoorGames: boolean("has_indoor_games").default(false),
  indoorGameTypes: text("indoor_game_types"),
  hasOutdoorGames: boolean("has_outdoor_games").default(false),
  outdoorGameTypes: text("outdoor_game_types"),
  hasKidsPlayArea: boolean("has_kids_play_area").default(false),
  hasCasino: boolean("has_casino").default(false),
  recreationalActivities: text("recreational_activities"),

  // Meeting and event facilities
  hasConferenceRoom: boolean("has_conference_room").default(false),
  conferenceRoomCount: integer("conference_room_count"),
  largestConferenceCapacity: integer("largest_conference_capacity"),
  hasBanquetHall: boolean("has_banquet_hall").default(false),
  banquetHallCount: integer("banquet_hall_count"),
  largestBanquetCapacity: integer("largest_banquet_capacity"),
  hasBusinessCenter: boolean("has_business_center").default(false),
  meetingRoomCount: integer("meeting_room_count"),
  eventSpaces: text("event_spaces"),
  eventServicesOffered: text("event_services_offered"),
  weddingFacilitiesAvailable: boolean("wedding_facilities_available").default(
    false,
  ),

  // Services and amenities
  has24HourFrontDesk: boolean("has_24_hour_front_desk").default(false),
  hasConciergeService: boolean("has_concierge_service").default(false),
  hasLaundryService: boolean("has_laundry_service").default(false),
  hasRoomCleaning: boolean("has_room_cleaning").default(true),
  roomCleaningFrequency: text("room_cleaning_frequency"),
  hasTourDeskService: boolean("has_tour_desk_service").default(false),
  tourServices: text("tour_services"),
  hasCurrencyExchange: boolean("has_currency_exchange").default(false),
  hasAirportPickup: boolean("has_airport_pickup").default(false),
  airportPickupFeeNPR: decimal("airport_pickup_fee_npr", {
    precision: 10,
    scale: 2,
  }),
  hasChildcare: boolean("has_childcare").default(false),
  hasLanguageTranslation: boolean("has_language_translation").default(false),
  languagesSupported: text("languages_supported"),

  // Transportation and parking
  hasParking: boolean("has_parking").default(false),
  parkingSpaceCount: integer("parking_space_count"),
  parkingFeeNPR: decimal("parking_fee_npr", { precision: 10, scale: 2 }),
  hasValetParking: boolean("has_valet_parking").default(false),
  parkingType: text("parking_type"), // Garage, outdoor, etc.
  hasCarRental: boolean("has_car_rental").default(false),
  hasBicycleRental: boolean("has_bicycle_rental").default(false),
  hasShuttleService: boolean("has_shuttle_service").default(false),
  shuttleServiceDetails: text("shuttle_service_details"),

  // Staff and human resources
  totalStaffCount: integer("total_staff_count"),
  permanentStaffCount: integer("permanent_staff_count"),
  temporaryStaffCount: integer("temporary_staff_count"),
  femaleStaffCount: integer("female_staff_count"),
  localStaffPercentage: integer("local_staff_percentage"),
  staffTrainingProgram: boolean("staff_training_program").default(false),
  staffAccommodationProvided: boolean("staff_accommodation_provided").default(
    false,
  ),

  // Security and safety
  has24HourSecurity: boolean("has_24_hour_security").default(false),
  securityPersonnelCount: integer("security_personnel_count"),
  hasCctv: boolean("has_cctv").default(false),
  cctvCameraCount: integer("cctv_camera_count"),
  hasFireSafetySystem: boolean("has_fire_safety_system").default(false),
  fireSafetyEquipment: text("fire_safety_equipment"),
  hasEmergencyExits: boolean("has_emergency_exits").default(false),
  hasSprinklerSystem: boolean("has_sprinkler_system").default(false),
  hasSmokeDetectors: boolean("has_smoke_detectors").default(false),
  hasFirstAidFacilities: boolean("has_first_aid_facilities").default(false),
  hasDoctorOnCall: boolean("has_doctor_on_call").default(false),
  nearestHospitalKm: decimal("nearest_hospital_km", { precision: 6, scale: 2 }),
  emergencyResponsePlan: boolean("emergency_response_plan").default(false),

  // Environmental and sustainability
  hasEnergyConservationMeasures: boolean(
    "has_energy_conservation_measures",
  ).default(false),
  energyConservationDetails: text("energy_conservation_details"),
  hasWaterConservationMeasures: boolean(
    "has_water_conservation_measures",
  ).default(false),
  waterConservationDetails: text("water_conservation_details"),
  hasWasteManagementSystem: boolean("has_waste_management_system").default(
    false,
  ),
  wasteManagementDetails: text("waste_management_details"),
  hasRenewableEnergySource: boolean("has_renewable_energy_source").default(
    false,
  ),
  renewableEnergyDetails: text("renewable_energy_details"),
  hasPaperReductionPolicy: boolean("has_paper_reduction_policy").default(false),
  usesLocalFood: boolean("uses_local_food").default(false),
  localFoodPercentage: integer("local_food_percentage"),
  hasGreenCertification: boolean("has_green_certification").default(false),
  greenCertificationType: text("green_certification_type"),

  // Financial aspects
  estimatedAnnualRevenueNPR: decimal("estimated_annual_revenue_npr", {
    precision: 18,
    scale: 2,
  }),
  averageRoomRevenuePercentage: integer("average_room_revenue_percentage"),
  averageFoodRevenuePercentage: integer("average_food_revenue_percentage"),
  averageOtherRevenuePercentage: integer("average_other_revenue_percentage"),
  paymentMethodsAccepted: text("payment_methods_accepted"),
  acceptsCreditCards: boolean("accepts_credit_cards").default(false),
  acceptsDigitalPayments: boolean("accepts_digital_payments").default(false),
  digitalPaymentOptions: text("digital_payment_options"),
  hasRewardProgram: boolean("has_reward_program").default(false),
  rewardProgramDetails: text("reward_program_details"),

  // Booking and reservation
  hasOnlineBookingSystem: boolean("has_online_booking_system").default(false),
  onlineBookingPlatforms: text("online_booking_platforms"),
  onlineBookingPercentage: integer("online_booking_percentage"),
  walkInBookingPercentage: integer("walk_in_booking_percentage"),
  agentBookingPercentage: integer("agent_booking_percentage"),
  averageBookingLeadTimeDays: integer("average_booking_lead_time_days"),
  cancellationPolicy: text("cancellation_policy"),

  // Reviews and reputation
  averageRating: decimal("average_rating", { precision: 3, scale: 1 }), // Out of 5
  totalReviewCount: integer("total_review_count"),
  positiveReviewPercentage: integer("positive_review_percentage"),
  negativeReviewPercentage: integer("negative_review_percentage"),
  majorPositiveAspects: text("major_positive_aspects"),
  majorNegativeAspects: text("major_negative_aspects"),
  hasQualityManagementSystem: boolean("has_quality_management_system").default(
    false,
  ),
  guestSatisfactionMeasurement: text("guest_satisfaction_measurement"),

  // Local context and impact
  localAttractions: text("local_attractions"),
  culturalSignificance: text("cultural_significance"),
  communityEngagementPrograms: text("community_engagement_programs"),
  localEmploymentCreated: integer("local_employment_created"),
  economicImpactDetails: text("economic_impact_details"),
  culturalPreservationEfforts: text("cultural_preservation_efforts"),

  // Future plans and developments
  expansionPlans: text("expansion_plans"),
  renovationPlans: text("renovation_plans"),
  newServicePlans: text("new_service_plans"),
  sustainabilityGoals: text("sustainability_goals"),

  // Challenges and improvements
  majorChallenges: text("major_challenges"),
  plannedImprovements: text("planned_improvements"),
  competitorAnalysis: text("competitor_analysis"),
  marketPositioning: text("market_positioning"),

  // Regulations and compliance
  licenseRenewalDate: date("license_renewal_date"),
  lastInspectionDate: date("last_inspection_date"),
  regularoryComplianceStatus: text("regulatoy_compliance_status"),
  taxComplianceStatus: text("tax_compliance_status"),

  // Linkages to other entities
  linkedAttractions: jsonb("linked_attractions").default(sql`'[]'::jsonb`),
  linkedTourOperators: jsonb("linked_tour_operators").default(sql`'[]'::jsonb`),
  linkedTransportProviders: jsonb("linked_transport_providers").default(
    sql`'[]'::jsonb`,
  ),
  linkedWardOffices: jsonb("linked_ward_offices").default(sql`'[]'::jsonb`),

  // SEO fields
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),

  // Geometry fields
  locationPoint: geometry("location_point", { type: "Point" }),
  propertyArea: geometry("property_area", { type: "Polygon" }),

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

export type HotelResort = typeof hotelResort.$inferSelect;
export type NewHotelResort = typeof hotelResort.$inferInsert;

// Export the slug generation helper for use in procedures
export { generateSlug } from "@/server/utils/slug-helpers";
