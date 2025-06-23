-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Wetland type enum (Ramsar classification)
DO $$
BEGIN
  CREATE TYPE wetland_type AS ENUM (
    'MARSH', 'SWAMP', 'BOG', 'FEN', 'POND', 'FLOODPLAIN', 'MANGROVE',
    'ESTUARINE', 'RIVERINE', 'LACUSTRINE', 'PEATLAND', 'ARTIFICIAL_POND',
    'CONSTRUCTED_WETLAND', 'RICE_FIELD', 'SEASONAL_WETLAND', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Wetland seasonality enum
DO $$
BEGIN
  CREATE TYPE wetland_seasonality AS ENUM (
    'PERMANENT', 'SEASONAL', 'INTERMITTENT', 'EPHEMERAL', 'FLUCTUATING', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Ecosystem health enum
DO $$
BEGIN
  CREATE TYPE ecosystem_health AS ENUM (
    'PRISTINE', 'HEALTHY', 'MODERATE', 'DEGRADED', 'SEVERELY_DEGRADED',
    'COLLAPSED', 'RECOVERING', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Use water_body_conservation_status from rivers if not already present
DO $$
BEGIN
  CREATE TYPE water_body_conservation_status AS ENUM (
    'PROTECTED', 'CONSERVATION_AREA', 'MANAGED', 'UNPROTECTED',
    'THREATENED', 'CRITICAL', 'RESTORED', 'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the wetland table
CREATE TABLE IF NOT EXISTS acme_wetland (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_in_local_language TEXT,
  description TEXT,
  wetland_type wetland_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_range_min_m DECIMAL(8,2),
  elevation_range_max_m DECIMAL(8,2),

  -- Physical characteristics
  total_area_hectares DECIMAL(10,2),
  water_surface_area_hectares DECIMAL(10,2),
  average_depth_m DECIMAL(6,2),
  maximum_depth_m DECIMAL(6,2),
  seasonality wetland_seasonality,
  water_source TEXT,
  water_color TEXT,
  water_ph DECIMAL(4,2),
  water_temperature_range_c TEXT,
  has_fluctuating_water_levels BOOLEAN DEFAULT true,
  water_level_fluctuation_m DECIMAL(4,2),
  sediment_type TEXT,
  soil_type TEXT,
  hydrology_notes TEXT,

  -- Biodiversity and ecological aspects
  dominant_vegetation TEXT,
  vegetation_cover_percent INTEGER,
  significant_flora_species TEXT,
  significant_fauna_species TEXT,
  fish_species TEXT,
  bird_species TEXT,
  reptile_amphibian_species TEXT,
  mammal_species TEXT,
  invertebrate_species TEXT,
  endangered_species TEXT,
  invasive_species TEXT,
  migratory_site_for TEXT,
  habitat_types TEXT,
  ecological_succession_stage TEXT,
  ecosystem_services TEXT,
  biodiversity_assessment_date DATE,
  biodiversity_assessment_by TEXT,

  -- Conservation status and management
  conservation_status water_body_conservation_status,
  protection_year INTEGER,
  protection_legal_status TEXT,
  managed_by TEXT,
  management_plan_exists BOOLEAN DEFAULT false,
  management_plan_details TEXT,
  has_buffer_zone BOOLEAN DEFAULT false,
  buffer_zone_size_hectares DECIMAL(10,2),
  is_ramsar_site BOOLEAN DEFAULT false,
  ramsar_site_number TEXT,
  ramsar_designation_date DATE,
  conservation_challenges TEXT,

  -- Current condition and threats
  ecosystem_health ecosystem_health,
  threats_and_pressures TEXT,
  pollution_sources TEXT,
  human_impacts TEXT,
  invasive_species_impacts TEXT,
  climate_change_impacts TEXT,
  drainage_issues TEXT,
  encroachment_issues TEXT,
  waste_dumping_issues TEXT,

  -- Restoration and conservation efforts
  restoration_activities TEXT,
  restoration_start_date DATE,
  restoration_organization TEXT,
  restoration_cost_npr DECIMAL(14,2),
  conservation_measures TEXT,
  community_conservation_efforts TEXT,

  -- Usage and socioeconomic aspects
  primary_uses TEXT,
  community_dependence TEXT,
  economic_activities TEXT,
  resource_harvesting TEXT,
  fishing_activities TEXT,
  agriculture_around TEXT,
  tourism_value TEXT,
  annual_visitor_count INTEGER,
  local_beneficiaries INTEGER,

  -- Cultural and historical significance
  cultural_importance TEXT,
  cultural_practices TEXT,
  religious_significance TEXT,
  historical_significance TEXT,
  traditional_uses TEXT,
  local_myths TEXT,
  archaeological_findings TEXT,

  -- Accessibility and infrastructure
  accessibility_notes TEXT,
  distance_from_nearest_road_km DECIMAL(6,2),
  has_access_path BOOLEAN DEFAULT true,
  access_path_condition TEXT,
  has_tourism_infrastructure BOOLEAN DEFAULT false,
  tourism_infrastructure_details TEXT,
  has_viewing_platforms BOOLEAN DEFAULT false,
  has_boardwalks BOOLEAN DEFAULT false,
  has_information_centers BOOLEAN DEFAULT false,
  has_visitor_facilities BOOLEAN DEFAULT false,
  visitor_facilities_details TEXT,

  -- Education and research
  educational_value TEXT,
  educational_programs_offered TEXT,
  research_conducted BOOLEAN DEFAULT false,
  research_institutions TEXT,
  significant_research_findings TEXT,
  monitoring_programs TEXT,
  monitoring_frequency TEXT,

  -- Government and policy
  government_policies TEXT,
  local_regulations TEXT,
  included_in_land_use_plans BOOLEAN DEFAULT false,
  land_use_plan_details TEXT,

  -- Project and funding
  ongoing_projects TEXT,
  funding_sources_for_conservation TEXT,
  annual_budget_for_management_npr DECIMAL(14,2),
  has_endowment_fund BOOLEAN DEFAULT false,
  endowment_fund_value_npr DECIMAL(14,2),

  -- Climate and natural factors
  climatic_conditions TEXT,
  average_annual_rainfall_mm DECIMAL(8,2),
  flood_frequency TEXT,
  drought_frequency TEXT,
  natural_disturbance_history TEXT,

  -- Water quality and monitoring
  water_quality_status TEXT,
  water_quality_parameters TEXT,
  last_water_quality_test_date DATE,
  water_quality_testing_frequency TEXT,
  pollutant_levels TEXT,

  -- Community engagement
  community_awareness_level TEXT,
  community_participation TEXT,
  stakeholder_groups TEXT,
  conflict_issues TEXT,

  -- Future plans and sustainability
  future_plans TEXT,
  sustainability_strategy TEXT,
  adaptation_to_climate_change TEXT,

  -- Contact information
  management_contact_person TEXT,
  management_contact_phone TEXT,
  local_contact_person TEXT,
  local_contact_phone TEXT,

  -- Media and documentation
  has_photos BOOLEAN DEFAULT false,
  has_videos BOOLEAN DEFAULT false,
  has_maps BOOLEAN DEFAULT false,
  has_research_publications BOOLEAN DEFAULT false,

  -- Carbon sequestration and climate regulation
  carbon_sequestration_data TEXT,
  climate_regulation_value TEXT,

  -- Linkages to other entities
  linked_water_bodies JSONB DEFAULT '[]'::jsonb,
  linked_conservation_areas JSONB DEFAULT '[]'::jsonb,
  linked_communities JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  wetland_area GEOMETRY(MultiPolygon, 4326),
  buffer_zone_area GEOMETRY(MultiPolygon, 4326),

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
CREATE INDEX IF NOT EXISTS idx_wetland_location_point ON acme_wetland USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_wetland_area ON acme_wetland USING GIST (wetland_area);
CREATE INDEX IF NOT EXISTS idx_wetland_buffer_zone_area ON acme_wetland USING GIST (buffer_zone_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_wetland_name ON acme_wetland(name);
CREATE INDEX IF NOT EXISTS idx_wetland_slug ON acme_wetland(slug);
CREATE INDEX IF NOT EXISTS idx_wetland_type ON acme_wetland(wetland_type);
CREATE INDEX IF NOT EXISTS idx_wetland_conservation_status ON acme_wetland(conservation_status);
CREATE INDEX IF NOT EXISTS idx_wetland_ecosystem_health ON acme_wetland(ecosystem_health);
