-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Land survey branch type enum
DO $$ 
BEGIN
  CREATE TYPE land_survey_branch_type AS ENUM (
    'DISTRICT_SURVEY_OFFICE',
    'SURVEY_SECTION_OFFICE',
    'CADASTRAL_SURVEY_BRANCH',
    'FIELD_SURVEY_OFFICE',
    'MAP_PRODUCTION_CENTER',
    'LAND_ADMINISTRATION_SUPPORT_OFFICE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Survey equipment condition enum
DO $$ 
BEGIN
  CREATE TYPE survey_equipment_condition AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'NEEDS_MAINTENANCE',
    'OUTDATED',
    'NON_FUNCTIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the land survey branch table
CREATE TABLE IF NOT EXISTS acme_land_survey_branch (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  branch_type land_survey_branch_type NOT NULL,
  status government_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type government_office_ownership_type NOT NULL,
  parent_department TEXT,
  jurisdiction_area TEXT,
  
  -- Building information
  building_ownership TEXT, -- Owned, Rented, etc.
  building_condition office_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  total_area_sqm DECIMAL(10, 2),
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_area_capacity INTEGER,
  has_map_display_room BOOLEAN DEFAULT false,
  has_map_storage_facility BOOLEAN DEFAULT true,
  map_storage_condition TEXT,
  has_public_service_area BOOLEAN DEFAULT true,
  has_technical_work_area BOOLEAN DEFAULT true,
  has_separate_toilets BOOLEAN DEFAULT false,
  has_parking_space BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  
  -- Equipment and technical capacity
  has_digital_survey_equipment BOOLEAN DEFAULT false,
  digital_survey_equipment_details TEXT,
  has_gps_equipment BOOLEAN DEFAULT false,
  gps_equipment_count INTEGER,
  gps_equipment_condition survey_equipment_condition,
  has_total_station BOOLEAN DEFAULT false,
  total_station_count INTEGER,
  total_station_condition survey_equipment_condition,
  has_theodolite BOOLEAN DEFAULT false,
  theodolite_count INTEGER,
  theodolite_condition survey_equipment_condition,
  has_level_machine BOOLEAN DEFAULT false,
  level_machine_count INTEGER,
  level_machine_condition survey_equipment_condition,
  has_map_digitization_equipment BOOLEAN DEFAULT false,
  digitization_equipment_details TEXT,
  has_plotter BOOLEAN DEFAULT false,
  plotter_count INTEGER,
  has_large_format_scanner BOOLEAN DEFAULT false,
  scanner_count INTEGER,
  has_orthophoto_capability BOOLEAN DEFAULT false,
  has_aerial_survey_capability BOOLEAN DEFAULT false,
  aerial_survey_details TEXT,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  electricity_availability_hours INTEGER,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT, -- Generator, Inverter, Solar, etc.
  has_water_supply BOOLEAN DEFAULT true,
  has_internet BOOLEAN DEFAULT true,
  internet_type TEXT, -- Fiber, DSL, etc.
  internet_speed_mbps DECIMAL(8, 2),
  has_telephone_landline BOOLEAN DEFAULT true,
  
  -- Human resources
  office_chief_position TEXT,
  office_chief_name TEXT,
  office_chief_contact TEXT,
  total_sanctioned_positions INTEGER,
  total_filled_positions INTEGER,
  total_vacant_positions INTEGER,
  surveyor_count INTEGER,
  amin_count INTEGER, -- Land measuring officials
  technical_staff_count INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  staff_with_gis_training_count INTEGER,
  female_staff_percentage DECIMAL(5, 2),
  staff_adequacy TEXT, -- Assessment of staffing levels
  has_staff_training_program BOOLEAN DEFAULT false,
  
  -- Service delivery
  service_hours TEXT, -- e.g., "Sunday-Friday 10:00-17:00"
  weekly_off_days TEXT, -- e.g., "Saturday"
  major_services_provided TEXT,
  average_daily_service_recipients INTEGER,
  peak_time TEXT,
  peak_season TEXT,
  field_survey_requests_monthly INTEGER,
  field_surveys_completed_monthly INTEGER,
  average_field_survey_completion_days INTEGER,
  average_service_time_minutes INTEGER,
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
  has_online_service_portal BOOLEAN DEFAULT false,
  online_services TEXT,
  has_digital_cadastre BOOLEAN DEFAULT false,
  digital_cadastre_coverage_percentage DECIMAL(5, 2),
  has_gis_system BOOLEAN DEFAULT false,
  gis_software_used TEXT,
  has_digital_map_repository BOOLEAN DEFAULT false,
  digital_map_coverage_percentage DECIMAL(5, 2),
  has_backup_system BOOLEAN DEFAULT false,
  backup_system_details TEXT,
  
  -- Map archive
  total_map_sheets_archived INTEGER,
  digitized_maps_percentage DECIMAL(5, 2),
  oldest_map_year INTEGER,
  map_update_frequency TEXT,
  map_preservation_method TEXT,
  
  -- Land records
  total_parcels_in_jurisdiction INTEGER,
  digitized_parcels_percentage DECIMAL(5, 2),
  land_record_digitization_status TEXT,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  revenue_collection_npr DECIMAL(18, 2),
  service_fee_structure TEXT,
  
  -- Public communication and transparency
  has_citizen_charter BOOLEAN DEFAULT true,
  has_information_officer BOOLEAN DEFAULT true,
  information_officer_name TEXT,
  information_officer_contact TEXT,
  has_public_notice_board BOOLEAN DEFAULT true,
  has_service_fee_display BOOLEAN DEFAULT true,
  has_suggestion_box BOOLEAN DEFAULT false,
  
  -- Coordination and cooperation
  coordination_with_land_revenue_office TEXT,
  coordination_with_municipality TEXT,
  coordination_with_other_agencies TEXT,
  
  -- Performance and challenges
  annual_survey_target INTEGER,
  annual_survey_achievement INTEGER,
  boundary_disputes_handled_annually INTEGER,
  major_challenges TEXT,
  
  -- Future plans
  modernization_plans TEXT,
  service_improvement_plans TEXT,
  digitization_plans TEXT,
  
  -- Contact information
  office_phone_number TEXT,
  office_email TEXT,
  emergency_field_contact TEXT,
  
  -- Visitor information
  visitor_volume office_visitor_volume,
  peak_visitor_days TEXT,
  visitor_management_system TEXT,
  
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
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_location_point ON acme_land_survey_branch USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_building_footprint ON acme_land_survey_branch USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_jurisdiction_boundary ON acme_land_survey_branch USING GIST (jurisdiction_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_name ON acme_land_survey_branch(name);
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_slug ON acme_land_survey_branch(slug);
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_type ON acme_land_survey_branch(branch_type);
CREATE INDEX IF NOT EXISTS idx_land_survey_branch_status ON acme_land_survey_branch(status);
