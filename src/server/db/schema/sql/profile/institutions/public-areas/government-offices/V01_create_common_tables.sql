-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create government office status enum
DO $$ 
BEGIN
  CREATE TYPE government_office_status AS ENUM (
    'OPERATIONAL', 'TEMPORARILY_CLOSED', 'UNDER_RENOVATION', 
    'RELOCATED', 'PLANNED', 'MERGED', 'DISSOLVED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create office ownership type enum
DO $$ 
BEGIN
  CREATE TYPE government_office_ownership_type AS ENUM (
    'FEDERAL_GOVERNMENT', 'PROVINCIAL_GOVERNMENT', 'LOCAL_GOVERNMENT', 
    'QUASI_GOVERNMENT', 'AUTONOMOUS_BODY', 'PUBLIC_CORPORATION', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create office accessibility level enum
DO $$ 
BEGIN
  CREATE TYPE office_accessibility_level AS ENUM (
    'EXCELLENT', 'GOOD', 'MODERATE', 'POOR', 'VERY_POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create service delivery efficiency enum
DO $$ 
BEGIN
  CREATE TYPE service_delivery_efficiency AS ENUM (
    'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create digital infrastructure level enum
DO $$ 
BEGIN
  CREATE TYPE digital_infrastructure_level AS ENUM (
    'ADVANCED', 'ADEQUATE', 'BASIC', 'MINIMAL', 'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create building condition enum
DO $$ 
BEGIN
  CREATE TYPE office_building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 
    'NEEDS_RECONSTRUCTION', 'UNDER_CONSTRUCTION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create office visitor volume enum
DO $$ 
BEGIN
  CREATE TYPE office_visitor_volume AS ENUM (
    'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
