-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create checkpoint type enum
DO $$ 
BEGIN
  CREATE TYPE checkpoint_type AS ENUM (
    'ROAD',
    'RAIL',
    'RIVER',
    'BRIDGE',
    'MOUNTAIN_PASS',
    'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create security level enum
DO $$ 
BEGIN
  CREATE TYPE security_level AS ENUM (
    'HIGH',
    'MEDIUM',
    'STANDARD',
    'BASIC',
    'MINIMAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the customs_checkpoint table
CREATE TABLE IF NOT EXISTS acme_customs_checkpoint (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  checkpoint_type checkpoint_type NOT NULL,
  status customs_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  border_connection border_connection NOT NULL,
  connected_country TEXT,
  connected_international_checkpoint TEXT, -- Name of checkpoint on other side of border
  distance_to_nearest_town_km DECIMAL(8, 2),
  
  -- Basic information
  establishment_year INTEGER,
  code_number VARCHAR(50),
  parent_customs_office_id VARCHAR(36),
  parent_customs_office_name TEXT,
  distance_from_parent_office_km DECIMAL(8, 2),
  
  -- Physical infrastructure
  gate_count INTEGER,
  inspection_booth_count INTEGER,
  barrier_type TEXT,
  has_inspection_yard BOOLEAN DEFAULT true,
  inspection_yard_area_sq_m DECIMAL(10, 2),
  has_separate_entry_exit BOOLEAN DEFAULT false,
  vehicle_lanes_inbound INTEGER,
  vehicle_lanes_outbound INTEGER,
  pedestrian_crossing_available BOOLEAN DEFAULT true,
  has_separate_commercial_lane BOOLEAN DEFAULT false,
  facility_condition facility_condition,
  
  -- Security features
  security_level security_level,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_boom_barriers BOOLEAN DEFAULT true,
  has_vehicle_scanners BOOLEAN DEFAULT false,
  scanner_type TEXT,
  has_biometric_verification BOOLEAN DEFAULT false,
  has_document_verification_equipment BOOLEAN DEFAULT true,
  has_contraband_detection_equipment BOOLEAN DEFAULT false,
  contraband_detection_details TEXT,
  security_personnel_count INTEGER,
  armed_security_presence BOOLEAN DEFAULT true,
  
  -- Operating details
  operating_hours TEXT,
  days_operational_per_week INTEGER,
  is_24_7_operation BOOLEAN DEFAULT false,
  seasonal_closures TEXT,
  average_processing_time_minutes INTEGER,
  max_processing_capacity_vehicles_per_day INTEGER,
  max_processing_capacity_people_per_day INTEGER,
  has_fast_track_lane BOOLEAN DEFAULT false,
  fast_track_eligibility TEXT,
  
  -- Traffic statistics
  average_daily_vehicle_crossings INTEGER,
  average_daily_pedestrian_crossings INTEGER,
  peak_hour_vehicle_traffic INTEGER,
  peak_hour_pedestrian_traffic INTEGER,
  commercial_vehicle_percentage INTEGER,
  passenger_vehicle_percentage INTEGER,
  seasonal_traffic_variations TEXT,
  
  -- Services and facilities
  services_provided TEXT,
  document_requirements TEXT,
  has_customs_clearance BOOLEAN DEFAULT true,
  customs_clearance_capacity TEXT,
  has_immigration_services BOOLEAN DEFAULT true,
  has_quarantine_services BOOLEAN DEFAULT false,
  quarantine_details TEXT,
  has_currency_exchange BOOLEAN DEFAULT false,
  currency_exchange_details TEXT,
  has_duty_free_shop BOOLEAN DEFAULT false,
  
  -- Public amenities
  has_waiting_hall BOOLEAN DEFAULT false,
  waiting_hall_capacity INTEGER,
  has_public_toilet BOOLEAN DEFAULT false,
  has_food_stall BOOLEAN DEFAULT false,
  has_drinking_water BOOLEAN DEFAULT false,
  has_public_telephone BOOLEAN DEFAULT false,
  has_first_aid BOOLEAN DEFAULT false,
  
  -- Staff details
  total_staff_count INTEGER,
  customs_officer_count INTEGER,
  immigration_officer_count INTEGER,
  security_staff_count INTEGER,
  administrative_staff_count INTEGER,
  staffing_challenges TEXT,
  
  -- Challenges and issues
  common_crossing_issues TEXT,
  smuggling_concerns TEXT,
  traffic_management_challenges TEXT,
  seasonal_challenges TEXT,
  
  -- Development plans
  planned_upgrades TEXT,
  expansion_plans TEXT,
  modernization_priorities TEXT,
  funding_requirements TEXT,
  
  -- Coordination aspects
  bilateral_checkpoint_agreement TEXT,
  coordination_mechanism TEXT,
  joint_operations BOOLEAN DEFAULT false,
  joint_operations_details TEXT,
  
  -- Trade and transport
  main_commodities_crossing TEXT,
  typical_cargo_types TEXT,
  hazardous_materials_handling BOOLEAN DEFAULT false,
  hazardous_materials_procedures TEXT,
  
  -- Special provisions
  has_special_economic_zone_link BOOLEAN DEFAULT false,
  sez_details TEXT,
  special_trading_arrangements TEXT,
  simplified_procedures TEXT,
  
  -- Accessibility
  road_condition_approaching TEXT,
  nearest_fueling_station_km DECIMAL(8, 2),
  nearest_rest_area_km DECIMAL(8, 2),
  special_access_requirements TEXT,
  
  -- Environmental aspects
  environmental_challenges TEXT,
  waste_management_system TEXT,
  carbon_footprint_measures TEXT,
  
  -- Contact information
  checkpoint_manager TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  emergency_contact TEXT,
  
  -- Linkages to other entities
  linked_transportation_routes JSONB DEFAULT '[]'::jsonb,
  linked_rest_areas JSONB DEFAULT '[]'::jsonb,
  linked_service_centers JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  checkpoint_area GEOMETRY(Polygon, 4326),
  access_routes GEOMETRY(MultiLineString, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_location_point ON acme_customs_checkpoint USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_area ON acme_customs_checkpoint USING GIST (checkpoint_area);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_routes ON acme_customs_checkpoint USING GIST (access_routes);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_name ON acme_customs_checkpoint(name);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_slug ON acme_customs_checkpoint(slug);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_type ON acme_customs_checkpoint(checkpoint_type);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_status ON acme_customs_checkpoint(status);
CREATE INDEX IF NOT EXISTS idx_customs_checkpoint_border ON acme_customs_checkpoint(border_connection);
