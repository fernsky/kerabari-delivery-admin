-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Municipality office type enum
DO $$ 
BEGIN
  CREATE TYPE municipality_office_type AS ENUM (
    'METROPOLITAN_CITY_OFFICE', 'SUB_METROPOLITAN_CITY_OFFICE', 'MUNICIPALITY_OFFICE',
    'RURAL_MUNICIPALITY_OFFICE', 'WARD_OFFICE', 'DISTRICT_COORDINATION_COMMITTEE',
    'SPECIALIZED_MUNICIPAL_UNIT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Service performance enum
DO $$ 
BEGIN
  CREATE TYPE service_performance AS ENUM (
    'EXCELLENT', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the municipality office table
CREATE TABLE IF NOT EXISTS acme_municipality_office (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  office_type municipality_office_type NOT NULL,
  status government_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type government_office_ownership_type NOT NULL,
  jurisdiction_area TEXT,
  population_served INTEGER,
  
  -- Building information
  building_ownership TEXT, -- Owned, Rented, etc.
  building_condition office_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  total_area_sqm DECIMAL(10, 2),
  has_meeting_hall BOOLEAN DEFAULT false,
  meeting_hall_capacity INTEGER,
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_area_capacity INTEGER,
  has_public_information_desk BOOLEAN DEFAULT true,
  has_separate_toilet_for_public BOOLEAN DEFAULT false,
  has_ramp BOOLEAN DEFAULT false,
  has_elevator BOOLEAN DEFAULT false,
  has_parking_space BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  electricity_availability_hours INTEGER,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT, -- Generator, Inverter, Solar, etc.
  has_water_supply BOOLEAN DEFAULT true,
  water_supply_source TEXT,
  has_internet BOOLEAN DEFAULT true,
  internet_type TEXT, -- Fiber, DSL, etc.
  internet_speed_mbps DECIMAL(8, 2),
  has_telephone_landline BOOLEAN DEFAULT true,
  has_public_wifi BOOLEAN DEFAULT false,
  
  -- Human resources
  total_sanctioned_positions INTEGER,
  total_filled_positions INTEGER,
  total_vacant_positions INTEGER,
  officer_count INTEGER,
  assistant_level_count INTEGER,
  support_staff_count INTEGER,
  contract_staff_count INTEGER,
  female_staff_percentage DECIMAL(5, 2),
  staff_adequacy TEXT, -- Assessment of staffing levels
  
  -- Service delivery
  service_hours TEXT, -- e.g., "Sunday-Friday 10:00-17:00"
  weekly_off_days TEXT, -- e.g., "Saturday"
  major_services_provided TEXT,
  average_daily_service_recipients INTEGER,
  peak_time TEXT,
  peak_season TEXT,
  average_service_time_minutes INTEGER,
  has_token_system BOOLEAN DEFAULT false,
  token_system_type TEXT,
  service_delivery_efficiency service_delivery_efficiency,
  complaint_handling_mechanism TEXT,
  public_satisfaction_level service_performance,
  
  -- Digital infrastructure
  digital_infrastructure_level digital_infrastructure_level,
  has_electronic_attendance BOOLEAN DEFAULT false,
  has_cctvs BOOLEAN DEFAULT false,
  has_electronic_service_tracking BOOLEAN DEFAULT false,
  has_website BOOLEAN DEFAULT false,
  website_url TEXT,
  has_mobile_app BOOLEAN DEFAULT false,
  mobile_app_details TEXT,
  has_online_service_portal BOOLEAN DEFAULT false,
  online_services TEXT,
  digitization_status TEXT,
  has_digital_payment BOOLEAN DEFAULT false,
  digital_payment_methods TEXT,
  has_gis_system BOOLEAN DEFAULT false,
  has_digital_citizen_charter BOOLEAN DEFAULT false,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  revenue_collection_npr DECIMAL(18, 2),
  major_revenue_sources TEXT,
  budget_transparency_mechanism TEXT,
  
  -- Public communication and transparency
  has_citizen_charter BOOLEAN DEFAULT true,
  has_information_officer BOOLEAN DEFAULT true,
  information_officer_name TEXT,
  information_officer_contact TEXT,
  has_public_notice_board BOOLEAN DEFAULT true,
  has_suggestion_box BOOLEAN DEFAULT false,
  has_regular_public_hearings BOOLEAN DEFAULT false,
  public_hearing_frequency TEXT,
  has_social_media_presence BOOLEAN DEFAULT false,
  social_media_handles TEXT,
  information_disclosure_practices TEXT,
  
  -- Coordination and cooperation
  coordination_with_provincial_offices TEXT,
  coordination_with_federal_offices TEXT,
  coordination_with_other_local_governments TEXT,
  coordination_with_ngos TEXT,
  coordination_with_private_sector TEXT,
  
  -- Performance and evaluation
  last_performance_review_date DATE,
  performance_evaluation_mechanism TEXT,
  innovation_initiatives TEXT,
  awards_recognitions TEXT,
  
  -- Governance aspects
  frequency_of_municipal_assembly TEXT,
  frequency_of_executive_meetings TEXT,
  decision_making_process TEXT,
  has_active_committees BOOLEAN DEFAULT true,
  active_committee_details TEXT,
  
  -- Challenges and future plans
  major_challenges TEXT,
  infrastructure_development_plans TEXT,
  service_improvement_plans TEXT,
  
  -- Contact information
  mayor_chairperson_name TEXT,
  mayor_chairperson_contact TEXT,
  administrative_head_name TEXT,
  administrative_head_position TEXT,
  administrative_head_contact TEXT,
  office_phone_number TEXT,
  office_email TEXT,
  
  -- Visitor information
  visitor_volume office_visitor_volume,
  peak_visitor_days TEXT,
  visitor_management_system TEXT,
  accessibility_for_elderly TEXT,
  accessibility_for_disabled TEXT,
  
  -- Disaster preparedness
  disaster_response_plan BOOLEAN DEFAULT false,
  emergency_response_equipment TEXT,
  emergency_contact_list BOOLEAN DEFAULT true,
  
  -- External collaboration
  sister_city_relationships TEXT,
  international_partnerships TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  jurisdiction_boundary GEOMETRY(MultiPolygon, 4326),
  
  -- Timestamps and audit fields
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
CREATE INDEX IF NOT EXISTS idx_municipality_office_location_point ON acme_municipality_office USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_municipality_office_building_footprint ON acme_municipality_office USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_municipality_office_jurisdiction_boundary ON acme_municipality_office USING GIST (jurisdiction_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_municipality_office_name ON acme_municipality_office(name);
CREATE INDEX IF NOT EXISTS idx_municipality_office_slug ON acme_municipality_office(slug);
CREATE INDEX IF NOT EXISTS idx_municipality_office_type ON acme_municipality_office(office_type);
CREATE INDEX IF NOT EXISTS idx_municipality_office_status ON acme_municipality_office(status);
