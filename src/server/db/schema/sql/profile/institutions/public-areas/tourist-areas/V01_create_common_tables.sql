-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create tourist_attraction_status enum
DO $$ 
BEGIN
  CREATE TYPE tourist_attraction_status AS ENUM (
    'OPERATIONAL', 'SEASONAL', 'UNDER_RENOVATION', 'TEMPORARILY_CLOSED', 
    'PERMANENTLY_CLOSED', 'UNDER_DEVELOPMENT', 'PLANNED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE tourist_area_ownership_type AS ENUM (
    'GOVERNMENT', 'MUNICIPAL', 'PROVINCIAL', 'COMMUNITY', 'PRIVATE', 
    'PUBLIC_PRIVATE_PARTNERSHIP', 'RELIGIOUS_TRUST', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create accessibility_level enum
DO $$ 
BEGIN
  CREATE TYPE tourist_area_accessibility_level AS ENUM (
    'EXCELLENT', 'GOOD', 'MODERATE', 'POOR', 'DIFFICULT', 
    'SEASONAL', 'RESTRICTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create conservation_status enum
DO $$ 
BEGIN
  CREATE TYPE tourist_area_conservation_status AS ENUM (
    'PROTECTED', 'CONSERVED', 'PARTIALLY_PROTECTED', 'UNPROTECTED', 
    'ENDANGERED', 'DEGRADED', 'RESTORED', 'UNDER_RESTORATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create maintenance_level enum
DO $$ 
BEGIN
  CREATE TYPE maintenance_level AS ENUM (
    'EXCELLENT', 'GOOD', 'ADEQUATE', 'MINIMAL', 'POOR', 'NEGLECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create visit_frequency enum
DO $$ 
BEGIN
  CREATE TYPE visit_frequency AS ENUM (
    'DAILY', 'WEEKDAYS_ONLY', 'WEEKENDS_ONLY', 'SEASONAL', 
    'YEAR_ROUND', 'SPECIAL_OCCASIONS_ONLY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create entrance_fee_type enum
DO $$ 
BEGIN
  CREATE TYPE entrance_fee_type AS ENUM (
    'FREE', 'FIXED', 'TIERED', 'DONATION_BASED', 
    'MEMBERSHIP', 'DIFFERENT_FOR_FOREIGNERS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
