-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Natural pasture type enum
DO $$ 
BEGIN
  CREATE TYPE natural_pasture_type AS ENUM (
    'ALPINE_PASTURE', 'GRASSLAND_PASTURE', 'MEADOW_PASTURE', 
    'FOREST_BASED_PASTURE', 'SHRUBLAND_PASTURE', 'WETLAND_PASTURE', 
    'SEASONAL_PASTURE', 'MIXED_PASTURE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Pasture management type enum
DO $$ 
BEGIN
  CREATE TYPE pasture_management_type AS ENUM (
    'COMMUNITY_MANAGED', 'GOVERNMENT_MANAGED', 'TRADITIONAL_MANAGED', 
    'PRIVATELY_MANAGED', 'COOPERATIVE_MANAGED', 'JOINTLY_MANAGED', 
    'UNMANAGED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Vegetation condition enum
DO $$ 
BEGIN
  CREATE TYPE vegetation_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 
    'DEGRADED', 'UNDER_REHABILITATION', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Seasonal availability enum
DO $$ 
BEGIN
  CREATE TYPE seasonal_availability AS ENUM (
    'YEAR_ROUND', 'SUMMER_ONLY', 'WINTER_ONLY', 'MONSOON_SEASON', 
    'DRY_SEASON', 'SEASONAL_ROTATIONAL', 'INTERMITTENT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Grazing pressure enum
DO $$ 
BEGIN
  CREATE TYPE grazing_pressure AS ENUM (
    'NONE', 'LIGHT', 'MODERATE', 'HEAVY', 
    'EXCESSIVE', 'CONTROLLED', 'SEASONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the natural_pasture table
CREATE TABLE IF NOT EXISTS acme_natural_pasture (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  pasture_type natural_pasture_type NOT NULL,
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  address TEXT,
  
  -- Basic information
  local_name TEXT,
  traditional_name TEXT,
  ownership_type TEXT,
  management_type pasture_management_type,
  managing_authority TEXT,
  legal_status TEXT,
  designated_since_year INTEGER,
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  usable_grazing_area_hectares DECIMAL(10, 2),
  elevation_range_meters TEXT,
  min_elevation_meters INTEGER,
  max_elevation_meters INTEGER,
  topography topography_type,
  slope_type TEXT,
  average_slope_percent DECIMAL(5, 2),
  aspect TEXT,
  soil_type TEXT,
  soil_depth_cm INTEGER,
  water_availability TEXT,
  nearest_water_source TEXT,
  distance_to_water_source_km DECIMAL(5, 2),
  
  -- Vegetation characteristics
  vegetation_condition vegetation_condition,
  dominant_grass_species JSONB DEFAULT '[]'::jsonb,
  dominant_legume_species JSONB DEFAULT '[]'::jsonb,
  dominant_herb_species JSONB DEFAULT '[]'::jsonb,
  woody_vegetation_percent DECIMAL(5, 2),
  woody_species JSONB DEFAULT '[]'::jsonb,
  vegetation_height_cm INTEGER,
  ground_cover_percent DECIMAL(5, 2),
  bare_ground_percent DECIMAL(5, 2),
  invasive_species JSONB DEFAULT '[]'::jsonb,
  invasive_species_coverage_percent DECIMAL(5, 2),
  medicinal_plants JSONB DEFAULT '[]'::jsonb,
  vegetation_productivity TEXT,
  estimated_biomass_production_kg_per_hectare DECIMAL(10, 2),
  
  -- Usage information
  seasonal_availability seasonal_availability,
  primary_use_period TEXT,
  grazing_months TEXT,
  grazing_pressure grazing_pressure,
  average_animal_units INTEGER,
  carrying_capacity_animal_units INTEGER,
  main_livestock_types JSONB DEFAULT '[]'::jsonb,
  cattle_count INTEGER,
  buffalo_count INTEGER,
  sheep_count INTEGER,
  goat_count INTEGER,
  yak_count INTEGER,
  horse_count INTEGER,
  other_livestock TEXT,
  grazing_pattern TEXT,
  rotational_grazing_system BOOLEAN DEFAULT FALSE,
  rotational_pattern TEXT,
  
  -- Management and governance
  management_system TEXT,
  access_rights TEXT,
  access_restrictions TEXT,
  traditional_management_practices TEXT,
  has_management_committee BOOLEAN DEFAULT FALSE,
  committee_formation_date DATE,
  committee_members_count INTEGER,
  female_members_count INTEGER,
  marginalized_members_count INTEGER,
  has_usage_rules BOOLEAN DEFAULT FALSE,
  usage_rules TEXT,
  has_boundary_conflicts BOOLEAN DEFAULT FALSE,
  conflict_details TEXT,
  conflict_resolution_mechanism TEXT,
  
  -- Conservation and improvement
  conservation_status TEXT,
  conservation_measures TEXT,
  has_been_improved BOOLEAN DEFAULT FALSE,
  improvement_measures TEXT,
  reseeding_practices TEXT,
  weed_control_practices TEXT,
  erosion_control_measures TEXT,
  water_management_practices TEXT,
  
  -- Challenges and threats
  major_threats TEXT,
  degradation_issues TEXT,
  overgrazing_issues TEXT,
  encroachment_issues TEXT,
  climate_change_impacts TEXT,
  drought_frequency TEXT,
  fire_occurrence TEXT,
  invasive_species_problems TEXT,
  
  -- Socioeconomic aspects
  dependent_households_count INTEGER,
  dependent_population INTEGER,
  economic_importance TEXT,
  livelihood_contribution TEXT,
  annual_economic_value_npr DECIMAL(14, 2),
  indirect_benefits TEXT,
  cultural_significance TEXT,
  
  -- Wildlife and biodiversity
  wildlife_species JSONB DEFAULT '[]'::jsonb,
  bird_species JSONB DEFAULT '[]'::jsonb,
  endangered_species JSONB DEFAULT '[]'::jsonb,
  ecological_significance TEXT,
  
  -- Infrastructure
  has_shelters BOOLEAN DEFAULT FALSE,
  shelter_count INTEGER,
  has_fencing BOOLEAN DEFAULT FALSE,
  fencing_type TEXT,
  fencing_length_km DECIMAL(6, 2),
  has_water_points BOOLEAN DEFAULT FALSE,
  water_point_count INTEGER,
  has_trails BOOLEAN DEFAULT FALSE,
  trail_length_km DECIMAL(6, 2),
  other_infrastructure TEXT,
  
  -- Development interventions
  development_projects TEXT,
  implementing_agencies TEXT,
  project_period TEXT,
  investment_amount_npr DECIMAL(14, 2),
  project_outcomes TEXT,
  
  -- Future plans
  management_plans TEXT,
  improvement_plans TEXT,
  sustainable_use_strategies TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_role TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  
  -- Linkages to other entities
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_livestock_farms JSONB DEFAULT '[]'::jsonb,
  linked_water_sources JSONB DEFAULT '[]'::jsonb,
  linked_forests JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  pasture_boundary GEOMETRY(MultiPolygon, 4326),
  water_points GEOMETRY(MultiPoint, 4326),
  infrastructure_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_natural_pasture_boundary ON acme_natural_pasture USING GIST (pasture_boundary);
CREATE INDEX IF NOT EXISTS idx_natural_pasture_water_points ON acme_natural_pasture USING GIST (water_points);
CREATE INDEX IF NOT EXISTS idx_natural_pasture_infrastructure ON acme_natural_pasture USING GIST (infrastructure_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_natural_pasture_name ON acme_natural_pasture(name);
CREATE INDEX IF NOT EXISTS idx_natural_pasture_slug ON acme_natural_pasture(slug);
CREATE INDEX IF NOT EXISTS idx_natural_pasture_type ON acme_natural_pasture(pasture_type);
CREATE INDEX IF NOT EXISTS idx_natural_pasture_management ON acme_natural_pasture(management_type);
