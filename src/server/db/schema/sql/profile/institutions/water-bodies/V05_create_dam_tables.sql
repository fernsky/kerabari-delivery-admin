-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create dam_type enum
DO $$ 
BEGIN
  CREATE TYPE dam_type AS ENUM (
    'STORAGE', 'DIVERSION', 'DETENTION', 'DEBRIS', 'GRAVITY',
    'EMBANKMENT', 'ROCK_FILL', 'CONCRETE', 'ARCH', 'BUTTRESS',
    'RUN_OF_RIVER', 'CANAL_HEAD', 'BARRAGE', 'EARTHEN', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create dam_purpose enum
DO $$ 
BEGIN
  CREATE TYPE dam_purpose AS ENUM (
    'IRRIGATION', 'HYDROPOWER', 'WATER_SUPPLY', 'FLOOD_CONTROL',
    'RECREATION', 'NAVIGATION', 'FISHERY', 'MULTI_PURPOSE',
    'GROUNDWATER_RECHARGE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create dam_condition enum
DO $$ 
BEGIN
  CREATE TYPE dam_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL',
    'UNDER_CONSTRUCTION', 'ABANDONED', 'BREACHED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create dam_hazard_classification enum
DO $$ 
BEGIN
  CREATE TYPE dam_hazard_classification AS ENUM (
    'HIGH', 'SIGNIFICANT', 'LOW', 'UNDETERMINED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create dam_regulatory_status enum
DO $$ 
BEGIN
  CREATE TYPE dam_regulatory_status AS ENUM (
    'REGULATED', 'UNREGULATED', 'EXEMPTED', 'UNDER_REVIEW', 'NON_JURISDICTIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create dam_ownership_type enum
DO $$ 
BEGIN
  CREATE TYPE dam_ownership_type AS ENUM (
    'FEDERAL_GOVERNMENT', 'PROVINCIAL_GOVERNMENT', 'LOCAL_GOVERNMENT',
    'COMMUNITY', 'PRIVATE', 'PUBLIC_PRIVATE', 'UTILITY_COMPANY',
    'IRRIGATION_DISTRICT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the dam table
CREATE TABLE IF NOT EXISTS acme_dam (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,

    -- Basic information
    dam_type dam_type NOT NULL,
    primary_purpose dam_purpose NOT NULL,
    secondary_purposes JSONB DEFAULT '[]'::jsonb,
    condition dam_condition,

    -- Location details
    ward_number INTEGER,
    location TEXT,
    address TEXT,
    nearest_settlement TEXT,

    -- Physical characteristics
    height_meters DECIMAL(10, 2),
    length_meters DECIMAL(10, 2),
    crown_width_meters DECIMAL(10, 2),
    base_width_meters DECIMAL(10, 2),
    reservoir_capacity_cubic_meters DECIMAL(18, 2),
    surface_area_square_meters DECIMAL(18, 2),
    drainage_area_square_kilometers DECIMAL(10, 2),
    normal_water_level_meters DECIMAL(10, 2),
    maximum_water_level_meters DECIMAL(10, 2),
    minimum_operating_level_meters DECIMAL(10, 2),

    -- Construction details
    construction_start_date DATE,
    construction_completion_date DATE,
    construction_materials TEXT,
    design_life_years INTEGER,

    -- Operational information
    operational_status TEXT,
    commissioning_date DATE,
    operator_name TEXT,
    operator_contact_info TEXT,
    annual_maintenance_budget_npr DECIMAL(14, 2),
    last_major_maintenance_date DATE,
    next_scheduled_maintenance_date DATE,

    -- Ownership and regulation
    ownership_type dam_ownership_type,
    owner_name TEXT,
    owner_contact_info TEXT,
    regulatory_status dam_regulatory_status,
    regulatory_authority TEXT,
    permit_number TEXT,
    permit_issue_date DATE,
    permit_expiry_date DATE,

    -- Safety and risk
    hazard_classification dam_hazard_classification,
    emergency_action_plan BOOLEAN DEFAULT false,
    emergency_contact_info TEXT,
    last_inspection_date DATE,
    inspection_frequency_months INTEGER,
    safety_issues TEXT,
    remediation_plans TEXT,

    -- Hydrology and water management
    water_source_type TEXT,
    water_source_name TEXT,
    average_inflow_cubic_meters_per_second DECIMAL(10, 3),
    design_flood_cubic_meters_per_second DECIMAL(10, 3),
    spillway_type TEXT,
    spillway_capacity_cubic_meters_per_second DECIMAL(10, 3),
    flood_control_measures TEXT,
    water_release_schedule TEXT,

    -- Environmental aspects
    environmental_flow_requirements_cubic_meters_per_second DECIMAL(10, 3),
    fish_passage_type TEXT,
    environmental_impact_study BOOLEAN DEFAULT false,
    environmental_mitigation_measures TEXT,
    sediment_management_practices TEXT,

    -- Irrigation details (if applicable)
    irrigation_command_area_hectares DECIMAL(10, 2),
    irrigation_canal_length_kilometers DECIMAL(10, 2),
    irrigation_beneficiaries INTEGER,
    crops_irrigated TEXT,

    -- Hydropower details (if applicable)
    installed_capacity_mw DECIMAL(10, 2),
    annual_generation_gwh DECIMAL(10, 2),
    turbine_type TEXT,
    turbine_count INTEGER,
    minimum_operational_flow_cubic_meters_per_second DECIMAL(10, 3),
    generation_efficiency_percent DECIMAL(5, 2),

    -- Water supply details (if applicable)
    water_supply_population_served INTEGER,
    water_treatment_capacity_liters_per_day DECIMAL(14, 2),
    water_quality_monitoring BOOLEAN DEFAULT false,
    water_quality_parameters TEXT,

    -- Recreational facilities (if applicable)
    allows_recreation BOOLEAN DEFAULT false,
    recreational_activities TEXT,
    visitor_facilities TEXT,
    annual_visitor_count INTEGER,

    -- Socioeconomic impact
    population_displaced INTEGER,
    resettlement_plan BOOLEAN DEFAULT false,
    compensation_details TEXT,
    community_benefit_programs TEXT,
    local_employment_generated INTEGER,

    -- Financial aspects
    construction_cost_npr DECIMAL(18, 2),
    annual_operating_cost_npr DECIMAL(14, 2),
    revenue_source_details TEXT,
    annual_revenue_npr DECIMAL(14, 2),
    financial_sustainability TEXT,

    -- Challenges and future plans
    current_challenges TEXT,
    future_development_plans TEXT,
    rehabilitation_needs TEXT,
    climate_change_adaptation_measures TEXT,

    -- Governance and management
    management_committee_details TEXT,
    community_involvement_level TEXT,
    conflict_resolution_mechanism TEXT,
    water_user_associations TEXT,

    -- Linkages to other entities
    linked_rivers JSONB DEFAULT '[]'::jsonb,
    linked_irrigation_canals JSONB DEFAULT '[]'::jsonb,
    linked_settlements JSONB DEFAULT '[]'::jsonb,
    linked_hydropower_plants JSONB DEFAULT '[]'::jsonb,

    -- Media and documentation
    has_photos BOOLEAN DEFAULT false,
    has_design_documents BOOLEAN DEFAULT false,
    has_operation_manual BOOLEAN DEFAULT false,
    documentation_notes TEXT,

    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,

    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    dam_footprint GEOMETRY(LineString, 4326),
    reservoir_area GEOMETRY(Polygon, 4326),

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
CREATE INDEX IF NOT EXISTS idx_dam_location_point ON acme_dam USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_dam_footprint ON acme_dam USING GIST (dam_footprint);
CREATE INDEX IF NOT EXISTS idx_dam_reservoir_area ON acme_dam USING GIST (reservoir_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_dam_name ON acme_dam(name);
CREATE INDEX IF NOT EXISTS idx_dam_slug ON acme_dam(slug);
CREATE INDEX IF NOT EXISTS idx_dam_type ON acme_dam(dam_type);
CREATE INDEX IF NOT EXISTS idx_dam_purpose ON acme_dam(primary_purpose);
CREATE INDEX IF NOT EXISTS idx_dam_condition ON acme_dam(condition);
