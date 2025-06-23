-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create cleaning frequency enum
DO $$ 
BEGIN
  CREATE TYPE cleaning_frequency AS ENUM (
    'MULTIPLE_TIMES_DAILY', 'DAILY', 'ALTERNATE_DAYS', 'WEEKLY', 
    'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'AS_NEEDED', 'IRREGULAR', 'NEVER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create maintenance responsibility enum
DO $$ 
BEGIN
  CREATE TYPE maintenance_responsibility AS ENUM (
    'MUNICIPALITY', 'WARD_OFFICE', 'COMMUNITY_COMMITTEE', 'PRIVATE_CONTRACTOR', 
    'VOLUNTEERS', 'NGO', 'USER_GROUP', 'RELIGIOUS_ENTITY', 'MIXED_RESPONSIBILITY', 'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create usage intensity enum
DO $$ 
BEGIN
  CREATE TYPE usage_intensity AS ENUM (
    'VERY_HIGH', 'HIGH', 'MODERATE', 'LOW', 'VERY_LOW', 'SEASONAL', 'VARIABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
