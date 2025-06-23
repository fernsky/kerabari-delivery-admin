-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Religious forest type enum
DO $$ 
BEGIN
  CREATE TYPE religious_forest_type AS ENUM (
    'TEMPLE_FOREST', 'MONASTERY_FOREST', 'SACRED_GROVE', 
    'CREMATION_SITE', 'CHURCH_FOREST', 'MOSQUE_FOREST', 
    'PILGRIMAGE_SITE', 'HISTORICAL_RELIGIOUS_SITE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Forest religious significance enum
DO $$ 
BEGIN
  CREATE TYPE forest_religious_significance AS ENUM (
    'EXTREMELY_HIGH', 'HIGH', 'MODERATE', 'LOW'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the religious_forest table
CREATE TABLE IF NOT EXISTS acme_religious_forest (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  forest_type religious_forest_type NOT NULL,
  
  -- Location details
  ward_numbers JSONB DEFAULT '[]'::jsonb,
  location TEXT,
  address TEXT,
  
  -- Basic information
  religious_significance forest_religious_significance NOT NULL,
  associated_religious_site TEXT,
  religious_affiliation TEXT, -- Hindu, Buddhist, Muslim, Christian, etc.
  historical_significance TEXT,
  establishment_year INTEGER,
  protected_since_year INTEGER,
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  forest_coverage_percent DECIMAL(5, 2),
  forest_condition forest_condition,
  forest_density forest_density,
  biodiversity_level biodiversity_level,
  elevation_range_meters TEXT,
  topography topography_type,
  
  -- Flora and fauna
  sacred_tree_species JSONB DEFAULT '[]'::jsonb,
  other_tree_species JSONB DEFAULT '[]'::jsonb,
  notable_old_growth_trees INTEGER,
  estimated_oldest_tree_age INTEGER,
  medicinal_plants JSONB DEFAULT '[]'::jsonb,
  sacred_animal_species JSONB DEFAULT '[]'::jsonb,
  other_animal_species JSONB DEFAULT '[]'::jsonb,
  endangered_species JSONB DEFAULT '[]'::jsonb,
  
  -- Management and conservation
  management_authority TEXT,
  managed_by_religious_institution BOOLEAN DEFAULT TRUE,
  religious_institution_name TEXT,
  management_committee_exists BOOLEAN DEFAULT TRUE,
  committee_formation_date DATE,
  committee_members_count INTEGER,
  female_committee_members INTEGER,
  conservation_rules TEXT,
  traditional_conservation_practices TEXT,
  taboos_and_beliefs TEXT,
  
  -- Religious and cultural practices
  religious_ceremonies TEXT,
  ceremony_frequency TEXT,
  annual_festivals TEXT,
  visitor_rituals TEXT,
  religious_structures_present TEXT,
  structures_count INTEGER,
  oldest_structure_year INTEGER,
  heritage_status TEXT,
  
  -- Access and usage
  access_restrictions TEXT,
  who_can_access TEXT,
  resource_extraction_allowed BOOLEAN DEFAULT FALSE,
  allowed_extraction_activities TEXT,
  prohibited_activities TEXT,
  permission_required BOOLEAN DEFAULT TRUE,
  permission_process TEXT,
  
  -- Visitor information
  annual_visitors_count INTEGER,
  annual_pilgrims_count INTEGER,
  peak_visitation_months TEXT,
  important_visitation_days TEXT,
  visitor_facilities TEXT,
  entry_fee_npr DECIMAL(10, 2),
  donation_system TEXT,
  
  -- Threats and challenges
  encroachment_issues TEXT,
  vandalism_issues TEXT,
  natural_threats TEXT,
  visitor_pressure TEXT,
  modernization_impacts TEXT,
  other_challenges TEXT,
  
  -- Conservation efforts
  conservation_initiatives TEXT,
  restoration_activities TEXT,
  community_involvement TEXT,
  government_support TEXT,
  ngo_support TEXT,
  documentation_efforts TEXT,
  
  -- Ecological services
  watershed_protection TEXT,
  biodiversity_conservation TEXT,
  microclimate_effects TEXT,
  carbon_sequestration TEXT,
  seed_bank_role TEXT,
  
  -- Socio-economic aspects
  employment_generation INTEGER,
  local_economy_impact TEXT,
  tourism_contribution TEXT,
  educational_value TEXT,
  research_value TEXT,
  
  -- Contact information
  contact_person_name TEXT,
  contact_person_role TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  
  -- Linkages to other entities
  linked_religious_institutions JSONB DEFAULT '[]'::jsonb,
  linked_cultural_sites JSONB DEFAULT '[]'::jsonb,
  linked_tourist_attractions JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  forest_boundary GEOMETRY(MultiPolygon, 4326),
  sacred_sites GEOMETRY(MultiPoint, 4326),
  entry_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_religious_forest_boundary ON acme_religious_forest USING GIST (forest_boundary);
CREATE INDEX IF NOT EXISTS idx_religious_forest_sacred_sites ON acme_religious_forest USING GIST (sacred_sites);
CREATE INDEX IF NOT EXISTS idx_religious_forest_entry_points ON acme_religious_forest USING GIST (entry_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_religious_forest_name ON acme_religious_forest(name);
CREATE INDEX IF NOT EXISTS idx_religious_forest_slug ON acme_religious_forest(slug);
CREATE INDEX IF NOT EXISTS idx_religious_forest_type ON acme_religious_forest(forest_type);
CREATE INDEX IF NOT EXISTS idx_religious_forest_significance ON acme_religious_forest(religious_significance);
