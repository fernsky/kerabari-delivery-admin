-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create forest condition enum
DO $$ 
BEGIN
  CREATE TYPE forest_condition AS ENUM (
    'PRISTINE', 'WELL_MAINTAINED', 'MODERATELY_DEGRADED', 
    'HEAVILY_DEGRADED', 'UNDER_RESTORATION', 'PLANTATION', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create forest management status enum
DO $$ 
BEGIN
  CREATE TYPE forest_management_status AS ENUM (
    'WELL_MANAGED', 'MODERATELY_MANAGED', 'POORLY_MANAGED', 
    'UNMANAGED', 'UNDER_DEVELOPMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create biodiversity level enum
DO $$ 
BEGIN
  CREATE TYPE biodiversity_level AS ENUM (
    'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create fire risk level enum
DO $$ 
BEGIN
  CREATE TYPE fire_risk_level AS ENUM (
    'EXTREME', 'HIGH', 'MODERATE', 'LOW', 'MINIMAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create forest density enum
DO $$ 
BEGIN
  CREATE TYPE forest_density AS ENUM (
    'VERY_DENSE', 'DENSE', 'MODERATE', 'SPARSE', 'VERY_SPARSE', 'OPEN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create topography type enum
DO $$ 
BEGIN
  CREATE TYPE topography_type AS ENUM (
    'FLAT', 'GENTLE_SLOPE', 'MODERATE_SLOPE', 'STEEP', 
    'VERY_STEEP', 'MOUNTAINOUS', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ecosystem type enum
DO $$ 
BEGIN
  CREATE TYPE ecosystem_type AS ENUM (
    'TROPICAL', 'SUBTROPICAL', 'TEMPERATE', 'ALPINE', 
    'GRASSLAND', 'WETLAND', 'RIPARIAN', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create accessibility level enum
DO $$ 
BEGIN
  CREATE TYPE forest_accessibility AS ENUM (
    'HIGHLY_ACCESSIBLE', 'MODERATELY_ACCESSIBLE', 'DIFFICULT_ACCESS', 
    'REMOTE', 'VERY_REMOTE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create land tenure status enum
DO $$ 
BEGIN
  CREATE TYPE land_tenure AS ENUM (
    'REGISTERED', 'UNREGISTERED', 'DISPUTED', 'COMMUNAL', 
    'PUBLIC', 'PRIVATE', 'TRUST', 'LEASED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
