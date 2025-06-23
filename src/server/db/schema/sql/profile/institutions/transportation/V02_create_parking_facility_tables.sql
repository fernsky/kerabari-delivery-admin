-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create parking_facility_type enum
DO $$ 
BEGIN
  CREATE TYPE parking_facility_type AS ENUM (
    'BUS_PARK', 'TAXI_PARK', 'TEMPO_PARK', 'AUTO_RICKSHAW_PARK',
    'CAR_PARK', 'BIKE_PARK', 'MULTIPURPOSE_PARK', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create parking_condition enum
DO $$ 
BEGIN
  CREATE TYPE parking_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 'UNDER_CONSTRUCTION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Check if drainage_system enum exists, if not create it
-- (This might have been created already by the road table)
DO $$ 
BEGIN
  CREATE TYPE drainage_system AS ENUM (
    'PROPER', 'PARTIAL', 'NONE', 'BLOCKED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the parking_facility table
CREATE TABLE IF NOT EXISTS acme_parking_facility (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type parking_facility_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_square_meters INTEGER,
    vehicle_capacity INTEGER,
    condition parking_condition,
    drainage_system drainage_system,
    
    -- Additional facilities and features
    has_roof BOOLEAN DEFAULT false,
    has_toilet BOOLEAN DEFAULT false,
    has_waiting_area BOOLEAN DEFAULT false,
    has_ticket_counter BOOLEAN DEFAULT false,
    has_food_stalls BOOLEAN DEFAULT false,
    has_security_personnel BOOLEAN DEFAULT false,
    has_cctv BOOLEAN DEFAULT false,
    operating_hours TEXT,
    
    -- Management details
    operator TEXT,
    contact_info TEXT,
    established_year VARCHAR(4),
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    area_polygon GEOMETRY(Polygon, 4326),
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_parking_location_point ON acme_parking_facility USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_parking_area_polygon ON acme_parking_facility USING GIST (area_polygon);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_parking_facility_type ON acme_parking_facility(type);
CREATE INDEX IF NOT EXISTS idx_parking_facility_name ON acme_parking_facility(name);
CREATE INDEX IF NOT EXISTS idx_parking_facility_ward ON acme_parking_facility(ward_number);
CREATE INDEX IF NOT EXISTS idx_parking_facility_condition ON acme_parking_facility(condition);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_parking_facility_slug ON acme_parking_facility(slug);
