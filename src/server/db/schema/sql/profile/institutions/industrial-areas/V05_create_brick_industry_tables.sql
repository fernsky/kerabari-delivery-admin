-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Brick kiln type enum
DO $$ 
BEGIN
  CREATE TYPE brick_kiln_type AS ENUM (
    'TRADITIONAL_CLAMP_KILN', 
    'FIXED_CHIMNEY_BULL_TRENCH_KILN', 
    'ZIGZAG_KILN', 
    'VERTICAL_SHAFT_BRICK_KILN', 
    'HOFFMAN_KILN', 
    'TUNNEL_KILN', 
    'HYBRID_KILN', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Brick size standard enum
DO $$ 
BEGIN
  CREATE TYPE brick_size_standard AS ENUM (
    'STANDARD_NEPALI', 
    'CHIMNEY_BRICK', 
    'MACHINE_MADE', 
    'FACING_BRICK', 
    'PERFORATED_BRICK', 
    'CUSTOM', 
    'MIXED', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Fuel type enum
DO $$ 
BEGIN
  CREATE TYPE brick_kiln_fuel_type AS ENUM (
    'COAL', 
    'FIREWOOD', 
    'AGRICULTURAL_WASTE', 
    'INDUSTRIAL_WASTE', 
    'NATURAL_GAS', 
    'ELECTRICITY', 
    'MIXED_FUEL', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the brick_industry table
CREATE TABLE IF NOT EXISTS acme_brick_industry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  kiln_type brick_kiln_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Registration details
  registration_number VARCHAR(50),
  registration_date DATE,
  pan_number VARCHAR(20),
  vat_registered BOOLEAN DEFAULT false,
  vat_number VARCHAR(20),
  
  -- Basic information
  established_year INTEGER,
  ownership_type VARCHAR(50), -- Private, Public, Cooperative, etc.
  owner_name TEXT,
  manager_name TEXT,
  
  -- Production details
  operational_status VARCHAR(50),
  seasonal_operation BOOLEAN DEFAULT true,
  operational_months TEXT, -- e.g., "November-May"
  production_capacity_bricks_per_year INTEGER,
  actual_production_bricks_per_year INTEGER,
  brick_size_standard brick_size_standard,
  brick_dimensions TEXT, -- e.g., "240mm x 115mm x 57mm"
  brick_types_produced TEXT,
  specialty_products TEXT,
  has_mechanized_molding BOOLEAN DEFAULT false,
  has_mechanized_loading BOOLEAN DEFAULT false,
  
  -- Technical specifications
  kiln_height_m DECIMAL(6, 2),
  kiln_diameter_m DECIMAL(6, 2),
  chimney_height_m DECIMAL(6, 2),
  kiln_capacity_bricks INTEGER,
  production_cycles_per_year INTEGER,
  firing_duration_days INTEGER,
  cooling_period_days INTEGER,
  
  -- Fuel and energy
  primary_fuel_type brick_kiln_fuel_type,
  secondary_fuel_type brick_kiln_fuel_type,
  average_fuel_consumption_per_batch TEXT,
  fuel_source TEXT,
  fuel_cost_per_batch_npr DECIMAL(14, 2),
  has_electricity_connection BOOLEAN DEFAULT true,
  electricity_consumption_monthly_kwh DECIMAL(10, 2),
  
  -- Raw materials
  clay_source_location TEXT,
  clay_transportation_method TEXT,
  clay_quality TEXT,
  annual_clay_consumption_cubic_m DECIMAL(10, 2),
  other_raw_materials TEXT,
  raw_material_challenges TEXT,
  
  -- Land use
  total_land_area_hectares DECIMAL(10, 2),
  clay_mining_area_hectares DECIMAL(10, 2),
  production_area_hectares DECIMAL(10, 2),
  storage_area_hectares DECIMAL(10, 2),
  land_ownership_status TEXT, -- Owned, Leased, etc.
  land_lease_details TEXT,
  
  -- Employment
  total_employees INTEGER,
  permanent_employees INTEGER,
  seasonal_employees INTEGER,
  male_employees INTEGER,
  female_employees INTEGER,
  migrant_workers INTEGER,
  average_daily_wage_npr DECIMAL(10, 2),
  has_worker_housing BOOLEAN DEFAULT false,
  worker_housing_capacity INTEGER,
  worker_facilities TEXT,
  
  -- Environmental aspects
  has_environmental_clearance BOOLEAN DEFAULT false,
  environmental_clearance_details TEXT,
  has_pollution_control_measures BOOLEAN DEFAULT false,
  pollution_control_details TEXT,
  dust_management_methods TEXT,
  water_conservation_methods TEXT,
  has_effluent_treatment BOOLEAN DEFAULT false,
  effluent_treatment_details TEXT,
  environmental_issues TEXT,
  
  -- Market and sales
  primary_market_area TEXT,
  sales_distribution_channels TEXT,
  has_direct_sales BOOLEAN DEFAULT false,
  has_dealer_network BOOLEAN DEFAULT false,
  dealer_count INTEGER,
  average_price_per_thousand_bricks_npr DECIMAL(10, 2),
  annual_sales_volume_bricks INTEGER,
  annual_revenue_npr DECIMAL(18, 2),
  
  -- Financial aspects
  initial_investment_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(18, 2),
  profitability_status TEXT,
  has_loan_financing BOOLEAN DEFAULT false,
  financing_sources TEXT,
  financial_challenges TEXT,
  
  -- Technology and innovation
  technology_level TEXT, -- Traditional, Semi-modern, Modern
  recent_technological_upgrades TEXT,
  planned_upgrades TEXT,
  energy_efficiency_measures TEXT,
  has_quality_testing BOOLEAN DEFAULT false,
  quality_testing_details TEXT,
  
  -- Compliance and certification
  complies_with_emission_standards BOOLEAN DEFAULT false,
  emission_standard_details TEXT,
  has_quality_certification BOOLEAN DEFAULT false,
  certification_details TEXT,
  has_occupational_safety_measures BOOLEAN DEFAULT false,
  safety_measures_details TEXT,
  
  -- Challenges and needs
  production_challenges TEXT,
  market_challenges TEXT,
  environmental_challenges TEXT,
  policy_challenges TEXT,
  infrastructure_needs TEXT,
  
  -- Association and support
  member_of_industry_association BOOLEAN DEFAULT false,
  association_details TEXT,
  government_support_received TEXT,
  ngo_support_received TEXT,
  technical_assistance_needs TEXT,
  
  -- Development plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  technology_adoption_plans TEXT,
  sustainability_initiatives TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  
  -- Additional details
  clay_mining_status TEXT,
  has_mining_permission BOOLEAN DEFAULT false,
  mining_permission_details TEXT,
  soil_rehabilitation_plans TEXT,
  community_relations TEXT,
  local_impact TEXT,
  
  -- Research and development
  conducts_rd BOOLEAN DEFAULT false,
  rd_focus_areas TEXT,
  collaborations_with_institutions TEXT,
  innovation_initiatives TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  clay_source_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_brick_industry_location_point ON acme_brick_industry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_brick_industry_boundary ON acme_brick_industry USING GIST (facility_boundary);
CREATE INDEX IF NOT EXISTS idx_brick_industry_clay_source ON acme_brick_industry USING GIST (clay_source_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_brick_industry_name ON acme_brick_industry(name);
CREATE INDEX IF NOT EXISTS idx_brick_industry_slug ON acme_brick_industry(slug);
CREATE INDEX IF NOT EXISTS idx_brick_industry_kiln_type ON acme_brick_industry(kiln_type);
CREATE INDEX IF NOT EXISTS idx_brick_industry_ward_number ON acme_brick_industry(ward_number);
