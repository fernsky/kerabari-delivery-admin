-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create grazing_area_type enum
DO $$ 
BEGIN
  CREATE TYPE grazing_area_type AS ENUM (
    'OPEN_RANGE', 'ALPINE_MEADOW', 'COMMUNITY_PASTURE', 'FOREST_UNDERSTORY',
    'FLOODPLAIN', 'SEASONAL_PASTURE', 'DRY_SEASON_RESERVE', 'ROTATIONAL_PADDOCK',
    'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create terrain_type enum
DO $$ 
BEGIN
  CREATE TYPE terrain_type AS ENUM (
    'FLAT', 'ROLLING', 'HILLY', 'MOUNTAINOUS', 'VALLEY', 'RIVERINE', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create accessibility_level enum
DO $$ 
BEGIN
  CREATE TYPE accessibility_level AS ENUM (
    'EASILY_ACCESSIBLE', 'MODERATELY_ACCESSIBLE', 'DIFFICULT_ACCESS', 
    'SEASONAL_ACCESS', 'REMOTE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ground_cover enum
DO $$ 
BEGIN
  CREATE TYPE ground_cover AS ENUM (
    'PRIMARILY_GRASSES', 'SHRUB_DOMINANT', 'MIXED_VEGETATION',
    'FORBS_DOMINANT', 'TREE_SCATTERED', 'DEGRADED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create utilization_level enum
DO $$ 
BEGIN
  CREATE TYPE utilization_level AS ENUM (
    'UNDERUTILIZED', 'OPTIMAL_USE', 'OVERUTILIZED', 
    'SEVERELY_DEGRADED', 'PROTECTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the grazing area table
CREATE TABLE IF NOT EXISTS acme_grazing_area (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type grazing_area_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_hectares DECIMAL(10,2),
    elevation_in_meters INTEGER,
    terrain_type terrain_type,
    ground_cover ground_cover,
    accessibility_level accessibility_level,
    
    -- Grazing specific details
    livestock_capacity INTEGER, -- Number of livestock it can support
    primary_livestock_type TEXT, -- E.g. "Cattle, Sheep, Goats"
    grazing_seasons TEXT, -- E.g. "Summer only", "Year-round", "Winter"
    grazing_duration TEXT, -- E.g. "3 months", "6 months"
    rotational_system BOOLEAN DEFAULT false,
    rest_period TEXT, -- Period when grazing is prohibited for recovery
    utilization_level utilization_level,
    
    -- Water resources
    has_water_source BOOLEAN DEFAULT false,
    water_source_types TEXT, -- E.g., "Stream, Pond, Well"
    water_availability TEXT, -- E.g., "Year-round", "Seasonal"
    water_source_distance INTEGER, -- Distance in meters
    
    -- Management details
    is_government_owned BOOLEAN DEFAULT false,
    owner_name TEXT, -- Individual or organization that owns this area
    owner_contact TEXT,
    caretaker_name TEXT, -- Person responsible for maintenance
    caretaker_contact TEXT,
    permit_required BOOLEAN DEFAULT false,
    permit_info TEXT,
    
    -- Infrastructure
    has_fencing BOOLEAN DEFAULT false,
    has_windbreaks BOOLEAN DEFAULT false,
    has_shelters BOOLEAN DEFAULT false,
    infrastructure_notes TEXT,
    
    -- Health and sustainability
    invasive_species TEXT,
    erosion_issues BOOLEAN DEFAULT false,
    conservation_status TEXT,
    restoration_efforts TEXT,
    
    -- Cultural significance
    traditional_use TEXT,
    cultural_significance TEXT,
    
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
CREATE INDEX IF NOT EXISTS idx_grazing_area_location_point ON acme_grazing_area USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_grazing_area_area_polygon ON acme_grazing_area USING GIST (area_polygon);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_grazing_area_type ON acme_grazing_area(type);
CREATE INDEX IF NOT EXISTS idx_grazing_area_name ON acme_grazing_area(name);
CREATE INDEX IF NOT EXISTS idx_grazing_area_ward ON acme_grazing_area(ward_number);
CREATE INDEX IF NOT EXISTS idx_grazing_area_terrain ON acme_grazing_area(terrain_type);
CREATE INDEX IF NOT EXISTS idx_grazing_area_ground_cover ON acme_grazing_area(ground_cover);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_grazing_area_slug ON acme_grazing_area(slug);
