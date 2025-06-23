-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Water supply institution type enum
DO $$ 
BEGIN
  CREATE TYPE water_supply_institution_type AS ENUM (
    'DRINKING_WATER_OFFICE',
    'WATER_SUPPLY_CORPORATION_BRANCH',
    'WATER_AUTHORITY_OFFICE',
    'WATER_USERS_COMMITTEE',
    'WATER_RESOURCE_MANAGEMENT_OFFICE',
    'RURAL_WATER_SUPPLY_AGENCY',
    'WATER_QUALITY_CONTROL_OFFICE',
    'WATERSHED_MANAGEMENT_OFFICE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Water service coverage enum
DO $$ 
BEGIN
  CREATE TYPE water_service_coverage AS ENUM (
    'EXCELLENT',
    'GOOD',
    'SATISFACTORY',
    'LIMITED',
    'POOR',
    'VERY_POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Water quality level enum
DO $$ 
BEGIN
  CREATE TYPE water_quality_level AS ENUM (
    'HIGH_QUALITY',
    'GOOD_QUALITY',
    'ACCEPTABLE',
    'NEEDS_IMPROVEMENT',
    'POOR',
    'UNSAFE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the water supply institution table
CREATE TABLE IF NOT EXISTS acme_water_supply_institution (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  institution_type water_supply_institution_type NOT NULL,
  status government_office_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type government_office_ownership_type NOT NULL,
  parent_organization TEXT,
  jurisdiction_area TEXT,
  population_served INTEGER,
  households_served INTEGER,
  
  -- Building information
  building_ownership TEXT, -- Owned, Rented, etc.
  building_condition office_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  total_area_sqm DECIMAL(10, 2),
  has_waiting_area BOOLEAN DEFAULT true,
  has_service_counter BOOLEAN DEFAULT true,
  has_customer_complaint_desk BOOLEAN DEFAULT false,
  has_water_quality_testing_lab BOOLEAN DEFAULT false,
  lab_facilities TEXT,
  has_parking_space BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  electricity_availability_hours INTEGER,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT, -- Generator, Inverter, Solar, etc.
  has_water_supply BOOLEAN DEFAULT true,
  has_internet BOOLEAN DEFAULT false,
  internet_type TEXT, -- Fiber, DSL, etc.
  has_telephone_landline BOOLEAN DEFAULT true,
  
  -- Human resources
  office_head_position TEXT,
  office_head_name TEXT,
  office_head_contact TEXT,
  total_sanctioned_positions INTEGER,
  total_filled_positions INTEGER,
  total_vacant_positions INTEGER,
  technical_staff_count INTEGER,
  administrative_staff_count INTEGER,
  field_staff_count INTEGER,
  support_staff_count INTEGER,
  female_staff_percentage DECIMAL(5, 2),
  staff_adequacy TEXT, -- Assessment of staffing levels
  
  -- Service delivery
  service_hours TEXT, -- e.g., "Sunday-Friday 10:00-17:00"
  weekly_off_days TEXT, -- e.g., "Saturday"
  major_services_provided TEXT,
  average_daily_service_recipients INTEGER,
  complaint_handling_mechanism TEXT,
  average_complaint_resolution_days DECIMAL(5, 2),
  service_delivery_efficiency service_delivery_efficiency,
  
  -- Water supply infrastructure
  water_sources TEXT, -- River, groundwater, spring, etc.
  total_water_sources_count INTEGER,
  treatment_plants_count INTEGER,
  treatment_plants_capacity_mld DECIMAL(10, 2), -- Million liters per day
  reservoirs_count INTEGER,
  total_reservoir_capacity_liters DECIMAL(18, 2),
  distribution_network_length_km DECIMAL(10, 2),
  pumping_stations_count INTEGER,
  public_taps_count INTEGER,
  water_meters_installed_count INTEGER,
  metered_connections_percentage DECIMAL(5, 2),
  treatment_methods_used TEXT,
  
  -- Service metrics
  water_supply_hours_daily DECIMAL(4, 2),
  water_supply_days_weekly INTEGER,
  supply_intermittency_pattern TEXT,
  water_production_liters_daily DECIMAL(18, 2),
  water_distributed_liters_daily DECIMAL(18, 2),
  average_consumption_lcd INTEGER, -- Liters per capita per day
  water_loss_percentage DECIMAL(5, 2),
  non_revenue_water_percentage DECIMAL(5, 2),
  service_coverage_percentage DECIMAL(5, 2),
  service_coverage_rating water_service_coverage,
  unserved_areas TEXT,
  
  -- Water quality
  water_quality_testing_frequency TEXT,
  water_quality_level water_quality_level,
  water_quality_parameters_tested TEXT,
  chlorination_done BOOLEAN DEFAULT true,
  chlorination_method TEXT,
  quality_issues_reported TEXT,
  water_borne_disease_incidents INTEGER,
  
  -- Customer management
  total_connections INTEGER,
  domestic_connections INTEGER,
  commercial_connections INTEGER,
  institutional_connections INTEGER,
  industrial_connections INTEGER,
  new_connections_monthly_average INTEGER,
  connection_application_process TEXT,
  average_connection_time_days INTEGER,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  operational_cost_npr DECIMAL(18, 2),
  revenue_collection_npr DECIMAL(18, 2),
  average_water_tariff_npr DECIMAL(10, 2),
  tariff_structure TEXT,
  billing_frequency TEXT,
  billing_collection_efficiency_percentage DECIMAL(5, 2),
  has_digital_payment BOOLEAN DEFAULT false,
  digital_payment_options TEXT,
  
  -- Digital infrastructure
  digital_infrastructure_level digital_infrastructure_level,
  has_customer_database BOOLEAN DEFAULT false,
  has_billing_software BOOLEAN DEFAULT false,
  has_asset_management_system BOOLEAN DEFAULT false,
  has_gis_mapping BOOLEAN DEFAULT false,
  gis_coverage_percentage DECIMAL(5, 2),
  has_scada_system BOOLEAN DEFAULT false,
  scada_coverage_percentage DECIMAL(5, 2),
  has_website BOOLEAN DEFAULT false,
  website_url TEXT,
  has_mobile_app BOOLEAN DEFAULT false,
  mobile_app_features TEXT,
  has_online_bill_payment BOOLEAN DEFAULT false,
  has_online_complaint_system BOOLEAN DEFAULT false,
  
  -- Equipment and transport
  has_water_testing_equipment BOOLEAN DEFAULT false,
  testing_equipment_details TEXT,
  has_leak_detection_equipment BOOLEAN DEFAULT false,
  leak_detection_details TEXT,
  maintenance_vehicles_count INTEGER,
  vehicles_condition TEXT,
  
  -- Management aspects
  has_water_safety_plan BOOLEAN DEFAULT false,
  has_business_plan BOOLEAN DEFAULT false,
  has_water_conservation_plan BOOLEAN DEFAULT false,
  has_emergency_response_plan BOOLEAN DEFAULT false,
  has_asset_management_plan BOOLEAN DEFAULT false,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  water_source_challenges TEXT,
  water_quality_challenges TEXT,
  financial_sustainability_challenges TEXT,
  service_expansion_challenges TEXT,
  climate_change_impacts TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  infrastructure_upgrade_plans TEXT,
  service_improvement_plans TEXT,
  water_conservation_initiatives TEXT,
  
  -- Community engagement
  has_consumer_committee BOOLEAN DEFAULT false,
  consumer_committee_details TEXT,
  public_awareness_programs TEXT,
  community_feedback_mechanism TEXT,
  
  -- Contact information
  customer_service_phone TEXT,
  emergency_contact TEXT,
  office_phone_number TEXT,
  office_email TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  service_area GEOMETRY(MultiPolygon, 4326),
  distribution_network GEOMETRY(MultiLineString, 4326),
  water_source_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_location_point ON acme_water_supply_institution USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_building_footprint ON acme_water_supply_institution USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_service_area ON acme_water_supply_institution USING GIST (service_area);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_distribution_network ON acme_water_supply_institution USING GIST (distribution_network);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_water_source_points ON acme_water_supply_institution USING GIST (water_source_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_name ON acme_water_supply_institution(name);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_slug ON acme_water_supply_institution(slug);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_type ON acme_water_supply_institution(institution_type);
CREATE INDEX IF NOT EXISTS idx_water_supply_institution_status ON acme_water_supply_institution(status);
