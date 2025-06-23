-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create industry_status enum
DO $$ 
BEGIN
  CREATE TYPE industry_status AS ENUM (
    'OPERATIONAL', 'UNDER_CONSTRUCTION', 'TEMPORARILY_CLOSED', 
    'PERMANENTLY_CLOSED', 'SEASONAL', 'PLANNING_STAGE',
    'UNDER_RENOVATION', 'PARTIALLY_OPERATIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE industry_ownership_type AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'PUBLIC_PRIVATE_PARTNERSHIP', 
    'COOPERATIVE', 'COMMUNITY_OWNED', 'FOREIGN_OWNED', 
    'JOINT_VENTURE', 'MULTINATIONAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create industry_size enum
DO $$ 
BEGIN
  CREATE TYPE industry_size AS ENUM (
    'COTTAGE', 'MICRO', 'SMALL', 'MEDIUM', 'LARGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create environmental_compliance enum
DO $$ 
BEGIN
  CREATE TYPE environmental_compliance AS ENUM (
    'FULLY_COMPLIANT', 'MOSTLY_COMPLIANT', 'PARTIALLY_COMPLIANT', 
    'NON_COMPLIANT', 'NOT_ASSESSED', 'EXEMPT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create production_capacity_utilization enum
DO $$ 
BEGIN
  CREATE TYPE production_capacity_utilization AS ENUM (
    'FULL_CAPACITY', 'HIGH', 'MEDIUM', 'LOW', 
    'MINIMAL', 'VARIABLE', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create market_scope enum
DO $$ 
BEGIN
  CREATE TYPE market_scope AS ENUM (
    'LOCAL', 'DISTRICT', 'PROVINCIAL', 'NATIONAL', 
    'INTERNATIONAL', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create technology_level enum
DO $$ 
BEGIN
  CREATE TYPE technology_level AS ENUM (
    'TRADITIONAL', 'SEMI_MECHANIZED', 'FULLY_MECHANIZED', 
    'AUTOMATED', 'HIGH_TECH', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create energy_source enum
DO $$ 
BEGIN
  CREATE TYPE energy_source AS ENUM (
    'GRID_ELECTRICITY', 'DIESEL_GENERATOR', 'SOLAR', 
    'HYDRO', 'BIOMASS', 'MIXED', 'WIND', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_source enum
DO $$ 
BEGIN
  CREATE TYPE water_source AS ENUM (
    'MUNICIPAL', 'WELL', 'RIVER', 'RAINWATER_HARVESTING', 
    'TANKER_SUPPLY', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
