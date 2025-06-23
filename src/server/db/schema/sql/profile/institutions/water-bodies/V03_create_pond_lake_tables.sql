-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create water_body_type enum
DO $$ 
BEGIN
  CREATE TYPE water_body_type AS ENUM (
    'NATURAL_LAKE', 'ARTIFICIAL_LAKE', 'RESERVOIR', 'NATURAL_POND',
    'ARTIFICIAL_POND', 'FISHERY_POND', 'RETENTION_POND', 'SHALLOW_POND',
    'SEASONAL_POOL', 'OXBOW_LAKE', 'CRATER_LAKE', 'GLACIAL_LAKE',
    'TECTONIC_LAKE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_body_origin enum
DO $$ 
BEGIN
  CREATE TYPE water_body_origin AS ENUM (
    'NATURAL', 'ARTIFICIAL', 'MODIFIED_NATURAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_body_formation enum
DO $$ 
BEGIN
  CREATE TYPE water_body_formation AS ENUM (
    'GLACIAL', 'TECTONIC', 'VOLCANIC', 'FLUVIAL', 'LANDSLIDE',
    'HUMAN_MADE', 'ARTIFICIAL_EXCAVATION', 'RAIN_HARVESTING',
    'RIVER_DIVERSION', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_body_permanence enum
DO $$ 
BEGIN
  CREATE TYPE water_body_permanence AS ENUM (
    'PERMANENT', 'SEASONAL', 'INTERMITTENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_body_ownership enum
DO $$ 
BEGIN
  CREATE TYPE water_body_ownership AS ENUM (
    'PUBLIC', 'GOVERNMENT', 'COMMUNITY', 'PRIVATE', 'RELIGIOUS_INSTITUTION',
    'NGO', 'COOPERATIVE', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the pond_lake table
CREATE TABLE IF NOT EXISTS acme_pond_lake (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    local_name TEXT,
    alternative_names TEXT,
    description TEXT,
    water_body_type water_body_type NOT NULL,
    origin_type water_body_origin NOT NULL,
    formation_type water_body_formation,
    permanence_type water_body_permanence NOT NULL,

    -- Location and administrative details
    ward_number INTEGER,
    location TEXT,
    nearest_settlement TEXT,
    ownership_type water_body_ownership NOT NULL,
    owner_details TEXT,
    managed_by TEXT,

    -- Physical characteristics
    surface_area_sq_m DECIMAL(12, 2),
    maximum_length_m DECIMAL(8, 2),
    maximum_width_m DECIMAL(8, 2),
    shore_length_m DECIMAL(10, 2),
    average_depth_m DECIMAL(6, 2),
    maximum_depth_m DECIMAL(6, 2),
    water_volume_m3 DECIMAL(14, 2),
    elevation_m DECIMAL(8, 2),
    catchment_area_sq_km DECIMAL(10, 2),

    -- Hydrological characteristics
    water_source_type TEXT,
    water_source_details TEXT,
    has_inflow BOOLEAN DEFAULT false,
    inflow_details TEXT,
    has_outflow BOOLEAN DEFAULT false,
    outflow_details TEXT,
    water_level_fluctuation_m DECIMAL(6, 2),
    highest_water_level_month TEXT,
    lowest_water_level_month TEXT,
    is_subject_to_flooding BOOLEAN DEFAULT false,
    flooding_details TEXT,
    is_drying BOOLEAN DEFAULT false,
    drying_details TEXT,
    has_water_level_monitoring BOOLEAN DEFAULT false,
    water_level_monitoring_details TEXT,
    evaporation_rate TEXT,

    -- Water quality
    water_quality_status water_quality_status,
    water_quality_testing_frequency TEXT,
    last_water_quality_test_date DATE,
    dissolved_oxygen_mg_l DECIMAL(6, 2),
    ph_level DECIMAL(4, 2),
    turbidity_ntu DECIMAL(8, 2),
    electrical_conductivity_micro_s_cm DECIMAL(8, 2),
    total_dissolved_solids_mg_l DECIMAL(8, 2),
    water_temperature_c DECIMAL(5, 2),
    pollution_level pollution_level,
    pollution_sources TEXT,
    pollution_impacts TEXT,
    eutrophication_status TEXT,
    algal_bloom_frequency TEXT,

    -- Ecological characteristics
    aquatic_ecosystem_type TEXT,
    dominant_flora_species TEXT,
    dominant_fauna_species TEXT,
    fish_species TEXT,
    endangered_species TEXT,
    invasive_species TEXT,
    microbial_diversity TEXT,
    shoreline_vegetation TEXT,
    conservation_status water_body_conservation_status,
    conservation_efforts TEXT,
    conserved_by_organization TEXT,
    restoration_projects TEXT,
    has_wetland_features BOOLEAN DEFAULT false,
    wetland_description TEXT,

    -- Human use and cultural significance
    primary_use TEXT,
    secondary_uses TEXT,
    irrigation_area_hectares DECIMAL(10, 2),
    water_extraction_rate_m3_day DECIMAL(10, 2),
    is_drinking_water_source BOOLEAN DEFAULT false,
    drinking_water_details TEXT,
    population_served INTEGER,
    has_fish_farming BOOLEAN DEFAULT false,
    fish_farming_details TEXT,
    annual_fish_production_kg DECIMAL(10, 2),
    fish_species_cultivated TEXT,
    has_recreational_use BOOLEAN DEFAULT false,
    recreational_activities TEXT,
    tourism_significance TEXT,
    visitor_statistics TEXT,
    has_religious_significance BOOLEAN DEFAULT false,
    religious_significance_details TEXT,
    has_cultural_significance BOOLEAN DEFAULT false,
    cultural_significance_details TEXT,
    traditional_practices TEXT,
    local_beliefs TEXT,

    -- Infrastructure
    has_dams BOOLEAN DEFAULT false,
    dam_details TEXT,
    has_embankments BOOLEAN DEFAULT false,
    embankment_details TEXT,
    has_water_supply_infrastructure BOOLEAN DEFAULT false,
    water_supply_infrastructure_details TEXT,
    has_recreational_infrastructure BOOLEAN DEFAULT false,
    recreational_infrastructure_details TEXT,
    has_water_treatment_facilities BOOLEAN DEFAULT false,
    water_treatment_details TEXT,
    has_boating_facilities BOOLEAN DEFAULT false,
    boating_facilities_details TEXT,
    has_fishing_platforms BOOLEAN DEFAULT false,
    fishing_platforms_details TEXT,
    accessibility_details TEXT,

    -- Management and administration
    has_management_committee BOOLEAN DEFAULT false,
    management_committee_details TEXT,
    has_management_plan BOOLEAN DEFAULT false,
    management_plan_details TEXT,
    annual_maintenance_cost_npr DECIMAL(12, 2),
    funding_source TEXT,
    community_involvement_description TEXT,
    regular_monitoring BOOLEAN DEFAULT false,
    monitoring_details TEXT,
    has_dredging_program BOOLEAN DEFAULT false,
    dredging_frequency TEXT,
    water_quality_management_practices TEXT,

    -- Environmental threats and challenges
    major_threats TEXT,
    encroachment_issues TEXT,
    waste_dumping_issues TEXT,
    siltation_rate TEXT,
    climate_change_impacts TEXT,
    eutrophication_issues TEXT,
    water_hyacinth_issues TEXT,
    invasive_species_management TEXT,
    drought_vulnerability TEXT,

    -- History and formation
    formation_year INTEGER,
    age_estimate_years INTEGER,
    historical_events TEXT,
    origin_story TEXT,
    historical_significance TEXT,
    traditional_name_origin TEXT,
    construction_details TEXT,

    -- Economic aspects
    economic_importance TEXT,
    jobs_created INTEGER,
    annual_economic_value_npr DECIMAL(12, 2),
    tourist_revenue_npr DECIMAL(12, 2),
    fishery_revenue_npr DECIMAL(12, 2),
    irrigation_economic_benefit_npr DECIMAL(12, 2),

    -- Restoration and future plans
    restoration_needs TEXT,
    planned_improvements TEXT,
    expansion_plans TEXT,
    community_vision TEXT,
    proposed_projects TEXT,

    -- Research and education
    research_studies TEXT,
    educational_value TEXT,
    educational_programs_offered TEXT,

    -- Legal status
    legal_protection_status TEXT,
    relevant_legislation TEXT,
    water_rights_issues TEXT,

    -- SEO metadata
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    water_body_polygon GEOMETRY(Polygon, 4326),
    catchment_area_polygon GEOMETRY(MultiPolygon, 4326),
    water_level_high_polygon GEOMETRY(Polygon, 4326),
    water_level_low_polygon GEOMETRY(Polygon, 4326),

    -- Linked entities
    linked_watersheds JSONB DEFAULT '[]'::jsonb,
    linked_rivers JSONB DEFAULT '[]'::jsonb,
    linked_streams JSONB DEFAULT '[]'::jsonb,
    linked_irrigation_canals JSONB DEFAULT '[]'::jsonb,
    linked_wetlands JSONB DEFAULT '[]'::jsonb,
    linked_water_projects JSONB DEFAULT '[]'::jsonb,
    linked_settlements JSONB DEFAULT '[]'::jsonb,

    -- Media content
    image_gallery JSONB DEFAULT '[]'::jsonb,
    videos JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,

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
CREATE INDEX IF NOT EXISTS idx_pond_lake_location_point ON acme_pond_lake USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_pond_lake_water_body_polygon ON acme_pond_lake USING GIST (water_body_polygon);
CREATE INDEX IF NOT EXISTS idx_pond_lake_catchment_area_polygon ON acme_pond_lake USING GIST (catchment_area_polygon);
CREATE INDEX IF NOT EXISTS idx_pond_lake_water_level_high_polygon ON acme_pond_lake USING GIST (water_level_high_polygon);
CREATE INDEX IF NOT EXISTS idx_pond_lake_water_level_low_polygon ON acme_pond_lake USING GIST (water_level_low_polygon);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_pond_lake_name ON acme_pond_lake(name);
CREATE INDEX IF NOT EXISTS idx_pond_lake_slug ON acme_pond_lake(slug);
CREATE INDEX IF NOT EXISTS idx_pond_lake_water_body_type ON acme_pond_lake(water_body_type);
CREATE INDEX IF NOT EXISTS idx_pond_lake_origin_type ON acme_pond_lake(origin_type);
CREATE INDEX IF NOT EXISTS idx_pond_lake_ownership_type ON acme_pond_lake(ownership_type);
CREATE INDEX IF NOT EXISTS idx_pond_lake_conservation_status ON acme_pond_lake(conservation_status);
