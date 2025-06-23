-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create river_type enum
DO $$ 
BEGIN
  CREATE TYPE river_type AS ENUM (
    'MAJOR_RIVER', 'TRIBUTARY', 'SEASONAL_RIVER', 'PERENNIAL_RIVER',
    'URBAN_RIVER', 'BOUNDARY_RIVER', 'BRAIDED_RIVER', 'MEANDERING_RIVER',
    'MOUNTAIN_RIVER', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create river_flow_status enum
DO $$ 
BEGIN
  CREATE TYPE river_flow_status AS ENUM (
    'PERENNIAL', 'SEASONAL', 'INTERMITTENT', 'EPHEMERAL',
    'REGULATED', 'VARIABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_quality_status enum
DO $$ 
BEGIN
  CREATE TYPE water_quality_status AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 'POLLUTED', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create pollution_level enum
DO $$ 
BEGIN
  CREATE TYPE pollution_level AS ENUM (
    'NONE', 'LOW', 'MODERATE', 'HIGH', 'SEVERE', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create flood_risk_level enum
DO $$ 
BEGIN
  CREATE TYPE flood_risk_level AS ENUM (
    'MINIMAL', 'LOW', 'MODERATE', 'HIGH', 'EXTREME', 'VARIABLE', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create water_body_conservation_status enum
DO $$ 
BEGIN
  CREATE TYPE water_body_conservation_status AS ENUM (
    'PROTECTED', 'CONSERVATION_AREA', 'MANAGED', 'UNPROTECTED',
    'THREATENED', 'CRITICAL', 'RESTORED', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the river table
CREATE TABLE IF NOT EXISTS acme_river (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    local_name TEXT,
    alternative_names TEXT,
    description TEXT,
    river_type river_type NOT NULL,
    
    -- Physical characteristics
    flow_status river_flow_status,
    total_length_km DECIMAL(10, 2),
    length_within_municipality_km DECIMAL(10, 2),
    average_width_m DECIMAL(8, 2),
    maximum_width_m DECIMAL(8, 2),
    minimum_width_m DECIMAL(8, 2),
    average_depth_m DECIMAL(8, 2),
    maximum_depth_m DECIMAL(8, 2),
    drainage_area_sq_km DECIMAL(12, 2),
    average_discharge_m3s DECIMAL(10, 2),
    highest_recorded_discharge_m3s DECIMAL(10, 2),
    lowest_recorded_discharge_m3s DECIMAL(10, 2),
    begin_elevation_m DECIMAL(8, 2),
    end_elevation_m DECIMAL(8, 2),
    gradient_percent DECIMAL(6, 3),
    main_source_type TEXT,
    source_location TEXT,
    river_mouth_location TEXT,
    major_tributaries TEXT,

    -- Hydrological information
    catchment_area TEXT,
    annual_rainfall_mm DECIMAL(8, 2),
    peak_flow_month TEXT,
    low_flow_month TEXT,
    flood_risk_level flood_risk_level,
    last_major_flood_date DATE,
    flood_history_details TEXT,
    has_flood_control_measures BOOLEAN DEFAULT false,
    flood_control_details TEXT,
    has_early_warning_system BOOLEAN DEFAULT false,
    early_warning_system_details TEXT,
    sediment_transport_rate_tons_year DECIMAL(12, 2),
    is_subject_to_riverbed_extraction BOOLEAN DEFAULT false,
    riverbed_extraction_details TEXT,

    -- Water quality
    water_quality_status water_quality_status,
    water_quality_testing_frequency TEXT,
    last_water_quality_test_date DATE,
    dissolved_oxygen_mg_l DECIMAL(6, 2),
    ph_level DECIMAL(4, 2),
    turbidity_ntu DECIMAL(8, 2),
    electrical_conductivity_micro_s_cm DECIMAL(8, 2),
    total_dissolved_solids_mg_l DECIMAL(8, 2),
    pollution_level pollution_level,
    pollution_sources TEXT,
    pollution_impacts TEXT,

    -- Ecological information
    aquatic_ecosystem_type TEXT,
    native_fish_species TEXT,
    endangered_species TEXT,
    invasive_species TEXT,
    riparian_vegetation TEXT,
    riparian_buffer_width_m DECIMAL(6, 2),
    conservation_status water_body_conservation_status,
    conservation_efforts TEXT,
    conserved_by_organization TEXT,
    restoration_projects TEXT,
    has_wildlife_corridors BOOLEAN DEFAULT false,
    wildlife_corridor_details TEXT,

    -- Human use
    main_usage TEXT,
    is_drinking_water_source BOOLEAN DEFAULT false,
    drinking_water_extraction_location_details TEXT,
    is_irrigation_source BOOLEAN DEFAULT false,
    irrigation_area_hectares DECIMAL(10, 2),
    has_fishing_activities BOOLEAN DEFAULT false,
    fishing_details TEXT,
    has_religious_significance BOOLEAN DEFAULT false,
    religious_significance_details TEXT,
    has_recreational_use BOOLEAN DEFAULT false,
    recreational_activities TEXT,
    has_cultural_significance BOOLEAN DEFAULT false,
    cultural_significance_details TEXT,
    has_riverbed_mining BOOLEAN DEFAULT false,
    riverbed_mining_details TEXT,
    settlement_near_river TEXT,

    -- Infrastructure
    has_bridges BOOLEAN DEFAULT false,
    bridge_count INTEGER,
    bridge_details TEXT,
    has_dams BOOLEAN DEFAULT false,
    dam_count INTEGER,
    dam_details TEXT,
    has_weirs BOOLEAN DEFAULT false,
    weir_count INTEGER,
    has_dredging BOOLEAN DEFAULT false,
    has_riverbank_stabilization BOOLEAN DEFAULT false,
    riverbank_stabilization_details TEXT,
    has_flood_defenses BOOLEAN DEFAULT false,
    flood_defense_details TEXT,
    has_hydropower_plants BOOLEAN DEFAULT false,
    hydropower_plant_count INTEGER,
    hydropower_details TEXT,
    total_hydropower_capacity_mw DECIMAL(10, 2),

    -- Management and administration
    administrative_jurisdiction TEXT,
    local_administration_authority TEXT,
    managed_by_organization TEXT,
    management_plan TEXT,
    has_river_basin_management_plan BOOLEAN DEFAULT false,
    basin_management_details TEXT,
    has_water_user_groups BOOLEAN DEFAULT false,
    water_user_group_details TEXT,

    -- Environmental threats
    environmental_threats TEXT,
    major_hazards TEXT,
    flood_risk_management TEXT,
    drought_risks TEXT,
    climate_change_impacts TEXT,
    encroachment_issues TEXT,
    invasive_species_threats TEXT,

    -- Historical significance
    historical_significance TEXT,
    historical_events TEXT,
    ancient_uses TEXT,

    -- Research and monitoring
    has_monitoring_stations BOOLEAN DEFAULT false,
    monitoring_station_count INTEGER,
    monitoring_station_details TEXT,
    research_studies TEXT,
    ongoing_research_projects TEXT,

    -- Restoration and conservation plans
    restoration_plans TEXT,
    conservation_plans TEXT,
    future_projects TEXT,
    community_stewardship_programs TEXT,

    -- Legal and policy aspects
    protected_status TEXT,
    relevant_legislation TEXT,
    water_right_settings TEXT,
    dispute_resolution_mechanism TEXT,

    -- Additional information
    additional_notes TEXT,
    data_source TEXT,
    last_survey_date DATE,
    surveyed_by TEXT,

    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    river_source GEOMETRY(Point, 4326),
    river_mouth GEOMETRY(Point, 4326),
    river_centerline GEOMETRY(LineString, 4326),
    river_polygon GEOMETRY(MultiPolygon, 4326),
    drainage_basin GEOMETRY(MultiPolygon, 4326),
    floodplain GEOMETRY(MultiPolygon, 4326),

    -- Linked entities
    linked_watersheds JSONB DEFAULT '[]'::jsonb,
    linked_tributaries JSONB DEFAULT '[]'::jsonb,
    linked_dams JSONB DEFAULT '[]'::jsonb,
    linked_irrigation_canals JSONB DEFAULT '[]'::jsonb,
    linked_water_projects JSONB DEFAULT '[]'::jsonb,
    linked_settlements JSONB DEFAULT '[]'::jsonb,

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
CREATE INDEX IF NOT EXISTS idx_river_river_source ON acme_river USING GIST (river_source);
CREATE INDEX IF NOT EXISTS idx_river_river_mouth ON acme_river USING GIST (river_mouth);
CREATE INDEX IF NOT EXISTS idx_river_river_centerline ON acme_river USING GIST (river_centerline);
CREATE INDEX IF NOT EXISTS idx_river_river_polygon ON acme_river USING GIST (river_polygon);
CREATE INDEX IF NOT EXISTS idx_river_drainage_basin ON acme_river USING GIST (drainage_basin);
CREATE INDEX IF NOT EXISTS idx_river_floodplain ON acme_river USING GIST (floodplain);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_river_name ON acme_river(name);
CREATE INDEX IF NOT EXISTS idx_river_slug ON acme_river(slug);
CREATE INDEX IF NOT EXISTS idx_river_river_type ON acme_river(river_type);
CREATE INDEX IF NOT EXISTS idx_river_flow_status ON acme_river(flow_status);
CREATE INDEX IF NOT EXISTS idx_river_conservation_status ON acme_river(conservation_status);
