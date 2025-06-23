-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create mine_status enum
DO $$ 
BEGIN
  CREATE TYPE mine_status AS ENUM (
    'OPERATIONAL', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED', 
    'UNDER_DEVELOPMENT', 'ABANDONED', 'RECLAIMED', 'EXPLORATION',
    'APPROVED_NOT_STARTED', 'SUSPENDED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE mine_ownership_type AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'PUBLIC_PRIVATE_PARTNERSHIP', 'COOPERATIVE', 
    'COMMUNITY_OWNED', 'FOREIGN_OWNED', 'JOINT_VENTURE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create operation_scale enum
DO $$ 
BEGIN
  CREATE TYPE mine_operation_scale AS ENUM (
    'LARGE_SCALE', 'MEDIUM_SCALE', 'SMALL_SCALE', 'MICRO_SCALE', 
    'ARTISANAL', 'INDUSTRIAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create environmental_impact enum
DO $$ 
BEGIN
  CREATE TYPE mine_environmental_impact AS ENUM (
    'LOW', 'MODERATE', 'HIGH', 'SEVERE', 'MINIMAL', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create safety_rating enum
DO $$ 
BEGIN
  CREATE TYPE mine_safety_rating AS ENUM (
    'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 
    'POOR', 'HAZARDOUS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create compliance_level enum
DO $$ 
BEGIN
  CREATE TYPE mine_compliance_level AS ENUM (
    'FULLY_COMPLIANT', 'MOSTLY_COMPLIANT', 'PARTIALLY_COMPLIANT',
    'NON_COMPLIANT', 'UNDER_REVIEW', 'NOT_ASSESSED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create extraction_method enum
DO $$ 
BEGIN
  CREATE TYPE extraction_method AS ENUM (
    'SURFACE_MINING', 'UNDERGROUND_MINING', 'PLACER_MINING', 
    'IN_SITU_MINING', 'SOLUTION_MINING', 'QUARRYING', 'DREDGING',
    'ARTISANAL_MINING', 'MIXED_METHODS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create processing_method enum
DO $$ 
BEGIN
  CREATE TYPE processing_method AS ENUM (
    'CRUSHING', 'GRINDING', 'FLOTATION', 'LEACHING', 'GRAVITY_SEPARATION',
    'MAGNETIC_SEPARATION', 'ELECTROSTATIC_SEPARATION', 'SMELTING',
    'REFINING', 'MINIMAL_PROCESSING', 'ADVANCED_PROCESSING', 
    'OFFSITE_PROCESSING', 'NO_PROCESSING'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create rehabilitation_status enum
DO $$ 
BEGIN
  CREATE TYPE rehabilitation_status AS ENUM (
    'NOT_STARTED', 'PLANNED', 'IN_PROGRESS', 'PARTIALLY_COMPLETED',
    'COMPLETED', 'MONITORED', 'NOT_REQUIRED', 'ABANDONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
