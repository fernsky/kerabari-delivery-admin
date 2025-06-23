-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Mill type enum
DO $$ 
BEGIN
  CREATE TYPE mill_type AS ENUM (
    'GRAIN_MILL', 'RICE_MILL', 'FLOUR_MILL', 'OIL_MILL',
    'SUGARCANE_MILL', 'PULSE_MILL', 'SPICE_MILL',
    'MULTI_PURPOSE_MILL', 'SAW_MILL', 'PAPER_MILL',
    'TEXTILE_MILL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the mills table
CREATE TABLE IF NOT EXISTS acme_mill (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  mill_type mill_type NOT NULL,
  status industry_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number VARCHAR(50),
  registered_with TEXT,
  pan_vat_number VARCHAR(50),
  ownership_type industry_ownership_type NOT NULL,
  industry_size industry_size NOT NULL,
  
  -- Physical infrastructure
  facility_area_sqm DECIMAL(10, 2),
  building_type TEXT,
  building_condition TEXT,
  number_of_floors INTEGER,
  storage_capacity TEXT,
  storage_area_sqm DECIMAL(10, 2),
  has_warehouse BOOLEAN DEFAULT false,
  has_loading_area BOOLEAN DEFAULT false,
  has_packaging_area BOOLEAN DEFAULT false,
  
  -- Mill details
  main_processing_items TEXT,
  processing_capacity_daily TEXT,
  capacity_unit TEXT,
  actual_processing_volume TEXT,
  capacity_utilization production_capacity_utilization,
  processing_seasons TEXT,
  seasonal_variations TEXT,
  operational_months_per_year INTEGER,
  
  -- Machinery and technology
  primary_machinery TEXT,
  machinery_source TEXT,
  machinery_age_years DECIMAL(5, 2),
  machinery_condition TEXT,
  technology_level technology_level,
  has_automated_processes BOOLEAN DEFAULT false,
  automated_process_details TEXT,
  quality_control_equipment TEXT,
  maintenance_schedule TEXT,
  machinery_breakdowns_frequency TEXT,
  
  -- Energy and power
  primary_energy_source energy_source,
  backup_energy_source energy_source,
  power_capacity_kw DECIMAL(10, 2),
  daily_energy_consumption_kwh DECIMAL(12, 2),
  monthly_electricity_cost_npr DECIMAL(12, 2),
  power_outage_impact TEXT,
  has_power_backup BOOLEAN DEFAULT false,
  
  -- Raw materials
  raw_material_sources TEXT,
  raw_material_sourcing_radius_km DECIMAL(8, 2),
  main_suppliers TEXT,
  raw_material_storage_capacity TEXT,
  raw_material_quality_issues TEXT,
  seasonal_raw_material_variations TEXT,
  raw_material_cost_variations TEXT,
  
  -- Operations
  operating_days_per_week INTEGER,
  shifts_per_day INTEGER,
  operating_hours_per_day INTEGER,
  peak_operation_season TEXT,
  offseason_activities TEXT,
  production_schedule TEXT,
  
  -- Products and services
  main_products_produced TEXT,
  secondary_products TEXT,
  byproducts_produced TEXT,
  byproduct_utilization TEXT,
  waste_generation TEXT,
  waste_management_process TEXT,
  services_provided TEXT,
  milling_fee_structure TEXT,
  
  -- Human resources
  total_employees INTEGER,
  skilled_operators INTEGER,
  unskilled_workers INTEGER,
  female_employees INTEGER,
  male_employees INTEGER,
  seasonal_workers INTEGER,
  administrative_staff INTEGER,
  salary_range_npr TEXT,
  worker_benefits TEXT,
  
  -- Market and distribution
  market_scope market_scope,
  major_markets TEXT,
  distribution_channels TEXT,
  customer_types TEXT,
  direct_to_consumer_sales BOOLEAN DEFAULT false,
  bulk_supply_contracts BOOLEAN DEFAULT false,
  primary_buyers TEXT,
  transportation_methods TEXT,
  
  -- Financial aspects
  initial_investment_npr DECIMAL(14, 2),
  annual_turnover_npr DECIMAL(14, 2),
  processing_fee_structure TEXT,
  profit_margin_percentage DECIMAL(5, 2),
  operational_costs_breakdown TEXT,
  financial_challenges TEXT,
  loan_financing BOOLEAN DEFAULT false,
  loan_source TEXT,
  
  -- Environmental aspects
  environmental_compliance environmental_compliance,
  effluent_generation BOOLEAN DEFAULT false,
  effluent_treatment_method TEXT,
  dust_control_measures TEXT,
  noise_pollution_management TEXT,
  environmental_issues TEXT,
  environmental_certifications TEXT,
  
  -- Safety and health
  safety_measures_implemented TEXT,
  safety_equipment_provided TEXT,
  accident_history TEXT,
  insurance_coverage TEXT,
  health_hazards TEXT,
  risk_mitigation_measures TEXT,
  
  -- Community relations
  community_benefits TEXT,
  community_complaints TEXT,
  local_employment_percentage INTEGER,
  community_support_programs TEXT,
  
  -- Challenges and constraints
  operational_challenges TEXT,
  supply_chain_challenges TEXT,
  market_challenges TEXT,
  regulatory_challenges TEXT,
  competition_details TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  technology_upgrade_plans TEXT,
  product_diversification_plans TEXT,
  challenges_to_expansion TEXT,
  
  -- Support and government relations
  government_support_received TEXT,
  subsidy_programs_accessed TEXT,
  industry_association_membership TEXT,
  cooperative_membership TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  
  -- Linkages to other entities
  linked_suppliers JSONB DEFAULT '[]'::jsonb,
  linked_buyers JSONB DEFAULT '[]'::jsonb,
  linked_transporters JSONB DEFAULT '[]'::jsonb,
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  property_boundary GEOMETRY(Polygon, 4326),
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
CREATE INDEX IF NOT EXISTS idx_mill_location_point ON acme_mill USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_mill_boundary ON acme_mill USING GIST (property_boundary);
CREATE INDEX IF NOT EXISTS idx_mill_footprint ON acme_mill USING GIST (building_footprint);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_mill_name ON acme_mill(name);
CREATE INDEX IF NOT EXISTS idx_mill_slug ON acme_mill(slug);
CREATE INDEX IF NOT EXISTS idx_mill_type ON acme_mill(mill_type);
CREATE INDEX IF NOT EXISTS idx_mill_status ON acme_mill(status);
