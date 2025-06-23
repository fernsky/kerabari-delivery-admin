-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create accessibility_level enum
DO $$ 
BEGIN
  CREATE TYPE accessibility_level AS ENUM (
    'EASILY_ACCESSIBLE', 'MODERATELY_ACCESSIBLE', 'DIFFICULT_ACCESS',
    'CHALLENGING_ACCESS', 'RESTRICTED_ACCESS', 'ACCESSIBLE_FOR_DISABLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create building_condition enum
DO $$ 
BEGIN
  CREATE TYPE building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_MAINTENANCE',
    'POOR', 'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create usage_frequency enum
DO $$ 
BEGIN
  CREATE TYPE usage_frequency AS ENUM (
    'DAILY', 'SEVERAL_TIMES_WEEKLY', 'WEEKLY', 'MONTHLY',
    'OCCASIONALLY', 'SEASONALLY', 'RARELY', 'NOT_IN_USE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_quality enum
DO $$ 
BEGIN
  CREATE TYPE water_quality AS ENUM (
    'EXCELLENT', 'GOOD', 'ACCEPTABLE', 'POOR', 'VERY_POOR', 'UNTESTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create environmental_impact_level enum
DO $$ 
BEGIN
  CREATE TYPE environmental_impact_level AS ENUM (
    'HIGH', 'MODERATE', 'LOW', 'MINIMAL', 'UNKNOWN', 'MONITORED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create indexes and additional structures as needed for these types
-- (Note: PostgreSQL doesn't allow indexes on types directly, but this comment is here
-- for consistency with other SQL files in the project)
