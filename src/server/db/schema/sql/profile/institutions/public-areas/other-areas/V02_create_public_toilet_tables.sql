-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Public toilet type enum
DO $$ 
BEGIN
  CREATE TYPE public_toilet_type AS ENUM (
    'PERMANENT_FACILITY', 'PORTABLE_FACILITY', 'MOBILE_FACILITY', 'URINALS_ONLY',
    'FULL_SERVICE', 'PAY_AND_USE', 'FREE_FACILITY', 'ECO_TOILET',
    'BIODIGESTER_TOILET', 'DISABILITY_FRIENDLY', 'SMART_TOILET', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Cleanliness level enum
DO $$ 
BEGIN
  CREATE TYPE cleanliness_level AS ENUM (
    'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Toilet management type enum
DO $$ 
BEGIN
  CREATE TYPE toilet_management_type AS ENUM (
    'GOVERNMENT_MANAGED', 'MUNICIPALITY_MANAGED', 'COMMUNITY_MANAGED', 'PRIVATE_OPERATED',
    'PUBLIC_PRIVATE_PARTNERSHIP', 'NGO_MANAGED', 'USER_COMMITTEE_MANAGED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Sewage management system enum
DO $$ 
BEGIN
  CREATE TYPE sewage_management_system AS ENUM (
    'CENTRALIZED_SEWERAGE', 'SEPTIC_TANK', 'BIODIGESTER', 'COMPOSTING_SYSTEM',
    'ECOLOGICAL_SANITATION', 'CONVENTIONAL_PIT_LATRINE', 'POUR_FLUSH_TOILET', 
    'CONNECTION_TO_TREATMENT_PLANT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the public_toilet table
CREATE TABLE IF NOT EXISTS acme_public_toilet (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  toilet_type public_toilet_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  location_type TEXT, -- Bus stand, market, park, etc.
  
  -- Basic information
  established_year INTEGER,
  management_type toilet_management_type NOT NULL,
  managing_body TEXT,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  building_condition TEXT,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  
  -- Toilet facilities
  male_section_available BOOLEAN DEFAULT true,
  female_section_available BOOLEAN DEFAULT true,
  third_gender_section_available BOOLEAN DEFAULT false,
  gender_neutral_available BOOLEAN DEFAULT false,
  
  -- Toilet counts
  male_toilet_count INTEGER,
  female_toilet_count INTEGER,
  urinal_count INTEGER,
  handicap_accessible_toilet_count INTEGER,
  family_toilet_count INTEGER,
  children_toilet_count INTEGER,
  
  -- Additional facilities
  has_sinks BOOLEAN DEFAULT true,
  sink_count INTEGER,
  has_hand_dryers BOOLEAN DEFAULT false,
  hand_dryer_count INTEGER,
  has_mirrors BOOLEAN DEFAULT false,
  mirror_count INTEGER,
  has_baby_changing_station BOOLEAN DEFAULT false,
  baby_changing_station_count INTEGER,
  has_showers BOOLEAN DEFAULT false,
  shower_count INTEGER,
  has_sanitary_napkin_vending_machine BOOLEAN DEFAULT false,
  has_sanitary_napkin_disposal BOOLEAN DEFAULT false,
  has_toilet_paper_dispenser BOOLEAN DEFAULT false,
  has_soap_dispenser BOOLEAN DEFAULT false,
  
  -- Water and sanitation
  has_water_supply BOOLEAN DEFAULT true,
  water_supply_type TEXT, -- Municipal, tanker, well, etc.
  water_storage_facility BOOLEAN DEFAULT false,
  water_storage_capacity_liters INTEGER,
  sewage_management_system sewage_management_system,
  septic_tank_cleaning_frequency TEXT,
  last_septic_tank_cleaning_date DATE,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  has_proper_lighting BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  has_proper_ventilation BOOLEAN DEFAULT true,
  has_waste_management_system BOOLEAN DEFAULT true,
  waste_management_details TEXT,
  
  -- Usage and operations
  operating_hours TEXT,
  opening_time TIME,
  closing_time TIME,
  is_24_hours BOOLEAN DEFAULT false,
  usage_intensity usage_intensity,
  average_daily_users INTEGER,
  
  -- Accessibility
  accessibility_level TEXT, -- Good, Moderate, Poor, etc.
  has_ramp BOOLEAN DEFAULT false,
  has_wheelchair_access BOOLEAN DEFAULT false,
  has_handrails BOOLEAN DEFAULT false,
  has_wide_entrance_doors BOOLEAN DEFAULT false,
  has_adequate_maneuvering_space BOOLEAN DEFAULT false,
  has_visual_signage BOOLEAN DEFAULT false,
  has_braille_signage BOOLEAN DEFAULT false,
  distance_from_main_road_meters INTEGER,
  
  -- Fees and financial aspects
  has_usage_fee BOOLEAN DEFAULT false,
  usage_fee_npr DECIMAL(10, 2),
  fee_differentiated_by_gender BOOLEAN DEFAULT false,
  fee_collection_method TEXT,
  monthly_maintenance_cost_npr DECIMAL(10, 2),
  annual_operating_cost_npr DECIMAL(14, 2),
  funding_source TEXT,
  is_financially_sustainable BOOLEAN DEFAULT false,
  
  -- Maintenance and cleaning
  daily_cleaning_frequency INTEGER,
  cleaning_schedule TEXT,
  has_cleaning_staff BOOLEAN DEFAULT false,
  cleaning_staff_count INTEGER,
  cleanliness_level cleanliness_level,
  maintenance_responsibility maintenance_responsibility,
  has_complaint_system BOOLEAN DEFAULT false,
  complaint_resolution_process TEXT,
  
  -- Safety and security
  has_caretaker BOOLEAN DEFAULT false,
  caretaker_presence_hours TEXT,
  security_measures TEXT,
  has_dedicated_security BOOLEAN DEFAULT false,
  has_emergency_light BOOLEAN DEFAULT false,
  has_emergency_contact BOOLEAN DEFAULT false,
  emergency_contact_details TEXT,
  has_first_aid_kit BOOLEAN DEFAULT false,
  
  -- Hygiene promotion
  has_handwashing_instructions BOOLEAN DEFAULT false,
  has_hygiene_promotion_materials BOOLEAN DEFAULT false,
  conduct_awareness_programs BOOLEAN DEFAULT false,
  awareness_frequency TEXT,
  
  -- Environmental aspects
  has_eco_friendly_features BOOLEAN DEFAULT false,
  eco_friendly_feature_details TEXT,
  has_water_conservation_measures BOOLEAN DEFAULT false,
  water_conservation_details TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  maintenance_challenges TEXT,
  user_behavior_challenges TEXT,
  financial_challenges TEXT,
  future_improvement_plans TEXT,
  necessary_upgrades TEXT,
  
  -- Community involvement
  community_sensitization_efforts TEXT,
  feedback_mechanism TEXT,
  user_satisfaction_level TEXT,
  community_contribution TEXT,
  
  -- Contact information
  contact_person_name TEXT,
  contact_person_designation TEXT,
  contact_phone TEXT,
  alternate_contact_phone TEXT,
  
  -- Linkages to other entities
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_public_spaces JSONB DEFAULT '[]'::jsonb,
  linked_bus_stands JSONB DEFAULT '[]'::jsonb,
  linked_markets JSONB DEFAULT '[]'::jsonb,
  linked_parking_areas JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_public_toilet_location_point ON acme_public_toilet USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_public_toilet_building_footprint ON acme_public_toilet USING GIST (building_footprint);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_public_toilet_name ON acme_public_toilet(name);
CREATE INDEX IF NOT EXISTS idx_public_toilet_slug ON acme_public_toilet(slug);
CREATE INDEX IF NOT EXISTS idx_public_toilet_type ON acme_public_toilet(toilet_type);
CREATE INDEX IF NOT EXISTS idx_public_toilet_management ON acme_public_toilet(management_type);
