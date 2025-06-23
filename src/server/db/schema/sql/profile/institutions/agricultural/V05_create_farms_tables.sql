-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create farm_type enum
DO $$ 
BEGIN
  CREATE TYPE farm_type AS ENUM (
    'CROP_FARM', 'LIVESTOCK_FARM', 'MIXED_FARM', 'POULTRY_FARM',
    'DAIRY_FARM', 'AQUACULTURE_FARM', 'HORTICULTURE_FARM',
    'APICULTURE_FARM', 'SERICULTURE_FARM', 'ORGANIC_FARM',
    'COMMERCIAL_FARM', 'SUBSISTENCE_FARM', 'AGROFORESTRY', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create farming_system enum
DO $$ 
BEGIN
  CREATE TYPE farming_system AS ENUM (
    'CONVENTIONAL', 'ORGANIC', 'INTEGRATED', 'CONSERVATION', 'HYDROPONIC',
    'PERMACULTURE', 'BIODYNAMIC', 'TRADITIONAL', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create irrigation_type enum
DO $$ 
BEGIN
  CREATE TYPE irrigation_type AS ENUM (
    'RAINFED', 'CANAL', 'DRIP', 'SPRINKLER', 'FLOOD',
    'GROUNDWATER', 'RAINWATER_HARVESTING', 'NONE', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create soil_type enum
DO $$ 
BEGIN
  CREATE TYPE soil_type AS ENUM (
    'CLAY', 'SANDY', 'LOAM', 'SILT', 'CLAY_LOAM',
    'SANDY_LOAM', 'SILTY_CLAY', 'ROCKY', 'PEATY', 'CHALKY', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create livestock_housing enum
DO $$ 
BEGIN
  CREATE TYPE livestock_housing AS ENUM (
    'OPEN_SHED', 'BARN', 'FREE_STALL', 'TIE_STALL', 'DEEP_LITTER',
    'CAGE_SYSTEM', 'FREE_RANGE', 'MOVABLE_PEN', 'ZERO_GRAZING', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create land_ownership enum
DO $$ 
BEGIN
  CREATE TYPE land_ownership AS ENUM (
    'OWNED', 'LEASED', 'COMMUNITY', 'SHARED', 'GOVERNMENT', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the farm table
CREATE TABLE IF NOT EXISTS acme_farm (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    farm_type farm_type NOT NULL,
    farming_system farming_system,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Land details
    total_area_in_hectares DECIMAL(10,2),
    cultivated_area_in_hectares DECIMAL(10,2),
    land_ownership land_ownership,
    soil_type soil_type,
    irrigation_type irrigation_type,
    irrigation_source_details TEXT,
    irrigated_area_in_hectares DECIMAL(10,2),
    
    -- Crops
    main_crops TEXT, -- E.g., "Rice, Wheat, Maize"
    secondary_crops TEXT, -- E.g., "Vegetables, Pulses"
    crop_rotation BOOLEAN DEFAULT false,
    crop_rotation_details TEXT,
    intercropping BOOLEAN DEFAULT false,
    cropping_seasons TEXT, -- E.g., "Summer, Winter, Year-round"
    annual_crop_yield_mt DECIMAL(10,2), -- Metric Tons
    recorded_year_crops VARCHAR(4),
    
    -- Livestock
    has_livestock BOOLEAN DEFAULT false,
    livestock_types TEXT, -- E.g., "Cattle, Goats, Poultry"
    cattle_count INTEGER,
    buffalo_count INTEGER,
    goat_count INTEGER,
    sheep_count INTEGER,
    pig_count INTEGER,
    poultry_count INTEGER,
    other_livestock_count INTEGER,
    other_livestock_details TEXT,
    livestock_housing_type livestock_housing,
    livestock_management_details TEXT,
    annual_milk_production_liters DECIMAL(12,2),
    annual_egg_production INTEGER,
    annual_meat_production_kg DECIMAL(10,2),
    recorded_year_livestock VARCHAR(4),
    
    -- Farmer details
    owner_name TEXT,
    owner_contact TEXT,
    farmer_type TEXT, -- E.g., "Commercial, Subsistence, Cooperative member"
    farmer_education TEXT, -- Highest education level
    farmer_experience_years INTEGER,
    has_cooperative_membership BOOLEAN DEFAULT false,
    cooperative_name TEXT,
    
    -- Labor and economics
    family_labor_count INTEGER,
    hired_labor_count INTEGER,
    annual_investment_npr DECIMAL(14,2),
    annual_income_npr DECIMAL(14,2),
    profitable_operation BOOLEAN DEFAULT true,
    market_access_details TEXT,
    major_buyer_types TEXT, -- E.g., "Local market, Wholesalers, Cooperatives"
    
    -- Infrastructure
    has_farm_house BOOLEAN DEFAULT false,
    has_storage BOOLEAN DEFAULT false,
    storage_capacity_mt DECIMAL(10,2),
    has_farm_equipment BOOLEAN DEFAULT false,
    equipment_details TEXT,
    has_electricity BOOLEAN DEFAULT false,
    has_road_access BOOLEAN DEFAULT false,
    road_access_type TEXT, -- E.g., "Paved, Dirt, Seasonal"
    
    -- Sustainability and practices
    uses_chemical_fertilizer BOOLEAN DEFAULT false,
    uses_pesticides BOOLEAN DEFAULT false,
    uses_organic_methods BOOLEAN DEFAULT false,
    composting BOOLEAN DEFAULT false,
    soil_conservation_practices TEXT,
    rainwater_harvesting BOOLEAN DEFAULT false,
    manure_management TEXT,
    has_certifications BOOLEAN DEFAULT false,
    certification_details TEXT,
    
    -- Technical support and training
    receives_extension_services BOOLEAN DEFAULT false,
    extension_service_provider TEXT,
    training_received TEXT,
    technical_support_needs TEXT,
    
    -- Challenges and opportunities
    major_challenges TEXT,
    disaster_vulnerabilities TEXT, -- E.g., "Floods, Drought, Landslides"
    growth_opportunities TEXT,
    future_expansion_plans TEXT,
    
    -- Linkages to other entities
    linked_grazing_areas JSONB DEFAULT '[]'::jsonb,
    linked_processing_centers JSONB DEFAULT '[]'::jsonb,
    linked_agric_zones JSONB DEFAULT '[]'::jsonb, 
    linked_grasslands JSONB DEFAULT '[]'::jsonb,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    farm_boundary GEOMETRY(Polygon, 4326),
    
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
CREATE INDEX IF NOT EXISTS idx_farm_location_point 
    ON acme_farm USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_farm_boundary 
    ON acme_farm USING GIST (farm_boundary);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_farm_type 
    ON acme_farm(farm_type);
CREATE INDEX IF NOT EXISTS idx_farm_name 
    ON acme_farm(name);
CREATE INDEX IF NOT EXISTS idx_farm_ward 
    ON acme_farm(ward_number);
CREATE INDEX IF NOT EXISTS idx_farm_has_livestock 
    ON acme_farm(has_livestock);
CREATE INDEX IF NOT EXISTS idx_farm_farming_system 
    ON acme_farm(farming_system);
CREATE INDEX IF NOT EXISTS idx_farm_soil_type 
    ON acme_farm(soil_type);
CREATE INDEX IF NOT EXISTS idx_farm_irrigation_type 
    ON acme_farm(irrigation_type);
CREATE INDEX IF NOT EXISTS idx_farm_land_ownership 
    ON acme_farm(land_ownership);
CREATE INDEX IF NOT EXISTS idx_farm_is_verified 
    ON acme_farm(is_verified);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_farm_slug 
    ON acme_farm(slug);
