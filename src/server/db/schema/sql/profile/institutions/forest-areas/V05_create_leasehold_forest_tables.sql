-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Leasehold forest type enum
DO $$ 
BEGIN
  CREATE TYPE leasehold_forest_type AS ENUM (
    'POVERTY_ALLEVIATION', 'INDUSTRIAL', 'ECOTOURISM', 
    'AGROFORESTRY', 'CONSERVATION', 'MIXED_USE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Leasehold forest condition enum
DO $$ 
BEGIN
  CREATE TYPE leasehold_forest_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 
    'DEGRADED', 'UNDER_RESTORATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest terrain type enum
DO $$ 
BEGIN
  CREATE TYPE forest_terrain_type AS ENUM (
    'PLAIN', 'HILL', 'MOUNTAIN', 'VALLEY', 
    'SLOPE', 'PLATEAU', 'RIVERBANK', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest management system enum
DO $$ 
BEGIN
  CREATE TYPE forest_management_system AS ENUM (
    'TRADITIONAL', 'SCIENTIFIC', 'PARTICIPATORY', 'ECOSYSTEM_BASED', 
    'SUSTAINABLE', 'MINIMAL_INTERVENTION', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Benefit sharing mechanism enum
DO $$ 
BEGIN
  CREATE TYPE benefit_sharing_mechanism AS ENUM (
    'EQUITABLE', 'GROUP_BASED', 'PERFORMANCE_BASED', 
    'NEEDS_BASED', 'CONTRIBUTION_BASED', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the leasehold_forest table
CREATE TABLE IF NOT EXISTS acme_leasehold_forest (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  leasehold_type leasehold_forest_type NOT NULL,
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  address TEXT,
  
  -- Lease details
  lease_certificate_number VARCHAR(50),
  lease_issuance_date DATE,
  lease_period_years INTEGER,
  lease_expiry_date DATE,
  leasing_authority TEXT,
  annual_lease_fee_npr DECIMAL(12, 2),
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  forest_coverage_percent DECIMAL(5, 2),
  forest_condition leasehold_forest_condition,
  terrain_type forest_terrain_type,
  elevation_range_meters TEXT,
  slope_range_percent TEXT,
  soil_type TEXT,
  soil_fertility TEXT,
  
  -- Biodiversity and ecology
  biodiversity_level biodiversity_level,
  dominant_tree_species JSONB DEFAULT '[]'::jsonb,
  dominant_shrub_species JSONB DEFAULT '[]'::jsonb,
  plantation_species JSONB DEFAULT '[]'::jsonb,
  medicinal_plants JSONB DEFAULT '[]'::jsonb,
  wildlife_species JSONB DEFAULT '[]'::jsonb,
  endangered_species JSONB DEFAULT '[]'::jsonb,
  invasive_species JSONB DEFAULT '[]'::jsonb,
  has_water_source BOOLEAN DEFAULT FALSE,
  water_source_details TEXT,
  
  -- Leaseholder information
  leaseholder_type TEXT, -- Individual, Group, Company, Cooperative, etc.
  leaseholder_name TEXT,
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  leaseholder_address TEXT,
  number_of_households_involved INTEGER,
  total_beneficiaries INTEGER,
  women_beneficiaries INTEGER,
  marginalized_group_beneficiaries INTEGER,
  
  -- Management details
  management_system forest_management_system,
  has_management_plan BOOLEAN DEFAULT TRUE,
  management_plan_period TEXT,
  management_plan_approval_date DATE,
  implementing_agency TEXT,
  technical_support_provider TEXT,
  annual_operational_plan BOOLEAN DEFAULT TRUE,
  has_forest_inventory BOOLEAN DEFAULT FALSE,
  last_inventory_year INTEGER,
  monitoring_frequency TEXT,
  
  -- Activities and operations
  main_forest_products TEXT,
  non_timber_forest_products TEXT,
  annual_harvesting_amount TEXT,
  harvesting_method TEXT,
  processing_activities TEXT,
  marketing_channels TEXT,
  value_addition_activities TEXT,
  tourism_activities TEXT,
  ecotourism_facilities TEXT,
  
  -- Financial aspects
  establishment_cost_npr DECIMAL(14, 2),
  annual_operational_cost_npr DECIMAL(14, 2),
  annual_revenue_npr DECIMAL(14, 2),
  profit_margin_percent DECIMAL(5, 2),
  return_on_investment_percent DECIMAL(5, 2),
  revenue_sharing_mechanism benefit_sharing_mechanism,
  revenue_sharing_details TEXT,
  investment_sources TEXT,
  financial_sustainability TEXT,
  
  -- Employment and livelihoods
  permanent_jobs_created INTEGER,
  seasonal_jobs_created INTEGER,
  women_employment_percent DECIMAL(5, 2),
  average_monthly_income_per_household_npr DECIMAL(10, 2),
  poverty_reduction_impact TEXT,
  livelihood_improvement_measures TEXT,
  
  -- Environmental aspects
  environmental_impact_assessment BOOLEAN DEFAULT FALSE,
  carbon_sequestration_estimate TEXT,
  watershed_protection_measures TEXT,
  soil_conservation_measures TEXT,
  biodiversity_conservation_measures TEXT,
  climate_change_adaptation_measures TEXT,
  
  -- Challenges and constraints
  major_challenges TEXT,
  policy_constraints TEXT,
  technical_constraints TEXT,
  market_constraints TEXT,
  financial_constraints TEXT,
  
  -- Support and services
  technical_support_received TEXT,
  financial_support_received TEXT,
  training_received TEXT,
  marketing_support TEXT,
  research_support TEXT,
  
  -- Success indicators
  key_achievements TEXT,
  replication_potential TEXT,
  innovative_practices TEXT,
  success_factors TEXT,
  lessons_learned TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  modernization_plans TEXT,
  marketing_plans TEXT,
  sustainability_plans TEXT,
  
  -- Linkages and networks
  linked_markets JSONB DEFAULT '[]'::jsonb,
  linked_processors JSONB DEFAULT '[]'::jsonb,
  linked_technical_services JSONB DEFAULT '[]'::jsonb,
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  forest_boundary GEOMETRY(MultiPolygon, 4326),
  activity_locations GEOMETRY(MultiPoint, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_boundary ON acme_leasehold_forest USING GIST (forest_boundary);
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_activity_locations ON acme_leasehold_forest USING GIST (activity_locations);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_name ON acme_leasehold_forest(name);
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_slug ON acme_leasehold_forest(slug);
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_type ON acme_leasehold_forest(leasehold_type);
CREATE INDEX IF NOT EXISTS idx_leasehold_forest_condition ON acme_leasehold_forest(forest_condition);
