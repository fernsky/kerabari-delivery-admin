-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the ward office table
CREATE TABLE IF NOT EXISTS acme_ward_office (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  ward_number INTEGER NOT NULL,
  status government_office_status NOT NULL,
  
  -- Location details
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type government_office_ownership_type NOT NULL,
  population_served INTEGER,
  area_covered_sq_km DECIMAL(10, 2),
  
  -- Building information
  building_ownership TEXT, -- Owned, Rented, etc.
  building_condition office_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  total_area_sqm DECIMAL(10, 2),
  has_meeting_room BOOLEAN DEFAULT false,
  meeting_room_capacity INTEGER,
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_area_capacity INTEGER,
  has_public_toilet BOOLEAN DEFAULT false,
  has_ramp BOOLEAN DEFAULT false,
  has_parking_space BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  electricity_availability_hours INTEGER,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT, -- Generator, Inverter, Solar, etc.
  has_water_supply BOOLEAN DEFAULT true,
  water_supply_source TEXT,
  has_internet BOOLEAN DEFAULT false,
  internet_type TEXT, -- Fiber, DSL, etc.
  internet_speed_mbps DECIMAL(8, 2),
  has_telephone_landline BOOLEAN DEFAULT false,
  has_public_wifi BOOLEAN DEFAULT false,
  
  -- Human resources
  ward_chairperson_name TEXT,
  ward_chairperson_contact TEXT,
  secretary_name TEXT,
  secretary_contact TEXT,
  total_staff_count INTEGER,
  administrative_staff_count INTEGER,
  technical_staff_count INTEGER,
  support_staff_count INTEGER,
  female_staff_count INTEGER,
  
  -- Service delivery
  service_hours TEXT, -- e.g., "Sunday-Friday 10:00-17:00"
  weekly_off_days TEXT, -- e.g., "Saturday"
  services_provided TEXT,
  average_daily_service_recipients INTEGER,
  most_requested_service TEXT,
  service_delivery_efficiency service_delivery_efficiency,
  
  -- Digital infrastructure
  digital_infrastructure_level digital_infrastructure_level,
  has_electronic_attendance BOOLEAN DEFAULT false,
  has_computers BOOLEAN DEFAULT true,
  computer_count INTEGER,
  has_document_management_system BOOLEAN DEFAULT false,
  has_online_services BOOLEAN DEFAULT false,
  online_service_details TEXT,
  
  -- Public communication and transparency
  has_citizen_charter BOOLEAN DEFAULT true,
  has_public_notice_board BOOLEAN DEFAULT true,
  has_suggestion_box BOOLEAN DEFAULT false,
  transparency_mechanism TEXT,
  
  -- Ward committee
  ward_committee_exists BOOLEAN DEFAULT true,
  ward_committee_size INTEGER,
  committee_meeting_frequency TEXT,
  public_participation_mechanism TEXT,
  
  -- Community coordination
  tole_development_committee_count INTEGER,
  active_community_groups TEXT,
  coordination_with_community_groups TEXT,
  
  -- Programs and activities
  major_development_projects TEXT,
  annual_programs TEXT,
  social_welfare_programs TEXT,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  revenue_collection_npr DECIMAL(18, 2),
  revenue_sources TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  service_delivery_challenges TEXT,
  priority_development_needs TEXT,
  
  -- Contact information
  office_phone_number TEXT,
  office_email TEXT,
  office_social_media TEXT,
  
  -- Visitor information
  visitor_volume office_visitor_volume,
  peak_visitor_days TEXT,
  waiting_time_average_minutes INTEGER,
  
  -- Disaster management
  disaster_response_capacity TEXT,
  emergency_contact_mechanism TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  ward_boundary GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_ward_office_location_point ON acme_ward_office USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_ward_office_building_footprint ON acme_ward_office USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_ward_office_ward_boundary ON acme_ward_office USING GIST (ward_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_ward_office_name ON acme_ward_office(name);
CREATE INDEX IF NOT EXISTS idx_ward_office_slug ON acme_ward_office(slug);
CREATE INDEX IF NOT EXISTS idx_ward_office_ward_number ON acme_ward_office(ward_number);
CREATE INDEX IF NOT EXISTS idx_ward_office_status ON acme_ward_office(status);
