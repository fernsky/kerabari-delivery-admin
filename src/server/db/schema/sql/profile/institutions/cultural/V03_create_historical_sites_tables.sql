-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create historical_site_type enum
DO $$ 
BEGIN
  CREATE TYPE historical_site_type AS ENUM (
    'PALACE', 'FORT', 'ANCIENT_SETTLEMENT', 'ARCHAEOLOGICAL_SITE', 'ANCIENT_MONUMENT',
    'HERITAGE_BUILDING', 'HISTORIC_HOUSE', 'MEDIEVAL_TOWN', 'ROYAL_RESIDENCE',
    'HISTORIC_GARDEN', 'HISTORIC_INFRASTRUCTURE', 'BATTLEFIELD', 'ANCIENT_RUINS',
    'HISTORIC_LANDMARK', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create historical_architectural_style enum
DO $$ 
BEGIN
  CREATE TYPE historical_architectural_style AS ENUM (
    'TRADITIONAL_NEPALI', 'PAGODA', 'NEWAR', 'MALLA', 'SHAH', 'RAI', 'LIMBU',
    'MEDIEVAL', 'COLONIAL', 'GOTHIC', 'MUGHAL', 'RANA_PALACE', 'SHIKHARA',
    'STUPA', 'MIXED', 'VERNACULAR', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create historical_construction_material enum
DO $$ 
BEGIN
  CREATE TYPE historical_construction_material AS ENUM (
    'STONE', 'BRICK', 'WOOD', 'MUD', 'CLAY', 'MARBLE', 'METAL',
    'TERRACOTTA', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create historical_significance enum
DO $$ 
BEGIN
  CREATE TYPE historical_significance AS ENUM (
    'LOCAL', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create historical_preservation_status enum
DO $$ 
BEGIN
  CREATE TYPE historical_preservation_status AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED', 'UNDER_RENOVATION',
    'PARTIAL_RUINS', 'RUINS', 'ARCHAEOLOGICAL_REMAINS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create historical_period enum
DO $$ 
BEGIN
  CREATE TYPE historical_period AS ENUM (
    'ANCIENT', 'MEDIEVAL', 'LICCHAVI', 'MALLA', 'SHAH', 'RANA', 'PRE_UNIFICATION',
    'COLONIAL', 'MODERN', 'CONTEMPORARY', 'MULTIPLE_PERIODS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the historical site table
CREATE TABLE IF NOT EXISTS acme_historical_site (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type historical_site_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_square_meters DECIMAL(10,2),
    architectural_style historical_architectural_style,
    construction_material historical_construction_material,
    historical_period historical_period,
    year_established INTEGER, -- Estimated or known year of construction
    year_abandoned INTEGER, -- If applicable
    last_restoration_year INTEGER, -- Year of latest major restoration
    
    -- Historical context
    historical_significance historical_significance,
    original_function TEXT, -- Original purpose of the site
    notable_people TEXT, -- Historical figures associated with the site
    historical_events TEXT, -- Major events that occurred here
    dynasty_or_rulership TEXT, -- Dynasty/ruler who built or ruled from this site
    change_of_ownership TEXT, -- History of ownership changes
    
    -- Cultural and archaeological significance
    cultural_significance TEXT,
    archaeological_remains TEXT,
    artifacts_found TEXT, -- Summary of important discoveries
    excavation_history TEXT,
    excavation_year INTEGER, -- Year of major excavation, if applicable
    
    -- Heritage status
    is_heritage_site BOOLEAN DEFAULT false,
    heritage_designation TEXT, -- E.g., "UNESCO World Heritage", "National Monument"
    heritage_listing_year INTEGER,
    heritage_reference_id TEXT, -- Reference ID in heritage listings
    
    -- Inscriptions and documentation
    has_inscriptions BOOLEAN DEFAULT false,
    inscription_details TEXT,
    has_historical_documents BOOLEAN DEFAULT false,
    documentation_details TEXT,
    
    -- Management and operations
    managed_by TEXT, -- Organization or committee name
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    website_url TEXT,
    daily_opening_time TEXT,
    daily_closing_time TEXT,
    is_open_all_day BOOLEAN DEFAULT false,
    weekly_closed_days TEXT, -- E.g., "Monday, Tuesday"
    entry_fee_npr INTEGER,
    entry_fee_details_foreigners TEXT,
    
    -- Physical infrastructure
    total_structure_count INTEGER,
    has_main_building BOOLEAN DEFAULT false,
    has_defensive_walls BOOLEAN DEFAULT false,
    has_towers BOOLEAN DEFAULT false,
    has_moat BOOLEAN DEFAULT false,
    has_gardens BOOLEAN DEFAULT false,
    has_courtyards BOOLEAN DEFAULT false,
    structure_details TEXT,
    
    -- Features and architectural elements
    notable_features TEXT,
    architectural_elements TEXT,
    has_underground_structures BOOLEAN DEFAULT false,
    underground_details TEXT,
    has_durbar BOOLEAN DEFAULT false, -- For palaces
    has_temple BOOLEAN DEFAULT false,
    has_artificial_water_body BOOLEAN DEFAULT false,
    water_body_details TEXT,
    
    -- Facilities and amenities
    has_parking BOOLEAN DEFAULT false,
    parking_capacity INTEGER,
    has_toilets BOOLEAN DEFAULT false,
    has_handicap_access BOOLEAN DEFAULT false,
    has_electricity BOOLEAN DEFAULT true,
    has_water_supply BOOLEAN DEFAULT true,
    has_cafeteria BOOLEAN DEFAULT false,
    has_gift_shop BOOLEAN DEFAULT false,
    
    -- Preservation and restoration
    preservation_status historical_preservation_status,
    restoration_details TEXT,
    has_regular_maintenance BOOLEAN DEFAULT false,
    maintenance_details TEXT,
    funding_source TEXT, -- Where restoration/maintenance funds come from
    conservation_challenges TEXT,
    
    -- Research and education
    research_value TEXT,
    ongoing_research TEXT,
    educational_programs TEXT,
    publication_references TEXT, -- Key publications about this site
    
    -- Visitor information
    estimated_daily_visitors INTEGER,
    estimated_yearly_visitors INTEGER,
    peak_visitation_months TEXT,
    has_overseas_visitors BOOLEAN DEFAULT false,
    guides_available BOOLEAN DEFAULT false,
    has_tourism_infrastructure BOOLEAN DEFAULT false,
    tourism_details TEXT,
    visitor_facilities TEXT,
    photo_allowed BOOLEAN DEFAULT true,
    photo_restrictions TEXT,
    visit_duration TEXT, -- Typical time needed to visit
    
    -- Community engagement
    local_community_involvement TEXT,
    community_benefits TEXT,
    educational_activities TEXT,
    
    -- Economic aspects
    annual_maintenance_cost DECIMAL(14,2),
    annual_revenue DECIMAL(14,2),
    economic_impact TEXT, -- How it contributes to local economy
    employment_generated INTEGER,
    
    -- Cultural and ceremonial use
    traditional_uses TEXT,
    ceremonial_importance TEXT,
    cultural_events TEXT, -- Events regularly held at the site
    local_myths TEXT, -- Associated folklore or legends
    
    -- Safety and security
    has_security_personnel BOOLEAN DEFAULT false,
    has_cctv BOOLEAN DEFAULT false,
    has_fire_safety BOOLEAN DEFAULT false,
    safety_measures TEXT,
    disaster_preparedness TEXT, -- Measures for earthquakes, floods, etc.
    
    -- Artifacts and collections
    has_archaeological_artifacts BOOLEAN DEFAULT false,
    artifact_storage_location TEXT,
    has_on_site_museum BOOLEAN DEFAULT false,
    museum_details TEXT,
    notable_collections TEXT,
    
    -- Damages and threats
    damage_history TEXT, -- Historical damage from wars, natural disasters, etc.
    current_threats TEXT, -- Environmental, human, or developmental threats
    encroachment_issues TEXT,
    natural_disaster_risk TEXT,
    
    -- Development and future plans
    development_projects TEXT,
    future_conservation_plans TEXT,
    proposed_improvements TEXT,
    
    -- Linkages to other entities
    linked_cultural_events JSONB DEFAULT '[]'::jsonb,
    linked_cultural_organizations JSONB DEFAULT '[]'::jsonb,
    linked_religious_places JSONB DEFAULT '[]'::jsonb,
    linked_historical_sites JSONB DEFAULT '[]'::jsonb,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    site_boundary GEOMETRY(Polygon, 4326),
    structure_footprints GEOMETRY(MultiPolygon, 4326),
    
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
CREATE INDEX IF NOT EXISTS idx_historical_site_location_point 
    ON acme_historical_site USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_historical_site_boundary 
    ON acme_historical_site USING GIST (site_boundary);
CREATE INDEX IF NOT EXISTS idx_historical_site_footprints 
    ON acme_historical_site USING GIST (structure_footprints);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_historical_site_type 
    ON acme_historical_site(type);
CREATE INDEX IF NOT EXISTS idx_historical_site_name 
    ON acme_historical_site(name);
CREATE INDEX IF NOT EXISTS idx_historical_site_ward 
    ON acme_historical_site(ward_number);
CREATE INDEX IF NOT EXISTS idx_historical_site_period 
    ON acme_historical_site(historical_period);
CREATE INDEX IF NOT EXISTS idx_historical_site_significance 
    ON acme_historical_site(historical_significance);
CREATE INDEX IF NOT EXISTS idx_historical_site_preservation 
    ON acme_historical_site(preservation_status);
CREATE INDEX IF NOT EXISTS idx_historical_site_is_verified 
    ON acme_historical_site(is_verified);
CREATE INDEX IF NOT EXISTS idx_historical_site_is_heritage 
    ON acme_historical_site(is_heritage_site);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_historical_site_slug 
    ON acme_historical_site(slug);
