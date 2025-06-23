-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create stream_type enum
DO $$ 
BEGIN
  CREATE TYPE stream_type AS ENUM (
    'PERENNIAL', 'SEASONAL', 'INTERMITTENT', 'EPHEMERAL', 
    'HEADWATER', 'RAVINE', 'CREEK', 'BROOK', 
    'MOUNTAIN_STREAM', 'FOREST_STREAM', 'ARTIFICIAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the stream table
CREATE TABLE IF NOT EXISTS acme_stream (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    local_name TEXT,
    description TEXT,
    stream_type stream_type NOT NULL,
    
    -- Physical characteristics
    total_length_km DECIMAL(8, 2),
    length_within_municipality_km DECIMAL(8, 2),
    average_width_m DECIMAL(6, 2),
    maximum_width_m DECIMAL(6, 2),
    average_depth_m DECIMAL(6, 2),
    maximum_depth_m DECIMAL(6, 2),
    drainage_area_sq_km DECIMAL(10, 2),
    average_flow_rate_m3s DECIMAL(8, 3),
    begin_elevation_m DECIMAL(8, 2),
    end_elevation_m DECIMAL(8, 2),
    gradient_percent DECIMAL(6, 3),
    main_source_type TEXT,
    source_location TEXT,
    flows_into TEXT,
    is_flow_permanent BOOLEAN DEFAULT false,
    flow_months_count INTEGER,
    flow_season_description TEXT,
    stream_bed_composition TEXT,
    bank_stability TEXT,

    -- Hydrological information
    catchment_description TEXT,
    annual_rainfall_mm DECIMAL(8, 2),
    peak_flow_month TEXT,
    low_flow_month TEXT,
    flood_risk_level flood_risk_level,
    last_flooding_event DATE,
    flooding_history TEXT,
    has_flood_control_measures BOOLEAN DEFAULT false,
    flood_control_details TEXT,

    -- Water quality
    water_quality_status water_quality_status,
    last_water_quality_test_date DATE,
    water_quality_parameters TEXT,
    pollution_level pollution_level,
    pollution_sources TEXT,
    pollution_impacts TEXT,
    has_pollution_prevention BOOLEAN DEFAULT false,
    pollution_prevention_measures TEXT,

    -- Ecological information
    aquatic_species TEXT,
    endangered_species TEXT,
    invasive_species TEXT,
    riparian_vegetation TEXT,
    riparian_buffer_width_m DECIMAL(6, 2),
    conservation_status water_body_conservation_status,
    conservation_efforts TEXT,
    conserved_by_organization TEXT,
    restoration_projects TEXT,
    has_wildlife_corridors BOOLEAN DEFAULT false,
    wildlife_significance TEXT,

    -- Human use
    main_usage TEXT,
    is_drinking_water_source BOOLEAN DEFAULT false,
    drinking_water_details TEXT,
    is_irrigation_source BOOLEAN DEFAULT false,
    irrigation_area_hectares DECIMAL(8, 2),
    water_extraction_systems TEXT,
    water_harvesting_details TEXT,
    has_fishing_activities BOOLEAN DEFAULT false,
    fishing_details TEXT,
    has_religious_significance BOOLEAN DEFAULT false,
    religious_significance_details TEXT,
    has_recreational_use BOOLEAN DEFAULT false,
    recreational_activities TEXT,
    has_cultural_significance BOOLEAN DEFAULT false,
    cultural_significance_details TEXT,
    settlement_proximity TEXT,

    -- Infrastructure
    has_bridges BOOLEAN DEFAULT false,
    bridge_count INTEGER,
    bridge_details TEXT,
    has_check_dams BOOLEAN DEFAULT false,
    check_dam_count INTEGER,
    check_dam_purpose TEXT,
    has_water_mills BOOLEAN DEFAULT false,
    water_mill_count INTEGER,
    has_stream_channelization BOOLEAN DEFAULT false,
    channelization_details TEXT,
    has_bank_stabilization BOOLEAN DEFAULT false,
    bank_stabilization_details TEXT,
    has_water_diversion_structures BOOLEAN DEFAULT false,
    water_diversion_details TEXT,

    -- Management and administration
    administrative_jurisdiction TEXT,
    local_administration_authority TEXT,
    managed_by_organization TEXT,
    management_approach TEXT,
    has_water_user_groups BOOLEAN DEFAULT false,
    water_user_group_details TEXT,
    community_involvement_description TEXT,

    -- Environmental threats
    environmental_threats TEXT,
    encroachment_issues TEXT,
    waste_dumping_issues TEXT,
    deforestation_impacts TEXT,
    climate_change_impacts TEXT,
    land_use_change_impacts TEXT,

    -- Historical significance
    historical_significance TEXT,
    historical_uses TEXT,

    -- Monitoring and research
    has_monitoring_program BOOLEAN DEFAULT false,
    monitoring_frequency TEXT,
    monitored_by TEXT,
    research_studies TEXT,

    -- Restoration and conservation
    restoration_needs TEXT,
    conservation_priority TEXT,
    restoration_plans TEXT,
    community_based_conservation TEXT,

    -- Local knowledge and practices
    traditional_management_practices TEXT,
    indigenous_knowledge TEXT,
    local_beliefs_surrounding_stream TEXT,

    -- Challenges and issues
    main_challenges TEXT,
    conflict_issues TEXT,
    proposed_solutions TEXT,

    -- SEO metadata
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    stream_source GEOMETRY(Point, 4326),
    stream_outlet GEOMETRY(Point, 4326),
    stream_centerline GEOMETRY(LineString, 4326),
    stream_polygon GEOMETRY(MultiPolygon, 4326),
    catchment_area GEOMETRY(MultiPolygon, 4326),

    -- Linked entities
    linked_rivers JSONB DEFAULT '[]'::jsonb,
    linked_springs JSONB DEFAULT '[]'::jsonb,
    linked_settlements JSONB DEFAULT '[]'::jsonb,
    linked_irrigation_canals JSONB DEFAULT '[]'::jsonb,
    linked_water_projects JSONB DEFAULT '[]'::jsonb,

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
CREATE INDEX IF NOT EXISTS idx_stream_source ON acme_stream USING GIST (stream_source);
CREATE INDEX IF NOT EXISTS idx_stream_outlet ON acme_stream USING GIST (stream_outlet);
CREATE INDEX IF NOT EXISTS idx_stream_centerline ON acme_stream USING GIST (stream_centerline);
CREATE INDEX IF NOT EXISTS idx_stream_polygon ON acme_stream USING GIST (stream_polygon);
CREATE INDEX IF NOT EXISTS idx_stream_catchment_area ON acme_stream USING GIST (catchment_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_stream_name ON acme_stream(name);
CREATE INDEX IF NOT EXISTS idx_stream_slug ON acme_stream(slug);
CREATE INDEX IF NOT EXISTS idx_stream_stream_type ON acme_stream(stream_type);
CREATE INDEX IF NOT EXISTS idx_stream_conservation_status ON acme_stream(conservation_status);
