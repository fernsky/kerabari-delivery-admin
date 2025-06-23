-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create canal_type enum
DO $$ 
BEGIN
  CREATE TYPE canal_type AS ENUM (
    'MAIN_CANAL', 'BRANCH_CANAL', 'SECONDARY_CANAL', 'TERTIARY_CANAL', 
    'DISTRIBUTION_CANAL', 'FEEDER_CANAL', 'DRAINAGE_CANAL', 'MULTIPURPOSE_CANAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create canal_construction_type enum
DO $$ 
BEGIN
  CREATE TYPE canal_construction_type AS ENUM (
    'EARTHEN', 'LINED_CONCRETE', 'LINED_STONE', 'LINED_BRICK', 
    'LINED_PLASTIC', 'COMPOSITE', 'PIPED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create canal_condition enum
DO $$ 
BEGIN
  CREATE TYPE canal_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'VERY_POOR', 
    'DAMAGED', 'UNDER_CONSTRUCTION', 'UNDER_MAINTENANCE', 'ABANDONED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create flow_control_mechanism enum
DO $$ 
BEGIN
  CREATE TYPE flow_control_mechanism AS ENUM (
    'GATES', 'WEIRS', 'VALVES', 'PUMPS', 'SIPHONS', 
    'MANUAL', 'AUTOMATED', 'NONE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create irrigation_management_type enum
DO $$ 
BEGIN
  CREATE TYPE irrigation_management_type AS ENUM (
    'GOVERNMENT', 'COMMUNITY', 'WATER_USER_ASSOCIATION', 'PRIVATE', 
    'COOPERATIVE', 'JOINT_MANAGEMENT', 'PUBLIC_PRIVATE_PARTNERSHIP', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the irrigation_canal table
CREATE TABLE IF NOT EXISTS acme_irrigation_canal (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    local_name TEXT,
    description TEXT,
    canal_type canal_type NOT NULL,

    -- Physical characteristics
    total_length_km DECIMAL(8, 3),
    average_width_m DECIMAL(6, 2),
    maximum_width_m DECIMAL(6, 2),
    minimum_width_m DECIMAL(6, 2),
    average_depth_m DECIMAL(6, 2),
    maximum_depth_m DECIMAL(6, 2),
    construction_type canal_construction_type NOT NULL,
    canal_condition canal_condition,
    canal_gradient DECIMAL(6, 4),
    bed_material TEXT,
    bank_material TEXT,
    has_lining BOOLEAN DEFAULT false,
    lining_type TEXT,
    lining_condition TEXT,
    lining_thickness_m DECIMAL(5, 3),
    percent_lined_section INTEGER,

    -- Technical details
    design_discharge_m3s DECIMAL(8, 3),
    actual_discharge_m3s DECIMAL(8, 3),
    water_source_name TEXT,
    water_source_type TEXT,
    source_location_description TEXT,
    flow_control_mechanism flow_control_mechanism,
    flow_control_details TEXT,
    cross_section_type TEXT,
    cross_section_details TEXT,
    water_loss_percent DECIMAL(5, 2),
    water_loss_reasons TEXT,

    -- Construction and maintenance
    construction_year INTEGER,
    last_major_rehabilitation_year INTEGER,
    constructed_by TEXT,
    construction_project_name TEXT,
    construction_cost_npr DECIMAL(14, 2),
    funding_source TEXT,
    design_life_years INTEGER,
    last_maintenance_date DATE,
    maintenance_frequency TEXT,
    annual_maintenance_cost_npr DECIMAL(12, 2),
    maintenance_funding_source TEXT,

    -- Service area and usage
    total_irrigated_area_hectares DECIMAL(12, 2),
    command_area_hectares DECIMAL(12, 2),
    actual_irrigated_area_rainy DECIMAL(12, 2),
    actual_irrigated_area_winter DECIMAL(12, 2),
    actual_irrigated_area_spring DECIMAL(12, 2),
    beneficiary_household_count INTEGER,
    beneficiary_population INTEGER,
    major_crops_irrigated TEXT,
    cropping_intensity_percent INTEGER,
    water_availability_status TEXT,
    water_distribution_method TEXT,
    irrigation_schedule_details TEXT,
    water_use_efficiency_percent INTEGER,
    secondary_usage TEXT,

    -- Management and administration
    management_type irrigation_management_type NOT NULL,
    managing_authority TEXT,
    water_user_association_name TEXT,
    water_user_committee_size INTEGER,
    women_in_committee_count INTEGER,
    year_of_wua_formation INTEGER,
    wua_registration_number TEXT,
    wua_registration_date DATE,
    has_water_fee_system BOOLEAN DEFAULT false,
    water_fee_structure TEXT,
    annual_water_fee_collection_npr DECIMAL(12, 2),
    fee_collection_rate DECIMAL(5, 2),
    has_operation_plan BOOLEAN DEFAULT false,
    operation_plan_details TEXT,
    has_meetings BOOLEAN DEFAULT false,
    meeting_frequency TEXT,

    -- Water quality
    water_quality_status water_quality_status,
    last_water_quality_test_date DATE,
    water_quality_issues TEXT,
    water_quality_monitoring BOOLEAN DEFAULT false,
    monitoring_frequency TEXT,

    -- Environmental aspects
    environmental_flow_provision BOOLEAN DEFAULT false,
    environmental_flow_details TEXT,
    has_aquatic_life BOOLEAN DEFAULT false,
    aquatic_life_details TEXT,
    sedimentation_issues TEXT,
    erosion_issues TEXT,
    waterlogging_issues TEXT,
    salinity_issues TEXT,
    has_bioengineering BOOLEAN DEFAULT false,
    bioengineering_details TEXT,

    -- Infrastructure
    has_intakes BOOLEAN DEFAULT true,
    intake_count INTEGER,
    intake_type TEXT,
    has_diverting_dam BOOLEAN DEFAULT false,
    diverting_dam_details TEXT,
    has_aqueducts BOOLEAN DEFAULT false,
    aqueduct_count INTEGER,
    has_culverts BOOLEAN DEFAULT false,
    culvert_count INTEGER,
    has_syphons BOOLEAN DEFAULT false,
    syphon_count INTEGER,
    has_escapes BOOLEAN DEFAULT false,
    escape_count INTEGER,
    has_drop_structures BOOLEAN DEFAULT false,
    drop_structure_count INTEGER,
    has_desilting BOOLEAN DEFAULT false,
    desilting_details TEXT,
    has_measuring_devices BOOLEAN DEFAULT false,
    measuring_device_details TEXT,
    has_road_crossings BOOLEAN DEFAULT false,
    road_crossing_count INTEGER,
    structure_condition TEXT,

    -- Performance and challenges
    irrigation_efficiency_percent INTEGER,
    conveyance_efficiency_percent INTEGER,
    application_efficiency_percent INTEGER,
    major_problems TEXT,
    water_scarcity_issues TEXT,
    conflict_issues TEXT,
    conflict_resolution_mechanism TEXT,
    missing_infrastructure TEXT,

    -- Impact on agriculture
    pre_irrigation_yield_data TEXT,
    post_irrigation_yield_data TEXT,
    cropping_pattern_changes TEXT,
    agricultural_income_impact TEXT,
    farm_gate_value_increase TEXT,

    -- Modernization and improvement
    rehabilitation_needs TEXT,
    modernization_plans TEXT,
    upgrade_proposals TEXT,
    proposed_expansion_area_ha DECIMAL(10, 2),
    estimated_upgrade_cost_npr DECIMAL(14, 2),
    has_pressurized_irrigation_systems BOOLEAN DEFAULT false,
    pressurized_irrigation_details TEXT,

    -- Historical context
    historical_significance TEXT,
    traditional_management_practices TEXT,
    changes_in_management TEXT,

    -- Social impact
    has_improved_livelihood BOOLEAN DEFAULT false,
    livelihood_impact_details TEXT,
    social_changes TEXT,
    gender_participation TEXT,
    inclusive_participation TEXT,

    -- Climate resilience
    climate_vulnerability TEXT,
    adaptation_measures TEXT,
    drought_resilience_rating TEXT,
    flood_resilience_rating TEXT,

    -- Legal and policy aspects
    legal_status TEXT,
    water_rights_issues TEXT,
    policy_implementation TEXT,

    -- SEO metadata
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    canal_start_point GEOMETRY(Point, 4326),
    canal_end_point GEOMETRY(Point, 4326),
    canal_alignment GEOMETRY(LineString, 4326),
    canal_width_line GEOMETRY(MultiLineString, 4326),
    command_area GEOMETRY(MultiPolygon, 4326),
    irrigation_network_area GEOMETRY(MultiPolygon, 4326),

    -- Linked entities
    linked_water_source JSONB DEFAULT '[]'::jsonb,
    linked_subcanals JSONB DEFAULT '[]'::jsonb,
    linked_parent_canal JSONB DEFAULT '[]'::jsonb,
    linked_water_projects JSONB DEFAULT '[]'::jsonb,
    linked_settlements JSONB DEFAULT '[]'::jsonb,
    linked_agriculture_lands JSONB DEFAULT '[]'::jsonb,

    -- Status and metadata
    is_active BOOLEAN DEFAULT true,
    is_operational BOOLEAN DEFAULT true,
    operational_status TEXT,
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMP,
    verified_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_start_point ON acme_irrigation_canal USING GIST (canal_start_point);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_end_point ON acme_irrigation_canal USING GIST (canal_end_point);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_alignment ON acme_irrigation_canal USING GIST (canal_alignment);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_width_line ON acme_irrigation_canal USING GIST (canal_width_line);
CREATE INDEX IF NOT EXISTS idx_irrigation_command_area ON acme_irrigation_canal USING GIST (command_area);
CREATE INDEX IF NOT EXISTS idx_irrigation_network_area ON acme_irrigation_canal USING GIST (irrigation_network_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_name ON acme_irrigation_canal(name);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_slug ON acme_irrigation_canal(slug);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_type ON acme_irrigation_canal(canal_type);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_construction_type ON acme_irrigation_canal(construction_type);
CREATE INDEX IF NOT EXISTS idx_irrigation_canal_condition ON acme_irrigation_canal(canal_condition);
CREATE INDEX IF NOT EXISTS idx_irrigation_management_type ON acme_irrigation_canal(management_type);
