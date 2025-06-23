-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Private forest type enum
DO $$ 
BEGIN
  CREATE TYPE private_forest_type AS ENUM (
    'TIMBER_PRODUCTION', 'AGROFORESTRY', 'HOMESTEAD_FOREST', 
    'CONSERVATION', 'MIXED_USE', 'COMMERCIAL_PLANTATION', 
    'RECREATIONAL', 'INVESTMENT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Private forest registration status enum
DO $$ 
BEGIN
  CREATE TYPE private_forest_registration AS ENUM (
    'REGISTERED', 'UNREGISTERED', 'IN_PROCESS', 'EXEMPT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the private_forest table
CREATE TABLE IF NOT EXISTS acme_private_forest (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  forest_type private_forest_type NOT NULL,
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  address TEXT,
  
  -- Ownership information
  owner_type TEXT, -- Individual, Family, Company, etc.
  owner_name TEXT,
  ownership_since_year INTEGER,
  ownership_document_type TEXT,
  registration_status private_forest_registration,
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT,
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  forest_area_hectares DECIMAL(10, 2),
  other_land_use_hectares DECIMAL(10, 2),
  land_use_details TEXT,
  forest_condition forest_condition,
  forest_density forest_density,
  elevation_range_meters TEXT,
  topography topography_type,
  soil_type TEXT,
  
  -- Forest composition
  plantation_forest_percent DECIMAL(5, 2),
  natural_forest_percent DECIMAL(5, 2),
  mixed_forest_percent DECIMAL(5, 2),
  plantation_year INTEGER,
  tree_species JSONB DEFAULT '[]'::jsonb,
  dominant_species TEXT,
  fruit_tree_species JSONB DEFAULT '[]'::jsonb,
  medicinal_plant_species JSONB DEFAULT '[]'::jsonb,
  biodiversity_level biodiversity_level,
  estimated_tree_count INTEGER,
  average_tree_age INTEGER,
  
  -- Management aspects
  management_objective TEXT,
  has_management_plan BOOLEAN DEFAULT FALSE,
  management_plan_period TEXT,
  forest_technician_support BOOLEAN DEFAULT FALSE,
  technician_details TEXT,
  receives_external_support BOOLEAN DEFAULT FALSE,
  support_from TEXT,
  support_type TEXT,
  silvicultural_practices TEXT,
  pest_management_practices TEXT,
  disease_management_practices TEXT,
  has_nursery BOOLEAN DEFAULT FALSE,
  nursery_capacity INTEGER,
  fire_management_measures TEXT,
  has_had_forest_fire BOOLEAN DEFAULT FALSE,
  last_fire_year INTEGER,
  
  -- Production and harvesting
  main_forest_products TEXT,
  annual_timber_harvest_cubic_meters DECIMAL(10, 2),
  harvesting_frequency TEXT,
  last_harvest_date DATE,
  annual_fuelwood_production_kg DECIMAL(10, 2),
  annual_fodder_production_kg DECIMAL(10, 2),
  non_timber_forest_products TEXT,
  has_permits_for_harvesting BOOLEAN DEFAULT FALSE,
  permit_process TEXT,
  
  -- Economic aspects
  establishment_cost_npr DECIMAL(12, 2),
  annual_maintenance_cost_npr DECIMAL(10, 2),
  annual_revenue_npr DECIMAL(12, 2),
  main_revenue_sources TEXT,
  marketing_channels TEXT,
  processing_facilities TEXT,
  value_addition_activities TEXT,
  provides_employment BOOLEAN DEFAULT FALSE,
  employment_details TEXT,
  
  -- Environmental services
  carbon_sequestration_estimate TEXT,
  watershed_services TEXT,
  biodiversity_conservation TEXT,
  landscape_value TEXT,
  soil_conservation TEXT,
  
  -- Challenges and opportunities
  main_challenges TEXT,
  disease_pest_issues TEXT,
  market_challenges TEXT,
  policy_challenges TEXT,
  future_opportunities TEXT,
  expansion_plans TEXT,
  sustainability_measures TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  
  -- Linkages to other entities
  linked_markets JSONB DEFAULT '[]'::jsonb,
  linked_processors JSONB DEFAULT '[]'::jsonb,
  linked_other_private_forests JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  forest_boundary GEOMETRY(MultiPolygon, 4326),
  forest_facilities GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_private_forest_boundary ON acme_private_forest USING GIST (forest_boundary);
CREATE INDEX IF NOT EXISTS idx_private_forest_facilities ON acme_private_forest USING GIST (forest_facilities);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_private_forest_name ON acme_private_forest(name);
CREATE INDEX IF NOT EXISTS idx_private_forest_slug ON acme_private_forest(slug);
CREATE INDEX IF NOT EXISTS idx_private_forest_type ON acme_private_forest(forest_type);
CREATE INDEX IF NOT EXISTS idx_private_forest_registration ON acme_private_forest(registration_status);
