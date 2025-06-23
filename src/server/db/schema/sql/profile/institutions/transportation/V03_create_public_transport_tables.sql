-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create public_transport_type enum
DO $$ 
BEGIN
  CREATE TYPE public_transport_type AS ENUM (
    'BUS', 'MINIBUS', 'MICROBUS', 'TEMPO', 'AUTO_RICKSHAW', 'TAXI', 'E_RICKSHAW', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create vehicle_condition enum
DO $$ 
BEGIN
  CREATE TYPE vehicle_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 'UNDER_MAINTENANCE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create frequency enum
DO $$ 
BEGIN
  CREATE TYPE frequency AS ENUM (
    'DAILY', 'WEEKDAYS_ONLY', 'WEEKENDS_ONLY', 'OCCASIONAL', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the public_transport table
CREATE TABLE IF NOT EXISTS acme_public_transport (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type public_transport_type NOT NULL,
    
    -- Operator details
    operator_name TEXT,
    operator_contact TEXT,
    operator_email TEXT,
    operator_website TEXT,
    
    -- Route details
    route_name TEXT,
    start_point TEXT,
    end_point TEXT,
    via_points TEXT, -- Comma separated list of major stops
    estimated_duration_minutes INTEGER,
    
    -- Schedule details
    frequency frequency,
    start_time TIME,
    end_time TIME,
    interval_minutes INTEGER,
    
    -- Vehicle details
    vehicle_count INTEGER,
    seating_capacity INTEGER,
    vehicle_condition vehicle_condition,
    has_air_conditioning BOOLEAN DEFAULT false,
    has_wifi BOOLEAN DEFAULT false,
    is_accessible BOOLEAN DEFAULT false,
    
    -- Fare details
    fare_amount INTEGER,
    fare_description TEXT,
    
    -- Related entities
    serving_road_ids TEXT, -- Comma-separated list of road IDs
    parking_facility_ids TEXT, -- Comma-separated list of parking facility IDs
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    route_path GEOMETRY(LineString, 4326),
    stop_points GEOMETRY(MultiPoint, 4326),
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_public_transport_route_path ON acme_public_transport USING GIST (route_path);
CREATE INDEX IF NOT EXISTS idx_public_transport_stop_points ON acme_public_transport USING GIST (stop_points);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_public_transport_type ON acme_public_transport(type);
CREATE INDEX IF NOT EXISTS idx_public_transport_name ON acme_public_transport(name);
CREATE INDEX IF NOT EXISTS idx_public_transport_slug ON acme_public_transport(slug);
CREATE INDEX IF NOT EXISTS idx_public_transport_operator ON acme_public_transport(operator_name);
