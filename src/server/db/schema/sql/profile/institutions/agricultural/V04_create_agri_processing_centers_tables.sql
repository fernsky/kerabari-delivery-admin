-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create center_type enum
DO $$ 
BEGIN
  CREATE TYPE center_type AS ENUM (
    'COLLECTION_CENTER', 'STORAGE_FACILITY', 'PROCESSING_UNIT', 
    'MULTIPURPOSE_CENTER', 'MARKET_CENTER', 'COLD_STORAGE',
    'WAREHOUSE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create storage_type enum
DO $$ 
BEGIN
  CREATE TYPE storage_type AS ENUM (
    'AMBIENT', 'COLD_STORAGE', 'CONTROLLED_ATMOSPHERE', 
    'SILO', 'WAREHOUSE', 'GRANARY', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create processing_level enum
DO $$ 
BEGIN
  CREATE TYPE processing_level AS ENUM (
    'PRIMARY_PROCESSING', 'SECONDARY_PROCESSING', 'TERTIARY_PROCESSING',
    'MINIMAL_PROCESSING', 'COMPREHENSIVE_PROCESSING', 'NOT_APPLICABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE ownership_type AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'COOPERATIVE', 'COMMUNITY',
    'PUBLIC_PRIVATE_PARTNERSHIP', 'NGO_MANAGED', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the agri processing center table
CREATE TABLE IF NOT EXISTS acme_agri_processing_center (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    center_type center_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical properties
    area_in_square_meters DECIMAL(10,2),
    building_year_constructed INTEGER,
    is_operational BOOLEAN DEFAULT true,
    operational_status TEXT,
    operation_start_year INTEGER,
    
    -- Storage details
    has_storage_facility BOOLEAN DEFAULT false,
    storage_type storage_type,
    storage_total_capacity_mt DECIMAL(10,2), -- In metric tons
    storage_current_usage_mt DECIMAL(10,2),
    temperature_controlled BOOLEAN DEFAULT false,
    temperature_range_min DECIMAL(5,2),
    temperature_range_max DECIMAL(5,2),
    humidity_controlled BOOLEAN DEFAULT false,
    
    -- Processing capabilities
    has_processing_unit BOOLEAN DEFAULT false,
    processing_level processing_level,
    processing_capacity_mt_per_day DECIMAL(10,2),
    main_processing_activities TEXT, -- E.g., "Drying, Sorting, Packaging"
    value_addition_activities TEXT, -- E.g., "Cleaning, Grading, Packaging"
    
    -- Products and commodities
    primary_commodities TEXT, -- Main products handled
    secondary_commodities TEXT, -- Secondary products handled
    seasonal_availability TEXT, -- When the center is most active
    
    -- Quality control
    has_quality_control_lab BOOLEAN DEFAULT false,
    quality_standards TEXT, -- E.g., "HACCP, ISO 22000"
    certifications TEXT, -- E.g., "Organic, Fair Trade"
    
    -- Management and ownership
    ownership_type ownership_type,
    owner_name TEXT,
    owner_contact TEXT,
    manager_name TEXT,
    manager_contact TEXT,
    
    -- Staffing
    total_staff_count INTEGER,
    technical_staff_count INTEGER,
    
    -- Connectivity and services
    has_electricity BOOLEAN DEFAULT true,
    has_water_supply BOOLEAN DEFAULT true,
    has_waste_management_system BOOLEAN DEFAULT false,
    has_internet BOOLEAN DEFAULT false,
    
    -- Capacity and utilization
    annual_throughput_mt DECIMAL(12,2), -- Annual volume processed
    capacity_utilization_percent INTEGER, -- 0-100
    recorded_year VARCHAR(4), -- Year of the recorded data
    
    -- Economic impact
    employment_generated INTEGER,
    service_area_radius_km DECIMAL(6,2),
    farmers_served_count INTEGER,
    women_farmers_percent INTEGER,
    
    -- Linkages to other entities
    linked_grazing_areas JSONB DEFAULT '[]'::jsonb, -- Array of grazing area IDs
    linked_agric_zones JSONB DEFAULT '[]'::jsonb, -- Array of agricultural zone IDs
    linked_grasslands JSONB DEFAULT '[]'::jsonb, -- Array of grassland IDs
    
    -- Financial aspects
    establishment_cost_npr DECIMAL(14,2),
    annual_operating_cost_npr DECIMAL(14,2),
    annual_revenue_npr DECIMAL(14,2),
    profitable_operation BOOLEAN DEFAULT true,
    
    -- Challenges and needs
    major_constraints TEXT,
    development_needs TEXT,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    facility_footprint GEOMETRY(Polygon, 4326),
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_location_point 
    ON acme_agri_processing_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_facility_footprint 
    ON acme_agri_processing_center USING GIST (facility_footprint);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_type 
    ON acme_agri_processing_center(center_type);
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_name 
    ON acme_agri_processing_center(name);
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_ward 
    ON acme_agri_processing_center(ward_number);
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_operational 
    ON acme_agri_processing_center(is_operational);
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_ownership_type 
    ON acme_agri_processing_center(ownership_type);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_agri_processing_center_slug 
    ON acme_agri_processing_center(slug);
