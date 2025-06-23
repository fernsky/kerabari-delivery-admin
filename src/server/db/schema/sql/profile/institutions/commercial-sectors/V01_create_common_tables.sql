-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Common enums for commercial sectors

-- Business volume enum
DO $$ 
BEGIN
  CREATE TYPE business_volume AS ENUM (
    'VERY_HIGH',
    'HIGH',
    'MODERATE',
    'LOW',
    'VERY_LOW'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Facility condition enum
DO $$ 
BEGIN
  CREATE TYPE facility_condition AS ENUM (
    'EXCELLENT',
    'GOOD',
    'FAIR',
    'POOR',
    'UNDER_RENOVATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Business ownership type enum
DO $$ 
BEGIN
  CREATE TYPE business_ownership_type AS ENUM (
    'INDIVIDUAL_PROPRIETORSHIP',
    'PARTNERSHIP',
    'PRIVATE_LIMITED_COMPANY',
    'PUBLIC_LIMITED_COMPANY',
    'COOPERATIVE',
    'MULTINATIONAL_SUBSIDIARY',
    'FRANCHISE',
    'FAMILY_OWNED',
    'GOVERNMENT_OWNED',
    'COMMUNITY_OWNED',
    'NGO_OWNED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Business operational status enum
DO $$ 
BEGIN
  CREATE TYPE business_operational_status AS ENUM (
    'FULLY_OPERATIONAL',
    'PARTIALLY_OPERATIONAL',
    'TEMPORARILY_CLOSED',
    'UNDER_RENOVATION',
    'UNDER_CONSTRUCTION',
    'SEASONAL_OPERATION',
    'CLOSED_PERMANENTLY',
    'RELOCATING',
    'CHANGING_OWNERSHIP'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Market target enum
DO $$ 
BEGIN
  CREATE TYPE market_target AS ENUM (
    'LOCAL',
    'REGIONAL',
    'NATIONAL',
    'INTERNATIONAL',
    'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Business size enum
DO $$ 
BEGIN
  CREATE TYPE business_size AS ENUM (
    'MICRO',
    'SMALL',
    'MEDIUM',
    'LARGE',
    'VERY_LARGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
