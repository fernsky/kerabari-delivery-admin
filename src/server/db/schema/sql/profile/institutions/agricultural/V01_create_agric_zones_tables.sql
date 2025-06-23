-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create agric_zone_type enum
DO $$ 
BEGIN
  CREATE TYPE agric_zone_type AS ENUM (
    'PULSES', 'OILSEEDS', 'COMMERCIAL_FLOWER', 'SEASONAL_CROPS', 
    'SUPER_ZONE', 'POCKET_AREA', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create soil_quality enum
DO $$ 
BEGIN
  CREATE TYPE soil_quality AS ENUM (
    'EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'VERY_POOR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create irrigation_system enum
DO $$ 
BEGIN
  CREATE TYPE irrigation_system AS ENUM (
    'CANAL', 'SPRINKLER', 'DRIP', 'GROUNDWATER', 'RAINWATER_HARVESTING', 
    'SEASONAL_RIVER', 'NONE', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the agricultural zone table
CREATE TABLE IF NOT EXISTS acme_agric_zone (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type agric_zone_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_hectares INTEGER,
    soil_quality soil_quality,
    irrigation_system irrigation_system,
    
    -- Agricultural details
    major_crops TEXT, -- Comma-separated list of major crops
    seasonal_availability TEXT, -- E.g., "Winter, Summer"
    annual_production INTEGER, -- In metric tons
    production_year VARCHAR(4), -- Year of production data
    
    -- Management details
    is_government_owned BOOLEAN DEFAULT false,
    owner_name TEXT, -- Individual or organization that owns this zone
    owner_contact TEXT,
    caretaker_name TEXT, -- Person responsible for maintenance
    caretaker_contact TEXT,
    
    -- Additional facilities
    has_storage BOOLEAN DEFAULT false,
    has_processing_unit BOOLEAN DEFAULT false,
    has_farmers_cooperative BOOLEAN DEFAULT false,
    
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
CREATE INDEX IF NOT EXISTS idx_agric_zone_location_point ON acme_agric_zone USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_agric_zone_area_polygon ON acme_agric_zone USING GIST (area_polygon);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_agric_zone_type ON acme_agric_zone(type);
CREATE INDEX IF NOT EXISTS idx_agric_zone_name ON acme_agric_zone(name);
CREATE INDEX IF NOT EXISTS idx_agric_zone_ward ON acme_agric_zone(ward_number);
CREATE INDEX IF NOT EXISTS idx_agric_zone_soil_quality ON acme_agric_zone(soil_quality);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_agric_zone_slug ON acme_agric_zone(slug);
