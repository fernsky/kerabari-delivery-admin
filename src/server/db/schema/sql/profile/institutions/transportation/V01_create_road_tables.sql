-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create road_type enum
DO $$ 
BEGIN
  CREATE TYPE road_type AS ENUM (
    'HIGHWAY', 'URBAN', 'RURAL', 'GRAVEL', 
    'EARTHEN', 'AGRICULTURAL', 'ALLEY', 'BRIDGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create road_condition enum
DO $$ 
BEGIN
  CREATE TYPE road_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 'UNDER_CONSTRUCTION'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create drainage_system enum
DO $$ 
BEGIN
  CREATE TYPE drainage_system AS ENUM (
    'PROPER', 'PARTIAL', 'NONE', 'BLOCKED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the road table
CREATE TABLE IF NOT EXISTS acme_road (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type road_type NOT NULL,
    width_in_meters INTEGER,
    condition road_condition,
    drainage_system drainage_system,
    
    -- Additional details
    maintenance_year VARCHAR(4),
    length_in_meters INTEGER,
    start_point TEXT,
    end_point TEXT,
    has_street_lights BOOLEAN DEFAULT false,
    has_divider BOOLEAN DEFAULT false,
    has_pedestrian_path BOOLEAN DEFAULT false,
    has_bicycle_lane BOOLEAN DEFAULT false,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    road_path GEOMETRY(LineString, 4326),
    representative_point GEOMETRY(Point, 4326),
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_road_path ON acme_road USING GIST (road_path);
CREATE INDEX IF NOT EXISTS idx_road_representative_point ON acme_road USING GIST (representative_point);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_road_type ON acme_road(type);
CREATE INDEX IF NOT EXISTS idx_road_name ON acme_road(name);
CREATE INDEX IF NOT EXISTS idx_road_condition ON acme_road(condition);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_road_slug ON acme_road(slug);
