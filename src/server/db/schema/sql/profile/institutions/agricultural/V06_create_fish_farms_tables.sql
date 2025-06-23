-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create fish_farm_type enum
DO $$ 
BEGIN
  CREATE TYPE fish_farm_type AS ENUM (
    'POND_CULTURE', 'CAGE_CULTURE', 'TANK_CULTURE', 'RACEWAY_CULTURE',
    'RECIRCULATING_AQUACULTURE_SYSTEM', 'HATCHERY', 'NURSERY',
    'INTEGRATED_FARMING', 'RICE_FISH_CULTURE', 'ORNAMENTAL_FISH_FARM',
    'RESEARCH_FACILITY', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create fish_farm_ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE fish_farm_ownership_type AS ENUM (
    'PRIVATE', 'GOVERNMENT', 'COMMUNITY', 'COOPERATIVE',
    'PUBLIC_PRIVATE_PARTNERSHIP', 'NGO_MANAGED', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_source_type enum
DO $$ 
BEGIN
  CREATE TYPE water_source_type AS ENUM (
    'RIVER', 'STREAM', 'SPRING', 'WELL', 'GROUNDWATER',
    'RAINWATER', 'CANAL', 'RESERVOIR', 'LAKE', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create feeding_system enum
DO $$ 
BEGIN
  CREATE TYPE feeding_system AS ENUM (
    'MANUAL', 'AUTOMATIC', 'DEMAND_FEEDER', 'SUPPLEMENTARY', 'NATURAL_FOOD_ONLY', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_management_system enum
DO $$ 
BEGIN
  CREATE TYPE water_management_system AS ENUM (
    'STATIC', 'FLOW_THROUGH', 'RECIRCULATING', 'AERATED', 'INTEGRATED', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create culture_system enum
DO $$ 
BEGIN
  CREATE TYPE culture_system AS ENUM (
    'EXTENSIVE', 'SEMI_INTENSIVE', 'INTENSIVE', 'SUPER_INTENSIVE', 'POLYCULTURE', 'MONOCULTURE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the fish farm table
CREATE TABLE IF NOT EXISTS acme_fish_farm (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    farm_type fish_farm_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    ownership_type fish_farm_ownership_type,
    total_area_in_hectares DECIMAL(10,2),
    water_surface_area_in_hectares DECIMAL(10,2),
    operational_since INTEGER, -- Year
    
    -- Water body characteristics
    total_pond_count INTEGER,
    active_pond_count INTEGER,
    average_pond_size_in_square_meters DECIMAL(10,2),
    average_water_depth_in_meters DECIMAL(5,2),
    total_water_volume_in_cubic_meters DECIMAL(12,2),
    water_source water_source_type,
    water_source_details TEXT,
    water_availability_issues TEXT,
    has_water_quality_monitoring BOOLEAN DEFAULT false,
    water_quality_parameters TEXT, -- E.g., "pH, DO, Temperature, Ammonia"
    
    -- Culture and management details
    culture_system culture_system,
    primary_fish_species TEXT, -- E.g., "Carp, Tilapia, Catfish"
    secondary_fish_species TEXT,
    seed_source_details TEXT,
    stocking_density_per_square_meter DECIMAL(8,2),
    growout_period_in_months INTEGER,
    feeding_system feeding_system,
    feed_types TEXT, -- E.g., "Commercial pellet, Farm-made, Natural"
    feed_conversion_ratio DECIMAL(5,2),
    annual_feed_usage_in_kg DECIMAL(10,2),
    
    -- Water management
    water_management_system water_management_system,
    uses_probiotics BOOLEAN DEFAULT false,
    uses_aeration BOOLEAN DEFAULT false,
    aeration_type TEXT, -- E.g., "Paddle wheel, Air diffuser, Jet aerator"
    water_exchange_frequency TEXT, -- E.g., "Daily, Weekly, Monthly"
    water_exchange_percentage INTEGER, -- 0-100
    effluent_management_details TEXT,
    
    -- Production details
    annual_production_in_kg DECIMAL(12,2),
    average_yield_per_hectare_in_kg DECIMAL(10,2),
    survival_rate_percentage INTEGER, -- 0-100
    average_fish_size_in_grams DECIMAL(8,2),
    recorded_year_production VARCHAR(4),
    production_cycles_per_year INTEGER, -- Number of harvests per year
    
    -- Infrastructure and equipment
    has_farm_house BOOLEAN DEFAULT false,
    has_hatchery BOOLEAN DEFAULT false,
    hatchery_capacity_million_fry INTEGER, -- Capacity in million fry
    has_nursery BOOLEAN DEFAULT false,
    nursery_area_in_square_meters DECIMAL(10,2),
    has_feed_storage BOOLEAN DEFAULT false,
    has_equipment BOOLEAN DEFAULT false,
    equipment_details TEXT,
    has_laboratory BOOLEAN DEFAULT false,
    laboratory_purpose TEXT,
    has_ice_production BOOLEAN DEFAULT false,
    has_processing_area BOOLEAN DEFAULT false,
    has_electricity BOOLEAN DEFAULT false,
    has_generator BOOLEAN DEFAULT false,
    has_fencing BOOLEAN DEFAULT false,
    has_security_system BOOLEAN DEFAULT false,
    
    -- Personnel and management
    owner_name TEXT,
    owner_contact TEXT,
    manager_name TEXT,
    manager_contact TEXT,
    technical_staff_count INTEGER,
    regular_staff_count INTEGER,
    seasonal_labor_count INTEGER,
    has_trained_staff BOOLEAN DEFAULT false,
    training_details TEXT,
    
    -- Economic aspects
    annual_operating_cost_npr DECIMAL(14,2),
    annual_revenue_npr DECIMAL(14,2),
    profitable_operation BOOLEAN DEFAULT true,
    market_access_details TEXT,
    major_buyer_types TEXT, -- E.g., "Local market, Wholesalers, Exports"
    average_selling_price_per_kg DECIMAL(8,2),
    
    -- Health management
    common_diseases TEXT,
    disease_prevention_methods TEXT,
    uses_chemicals BOOLEAN DEFAULT false,
    chemical_usage_details TEXT,
    mortality_percentage INTEGER, -- 0-100
    health_monitoring_frequency TEXT, -- E.g., "Daily, Weekly, Monthly"
    
    -- Sustainability aspects
    has_environmental_impact_assessment BOOLEAN DEFAULT false,
    uses_renewable_energy BOOLEAN DEFAULT false,
    renewable_energy_details TEXT,
    waste_management_practices TEXT,
    has_certifications BOOLEAN DEFAULT false,
    certification_details TEXT, -- E.g., "Organic, BAP, ASC"
    
    -- Challenges and support
    major_constraints TEXT,
    disaster_vulnerabilities TEXT, -- E.g., "Floods, Drought, Disease"
    receives_government_support BOOLEAN DEFAULT false,
    government_support_details TEXT,
    receives_ngo_support BOOLEAN DEFAULT false,
    ngo_support_details TEXT,
    technical_support_needs TEXT,
    
    -- Future plans
    expansion_plans TEXT,
    diversification_plans TEXT,
    technology_upgrade_plans TEXT,
    
    -- Linkages to other entities
    linked_processing_centers JSONB DEFAULT '[]'::jsonb,
    linked_water_bodies JSONB DEFAULT '[]'::jsonb,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    farm_boundary GEOMETRY(Polygon, 4326),
    pond_polygons GEOMETRY(MultiPolygon, 4326), -- Multiple pond boundaries
    
    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    verified_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_fish_farm_location_point 
    ON acme_fish_farm USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_fish_farm_boundary 
    ON acme_fish_farm USING GIST (farm_boundary);
CREATE INDEX IF NOT EXISTS idx_fish_farm_pond_polygons
    ON acme_fish_farm USING GIST (pond_polygons);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_fish_farm_type 
    ON acme_fish_farm(farm_type);
CREATE INDEX IF NOT EXISTS idx_fish_farm_ownership_type 
    ON acme_fish_farm(ownership_type);
CREATE INDEX IF NOT EXISTS idx_fish_farm_name 
    ON acme_fish_farm(name);
CREATE INDEX IF NOT EXISTS idx_fish_farm_ward 
    ON acme_fish_farm(ward_number);
CREATE INDEX IF NOT EXISTS idx_fish_farm_culture_system
    ON acme_fish_farm(culture_system);
CREATE INDEX IF NOT EXISTS idx_fish_farm_water_source
    ON acme_fish_farm(water_source);
CREATE INDEX IF NOT EXISTS idx_fish_farm_is_verified 
    ON acme_fish_farm(is_verified);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_fish_farm_slug 
    ON acme_fish_farm(slug);
