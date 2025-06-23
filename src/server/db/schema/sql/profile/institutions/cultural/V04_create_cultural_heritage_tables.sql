-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create cultural_heritage_type enum
DO $$ 
BEGIN
  CREATE TYPE cultural_heritage_type AS ENUM (
    'INTANGIBLE_HERITAGE', 'HISTORICAL_TREE', 'HISTORICAL_WELL', 'HISTORICAL_POND',
    'HISTORICAL_STONE', 'ANCIENT_INSCRIPTION', 'SACRED_LANDMARK', 'TRADITIONAL_DANCE',
    'TRADITIONAL_MUSIC', 'TRADITIONAL_CRAFT', 'FOLKLORE', 'ORAL_TRADITION',
    'RITUAL_PRACTICE', 'CULINARY_TRADITION', 'TRADITIONAL_MEDICINE', 'INDIGENOUS_LANGUAGE',
    'TRADITIONAL_GAME', 'TRADITIONAL_FESTIVAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create heritage_significance enum
DO $$ 
BEGIN
  CREATE TYPE heritage_significance AS ENUM (
    'LOCAL', 'DISTRICT', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create heritage_conservation_status enum
DO $$ 
BEGIN
  CREATE TYPE heritage_conservation_status AS ENUM (
    'WELL_PRESERVED', 'MAINTAINED', 'VULNERABLE', 'ENDANGERED', 'CRITICALLY_ENDANGERED',
    'LOST', 'REVITALIZED', 'DOCUMENTED_ONLY', 'MIXED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create heritage_recognition_type enum
DO $$ 
BEGIN
  CREATE TYPE heritage_recognition_type AS ENUM (
    'UNESCO_INTANGIBLE_HERITAGE', 'NATIONAL_HERITAGE', 'PROVINCIAL_HERITAGE', 
    'LOCAL_HERITAGE', 'COMMUNITY_RECOGNISED', 'ACADEMIC_RECOGNITION', 'NONE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the cultural heritage table
CREATE TABLE IF NOT EXISTS acme_cultural_heritage (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    heritage_type cultural_heritage_type NOT NULL,
    
    -- Location details (not applicable for some intangible heritage)
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    has_physical_location BOOLEAN DEFAULT true,
    
    -- Basic details
    estimated_age_years INTEGER,
    historical_period TEXT, -- E.g., "Licchavi Period", "Malla Period"
    year_discovered INTEGER,
    year_recognised INTEGER, -- Year formally recognized as heritage
    
    -- Cultural significance
    cultural_significance TEXT,
    heritage_significance heritage_significance,
    associated_communities TEXT, -- Communities that maintain/treasure this heritage
    associated_ethnic_groups TEXT, -- Specific ethnic groups associated
    spiritual_significance TEXT,
    
    -- Conservation status
    conservation_status heritage_conservation_status,
    conservation_details TEXT,
    threats_to_preservation TEXT, -- E.g., "Modernization", "Natural decay", "Tourism impact"
    safeguarding_measures TEXT,
    last_conservation_date DATE,
    conservation_agency TEXT, -- Organization responsible for conservation
    
    -- Recognition and documentation
    is_officially_recognised BOOLEAN DEFAULT false,
    recognition_type heritage_recognition_type,
    recognition_date DATE,
    recognition_reference_id TEXT, -- Reference ID in official listings
    has_proper_documentation BOOLEAN DEFAULT false,
    documentation_details TEXT,
    has_research_publications BOOLEAN DEFAULT false,
    publication_references TEXT,
    
    -- For tangible elements (trees, wells, ponds, stones)
    physical_dimensions TEXT, -- E.g., "Height: 15m, Diameter: 2m" (for trees), "Depth: 10m, Diameter: 5m" (for wells)
    physical_characteristics TEXT,
    material_composition TEXT, -- For stones, wells, etc.
    geological_significance TEXT,
    
    -- For intangible elements (dances, music, crafts, etc.)
    practice_frequency TEXT, -- E.g., "Annual", "Daily", "On special occasions"
    practice_season TEXT, -- E.g., "Monsoon", "Spring", "Harvest season"
    geographic_distribution TEXT, -- Where this intangible heritage is practiced
    transmission_method TEXT, -- How it's passed down generations
    associated_artifacts TEXT, -- Physical items used in the practice
    language_of_expression TEXT, -- Primary language of the tradition
    
    -- Natural elements (for trees, ponds)
    has_ecological_value BOOLEAN DEFAULT false,
    ecological_value TEXT,
    ecosystem_services TEXT,
    flora_fauna_details TEXT,
    biological_characteristics TEXT,
    
    -- Social and contemporary context
    current_usage TEXT, -- Contemporary use/practice
    community_role TEXT, -- Role in contemporary community life
    economic_value TEXT, -- Economic benefits or potential
    tourism_value BOOLEAN DEFAULT false,
    tourism_details TEXT,
    educational_value BOOLEAN DEFAULT false,
    educational_activities TEXT,
    
    -- Management and access
    ownership_type TEXT, -- E.g., "Community", "Government", "Private", "Temple trust"
    managed_by TEXT,
    access_restrictions TEXT,
    visitor_guidelines TEXT,
    
    -- Rituals and practices
    associated_rituals TEXT,
    ritual_calendar TEXT, -- When rituals are performed
    ritual_participants TEXT, -- Who participates
    ritual_materials TEXT, -- Materials needed for rituals
    
    -- Contemporary challenges and adaptation
    adaptation_to_modern_context TEXT,
    commercialization_impact TEXT,
    globalization_impact TEXT,
    revitalization_efforts TEXT,
    
    -- Digital preservation
    has_audio_recordings BOOLEAN DEFAULT false,
    has_video_recordings BOOLEAN DEFAULT false,
    has_digital_documentation BOOLEAN DEFAULT false,
    digital_archive_links TEXT,
    
    -- Community engagement
    community_participation_level TEXT, -- E.g., "High", "Medium", "Low", "None"
    youth_involvement TEXT,
    gender_aspects TEXT, -- Gender roles in preservation/practice
    community_awareness TEXT,
    
    -- Knowledge holders and practitioners
    key_knowledge_holders TEXT, -- Names of important tradition bearers
    practitioner_count INTEGER,
    master_practitioners TEXT,
    teaching_institutions TEXT,
    
    -- Linkages to other entities
    linked_historical_sites JSONB DEFAULT '[]'::jsonb,
    linked_religious_places JSONB DEFAULT '[]'::jsonb,
    linked_cultural_organizations JSONB DEFAULT '[]'::jsonb,
    linked_cultural_events JSONB DEFAULT '[]'::jsonb,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields (for physical heritage)
    location_point GEOMETRY(Point, 4326),
    area_polygon GEOMETRY(Polygon, 4326),
    
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
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_location_point 
    ON acme_cultural_heritage USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_area_polygon 
    ON acme_cultural_heritage USING GIST (area_polygon);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_type 
    ON acme_cultural_heritage(heritage_type);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_name 
    ON acme_cultural_heritage(name);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_ward 
    ON acme_cultural_heritage(ward_number);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_significance 
    ON acme_cultural_heritage(heritage_significance);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_conservation_status 
    ON acme_cultural_heritage(conservation_status);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_recognition 
    ON acme_cultural_heritage(recognition_type);
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_is_verified 
    ON acme_cultural_heritage(is_verified);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_cultural_heritage_slug 
    ON acme_cultural_heritage(slug);
