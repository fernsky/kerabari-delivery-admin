-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define hotel type enum
DO $$ 
BEGIN
  CREATE TYPE hotel_type AS ENUM (
    'BUDGET_HOTEL',
    'MID_RANGE_HOTEL',
    'LUXURY_HOTEL',
    'BOUTIQUE_HOTEL',
    'RESORT',
    'ECO_RESORT',
    'LODGE',
    'GUEST_HOUSE',
    'HOME_STAY',
    'SERVICE_APARTMENT',
    'HERITAGE_HOTEL',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define hotel star rating enum
DO $$ 
BEGIN
  CREATE TYPE hotel_star_rating AS ENUM (
    'ONE_STAR',
    'TWO_STAR',
    'THREE_STAR',
    'FOUR_STAR',
    'FIVE_STAR',
    'UNRATED',
    'DELUXE',
    'TOURIST_STANDARD'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define hotel occupancy level enum
DO $$ 
BEGIN
  CREATE TYPE hotel_occupancy_level AS ENUM (
    'VERY_HIGH', -- 80-100%
    'HIGH', -- 60-80%
    'MODERATE', -- 40-60%
    'LOW', -- 20-40%
    'VERY_LOW', -- 0-20%
    'SEASONAL_VARIATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the hotel and resort table
CREATE TABLE IF NOT EXISTS acme_hotel_resort (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_in_local_language TEXT,
  description TEXT,
  tagline TEXT,
  hotel_type hotel_type NOT NULL,
  star_rating hotel_star_rating,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  gps_coordinates TEXT,
  altitude_m INTEGER,
  distance_from_city_center_km DECIMAL(6, 2),
  distance_from_airport_km DECIMAL(6, 2),
  distance_from_bus_stand_km DECIMAL(6, 2),
  surroundings TEXT,
  view_offered TEXT,
  
  -- Basic information
  established_year INTEGER,
  last_renovation_year INTEGER,
  ownership_type business_ownership_type,
  owner_name TEXT,
  management_company TEXT,
  registration_number VARCHAR(50),
  tourism_license_number VARCHAR(50),
  pan_vat_number VARCHAR(20),
  affiliation TEXT, -- Hotel associations, international chains, etc.
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  emergency_contact TEXT,
  email TEXT,
  reservation_email TEXT,
  website_url TEXT,
  facebook_page TEXT,
  instagram_handle TEXT,
  trip_advisor_page TEXT,
  
  -- Accommodation details
  total_rooms INTEGER,
  single_rooms INTEGER,
  double_rooms INTEGER,
  twin_rooms INTEGER,
  deluxe_rooms INTEGER,
  suite_rooms INTEGER,
  family_rooms INTEGER,
  dormitory_beds INTEGER,
  other_room_types TEXT,
  total_bed_capacity INTEGER,
  maximum_guests INTEGER,
  
  -- Room features
  has_attached_bathrooms BOOLEAN DEFAULT true,
  has_24_hour_hot_water BOOLEAN DEFAULT true,
  has_air_conditioning BOOLEAN DEFAULT false,
  has_heating BOOLEAN DEFAULT false,
  has_tv BOOLEAN DEFAULT true,
  has_telephone BOOLEAN DEFAULT true,
  has_wifi_in_rooms BOOLEAN DEFAULT true,
  has_room_service BOOLEAN DEFAULT true,
  has_mini_bar BOOLEAN DEFAULT false,
  has_safe_deposit BOOLEAN DEFAULT false,
  has_wardrobe BOOLEAN DEFAULT true,
  has_intercom BOOLEAN DEFAULT true,
  room_service_hours TEXT,
  
  -- Pricing and packages
  single_room_price_npr DECIMAL(10, 2),
  double_room_price_npr DECIMAL(10, 2),
  suite_price_npr DECIMAL(10, 2),
  foreigner_price_different BOOLEAN DEFAULT false,
  foreigner_price_factor DECIMAL(5, 2),
  peak_season_price_factor DECIMAL(5, 2),
  has_special_packages BOOLEAN DEFAULT false,
  special_packages_details TEXT,
  has_corporate_rates BOOLEAN DEFAULT false,
  has_group_discounts BOOLEAN DEFAULT false,
  average_room_rate_npr DECIMAL(10, 2),
  average_occupancy_rate DECIMAL(5, 2),
  
  -- Dining and food
  has_restaurant BOOLEAN DEFAULT true,
  number_of_restaurants INTEGER,
  restaurant_seating_capacity INTEGER,
  cuisine_types TEXT,
  dining_options TEXT, -- buffet, a la carte, etc.
  has_bar BOOLEAN DEFAULT false,
  bar_details TEXT,
  has_room_dining BOOLEAN DEFAULT true,
  has_cafeteria BOOLEAN DEFAULT false,
  serves_breakfast BOOLEAN DEFAULT true,
  breakfast_included_in_room_rate BOOLEAN DEFAULT true,
  meal_plan_options TEXT,
  
  -- Facilities and services
  has_parking BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  has_valet_parking BOOLEAN DEFAULT false,
  has_swimming_pool BOOLEAN DEFAULT false,
  swimming_pool_details TEXT,
  has_fitness_center BOOLEAN DEFAULT false,
  fitness_center_details TEXT,
  has_spa BOOLEAN DEFAULT false,
  spa_services TEXT,
  has_business_center BOOLEAN DEFAULT false,
  has_conference_facilities BOOLEAN DEFAULT false,
  conference_room_capacity INTEGER,
  has_banquet_facilities BOOLEAN DEFAULT false,
  banquet_hall_capacity INTEGER,
  has_garden BOOLEAN DEFAULT false,
  garden_area_sq_m DECIMAL(10, 2),
  has_outdoor_sitting BOOLEAN DEFAULT false,
  has_elevator BOOLEAN DEFAULT false,
  has_generator_backup BOOLEAN DEFAULT true,
  has_laundry_service BOOLEAN DEFAULT true,
  has_doctor_on_call BOOLEAN DEFAULT false,
  accepts_credit_cards BOOLEAN DEFAULT true,
  has_travel_desk BOOLEAN DEFAULT false,
  has_gift_shop BOOLEAN DEFAULT false,
  additional_facilities TEXT,
  
  -- Recreational activities
  recreational_facilities TEXT,
  offers_tour_packages BOOLEAN DEFAULT false,
  tour_packages TEXT,
  has_activity_center BOOLEAN DEFAULT false,
  activities_offered TEXT,
  has_children_play_area BOOLEAN DEFAULT false,
  
  -- Accessibility
  has_wheelchair_accessibility BOOLEAN DEFAULT false,
  accessibility_features TEXT,
  has_airport_shuttle BOOLEAN DEFAULT false,
  transportation_services TEXT,
  
  -- Staff
  total_staff_count INTEGER,
  trained_staff_percentage DECIMAL(5, 2),
  front_desk_staff_count INTEGER,
  housekeeping_staff_count INTEGER,
  food_service_staff_count INTEGER,
  security_staff_count INTEGER,
  management_staff_count INTEGER,
  staff_language_skills TEXT,
  has_24_hour_reception BOOLEAN DEFAULT true,
  
  -- Guest information
  primary_guest_type TEXT, -- tourists, business travelers, etc.
  foreign_guests_percentage DECIMAL(5, 2),
  average_length_of_stay_days DECIMAL(5, 2),
  major_foreign_guest_nationalities TEXT,
  domestic_guest_percentage DECIMAL(5, 2),
  repeat_guest_percentage DECIMAL(5, 2),
  peak_season_months TEXT,
  off_season_months TEXT,
  occupancy_level hotel_occupancy_level,
  
  -- Safety and security
  has_fire_extinguishers BOOLEAN DEFAULT true,
  has_fire_alarm BOOLEAN DEFAULT true,
  has_emergency_exits BOOLEAN DEFAULT true,
  has_smoke_detectors BOOLEAN DEFAULT false,
  has_cctv BOOLEAN DEFAULT true,
  cctv_camera_count INTEGER,
  has_security_personnel BOOLEAN DEFAULT true,
  security_personnel_count INTEGER,
  has_first_aid BOOLEAN DEFAULT true,
  has_safety_lockers BOOLEAN DEFAULT false,
  safety_protocol_details TEXT,
  
  -- Environmental measures
  has_waste_management BOOLEAN DEFAULT false,
  waste_management_details TEXT,
  has_water_conservation BOOLEAN DEFAULT false,
  water_conservation_details TEXT,
  has_energy_saving_measures BOOLEAN DEFAULT false,
  energy_saving_details TEXT,
  uses_renewable_energy BOOLEAN DEFAULT false,
  renewable_energy_details TEXT,
  eco_friendly_practices TEXT,
  
  -- Business metrics
  annual_revenue_npr DECIMAL(18, 2),
  revenue_per_available_room_npr DECIMAL(10, 2),
  average_daily_rate_npr DECIMAL(10, 2),
  operating_cost_percentage DECIMAL(5, 2),
  profit_margin_percentage DECIMAL(5, 2),
  marketing_budget_percentage DECIMAL(5, 2),
  
  -- Online presence and bookings
  has_online_booking BOOLEAN DEFAULT true,
  online_booking_platforms JSONB DEFAULT '[]'::jsonb,
  online_booking_percentage DECIMAL(5, 2),
  direct_booking_percentage DECIMAL(5, 2),
  walk_in_percentage DECIMAL(5, 2),
  has_property_management_system BOOLEAN DEFAULT false,
  property_management_system_name TEXT,
  
  -- Reviews and ratings
  average_guest_rating DECIMAL(3, 1),
  tripadvisor_rating DECIMAL(3, 1),
  booking_com_rating DECIMAL(3, 1),
  google_rating DECIMAL(3, 1),
  guest_review_highlights TEXT,
  guest_complaint_handling TEXT,
  
  -- Market positioning
  competitive_advantages TEXT,
  target_market TEXT,
  marketing_strategies TEXT,
  collaboration_with_tour_operators BOOLEAN DEFAULT false,
  tour_operator_details TEXT,
  membership_in_hotel_association BOOLEAN DEFAULT false,
  association_details TEXT,
  
  -- Challenges and issues
  operational_challenges TEXT,
  staffing_challenges TEXT,
  market_challenges TEXT,
  regulatory_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  renovation_plans TEXT,
  facility_upgrade_plans TEXT,
  new_service_plans TEXT,
  
  -- Linkages to other entities
  linked_attractions JSONB DEFAULT '[]'::jsonb,
  linked_transportation_services JSONB DEFAULT '[]'::jsonb,
  linked_tour_operators JSONB DEFAULT '[]'::jsonb,
  linked_restaurants JSONB DEFAULT '[]'::jsonb,
  linked_event_venues JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  property_boundary GEOMETRY(Polygon, 4326),
  building_footprint GEOMETRY(MultiPolygon, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_hotel_location_point ON acme_hotel_resort USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_hotel_property_boundary ON acme_hotel_resort USING GIST (property_boundary);
CREATE INDEX IF NOT EXISTS idx_hotel_building_footprint ON acme_hotel_resort USING GIST (building_footprint);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_hotel_name ON acme_hotel_resort(name);
CREATE INDEX IF NOT EXISTS idx_hotel_slug ON acme_hotel_resort(slug);
CREATE INDEX IF NOT EXISTS idx_hotel_type ON acme_hotel_resort(hotel_type);
CREATE INDEX IF NOT EXISTS idx_hotel_star_rating ON acme_hotel_resort(star_rating);
CREATE INDEX IF NOT EXISTS idx_hotel_ward ON acme_hotel_resort(ward_number);
