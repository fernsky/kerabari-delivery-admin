-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Building condition enum
DO $$ 
BEGIN
  CREATE TYPE building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 'NEEDS_RECONSTRUCTION', 
    'UNDER_CONSTRUCTION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Service availability enum
DO $$ 
BEGIN
  CREATE TYPE service_availability AS ENUM (
    'ALWAYS_AVAILABLE', 'MOSTLY_AVAILABLE', 'OCCASIONALLY_AVAILABLE', 
    'RARELY_AVAILABLE', 'NOT_AVAILABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Facility level enum
DO $$ 
BEGIN
  CREATE TYPE facility_level AS ENUM (
    'EXCELLENT', 'GOOD', 'ADEQUATE', 'BASIC', 'MINIMAL', 'INADEQUATE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Emergency service level enum
DO $$ 
BEGIN
  CREATE TYPE emergency_service_level AS ENUM (
    'COMPREHENSIVE_24_7', 'BASIC_24_7', 'LIMITED_HOURS', 'STABILIZATION_ONLY',
    'REFERRAL_ONLY', 'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Accreditation status enum
DO $$ 
BEGIN
  CREATE TYPE accreditation_status AS ENUM (
    'FULLY_ACCREDITED', 'PARTIALLY_ACCREDITED', 'IN_PROCESS', 
    'NOT_ACCREDITED', 'ACCREDITATION_EXPIRED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Health facility ownership type enum
DO $$ 
BEGIN
  CREATE TYPE health_facility_ownership AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'COMMUNITY', 'NGO_OPERATED', 'PUBLIC_PRIVATE_PARTNERSHIP',
    'MUNICIPAL', 'PROVINCIAL', 'FEDERAL', 'RELIGIOUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Equipment condition enum
DO $$ 
BEGIN
  CREATE TYPE equipment_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_MAINTENANCE', 
    'OUTDATED', 'NON_FUNCTIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Water source type enum
DO $$ 
BEGIN
  CREATE TYPE water_source_type AS ENUM (
    'MUNICIPAL', 'WELL', 'BOREWELL', 'TANKER', 'RAINWATER_HARVESTING',
    'NATURAL_SPRING', 'RIVER', 'NONE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Power backup type enum
DO $$ 
BEGIN
  CREATE TYPE power_backup_type AS ENUM (
    'GENERATOR', 'SOLAR', 'INVERTER', 'UPS', 'NONE', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
