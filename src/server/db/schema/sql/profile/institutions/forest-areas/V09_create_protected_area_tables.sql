-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Protected area type enum
DO $$ 
BEGIN
  CREATE TYPE protected_area_type AS ENUM (
    'NATIONAL_PARK', 'WILDLIFE_RESERVE', 'CONSERVATION_AREA',
    'STRICT_NATURE_RESERVE', 'PROTECTED_FOREST', 'NATURAL_MONUMENT',
    'WATERSHED_PROTECTION_AREA', 'RAMSAR_SITE', 'HUNTING_RESERVE',
    'BIOSPHERE_RESERVE', 'WORLD_HERITAGE_SITE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Protected area management category enum
DO $$ 
BEGIN
  CREATE TYPE protected_area_management_category AS ENUM (
    'CATEGORY_I', 'CATEGORY_II', 'CATEGORY_III', 'CATEGORY_IV', 
    'CATEGORY_V', 'CATEGORY_VI', 'NOT_CATEGORIZED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Management authority enum
DO $$ 
BEGIN
  CREATE TYPE management_authority AS ENUM (
    'DEPARTMENT_NATIONAL_PARKS', 'FOREST_DEPARTMENT', 
    'CONSERVATION_NGO', 'COMMUNITY_ORGANIZATION', 'PROVINCIAL_GOVERNMENT',
    'LOCAL_GOVERNMENT', 'JOINT_MANAGEMENT', 'PRIVATE_ENTITY', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Tourism development level enum
DO $$ 
BEGIN
  CREATE TYPE tourism_development_level AS ENUM (
    'HIGHLY_DEVELOPED', 'DEVELOPED', 'MODERATELY_DEVELOPED', 
    'MINIMALLY_DEVELOPED', 'UNDEVELOPED', 'RESTRICTED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Conservation significance enum
DO $$ 
BEGIN
  CREATE TYPE conservation_significance AS ENUM (
    'GLOBAL', 'NATIONAL', 'REGIONAL', 'LOCAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the protected_area table
CREATE TABLE IF NOT EXISTS acme_protected_area (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  protected_area_type protected_area_type NOT NULL,
  
  -- Basic information
  international_designation TEXT, -- UNESCO, Ramsar, etc.
  iucn_category protected_area_management_category,
  management_authority management_authority NOT NULL,
  managing_office_name TEXT,
  headquarters_location TEXT,
  establishment_year INTEGER,
  gazette_notification_date DATE,
  gazette_reference TEXT,
  legal_framework TEXT,
  
  -- Location details
  province TEXT,
  district TEXT,
  municipality TEXT,
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  boundary_description TEXT,
  total_area_hectares DECIMAL(12, 2) NOT NULL,
  buffer_zone_area_hectares DECIMAL(12, 2),
  core_zone_area_hectares DECIMAL(12, 2),
  conservation_significance conservation_significance,
  
  -- Boundary information
  has_clearly_demarcated_boundary BOOLEAN DEFAULT TRUE,
  boundary_marking_type TEXT,
  boundary_conflicts BOOLEAN DEFAULT FALSE,
  boundary_conflict_details TEXT,
  surroundings_description TEXT,
  
  -- Physical characteristics
  elevation_range_meters TEXT,
  min_elevation_meters INTEGER,
  max_elevation_meters INTEGER,
  topography topography_type,
  major_landforms TEXT,
  soil_types TEXT,
  geological_features TEXT,
  major_watersheds TEXT,
  river_systems TEXT,
  lakes_wetlands_count INTEGER,
  lakes_wetlands_area_hectares DECIMAL(12, 2),
  climate_zones TEXT,
  average_annual_rainfall_mm INTEGER,
  temperature_range_celsius TEXT,
  seasons TEXT,
  
  -- Biodiversity
  ecosystem_types JSONB DEFAULT '[]'::jsonb,
  habitat_types JSONB DEFAULT '[]'::jsonb,
  forest_types JSONB DEFAULT '[]'::jsonb,
  forest_coverage_percent DECIMAL(5, 2),
  forest_area_hectares DECIMAL(12, 2),
  grassland_area_hectares DECIMAL(12, 2),
  wetland_area_hectares DECIMAL(12, 2),
  shrubland_area_hectares DECIMAL(12, 2),
  barren_land_area_hectares DECIMAL(12, 2),
  glacier_area_hectares DECIMAL(12, 2),
  
  -- Flora
  total_plant_species_count INTEGER,
  endemic_plant_species_count INTEGER,
  threatened_plant_species_count INTEGER,
  major_plant_species TEXT,
  keystone_plant_species TEXT,
  invasive_plant_species TEXT,
  commercially_valuable_plants TEXT,
  medicinal_plants TEXT,
  
  -- Fauna
  total_mammal_species INTEGER,
  endemic_mammal_species INTEGER,
  threatened_mammal_species INTEGER,
  flagship_species TEXT,
  total_bird_species INTEGER,
  endemic_bird_species INTEGER,
  migratory_bird_species INTEGER,
  total_reptile_species INTEGER,
  total_amphibian_species INTEGER,
  total_fish_species INTEGER,
  total_butterfly_species INTEGER,
  other_notable_invertebrates TEXT,
  notable_fauna_population_estimates TEXT,
  
  -- Conservation status
  biodiversity_condition TEXT,
  threats_to_biodiversity TEXT,
  endangered_species_count INTEGER,
  key_endangered_species TEXT,
  critical_habitats TEXT,
  ecological_restoration_projects TEXT,
  breeding_centers_present BOOLEAN DEFAULT FALSE,
  breeding_center_details TEXT,
  research_projects TEXT,
  
  -- Human dimensions
  settlements_inside_park INTEGER,
  population_inside_park INTEGER,
  indigenous_communities TEXT,
  traditional_resource_use_practices TEXT,
  settlement_relocation_history TEXT,
  special_use_zones BOOLEAN DEFAULT FALSE,
  special_use_zone_details TEXT,
  land_tenure_issues TEXT,
  
  -- Management
  has_management_plan BOOLEAN DEFAULT TRUE,
  management_plan_period TEXT,
  management_plan_implementation_status TEXT,
  annual_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  staff_count INTEGER,
  technical_staff_count INTEGER,
  ranger_count INTEGER,
  security_personnel_count INTEGER,
  security_posts_count INTEGER,
  monitoring_system TEXT,
  research_facilities TEXT,
  research_priorities TEXT,
  conservation_programs TEXT,
  collaborative_organizations TEXT,
  
  -- Infrastructure
  administrative_buildings_count INTEGER,
  ranger_posts_count INTEGER,
  entry_gates_count INTEGER,
  visitor_centers_count INTEGER,
  research_stations_count INTEGER,
  watch_towers_count INTEGER,
  internal_roads_km DECIMAL(8, 2),
  trails_km DECIMAL(8, 2),
  bridges_count INTEGER,
  infrastructure_development_needs TEXT,
  
  -- Tourism
  tourism_development_status tourism_development_level,
  annual_visitor_count INTEGER,
  foreign_visitor_percentage DECIMAL(5, 2),
  peak_visitation_months TEXT,
  entry_fee_domestic_npr DECIMAL(10, 2),
  entry_fee_foreign_npr DECIMAL(10, 2),
  major_attractions TEXT,
  visitor_facilities TEXT,
  accommodation_facilities TEXT,
  accommodation_capacity INTEGER,
  guided_tour_availability BOOLEAN DEFAULT TRUE,
  guided_tour_details TEXT,
  permitted_activities TEXT,
  restricted_activities TEXT,
  tourism_impact TEXT,
  visitor_management_strategy TEXT,
  
  -- Buffer zone management
  has_buffer_zone BOOLEAN DEFAULT FALSE,
  buffer_zone_management_approach TEXT,
  buffer_zone_community_programs TEXT,
  buffer_zone_user_groups_count INTEGER,
  buffer_zone_household_count INTEGER,
  buffer_zone_development_programs TEXT,
  buffer_zone_forest_management_system TEXT,
  
  -- Human-wildlife conflict
  human_wildlife_conflict_level TEXT,
  conflict_species TEXT,
  wildlife_damage_incidents_annual INTEGER,
  human_casualties_last_5_years INTEGER,
  livestock_loss_annual INTEGER,
  crop_damage_incidents_annual INTEGER,
  conflict_mitigation_strategies TEXT,
  compensation_schemes TEXT,
  annual_compensation_amount_npr DECIMAL(12, 2),
  
  -- Community participation
  community_involvement_level TEXT,
  benefit_sharing_mechanism TEXT,
  revenue_sharing_with_communities TEXT,
  community_development_programs TEXT,
  alternative_livelihood_programs TEXT,
  environmental_education_programs TEXT,
  
  -- Conservation impacts
  key_conservation_achievements TEXT,
  species_recovery_programs TEXT,
  habitat_restoration_achievements TEXT,
  population_trends_key_species TEXT,
  biodiversity_monitoring_results TEXT,
  
  -- Threats and challenges
  major_threats TEXT,
  poaching_incidents_annual INTEGER,
  illegal_logging_incidents_annual INTEGER,
  forest_fire_incidents_annual INTEGER,
  encroachment_hectares_annual DECIMAL(10, 2),
  invasive_species_impact TEXT,
  climate_change_impacts TEXT,
  pollution_issues TEXT,
  infrastructure_development_threats TEXT,
  resource_limitations TEXT,
  political_challenges TEXT,
  
  -- Sustainable use
  sustainable_harvesting_programs TEXT,
  community_forests_count INTEGER,
  community_forest_area_hectares DECIMAL(12, 2),
  permitted_resource_extraction TEXT,
  research_permits_annual INTEGER,
  grazing_management TEXT,
  
  -- Connectivity
  ecological_corridors TEXT,
  transboundary_initiatives TEXT,
  landscape_level_conservation TEXT,
  connectivity_with_other_protected_areas TEXT,
  
  -- Recognition and awards
  international_recognition TEXT,
  conservation_awards TEXT,
  special_programs TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  new_facilities_planned TEXT,
  strategic_priorities TEXT,
  research_needs TEXT,
  
  -- Contact information
  chief_warden_name TEXT,
  office_phone TEXT,
  office_email TEXT,
  website TEXT,
  address TEXT,
  
  -- Linkages to other entities
  linked_protected_areas JSONB DEFAULT '[]'::jsonb,
  linked_buffer_zones JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_tourism_facilities JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  park_boundary GEOMETRY(MultiPolygon, 4326),
  core_zone GEOMETRY(MultiPolygon, 4326),
  buffer_zone_boundary GEOMETRY(MultiPolygon, 4326),
  administrative_buildings GEOMETRY(MultiPoint, 4326),
  entry_points GEOMETRY(MultiPoint, 4326),
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
CREATE INDEX IF NOT EXISTS idx_protected_area_boundary ON acme_protected_area USING GIST (park_boundary);
CREATE INDEX IF NOT EXISTS idx_protected_area_core_zone ON acme_protected_area USING GIST (core_zone);
CREATE INDEX IF NOT EXISTS idx_protected_area_buffer_zone ON acme_protected_area USING GIST (buffer_zone_boundary);
CREATE INDEX IF NOT EXISTS idx_protected_area_buildings ON acme_protected_area USING GIST (administrative_buildings);
CREATE INDEX IF NOT EXISTS idx_protected_area_entry_points ON acme_protected_area USING GIST (entry_points);
CREATE INDEX IF NOT EXISTS idx_protected_area_trails ON acme_protected_area USING GIST (trails);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_protected_area_name ON acme_protected_area(name);
CREATE INDEX IF NOT EXISTS idx_protected_area_slug ON acme_protected_area(slug);
CREATE INDEX IF NOT EXISTS idx_protected_area_type ON acme_protected_area(protected_area_type);
CREATE INDEX IF NOT EXISTS idx_protected_area_authority ON acme_protected_area(management_authority);
