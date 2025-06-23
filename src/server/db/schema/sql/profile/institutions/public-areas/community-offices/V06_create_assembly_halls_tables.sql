-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define assembly_hall_type enum
DO $$ 
BEGIN
  CREATE TYPE assembly_hall_type AS ENUM (
    'PUBLIC_ASSEMBLY_HALL', 'COMMUNITY_AUDITORIUM', 'CONFERENCE_CENTER',
    'PERFORMANCE_HALL', 'TOWN_HALL', 'MULTIPURPOSE_HALL', 'CONVENTION_CENTER',
    'EVENT_VENUE', 'WEDDING_HALL', 'CULTURAL_PROGRAM_HALL', 'EXHIBITION_HALL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define hall_size_category enum
DO $$ 
BEGIN
  CREATE TYPE hall_size_category AS ENUM (
    'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define event_type enum
DO $$ 
BEGIN
  CREATE TYPE event_type AS ENUM (
    'MEETINGS', 'CONFERENCES', 'WEDDINGS', 'CULTURAL_PERFORMANCES',
    'RELIGIOUS_GATHERINGS', 'GOVERNMENT_FUNCTIONS', 'TRAINING_PROGRAMS',
    'EXHIBITIONS', 'CONCERTS', 'POLITICAL_GATHERINGS', 'COMMUNITY_GATHERINGS',
    'MIXED_USE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the assembly_hall table
CREATE TABLE IF NOT EXISTS acme_assembly_hall (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  hall_type assembly_hall_type NOT NULL,
  primary_use event_type NOT NULL,
  size_category hall_size_category NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  
  -- Basic information
  established_year INTEGER,
  management_type management_type NOT NULL,
  managing_body TEXT,
  has_necessary_permits BOOLEAN DEFAULT true,
  permits_details TEXT,
  registration_number VARCHAR(50),
  registered_with TEXT,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  building_condition building_condition,
  construction_year INTEGER,
  construction_material building_construction_material,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  number_of_halls INTEGER,
  main_hall_capacity_sqm DECIMAL(10, 2),
  main_hall_capacity_people INTEGER,
  standing_capacity INTEGER,
  max_occupancy_limit INTEGER,
  has_stage BOOLEAN DEFAULT true,
  stage_size_sqm DECIMAL(10, 2),
  has_backstage BOOLEAN DEFAULT false,
  has_dressing_rooms BOOLEAN DEFAULT false,
  chairs_count INTEGER,
  tables_count INTEGER,
  has_elevator BOOLEAN DEFAULT false,
  has_flexible_seating BOOLEAN DEFAULT false,
  seating_arrangements TEXT,
  
  -- Facilities and amenities
  has_air_conditioning BOOLEAN DEFAULT false,
  has_heating BOOLEAN DEFAULT false,
  has_audio_system BOOLEAN DEFAULT true,
  audio_system_details TEXT,
  has_lighting_system BOOLEAN DEFAULT true,
  lighting_system_details TEXT,
  has_projection_system BOOLEAN DEFAULT false,
  projection_system_details TEXT,
  has_wifi BOOLEAN DEFAULT false,
  internet_bandwidth_mbps INTEGER,
  has_kitchen BOOLEAN DEFAULT false,
  kitchen_facilities TEXT,
  has_dining_area BOOLEAN DEFAULT false,
  dining_area_capacity INTEGER,
  has_bar BOOLEAN DEFAULT false,
  has_vip_lounge BOOLEAN DEFAULT false,
  has_green_room BOOLEAN DEFAULT false,
  has_control_room BOOLEAN DEFAULT false,
  has_ticketing_area BOOLEAN DEFAULT false,
  has_lobby BOOLEAN DEFAULT false,
  
  -- Basic utilities
  has_electricity BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT true,
  has_toilets BOOLEAN DEFAULT true,
  male_toilets_count INTEGER,
  female_toilets_count INTEGER,
  neutral_toilets_count INTEGER,
  has_handicap_toilets BOOLEAN DEFAULT false,
  
  -- Accessibility and parking
  accessibility_level accessibility_level,
  has_wheelchair_ramps BOOLEAN DEFAULT false,
  has_accessible_seating BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  has_bus_parking BOOLEAN DEFAULT false,
  bus_parking_capacity INTEGER,
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  
  -- Usage and operations
  usage_frequency usage_frequency,
  weekly_bookings_average INTEGER,
  monthly_events_count INTEGER,
  annual_events_count INTEGER,
  peak_booking_months TEXT,
  major_annual_events TEXT,
  regular_activities TEXT,
  allows_external_catering BOOLEAN DEFAULT true,
  allows_alcohol BOOLEAN DEFAULT false,
  has_noise_restrictions BOOLEAN DEFAULT true,
  noise_restrictions TEXT,
  operating_hours TEXT,
  
  -- Booking and fees
  booking_procedure TEXT,
  has_online_booking BOOLEAN DEFAULT false,
  online_booking_url TEXT,
  rental_fee_structure TEXT,
  full_day_rate_npr DECIMAL(10, 2),
  half_day_rate_npr DECIMAL(10, 2),
  hourly_rate_npr DECIMAL(10, 2),
  has_discount_rates BOOLEAN DEFAULT false,
  discount_categories TEXT,
  security_deposit_required BOOLEAN DEFAULT true,
  security_deposit_amount_npr DECIMAL(10, 2),
  cancellation_policy TEXT,
  cancellation_fee_npr DECIMAL(10, 2),
  additional_services_offered TEXT,
  additional_services_rates TEXT,
  
  -- Management and staff
  has_full_time_manager BOOLEAN DEFAULT false,
  manager_contact_info TEXT,
  permanent_staff_count INTEGER,
  temporary_staff_count INTEGER,
  technical_staff_count INTEGER,
  cleaning_staff_count INTEGER,
  security_staff_count INTEGER,
  event_staff_available BOOLEAN DEFAULT false,
  event_staff_rates_npr DECIMAL(10, 2),
  
  -- Security and safety
  has_fire_safety_system BOOLEAN DEFAULT true,
  fire_safety_details TEXT,
  has_emergency_exits BOOLEAN DEFAULT true,
  emergency_exits_count INTEGER,
  has_evacuation_plan BOOLEAN DEFAULT false,
  has_first_aid_facilities BOOLEAN DEFAULT false,
  has_defibrillator BOOLEAN DEFAULT false,
  has_security BOOLEAN DEFAULT true,
  security_type TEXT,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_insurance BOOLEAN DEFAULT false,
  insurance_type TEXT,
  
  -- Financial aspects
  annual_operating_cost_npr DECIMAL(18, 2),
  annual_revenue_npr DECIMAL(18, 2),
  maintenance_budget_npr DECIMAL(14, 2),
  utility_budget_npr DECIMAL(14, 2),
  profitable_operation BOOLEAN DEFAULT false,
  receives_subsidies BOOLEAN DEFAULT false,
  subsidy_source_details TEXT,
  has_endowment_fund BOOLEAN DEFAULT false,
  endowment_fund_size_npr DECIMAL(18, 2),
  has_bank_account BOOLEAN DEFAULT true,
  bank_account_details TEXT,
  
  -- Partnerships and collaborations
  has_regular_partners BOOLEAN DEFAULT false,
  regular_partner_details TEXT,
  has_government_partnerships BOOLEAN DEFAULT false,
  government_partnership_details TEXT,
  has_corporate_sponsors BOOLEAN DEFAULT false,
  corporate_sponsor_details TEXT,
  has_community_partnerships BOOLEAN DEFAULT false,
  community_partnership_details TEXT,
  
  -- Event support services
  provides_event_planning BOOLEAN DEFAULT false,
  provides_catering_services BOOLEAN DEFAULT false,
  catering_options TEXT,
  provides_decor_services BOOLEAN DEFAULT false,
  provides_av_technician BOOLEAN DEFAULT false,
  provides_photography_services BOOLEAN DEFAULT false,
  provides_accommodation_info BOOLEAN DEFAULT false,
  nearby_accommodation_details TEXT,
  
  -- Maintenance and renovations
  maintenance_schedule TEXT,
  last_major_renovation DATE,
  planned_upgrades TEXT,
  current_condition_notes TEXT,
  cleaning_schedule TEXT,
  
  -- Challenges and needs
  operational_challenges TEXT,
  maintenance_challenges TEXT,
  upgrade_needs TEXT,
  competition_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  technological_upgrade_plans TEXT,
  service_improvement_plans TEXT,
  sustainability_plans TEXT,
  
  -- Environmental considerations
  environmental_impact_measures TEXT,
  energy_efficient_features TEXT,
  waste_management_system TEXT,
  has_green_certification BOOLEAN DEFAULT false,
  green_certification_details TEXT,
  
  -- Marketing and promotion
  marketing_strategy TEXT,
  has_dedicated_website BOOLEAN DEFAULT false,
  website_url TEXT,
  social_media_presence BOOLEAN DEFAULT false,
  facebook_page TEXT,
  instagram_handle TEXT,
  other_social_media TEXT,
  listed_on_booking_platforms BOOLEAN DEFAULT false,
  booking_platforms_list TEXT,
  
  -- Reviews and reputation
  average_rating DECIMAL(3, 1),
  review_sources TEXT,
  has_testimonials BOOLEAN DEFAULT false,
  notable_events TEXT,
  awards_received TEXT,
  
  -- Contact information
  booking_contact_name TEXT,
  booking_contact_phone TEXT,
  booking_email_address TEXT,
  manager_name TEXT,
  manager_phone TEXT,
  manager_email TEXT,
  alternate_contact_name TEXT,
  alternate_contact_phone TEXT,
  emergency_contact_details TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  linked_cultural_groups JSONB DEFAULT '[]'::jsonb,
  linked_hotels JSONB DEFAULT '[]'::jsonb,
  linked_catering_services JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  compound_area GEOMETRY(Polygon, 4326),
  parking_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_assembly_hall_location_point ON acme_assembly_hall USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_building_footprint ON acme_assembly_hall USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_compound_area ON acme_assembly_hall USING GIST (compound_area);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_parking_area ON acme_assembly_hall USING GIST (parking_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_assembly_hall_name ON acme_assembly_hall(name);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_slug ON acme_assembly_hall(slug);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_type ON acme_assembly_hall(hall_type);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_size ON acme_assembly_hall(size_category);
CREATE INDEX IF NOT EXISTS idx_assembly_hall_primary_use ON acme_assembly_hall(primary_use);
