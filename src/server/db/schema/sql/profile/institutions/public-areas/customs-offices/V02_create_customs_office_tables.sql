-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create the customs_office table
CREATE TABLE IF NOT EXISTS acme_customs_office (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  office_type customs_office_type NOT NULL,
  status customs_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  border_connection border_connection NOT NULL,
  connected_country TEXT,
  nearest_international_city TEXT,
  nearest_international_city_distance_km DECIMAL(8, 2),
  
  -- Basic information
  establishment_year INTEGER,
  code_number VARCHAR(50),
  iso_code VARCHAR(20),
  customs_district TEXT,
  parent_customs_office_id VARCHAR(36),
  
  -- Administrative details
  governing_authority TEXT,
  reporting_authority TEXT,
  administrative_hierarchy TEXT,
  jurisdiction_area TEXT,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  built_area_sq_m DECIMAL(10, 2),
  office_building_count INTEGER,
  warehouse_count INTEGER,
  warehouse_capacity_sq_m DECIMAL(10, 2),
  inspection_facility_count INTEGER,
  infrastructure_condition facility_condition,
  has_container_yard BOOLEAN DEFAULT false,
  container_yard_area_sq_m DECIMAL(10, 2),
  has_truck_parking BOOLEAN DEFAULT false,
  truck_parking_capacity INTEGER,
  has_weighbridge BOOLEAN DEFAULT true,
  weighbridge_count INTEGER,
  has_scanner_facility BOOLEAN DEFAULT false,
  scanner_facility_details TEXT,
  has_quarantine_facility BOOLEAN DEFAULT false,
  quarantine_facility_details TEXT,
  has_laboratory BOOLEAN DEFAULT false,
  laboratory_facilities TEXT,
  
  -- Modernization and technology
  modernization_level modernization_level,
  has_computerized_system BOOLEAN DEFAULT false,
  software_system_name TEXT,
  system_implementation_year INTEGER,
  has_internet_connectivity BOOLEAN DEFAULT true,
  internet_reliability TEXT,
  has_electronic_documentation BOOLEAN DEFAULT false,
  has_single_window_system BOOLEAN DEFAULT false,
  single_window_details TEXT,
  has_risk_management_system BOOLEAN DEFAULT false,
  
  -- Staff and human resources
  total_staff_count INTEGER,
  customs_officer_count INTEGER,
  administrative_staff_count INTEGER,
  technical_staff_count INTEGER,
  security_personnel_count INTEGER,
  staff_housing_available BOOLEAN DEFAULT false,
  staff_housing_units INTEGER,
  
  -- Operating details
  operating_hours TEXT,
  days_operational_per_week INTEGER,
  seasonal_variations TEXT,
  processing_capacity_per_day INTEGER,
  average_processing_time_minutes INTEGER,
  has_expedited_clearance BOOLEAN DEFAULT false,
  expedited_clearance_details TEXT,
  
  -- Trade statistics
  annual_trade_value_npr DECIMAL(18, 2),
  annual_import_value_npr DECIMAL(18, 2),
  annual_export_value_npr DECIMAL(18, 2),
  annual_revenue_collection_npr DECIMAL(18, 2),
  trade_volume_category customs_trade_volume,
  trade_direction trade_direction,
  top_import_commodities TEXT,
  top_export_commodities TEXT,
  primary_trading_partners TEXT,
  annual_vehicle_movement INTEGER,
  annual_passenger_movement INTEGER,
  
  -- Services and facilities
  services_provided TEXT,
  customs_clearance_procedures TEXT,
  document_requirements TEXT,
  payment_methods_accepted TEXT,
  has_bank_branch BOOLEAN DEFAULT false,
  bank_names TEXT,
  has_currency_exchange BOOLEAN DEFAULT false,
  has_customs_broker_offices BOOLEAN DEFAULT true,
  customs_broker_count INTEGER,
  has_freight_forwarders BOOLEAN DEFAULT false,
  freight_forwarder_count INTEGER,
  
  -- Public amenities
  has_public_toilet BOOLEAN DEFAULT false,
  has_waiting_area BOOLEAN DEFAULT false,
  waiting_area_capacity INTEGER,
  has_food_services BOOLEAN DEFAULT false,
  food_service_details TEXT,
  has_accommodation_nearby BOOLEAN DEFAULT false,
  accommodation_details TEXT,
  has_public_transport_access BOOLEAN DEFAULT false,
  public_transport_details TEXT,
  
  -- Security
  security_measures TEXT,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_24_hour_security BOOLEAN DEFAULT false,
  security_challenges TEXT,
  has_immigration_control BOOLEAN DEFAULT true,
  immigration_control_details TEXT,
  
  -- Compliance and standards
  compliance_with_international_standards TEXT,
  wco_compliance_level TEXT,
  certification_details TEXT,
  has_aeo_program BOOLEAN DEFAULT false,
  aeo_program_details TEXT,
  
  -- Challenges and issues
  infrastructure_challenges TEXT,
  operational_challenges TEXT,
  border_management_challenges TEXT,
  anti_smuggling_measures TEXT,
  common_illegal_trafficking_items TEXT,
  
  -- Development plans
  modernization_plans TEXT,
  planned_upgrades TEXT,
  development_projects TEXT,
  funding_sources TEXT,
  estimated_development_cost_npr DECIMAL(18, 2),
  
  -- Connectivity and logistics
  nearest_highway_distance_km DECIMAL(8, 2),
  nearest_airport_name TEXT,
  nearest_airport_distance_km DECIMAL(8, 2),
  nearest_dry_port_name TEXT,
  nearest_dry_port_distance_km DECIMAL(8, 2),
  road_condition TEXT,
  logistical_bottlenecks TEXT,
  
  -- Trade facilitation
  average_clearance_time_days DECIMAL(5, 2),
  has_fast_track_clearance BOOLEAN DEFAULT false,
  fast_track_clearance_details TEXT,
  transparency_measures TEXT,
  has_grievance_mechanism BOOLEAN DEFAULT false,
  grievance_mechanism_details TEXT,
  trader_support_services TEXT,
  
  -- Environmental aspects
  environmental_compliance TEXT,
  waste_management_system TEXT,
  green_initiatives TEXT,
  
  -- Economic impact
  local_employment_generation INTEGER,
  local_economic_impact TEXT,
  regional_trade_significance TEXT,
  
  -- Cross-border relations
  bilateral_customs_agreements TEXT,
  coordination_with_neighboring_customs TEXT,
  cross_border_issues TEXT,
  joint_inspection_mechanisms BOOLEAN DEFAULT false,
  
  -- Disaster preparedness
  disaster_management_plan BOOLEAN DEFAULT false,
  emergency_protocols TEXT,
  alternative_operation_plans TEXT,
  
  -- Contact information
  chief_customs_officer TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  website TEXT,
  
  -- Linkages to other entities
  linked_transportation_routes JSONB DEFAULT '[]'::jsonb,
  linked_warehouses JSONB DEFAULT '[]'::jsonb,
  linked_logistics_providers JSONB DEFAULT '[]'::jsonb,
  linked_industrial_areas JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  access_routes GEOMETRY(MultiLineString, 4326),
  jurisdiction_area_polygon GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_customs_office_location_point ON acme_customs_office USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_customs_office_boundary ON acme_customs_office USING GIST (facility_boundary);
CREATE INDEX IF NOT EXISTS idx_customs_office_access_routes ON acme_customs_office USING GIST (access_routes);
CREATE INDEX IF NOT EXISTS idx_customs_office_jurisdiction ON acme_customs_office USING GIST (jurisdiction_area_polygon);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_customs_office_name ON acme_customs_office(name);
CREATE INDEX IF NOT EXISTS idx_customs_office_slug ON acme_customs_office(slug);
CREATE INDEX IF NOT EXISTS idx_customs_office_type ON acme_customs_office(office_type);
CREATE INDEX IF NOT EXISTS idx_customs_office_status ON acme_customs_office(status);
CREATE INDEX IF NOT EXISTS idx_customs_office_border ON acme_customs_office(border_connection);
