-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create educational_institution_status enum
DO $$ 
BEGIN
  CREATE TYPE educational_institution_status AS ENUM (
    'OPERATIONAL', 'TEMPORARILY_CLOSED', 'PERMANENTLY_CLOSED', 
    'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'PLANNED', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create educational_institution_ownership enum
DO $$ 
BEGIN
  CREATE TYPE educational_institution_ownership AS ENUM (
    'GOVERNMENT', 'COMMUNITY', 'PRIVATE', 'PUBLIC_PRIVATE_PARTNERSHIP', 
    'TRUST', 'NGO', 'RELIGIOUS', 'COOPERATIVE', 'INTERNATIONAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create infrastructure_condition enum
DO $$ 
BEGIN
  CREATE TYPE infrastructure_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 
    'POOR', 'CRITICAL', 'UNDER_CONSTRUCTION', 'UNDER_RENOVATION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create education_medium enum
DO $$ 
BEGIN
  CREATE TYPE education_medium AS ENUM (
    'NEPALI', 'ENGLISH', 'BILINGUAL', 'MULTILINGUAL', 'LOCAL_LANGUAGE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create educational_accessibility_level enum
DO $$ 
BEGIN
  CREATE TYPE educational_accessibility_level AS ENUM (
    'HIGHLY_ACCESSIBLE', 'ACCESSIBLE', 'MODERATELY_ACCESSIBLE', 
    'DIFFICULT_ACCESS', 'SEASONAL_ACCESS', 'RESTRICTED_ACCESS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create utility_availability enum
DO $$ 
BEGIN
  CREATE TYPE utility_availability AS ENUM (
    'ALWAYS_AVAILABLE', 'MOSTLY_AVAILABLE', 'INTERMITTENT', 
    'RARELY_AVAILABLE', 'NOT_AVAILABLE', 'UNDER_DEVELOPMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create staffing_adequacy enum
DO $$ 
BEGIN
  CREATE TYPE staffing_adequacy AS ENUM (
    'OVERSTAFFED', 'ADEQUATE', 'SLIGHTLY_UNDERSTAFFED', 
    'UNDERSTAFFED', 'SEVERELY_UNDERSTAFFED', 'VACANT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create digital_readiness_level enum
DO $$ 
BEGIN
  CREATE TYPE digital_readiness_level AS ENUM (
    'ADVANCED', 'PROFICIENT', 'INTERMEDIATE', 'BASIC', 
    'MINIMAL', 'NONE', 'UNDER_DEVELOPMENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create facility_availability enum 
DO $$ 
BEGIN
  CREATE TYPE facility_availability AS ENUM (
    'COMPREHENSIVE', 'ADEQUATE', 'BASIC', 
    'MINIMAL', 'INADEQUATE', 'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
