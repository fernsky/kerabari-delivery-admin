-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create customs office type enum
DO $$ 
BEGIN
  CREATE TYPE customs_office_type AS ENUM (
    'INTERNATIONAL_BORDER',
    'INLAND_CUSTOMS',
    'DRY_PORT',
    'CUSTOMS_CHECKPOINT',
    'SUB_CUSTOMS_OFFICE',
    'CUSTOMS_HOUSE',
    'TRANSIT_POINT',
    'TRADE_POINT',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create customs office status enum
DO $$ 
BEGIN
  CREATE TYPE customs_office_status AS ENUM (
    'FULLY_OPERATIONAL',
    'PARTIALLY_OPERATIONAL',
    'UNDER_RENOVATION',
    'TEMPORARY_CLOSED',
    'SEASONAL_OPERATION',
    'PLANNED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create border connection enum
DO $$ 
BEGIN
  CREATE TYPE border_connection AS ENUM (
    'INDIA',
    'CHINA',
    'BOTH',
    'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create modernization level enum
DO $$ 
BEGIN
  CREATE TYPE modernization_level AS ENUM (
    'HIGHLY_MODERNIZED',
    'MODERATELY_MODERNIZED',
    'BASIC_FACILITIES',
    'NEEDS_MODERNIZATION',
    'UNDER_MODERNIZATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create facility condition enum
DO $$ 
BEGIN
  CREATE TYPE facility_condition AS ENUM (
    'EXCELLENT',
    'GOOD',
    'SATISFACTORY',
    'NEEDS_IMPROVEMENT',
    'POOR',
    'DILAPIDATED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create customs trade volume enum
DO $$ 
BEGIN
  CREATE TYPE customs_trade_volume AS ENUM (
    'VERY_HIGH',
    'HIGH',
    'MEDIUM',
    'LOW',
    'VERY_LOW',
    'FLUCTUATING',
    'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create trade direction enum
DO $$ 
BEGIN
  CREATE TYPE trade_direction AS ENUM (
    'IMPORT_DOMINANT',
    'EXPORT_DOMINANT',
    'BALANCED',
    'TRANSIT_DOMINANT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
