-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create generation_type enum
DO $$ 
BEGIN
  CREATE TYPE generation_type AS ENUM (
    'HYDROPOWER',
    'MICRO_HYDROPOWER',
    'MINI_HYDROPOWER',
    'SOLAR_FARM',
    'WIND_FARM',
    'THERMAL',
    'DIESEL_GENERATOR',
    'BIOMASS',
    'HYBRID',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create operational_status enum
DO $$ 
BEGIN
  CREATE TYPE operational_status AS ENUM (
    'OPERATIONAL',
    'UNDER_CONSTRUCTION',
    'PLANNED',
    'UNDER_MAINTENANCE',
    'DECOMMISSIONED',
    'PARTIALLY_OPERATIONAL',
    'SEASONAL_OPERATION',
    'TESTING_PHASE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE ownership_type AS ENUM (
    'GOVERNMENT',
    'PRIVATE',
    'COMMUNITY',
    'PUBLIC_PRIVATE_PARTNERSHIP',
    'COOPERATIVE',
    'FOREIGN_INVESTMENT',
    'JOINT_VENTURE',
    'NEA', -- Nepal Electricity Authority
    'IPP', -- Independent Power Producer
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
