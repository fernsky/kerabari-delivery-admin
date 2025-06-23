-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define army facility type enum
DO $$ 
BEGIN
  CREATE TYPE army_facility_type AS ENUM (
    'ARMY_HEADQUARTERS', 'DIVISION_HEADQUARTERS', 'BRIGADE_HEADQUARTERS',
    'BATTALION_HEADQUARTERS', 'COMPANY_BARRACKS', 'TRAINING_CENTER',
    'MILITARY_ACADEMY', 'MILITARY_HOSPITAL', 'LOGISTICS_BASE',
    'ENGINEERING_UNIT', 'AVIATION_BASE', 'SIGNAL_UNIT', 'DISASTER_RESPONSE_UNIT',
    'PEACE_KEEPING_TRAINING_CENTER', 'WELFARE_CENTER', 'RECRUITMENT_CENTER',
    'TECHNICAL_SCHOOL', 'RESEARCH_AND_DEVELOPMENT_CENTER', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define army unit type enum
DO $$ 
BEGIN
  CREATE TYPE army_unit_type AS ENUM (
    'INFANTRY', 'ARTILLERY', 'ARMORED', 'ENGINEERS', 'SIGNALS',
    'LOGISTICS', 'MEDICAL', 'AVIATION', 'SPECIAL_FORCES', 'MILITARY_POLICE',
    'DISASTER_RESPONSE', 'PEACEKEEPING', 'TECHNICAL', 'TRAINING', 'HEADQUARTERS',
    'CEREMONIAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the nepal army facility table
CREATE TABLE IF NOT EXISTS acme_nepal_army_facility (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  facility_type army_facility_type NOT NULL,
  unit_type army_unit_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Administrative details
  establishment_year INTEGER,
  parent_unit TEXT,
  commanding_unit TEXT,
  commanding_officer_rank TEXT,
  commanding_officer_name TEXT,
  unit_number TEXT,
  unit_motto TEXT,
  
  -- Physical infrastructure
  land_area_sq_m DECIMAL(12, 2),
  built_area_sq_m DECIMAL(12, 2),
  building_count INTEGER,
  main_building_floors INTEGER,
  building_condition building_condition,
  has_perimeter_wall BOOLEAN DEFAULT true,
  has_watchtower BOOLEAN DEFAULT true,
  watchtower_count INTEGER,
  has_main_gate BOOLEAN DEFAULT true,
  has_parade_ground BOOLEAN DEFAULT true,
  parade_ground_area_sq_m DECIMAL(10, 2),
  has_training_ground BOOLEAN DEFAULT true,
  training_ground_area_sq_m DECIMAL(10, 2),
  has_firing_range BOOLEAN DEFAULT false,
  firing_range_type TEXT,
  has_helipad BOOLEAN DEFAULT false,
  helipad_count INTEGER,
  has_sports_field BOOLEAN DEFAULT false,
  sports_facilities TEXT,
  
  -- Barrack facilities
  has_barracks BOOLEAN DEFAULT true,
  barrack_blocks_count INTEGER,
  barrack_capacity INTEGER,
  has_officers_quarters BOOLEAN DEFAULT false,
  officers_quarters_count INTEGER,
  has_jco_quarters BOOLEAN DEFAULT false, -- Junior Commissioned Officers
  jco_quarters_count INTEGER,
  has_family_quarters BOOLEAN DEFAULT false,
  family_quarters_count INTEGER,
  
  -- Other facilities
  has_mess BOOLEAN DEFAULT true,
  officers_mess_capacity INTEGER,
  jco_mess_capacity INTEGER,
  other_ranks_mess_capacity INTEGER,
  has_canteen BOOLEAN DEFAULT true,
  has_recreational_facility BOOLEAN DEFAULT false,
  recreational_facilities TEXT,
  has_medical_facility BOOLEAN DEFAULT false,
  medical_facility_type TEXT,
  medical_facility_beds INTEGER,
  has_religious_facility BOOLEAN DEFAULT false,
  religious_facility_type TEXT,
  has_educational_facility BOOLEAN DEFAULT false,
  educational_facility_details TEXT,
  
  -- Utilities
  has_generator BOOLEAN DEFAULT true,
  generator_capacity_kw DECIMAL(8, 2),
  has_solar_power BOOLEAN DEFAULT false,
  solar_capacity_kw DECIMAL(8, 2),
  electricity_source TEXT,
  water_source TEXT,
  has_water_treatment BOOLEAN DEFAULT false,
  has_sewage_treatment BOOLEAN DEFAULT false,
  
  -- Personnel
  total_personnel INTEGER,
  officer_count INTEGER,
  jco_count INTEGER,
  other_ranks_count INTEGER,
  civilian_staff_count INTEGER,
  male_personnel_count INTEGER,
  female_personnel_count INTEGER,
  sanctioned_strength INTEGER,
  current_vacancy_count INTEGER,
  has_female_facilities BOOLEAN DEFAULT false,
  female_facilities_details TEXT,
  
  -- Operational details
  primary_role TEXT,
  secondary_roles TEXT,
  specialized_capabilities TEXT,
  operational_area TEXT,
  is_disaster_response_unit BOOLEAN DEFAULT false,
  disaster_response_capabilities TEXT,
  is_un_peacekeeping_contributor BOOLEAN DEFAULT false,
  peacekeeping_missions TEXT,
  
  -- Equipment and logistics
  major_equipment TEXT,
  armament_types TEXT,
  vehicle_types TEXT,
  communication_systems TEXT,
  logistics_facilities TEXT,
  equipment_maintenance_facilities TEXT,
  
  -- Vehicles
  armored_vehicle_count INTEGER,
  utility_vehicle_count INTEGER,
  transport_vehicle_count INTEGER,
  specialized_vehicle_count INTEGER,
  
  -- Training facilities
  training_specialization TEXT,
  training_capacity INTEGER,
  annual_training_courses INTEGER,
  training_facilities TEXT,
  simulation_facilities TEXT,
  
  -- Community engagement
  community_service_activities TEXT,
  civil_military_cooperation_programs TEXT,
  public_events_participation TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  operational_challenges TEXT,
  resource_gaps TEXT,
  modernization_needs TEXT,
  improvement_priorities TEXT,
  
  -- Security and safety
  security_measures TEXT,
  fire_safety_measures TEXT,
  emergency_response_plan BOOLEAN DEFAULT true,
  
  -- Cultural and historical
  unit_history TEXT,
  notable_achievements TEXT,
  honors_and_decorations TEXT,
  has_museum BOOLEAN DEFAULT false,
  has_memorial BOOLEAN DEFAULT false,
  memorial_details TEXT,
  
  -- Contact information
  contact_phone TEXT,
  emergency_contact TEXT,
  alternate_contact TEXT,
  
  -- Future development
  expansion_plans TEXT,
  upcoming_infrastructure_projects TEXT,
  modernization_plans TEXT,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_army_location_point ON acme_nepal_army_facility USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_army_facility_area ON acme_nepal_army_facility USING GIST (facility_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_army_name ON acme_nepal_army_facility(name);
CREATE INDEX IF NOT EXISTS idx_army_slug ON acme_nepal_army_facility(slug);
CREATE INDEX IF NOT EXISTS idx_army_facility_type ON acme_nepal_army_facility(facility_type);
CREATE INDEX IF NOT EXISTS idx_army_unit_type ON acme_nepal_army_facility(unit_type);
