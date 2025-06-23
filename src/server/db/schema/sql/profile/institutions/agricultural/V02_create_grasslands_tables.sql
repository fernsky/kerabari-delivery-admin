-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create grassland_type enum
DO $$ 
BEGIN
  CREATE TYPE grassland_type AS ENUM (
    'NATURAL_MEADOW', 'IMPROVED_PASTURE', 'RANGELAND', 'SILVOPASTURE', 
    'WETLAND_GRAZING', 'ALPINE_GRASSLAND', 'COMMON_GRAZING_LAND', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create vegetation_density enum
DO $$ 
BEGIN
  CREATE TYPE vegetation_density AS ENUM (
    'VERY_DENSE', 'DENSE', 'MODERATE', 'SPARSE', 'VERY_SPARSE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create grassland_management enum
DO $$ 
BEGIN
  CREATE TYPE grassland_management AS ENUM (
    'ROTATIONAL_GRAZING', 'CONTINUOUS_GRAZING', 'DEFERRED_GRAZING', 
    'HAY_PRODUCTION', 'CONSERVATION', 'UNMANAGED', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the grassland table
CREATE TABLE IF NOT EXISTS acme_grassland (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type grassland_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_hectares DECIMAL(10,2),
    elevation_in_meters INTEGER,
    vegetation_density vegetation_density,
    grassland_management grassland_management,
    
    -- Grassland specific details
    dominant_species TEXT, -- Comma-separated list of dominant grass/plant species
    carrying_capacity INTEGER, -- Livestock units supported per hectare
    grazing_period TEXT, -- E.g., "Apr-Oct", "Year-round"
    annual_fodder_yield DECIMAL(10,2), -- In metric tons
    yield_year VARCHAR(4), -- Year of yield data
    
    -- Management details
    is_government_owned BOOLEAN DEFAULT false,
    owner_name TEXT, -- Individual or organization that owns this grassland
    owner_contact TEXT,
    caretaker_name TEXT, -- Person responsible for maintenance
    caretaker_contact TEXT,
    
    -- Additional information
    has_water_source BOOLEAN DEFAULT false,
    water_source_type TEXT, -- E.g., "Stream", "Pond", "Well"
    is_fenced BOOLEAN DEFAULT false,
    has_grazing_rights BOOLEAN DEFAULT false,
    
    -- Conservation status
    has_protected_status BOOLEAN DEFAULT false,
    protection_type TEXT, -- E.g., "Wildlife reserve", "Community protected"
    biodiversity_value TEXT, -- Description of ecological importance
    
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
CREATE INDEX IF NOT EXISTS idx_grassland_location_point ON acme_grassland USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_grassland_area_polygon ON acme_grassland USING GIST (area_polygon);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_grassland_type ON acme_grassland(type);
CREATE INDEX IF NOT EXISTS idx_grassland_name ON acme_grassland(name);
CREATE INDEX IF NOT EXISTS idx_grassland_ward ON acme_grassland(ward_number);
CREATE INDEX IF NOT EXISTS idx_grassland_vegetation_density ON acme_grassland(vegetation_density);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_grassland_slug ON acme_grassland(slug);
