-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spring_type enum
DO $$ 
BEGIN
  CREATE TYPE spring_type AS ENUM (
    'GRAVITY_SPRING', 'ARTESIAN_SPRING', 'HOT_SPRING', 'MINERAL_SPRING',
    'THERMAL_SPRING', 'GEYSER', 'SEEP', 'KARST_SPRING', 'CONTACT_SPRING',
    'FAULT_SPRING', 'FRACTURE_SPRING', 'DEPRESSION_SPRING', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create spring_flow_consistency enum
DO $$ 
BEGIN
  CREATE TYPE spring_flow_consistency AS ENUM (
    'PERENNIAL', 'SEASONAL', 'INTERMITTENT', 'EPHEMERAL',
    'VARIABLE', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create spring_status enum
DO $$ 
BEGIN
  CREATE TYPE spring_status AS ENUM (
    'FLOWING', 'REDUCED_FLOW', 'DRIED_UP', 'CONTAMINATED',
    'PROTECTED', 'DEVELOPED', 'THREATENED', 'RESTORED', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_quality enum if not already exists
DO $$ 
BEGIN
  CREATE TYPE water_quality AS ENUM (
    'EXCELLENT', 'GOOD', 'ACCEPTABLE', 'POOR', 'VERY_POOR', 'UNTESTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the spring table
CREATE TABLE IF NOT EXISTS acme_spring (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    name_in_local_language TEXT,
    description TEXT,
    spring_type spring_type NOT NULL,

    -- Location details
    ward_number INTEGER,
    location TEXT,
    address TEXT,
    elevation_m DECIMAL(8, 2),

    -- Physical characteristics
    flow_rate_liters_per_minute DECIMAL(10, 2),
    flow_consistency spring_flow_consistency,
    water_temperature_c DECIMAL(5, 2),
    catchment_area_sq_km DECIMAL(10, 2),
    has_visible_source BOOLEAN DEFAULT true,
    water_color TEXT,
    water_clarity TEXT,
    has_mineral_content BOOLEAN DEFAULT false,
    mineral_content_details TEXT,
    has_medicinal_properties BOOLEAN DEFAULT false,
    medicinal_properties_details TEXT,

    -- Environmental context
    surrounding_ecosystem TEXT,
    surrounding_vegetation TEXT,
    geological_formation TEXT,
    biodiversity_notes TEXT,
    associated_wildlife TEXT,

    -- Status and condition
    current_status spring_status,
    water_quality water_quality,
    is_water_tested BOOLEAN DEFAULT false,
    last_tested_date DATE,
    water_test_results TEXT,
    contamination_issues TEXT,
    environmental_threats TEXT,

    -- Development and infrastructure
    is_protected BOOLEAN DEFAULT false,
    protection_method TEXT,
    has_tap_system BOOLEAN DEFAULT false,
    tap_system_details TEXT,
    has_water_collection BOOLEAN DEFAULT false,
    collection_structure TEXT,
    has_distribution_system BOOLEAN DEFAULT false,
    distribution_system_details TEXT,

    -- Usage and importance
    primary_usage TEXT,
    estimated_beneficiaries INTEGER,
    households_served INTEGER,
    is_used_for_drinking BOOLEAN DEFAULT true,
    is_used_for_irrigation BOOLEAN DEFAULT false,
    irrigation_area_hectares DECIMAL(10, 2),
    is_used_for_livestock BOOLEAN DEFAULT false,
    is_used_for_religious BOOLEAN DEFAULT false,
    religious_significance TEXT,
    cultural_importance TEXT,

    -- Management and governance
    managed_by TEXT,
    management_system TEXT,
    has_water_user_committee BOOLEAN DEFAULT false,
    water_user_committee_details TEXT,
    has_fees BOOLEAN DEFAULT false,
    fee_structure TEXT,

    -- Restoration and conservation
    restoration_efforts TEXT,
    restoration_date DATE,
    restoration_organization TEXT,
    conservation_measures TEXT,
    has_local_regulations BOOLEAN DEFAULT false,
    local_regulations_details TEXT,

    -- Accessibility and facilities
    accessibility_notes TEXT,
    distance_from_nearest_road_km DECIMAL(6, 2),
    has_access_path BOOLEAN DEFAULT true,
    access_path_condition TEXT,
    has_resting_place BOOLEAN DEFAULT false,
    has_sanitation_facilities BOOLEAN DEFAULT false,

    -- Historical aspects
    historical_notes TEXT,
    estimated_age_years INTEGER,
    has_traditional_knowledge BOOLEAN DEFAULT false,
    traditional_knowledge_details TEXT,
    local_myths TEXT,

    -- Climate and seasonal factors
    seasonal_variations TEXT,
    rainfall_dependency TEXT,
    affected_by_climate_change BOOLEAN DEFAULT false,
    climate_change_impacts TEXT,

    -- Monitoring and research
    has_monitoring_system BOOLEAN DEFAULT false,
    monitoring_frequency TEXT,
    monitoring_organization TEXT,
    research_conducted BOOLEAN DEFAULT false,
    research_details TEXT,

    -- Community engagement
    community_involvement TEXT,
    awareness_programs TEXT,
    local_practices TEXT,

    -- Ownership and legal status
    ownership_type TEXT,
    legal_protection_status TEXT,
    protection_date DATE,
    government_recognition BOOLEAN DEFAULT false,

    -- Future plans
    development_plans TEXT,
    conservation_plans TEXT,

    -- Contact information
    contact_person TEXT,
    contact_phone TEXT,
    alternate_contact_person TEXT,
    alternate_contact_phone TEXT,

    -- Media and documentation
    has_photos BOOLEAN DEFAULT false,
    has_video_documentation BOOLEAN DEFAULT false,
    has_scientific_studies BOOLEAN DEFAULT false,

    -- Linkages to other entities
    linked_water_systems JSONB DEFAULT '[]'::jsonb,
    linked_communities JSONB DEFAULT '[]'::jsonb,

    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    catchment_area GEOMETRY(Polygon, 4326),

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
CREATE INDEX IF NOT EXISTS idx_spring_location_point ON acme_spring USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_spring_catchment_area ON acme_spring USING GIST (catchment_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_spring_name ON acme_spring(name);
CREATE INDEX IF NOT EXISTS idx_spring_slug ON acme_spring(slug);
CREATE INDEX IF NOT EXISTS idx_spring_type ON acme_spring(spring_type);
CREATE INDEX IF NOT EXISTS idx_spring_current_status ON acme_spring(current_status);
CREATE INDEX IF NOT EXISTS idx_spring_water_quality ON acme_spring(water_quality);
CREATE INDEX IF NOT EXISTS idx_spring_flow_consistency ON acme_spring(flow_consistency);
