-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define police facility type enum
DO $$ 
BEGIN
  CREATE TYPE police_facility_type AS ENUM (
    'POLICE_HEADQUARTERS', 'PROVINCIAL_POLICE_OFFICE', 'DISTRICT_POLICE_OFFICE',
    'AREA_POLICE_OFFICE', 'POLICE_STATION', 'POLICE_POST', 'BORDER_POLICE_POST',
    'TRAFFIC_POLICE_OFFICE', 'TOURIST_POLICE_OFFICE', 'SPECIAL_BUREAU',
    'TRAINING_CENTER', 'FORENSIC_LAB', 'DETENTION_CENTER', 'COMMUNITY_POLICE_CENTER',
    'WOMEN_AND_CHILDREN_SERVICE_CENTER', 'SPECIALIZED_UNIT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define police jurisdiction type enum
DO $$ 
BEGIN
  CREATE TYPE police_jurisdiction_type AS ENUM (
    'FEDERAL', 'PROVINCIAL', 'DISTRICT', 'METROPOLITAN', 'SUB_METROPOLITAN',
    'MUNICIPALITY', 'RURAL_MUNICIPALITY', 'WARD_LEVEL', 'SPECIAL_ZONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define building condition enum
DO $$ 
BEGIN
  CREATE TYPE building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_MAINTENANCE', 'POOR',
    'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define equipment status enum
DO $$ 
BEGIN
  CREATE TYPE equipment_status AS ENUM (
    'OPERATIONAL', 'NEEDS_REPAIR', 'UNDER_MAINTENANCE', 'NON_OPERATIONAL',
    'OBSOLETE', 'NEW', 'GOOD', 'FAIR', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define vehicle status enum
DO $$ 
BEGIN
  CREATE TYPE vehicle_status AS ENUM (
    'OPERATIONAL', 'NEEDS_REPAIR', 'UNDER_MAINTENANCE', 'NON_OPERATIONAL',
    'OBSOLETE', 'NEW', 'GOOD', 'FAIR', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define workload level enum
DO $$ 
BEGIN
  CREATE TYPE workload_level AS ENUM (
    'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VARIABLE', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the nepal police facility table
CREATE TABLE IF NOT EXISTS acme_nepal_police_facility (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  facility_type police_facility_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Administrative details
  jurisdiction_type police_jurisdiction_type NOT NULL,
  jurisdiction_coverage TEXT,
  establishment_year INTEGER,
  reporting_unit TEXT,
  commanding_unit TEXT,
  officer_in_charge_rank TEXT,
  officer_in_charge_name TEXT,
  
  -- Physical infrastructure
  land_area_sq_m DECIMAL(12, 2),
  built_area_sq_m DECIMAL(12, 2),
  building_count INTEGER,
  main_building_floors INTEGER,
  building_condition building_condition,
  has_perimeter_wall BOOLEAN DEFAULT true,
  has_main_gate BOOLEAN DEFAULT true,
  has_barrack BOOLEAN DEFAULT false,
  barrack_capacity INTEGER,
  has_mess BOOLEAN DEFAULT false,
  mess_capacity INTEGER,
  has_detention_cell BOOLEAN DEFAULT false,
  detention_cell_capacity INTEGER,
  has_separate_women_cell BOOLEAN DEFAULT false,
  women_cell_capacity INTEGER,
  has_interrogation_room BOOLEAN DEFAULT false,
  
  -- Facilities
  has_public_service_desk BOOLEAN DEFAULT true,
  has_women_desk BOOLEAN DEFAULT false,
  has_investigation_unit BOOLEAN DEFAULT true,
  has_crime_branch BOOLEAN DEFAULT false,
  has_traffic_unit BOOLEAN DEFAULT false,
  has_intelligence_unit BOOLEAN DEFAULT false,
  has_cyber_unit BOOLEAN DEFAULT false,
  has_canteen BOOLEAN DEFAULT false,
  has_recreation_room BOOLEAN DEFAULT false,
  has_meeting_hall BOOLEAN DEFAULT false,
  meeting_hall_capacity INTEGER,
  has_armory BOOLEAN DEFAULT true,
  has_parking BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  has_generator BOOLEAN DEFAULT false,
  generator_capacity_kw DECIMAL(8, 2),
  has_solar_power BOOLEAN DEFAULT false,
  solar_capacity_kw DECIMAL(8, 2),
  electricity_source TEXT,
  water_source TEXT,
  
  -- Personnel
  total_personnel INTEGER,
  officer_count INTEGER,
  inspector_count INTEGER,
  sub_inspector_count INTEGER,
  assistant_sub_inspector_count INTEGER,
  head_constable_count INTEGER,
  constable_count INTEGER,
  male_personnel_count INTEGER,
  female_personnel_count INTEGER,
  sanctioned_strength INTEGER,
  current_vacancy_count INTEGER,
  has_female_toilets BOOLEAN DEFAULT false,
  has_female_changing_room BOOLEAN DEFAULT false,
  
  -- Operations
  serves_population INTEGER,
  area_coverage_sq_km DECIMAL(10, 2),
  settlement_count INTEGER,
  house_count INTEGER,
  total_daily_visitors INTEGER,
  average_daily_cases INTEGER,
  average_daily_complaints INTEGER,
  has_community_policing BOOLEAN DEFAULT false,
  community_policing_programs TEXT,
  security_challenges TEXT,
  crime_hotspots TEXT,
  
  -- Equipment and logistics
  communication_equipment TEXT,
  communication_equipment_status equipment_status,
  has_computer BOOLEAN DEFAULT true,
  computer_count INTEGER,
  has_internet BOOLEAN DEFAULT false,
  internet_connection_type TEXT,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_investigation_kit BOOLEAN DEFAULT false,
  investigation_equipment TEXT,
  equipment_challenges TEXT,
  
  -- Vehicles
  four_wheeler_count INTEGER,
  two_wheeler_count INTEGER,
  vehicle_status vehicle_status,
  operational_vehicle_count INTEGER,
  
  -- Crime statistics
  annual_case_count INTEGER,
  annual_resolved_case_count INTEGER,
  case_resolution_rate_percent DECIMAL(5, 2),
  major_crime_types TEXT,
  crime_trend TEXT,
  
  -- Traffic management (if applicable)
  manages_traffic BOOLEAN DEFAULT false,
  traffic_personnel_count INTEGER,
  major_traffic_points TEXT,
  traffic_management_tools TEXT,
  annual_traffic_violations INTEGER,
  
  -- Community relations
  community_engagement_programs TEXT,
  public_awareness_campaigns TEXT,
  school_liaison_programs BOOLEAN DEFAULT false,
  public_feedback_mechanism TEXT,
  citizen_satisfaction_level TEXT,
  
  -- Coordination
  coordination_with_other_agencies TEXT,
  joint_operations TEXT,
  coordination_with_judiciary TEXT,
  coordination_with_local_government TEXT,
  
  -- Workload and efficiency
  average_response_time_minutes INTEGER,
  workload_level workload_level,
  peak_workload_time TEXT,
  peak_workload_day TEXT,
  staff_efficiency_challenges TEXT,
  
  -- Training and capacity
  staff_training_programs TEXT,
  staff_expertise TEXT,
  capacity_building_needs TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  operational_challenges TEXT,
  resource_gaps TEXT,
  improvement_priorities TEXT,
  
  -- Budget and resources
  annual_budget_npr DECIMAL(14, 2),
  budget_sufficiency TEXT, -- Sufficient, Insufficient, etc.
  resource_constraints TEXT,
  
  -- Contact information
  contact_phone TEXT,
  emergency_phone TEXT,
  alternate_contact TEXT,
  email_address TEXT,
  
  -- Future development
  expansion_plans TEXT,
  modernization_needs TEXT,
  
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
CREATE INDEX IF NOT EXISTS idx_police_location_point ON acme_nepal_police_facility USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_police_facility_area ON acme_nepal_police_facility USING GIST (facility_area);
CREATE INDEX IF NOT EXISTS idx_police_jurisdiction_area ON acme_nepal_police_facility USING GIST (jurisdiction_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_police_name ON acme_nepal_police_facility(name);
CREATE INDEX IF NOT EXISTS idx_police_slug ON acme_nepal_police_facility(slug);
CREATE INDEX IF NOT EXISTS idx_police_facility_type ON acme_nepal_police_facility(facility_type);
CREATE INDEX IF NOT EXISTS idx_police_jurisdiction_type ON acme_nepal_police_facility(jurisdiction_type);
