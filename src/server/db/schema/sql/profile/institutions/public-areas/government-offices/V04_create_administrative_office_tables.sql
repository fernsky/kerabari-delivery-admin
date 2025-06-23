-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Administrative office type enum
DO $$ 
BEGIN
  CREATE TYPE administrative_office_type AS ENUM (
    'DISTRICT_ADMINISTRATION_OFFICE',
    'DISTRICT_COORDINATION_COMMITTEE',
    'AREA_ADMINISTRATION_OFFICE',
    'REVENUE_OFFICE',
    'LAND_REVENUE_OFFICE',
    'DISTRICT_COURT',
    'TRANSPORTATION_MANAGEMENT_OFFICE',
    'DISTRICT_FOREST_OFFICE',
    'DISTRICT_AGRICULTURE_OFFICE',
    'DISTRICT_EDUCATION_OFFICE',
    'DISTRICT_HEALTH_OFFICE',
    'DISTRICT_VETERINARY_OFFICE',
    'DISTRICT_POSTAL_OFFICE',
    'DISTRICT_TREASURY_OFFICE',
    'DISTRICT_ELECTION_OFFICE',
    'DISTRICT_STATISTICS_OFFICE',
    'DISASTER_MANAGEMENT_OFFICE',
    'IMMIGRATION_OFFICE',
    'POLICE_OFFICE',
    'ARMED_POLICE_OFFICE',
    'ARMY_OFFICE',
    'DISTRICT_ATTORNEY_OFFICE',
    'DISTRICT_GOVERNMENT_ATTORNEY_OFFICE',
    'DISTRICT_LAND_SURVEY_OFFICE',
    'SMALL_COTTAGE_INDUSTRY_OFFICE',
    'INLAND_REVENUE_OFFICE',
    'IRRIGATION_OFFICE',
    'DRINKING_WATER_OFFICE',
    'ROAD_DIVISION_OFFICE',
    'ELECTRICITY_AUTHORITY_OFFICE',
    'TELECOMMUNICATIONS_OFFICE',
    'DISTRICT_DEVELOPMENT_COMMITTEE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the administrative office table
CREATE TABLE IF NOT EXISTS acme_administrative_office (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  office_type administrative_office_type NOT NULL,
  status government_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type government_office_ownership_type NOT NULL,
  parent_ministry TEXT,
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
  has_conference_hall BOOLEAN DEFAULT false,
  conference_hall_capacity INTEGER,
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_area_capacity INTEGER,
  has_public_information_desk BOOLEAN DEFAULT true,
  has_separate_toilets BOOLEAN DEFAULT true,
  has_disabled_access_facilities BOOLEAN DEFAULT false,
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
  has_internal_network BOOLEAN DEFAULT false,
  
  -- Human resources
  office_head_position TEXT,
  office_head_name TEXT,
  office_head_contact TEXT,
  total_sanctioned_positions INTEGER,
  total_filled_positions INTEGER,
  total_vacant_positions INTEGER,
  officer_level_count INTEGER,
  assistant_level_count INTEGER,
  support_staff_count INTEGER,
  contract_staff_count INTEGER,
  female_staff_percentage DECIMAL(5, 2),
  staff_adequacy TEXT, -- Assessment of staffing levels
  has_staff_training_program BOOLEAN DEFAULT false,
  
  -- Service delivery
  service_hours TEXT, -- e.g., "Sunday-Friday 10:00-17:00"
  weekly_off_days TEXT, -- e.g., "Saturday"
  major_services_provided TEXT,
  service_standards_published BOOLEAN DEFAULT false,
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
  cctv_count INTEGER,
  has_electronic_service_tracking BOOLEAN DEFAULT false,
  has_website BOOLEAN DEFAULT false,
  website_url TEXT,
  has_online_service_portal BOOLEAN DEFAULT false,
  online_services TEXT,
  digitization_level TEXT, -- E.g., "Full", "Partial", "Initial stage"
  has_digital_record_keeping BOOLEAN DEFAULT false,
  has_digital_payment BOOLEAN DEFAULT false,
  digital_payment_methods TEXT,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  revenue_collection_npr DECIMAL(18, 2),
  major_expense_categories TEXT,
  financial_management_system TEXT,
  
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
  
  -- Coordination and cooperation
  coordination_with_local_governments TEXT,
  coordination_with_other_agencies TEXT,
  participates_in_district_committees BOOLEAN DEFAULT true,
  
  -- Performance and evaluation
  last_performance_review_date DATE,
  performance_evaluation_mechanism TEXT,
  has_annual_work_plan BOOLEAN DEFAULT true,
  has_monitoring_system BOOLEAN DEFAULT false,
  achieved_targets_percentage DECIMAL(5, 2),
  
  -- Security
  has_security_staff BOOLEAN DEFAULT true,
  security_staff_count INTEGER,
  has_security_equipment BOOLEAN DEFAULT false,
  security_equipment_details TEXT,
  document_security_measures TEXT,
  
  -- Challenges and future plans
  major_challenges TEXT,
  infrastructure_development_plans TEXT,
  service_improvement_plans TEXT,
  
  -- Contact information
  office_phone_number TEXT,
  office_fax_number TEXT,
  office_email TEXT,
  emergency_contact_number TEXT,
  
  -- Visitor information
  visitor_volume office_visitor_volume,
  peak_visitor_days TEXT,
  visitor_management_system TEXT,
  
  -- Disaster preparedness
  has_disaster_response_plan BOOLEAN DEFAULT false,
  has_emergency_evacuation_plan BOOLEAN DEFAULT false,
  has_emergency_supplies BOOLEAN DEFAULT false,
  
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
CREATE INDEX IF NOT EXISTS idx_administrative_office_location_point ON acme_administrative_office USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_administrative_office_building_footprint ON acme_administrative_office USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_administrative_office_jurisdiction_boundary ON acme_administrative_office USING GIST (jurisdiction_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_administrative_office_name ON acme_administrative_office(name);
CREATE INDEX IF NOT EXISTS idx_administrative_office_slug ON acme_administrative_office(slug);
CREATE INDEX IF NOT EXISTS idx_administrative_office_type ON acme_administrative_office(office_type);
CREATE INDEX IF NOT EXISTS idx_administrative_office_status ON acme_administrative_office(status);
