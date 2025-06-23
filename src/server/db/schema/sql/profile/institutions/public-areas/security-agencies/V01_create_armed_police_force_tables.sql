-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define APF facility type enum
DO $$ 
BEGIN
  CREATE TYPE apf_facility_type AS ENUM (
    'APF_HEADQUARTERS', 'PROVINCIAL_APF_HEADQUARTERS', 'APF_BRIGADE_HEADQUARTERS',
    'APF_BATTALION_HEADQUARTERS', 'APF_COMPANY_BASE', 'APF_BORDER_OUTPOST',
    'APF_TRAINING_CENTER', 'APF_SECURITY_BASE', 'APF_DISASTER_MANAGEMENT_CENTER',
    'APF_SPECIAL_TASK_FORCE', 'APF_INDUSTRIAL_SECURITY_UNIT', 'APF_RIOT_CONTROL_UNIT',
    'APF_MOBILE_UNIT', 'APF_RESERVE_UNIT', 'APF_LOGISTICAL_UNIT',
    'APF_AIRPORT_SECURITY_UNIT', 'APF_HIGHWAY_SECURITY_UNIT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define APF jurisdiction type enum
DO $$ 
BEGIN
  CREATE TYPE apf_jurisdiction_type AS ENUM (
    'FEDERAL', 'PROVINCIAL', 'DISTRICT', 'MUNICIPALITY', 'RURAL_MUNICIPALITY',
    'BORDER_AREA', 'INDUSTRIAL_COMPLEX', 'CRITICAL_INFRASTRUCTURE', 'SPECIAL_SECURITY_ZONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define building condition enum
DO $$ 
BEGIN
  CREATE TYPE apf_building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_MAINTENANCE', 'POOR',
    'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define equipment status enum (reusing from nepal_police if it exists)
DO $$ 
BEGIN
  CREATE TYPE equipment_status AS ENUM (
    'OPERATIONAL', 'NEEDS_REPAIR', 'UNDER_MAINTENANCE', 'NON_OPERATIONAL',
    'OBSOLETE', 'NEW', 'GOOD', 'FAIR', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define vehicle status enum (reusing from nepal_police if it exists)
DO $$ 
BEGIN
  CREATE TYPE vehicle_status AS ENUM (
    'OPERATIONAL', 'NEEDS_REPAIR', 'UNDER_MAINTENANCE', 'NON_OPERATIONAL',
    'OBSOLETE', 'NEW', 'GOOD', 'FAIR', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define workload level enum (reusing from nepal_police if it exists)
DO $$ 
BEGIN
  CREATE TYPE workload_level AS ENUM (
    'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VARIABLE', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the armed police force facility table
CREATE TABLE IF NOT EXISTS acme_apf_facility (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  facility_type apf_facility_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Administrative details
  jurisdiction_type apf_jurisdiction_type NOT NULL,
  jurisdiction_coverage TEXT,
  establishment_year INTEGER,
  reporting_unit TEXT,
  commanding_unit TEXT,
  commanding_officer_rank TEXT,
  commanding_officer_name TEXT,
  
  -- Physical infrastructure
  land_area_sq_m DECIMAL(12, 2),
  built_area_sq_m DECIMAL(12, 2),
  building_count INTEGER,
  main_building_floors INTEGER,
  building_condition apf_building_condition,
  has_perimeter_wall BOOLEAN DEFAULT true,
  has_watchtower BOOLEAN DEFAULT false,
  watchtower_count INTEGER,
  has_barrack BOOLEAN DEFAULT false,
  barrack_capacity INTEGER,
  has_mess BOOLEAN DEFAULT false,
  mess_capacity INTEGER,
  has_training_ground BOOLEAN DEFAULT false,
  training_ground_area_sq_m DECIMAL(10, 2),
  has_firing_range BOOLEAN DEFAULT false,
  firing_range_details TEXT,
  has_parade_ground BOOLEAN DEFAULT false,
  parade_ground_area_sq_m DECIMAL(10, 2),
  
  -- Facilities
  has_detention_facility BOOLEAN DEFAULT false,
  detention_facility_capacity INTEGER,
  has_armory BOOLEAN DEFAULT true,
  armory_security_level TEXT,
  has_medical_facility BOOLEAN DEFAULT false,
  medical_facility_type TEXT,
  has_communication_room BOOLEAN DEFAULT true,
  has_control_room BOOLEAN DEFAULT false,
  has_helipad BOOLEAN DEFAULT false,
  has_vehicle_maintenance BOOLEAN DEFAULT false,
  has_fuel_storage BOOLEAN DEFAULT false,
  has_water_storage BOOLEAN DEFAULT true,
  water_storage_capacity_liters INTEGER,
  has_generator BOOLEAN DEFAULT false,
  generator_capacity_kw DECIMAL(8, 2),
  has_solar_power BOOLEAN DEFAULT false,
  solar_capacity_kw DECIMAL(8, 2),
  electricity_source TEXT,
  water_source TEXT,
  
  -- Personnel
  total_personnel INTEGER,
  officer_count INTEGER,
  jco_count INTEGER, -- Junior Commissioned Officers
  other_ranks_count INTEGER,
  male_personnel_count INTEGER,
  female_personnel_count INTEGER,
  sanctioned_strength INTEGER,
  current_vacancy_count INTEGER,
  has_female_facilities BOOLEAN DEFAULT false,
  female_facilities_details TEXT,
  
  -- Operations
  primary_functions TEXT,
  secondary_functions TEXT,
  specialized_units TEXT,
  operational_area_coverage TEXT, -- Geographic details
  area_coverage_sq_km DECIMAL(10, 2),
  population_coverage INTEGER,
  border_patrolling_km DECIMAL(8, 2),
  area_special_challenges TEXT,
  disaster_response_capabilities TEXT,
  special_security_responsibilities TEXT,
  
  -- Equipment and logistics
  major_equipment TEXT,
  communication_equipment TEXT,
  mobility_assets TEXT,
  surveillance_equipment TEXT,
  specialized_equipment TEXT,
  equipment_sufficiency_level TEXT, -- Sufficient, Insufficient, etc.
  equipment_maintenance_capability TEXT,
  logistics_challenges TEXT,
  
  -- Vehicles
  four_wheeler_count INTEGER,
  two_wheeler_count INTEGER,
  heavy_vehicle_count INTEGER,
  specialized_vehicle_count INTEGER,
  operational_vehicle_percentage INTEGER,
  vehicle_maintenance_system TEXT,
  
  -- Operations statistics
  average_daily_calls INTEGER,
  average_monthly_operations INTEGER,
  major_operation_types TEXT,
  recent_major_operations TEXT,
  border_seizure_statistics TEXT,
  response_time_minutes INTEGER,
  workload_level workload_level,
  peak_workload_time TEXT,
  peak_workload_season TEXT,
  
  -- Coordination and relationships
  coordination_with_police TEXT,
  coordination_with_army TEXT,
  coordination_with_local_government TEXT,
  community_relation_programs TEXT,
  community_outreach_activities TEXT,
  inter_agency_exercises TEXT,
  
  -- Training and capacity
  training_facilities_available TEXT,
  regular_training_programs TEXT,
  specialized_training TEXT,
  last_major_exercise_date DATE,
  exercise_types TEXT,
  capacity_building_needs TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  operational_challenges TEXT,
  resource_gaps TEXT,
  security_challenges TEXT,
  improvement_priorities TEXT,
  
  -- Budget and resources
  annual_budget_npr DECIMAL(14, 2),
  budget_sufficiency TEXT, -- Sufficient, Insufficient, etc.
  resource_constraints TEXT,
  external_funding_support TEXT,
  
  -- Contact information
  contact_phone TEXT,
  emergency_contact TEXT,
  alternate_contact TEXT,
  email_address TEXT,
  
  -- Disaster response capacity
  disaster_response_equipment TEXT,
  trained_disaster_personnel INTEGER,
  disaster_response_plans BOOLEAN DEFAULT false,
  evacuation_capacity INTEGER,
  emergency_shelter_capacity INTEGER,
  
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
  jurisdiction_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_apf_location_point ON acme_apf_facility USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_apf_facility_area ON acme_apf_facility USING GIST (facility_area);
CREATE INDEX IF NOT EXISTS idx_apf_jurisdiction_area ON acme_apf_facility USING GIST (jurisdiction_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_apf_name ON acme_apf_facility(name);
CREATE INDEX IF NOT EXISTS idx_apf_slug ON acme_apf_facility(slug);
CREATE INDEX IF NOT EXISTS idx_apf_facility_type ON acme_apf_facility(facility_type);
CREATE INDEX IF NOT EXISTS idx_apf_jurisdiction_type ON acme_apf_facility(jurisdiction_type);
