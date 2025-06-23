-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create petrol_pump_type enum
DO $$ 
BEGIN
  CREATE TYPE petrol_pump_type AS ENUM (
    'PETROL', 'DIESEL', 'PETROL_DIESEL', 'CNG', 'EV_CHARGING', 'MULTIPURPOSE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the petrol_pump table
CREATE TABLE IF NOT EXISTS acme_petrol_pump (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type petrol_pump_type NOT NULL,

    -- Location details
    ward_number INTEGER NOT NULL,
    locality TEXT, -- Village/Tole/Area name
    address TEXT,

    -- Owner details
    owner_name TEXT,
    owner_contact TEXT,
    owner_email TEXT,
    owner_website TEXT,

    -- Facilities
    has_ev_charging BOOLEAN DEFAULT false,
    has_car_wash BOOLEAN DEFAULT false,
    has_convenience_store BOOLEAN DEFAULT false,
    has_restroom BOOLEAN DEFAULT false,
    has_air_filling BOOLEAN DEFAULT false,
    operating_hours TEXT,

    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    location_point GEOMETRY(Point, 4326),

    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_petrol_pump_location_point ON acme_petrol_pump USING GIST (location_point);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_petrol_pump_type ON acme_petrol_pump(type);
CREATE INDEX IF NOT EXISTS idx_petrol_pump_name ON acme_petrol_pump(name);
CREATE INDEX IF NOT EXISTS idx_petrol_pump_slug ON acme_petrol_pump(slug);
CREATE INDEX IF NOT EXISTS idx_petrol_pump_ward ON acme_petrol_pump(ward_number);
