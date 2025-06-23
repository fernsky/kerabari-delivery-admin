-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Hunting conservation area type enum
DO $$ 
BEGIN
  CREATE TYPE hunting_conservation_area_type AS ENUM (
    'DESIGNATED_HUNTING_RESERVE', 'CONTROLLED_HUNTING_AREA', 
    'GAME_MANAGEMENT_AREA', 'WILDLIFE_MANAGEMENT_AREA', 
    'COMMUNITY_HUNTING_ZONE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hunting management approach enum
DO $$ 
BEGIN
  CREATE TYPE hunting_management_approach AS ENUM (
    'QUOTA_BASED', 'TROPHY_HUNTING', 'CULLING_MANAGEMENT', 
    'SEASONAL_CONTROL', 'COMMUNITY_MANAGED', 'SUSTAINABLE_USE', 
    'CONSERVATION_HUNTING', 'MIXED_APPROACH'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Target species status enum
DO $$ 
BEGIN
  CREATE TYPE target_species_status AS ENUM (
    'ABUNDANT', 'STABLE', 'DECLINING', 'VULNERABLE', 
    'ENDANGERED', 'UNCERTAIN', 'RECOVERING'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the hunting_conservation_area table
CREATE TABLE IF NOT EXISTS acme_hunting_conservation_area (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  area_type hunting_conservation_area_type NOT NULL,
  
  -- Basic information
  management_approach hunting_management_approach NOT NULL,
  management_authority TEXT,
  establishment_year INTEGER,
  legal_status TEXT,
  gazette_notification_date DATE,
  gazette_reference TEXT,
  
  -- Location details
  province TEXT,
  district TEXT,
  municipality TEXT,
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  boundary_description TEXT,
  total_area_hectares DECIMAL(12, 2) NOT NULL,
  buffer_zone_area_hectares DECIMAL(12, 2),
  
  -- Physical characteristics
  elevation_range_meters TEXT,
  min_elevation_meters INTEGER,
  max_elevation_meters INTEGER,
  topography topography_type,
  major_landforms TEXT,
  river_systems TEXT,
  climate_description TEXT,
  seasons TEXT,
  
  -- Biodiversity and habitat
  ecosystem_types JSONB DEFAULT '[]'::jsonb,
  habitat_types JSONB DEFAULT '[]'::jsonb,
  forest_coverage_percent DECIMAL(5, 2),
  forest_types JSONB DEFAULT '[]'::jsonb,
  grassland_area_percent DECIMAL(5, 2),
  wetland_area_percent DECIMAL(5, 2),
  biodiversity_level biodiversity_level,
  
  -- Target species
  target_game_species JSONB DEFAULT '[]'::jsonb,
  flagship_species TEXT,
  target_species_population_estimates JSONB DEFAULT '{}'::jsonb,
  target_species_population_status target_species_status,
  non_target_notable_species TEXT,
  endangered_species_present BOOLEAN DEFAULT FALSE,
  endangered_species_details TEXT,
  invasive_species_issues TEXT,
  
  -- Hunting management
  hunting_permit_system TEXT,
  permit_fee_structure TEXT,
  permit_fee_domestic_npr DECIMAL(10, 2),
  permit_fee_foreign_npr DECIMAL(10, 2),
  annual_permit_count INTEGER,
  annual_hunting_quota JSONB DEFAULT '{}'::jsonb,
  hunting_season_dates TEXT,
  hunting_method_restrictions TEXT,
  weapon_type_restrictions TEXT,
  trophy_regulations TEXT,
  trophy_export_procedures TEXT,
  
  -- Conservation measures
  conservation_programs TEXT,
  protected_species_list TEXT,
  no_hunting_zones TEXT,
  population_monitoring_method TEXT,
  monitoring_frequency TEXT,
  has_scientific_research BOOLEAN DEFAULT FALSE,
  research_details TEXT,
  habitat_management_practices TEXT,
  species_management_interventions TEXT,
  anti_poaching_measures TEXT,
  
  -- Management resources
  staff_count INTEGER,
  ranger_count INTEGER,
  annual_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  has_management_plan BOOLEAN DEFAULT TRUE,
  management_plan_period TEXT,
  management_plan_implementation_status TEXT,
  
  -- Infrastructure
  administrative_buildings_count INTEGER,
  ranger_posts_count INTEGER,
  entry_gates_count INTEGER,
  watch_towers_count INTEGER,
  roads_km DECIMAL(8, 2),
  hunting_camps_count INTEGER,
  camp_capacity_people INTEGER,
  infrastructure_condition TEXT,
  
  -- Community involvement
  surrounding_communities TEXT,
  community_benefit_sharing TEXT,
  revenue_sharing_percent DECIMAL(5, 2),
  community_involvement_in_management BOOLEAN DEFAULT FALSE,
  community_involvement_details TEXT,
  employment_generation INTEGER,
  community_development_programs TEXT,
  alternative_livelihood_programs TEXT,
  
  -- Economic aspects
  annual_revenue_npr DECIMAL(14, 2),
  revenue_from_permits_npr DECIMAL(14, 2),
  trophy_fees_revenue_npr DECIMAL(14, 2),
  other_revenue_sources TEXT,
  annual_operational_cost_npr DECIMAL(14, 2),
  economic_impact_on_local_economy TEXT,
  tourism_related_services TEXT,
  
  -- Hunting operators
  licensed_hunting_operators_count INTEGER,
  hunting_guide_count INTEGER,
  guide_training_requirements TEXT,
  operator_regulations TEXT,
  operator_performance_monitoring TEXT,
  
  -- Tourism aspects
  non_hunting_tourists_allowed BOOLEAN DEFAULT TRUE,
  annual_non_hunting_visitors INTEGER,
  visitor_facilities TEXT,
  accommodation_facilities TEXT,
  eco_tourism_activities TEXT,
  
  -- Challenges
  poaching_incidents_annual INTEGER,
  major_threats TEXT,
  human_wildlife_conflict_issues TEXT,
  conflict_species TEXT,
  conflict_mitigation_strategies TEXT,
  habitat_degradation_issues TEXT,
  management_challenges TEXT,
  
  -- Success indicators
  conservation_success_indicators TEXT,
  management_effectiveness_rating TEXT,
  species_population_trends TEXT,
  ecosystem_health_indicators TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  development_plans TEXT,
  species_introduction_plans TEXT,
  research_priorities TEXT,
  
  -- Contact information
  manager_name TEXT,
  office_phone TEXT,
  office_email TEXT,
  website TEXT,
  address TEXT,
  
  -- Linkages to other entities
  linked_protected_areas JSONB DEFAULT '[]'::jsonb,
  linked_conservation_areas JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_tourism_facilities JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  area_boundary GEOMETRY(MultiPolygon, 4326),
  no_hunting_zones GEOMETRY(MultiPolygon, 4326),
  administrative_buildings GEOMETRY(MultiPoint, 4326),
  hunting_camps GEOMETRY(MultiPoint, 4326),
  trails GEOMETRY(MultiLineString, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_boundary ON acme_hunting_conservation_area USING GIST (area_boundary);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_no_hunting ON acme_hunting_conservation_area USING GIST (no_hunting_zones);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_buildings ON acme_hunting_conservation_area USING GIST (administrative_buildings);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_camps ON acme_hunting_conservation_area USING GIST (hunting_camps);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_trails ON acme_hunting_conservation_area USING GIST (trails);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_name ON acme_hunting_conservation_area(name);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_slug ON acme_hunting_conservation_area(slug);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_type ON acme_hunting_conservation_area(area_type);
CREATE INDEX IF NOT EXISTS idx_hunting_conservation_area_approach ON acme_hunting_conservation_area(management_approach);
