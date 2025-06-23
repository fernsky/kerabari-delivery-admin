-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create location_type enum
DO $$ 
BEGIN
  CREATE TYPE location_type AS ENUM ('VILLAGE', 'SETTLEMENT', 'TOLE', 'WARD', 'SQUATTER_AREA');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the location table
CREATE TABLE IF NOT EXISTS acme_location (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type location_type NOT NULL,
    is_new_settlement BOOLEAN DEFAULT false,
    is_town_planned BOOLEAN DEFAULT false,
    
    -- SEO fields
    meta_title TEXT, -- SEO meta title
    meta_description TEXT, -- SEO meta description
    keywords TEXT, -- SEO keywords
    
    point_geometry GEOMETRY(Point, 4326),
    polygon_geometry GEOMETRY(Polygon, 4326),
    parent_id VARCHAR(36) REFERENCES acme_location(id), -- Fixed reference to acme_location
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_location_point_geometry ON acme_location USING GIST (point_geometry);
CREATE INDEX IF NOT EXISTS idx_location_polygon_geometry ON acme_location USING GIST (polygon_geometry);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_location_type ON acme_location(type);
CREATE INDEX IF NOT EXISTS idx_location_name ON acme_location(name);
CREATE INDEX IF NOT EXISTS idx_location_parent ON acme_location(parent_id);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_location_slug ON acme_location(slug);
