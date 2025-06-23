-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create religious_place_type enum
DO $$ 
BEGIN
  CREATE TYPE religious_place_type AS ENUM (
    'HINDU_TEMPLE', 'BUDDHIST_TEMPLE', 'MOSQUE', 'CHURCH', 'GURUDWARA', 'SHRINE', 
    'MONASTERY', 'SYNAGOGUE', 'JAIN_TEMPLE', 'MEDITATION_CENTER', 'PAGODA', 
    'SACRED_GROVE', 'SACRED_POND', 'SACRED_RIVER', 'SACRED_HILL', 'PRAYER_HALL', 
    'RELIGIOUS_COMPLEX', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create architectural_style enum
DO $$ 
BEGIN
  CREATE TYPE architectural_style AS ENUM (
    'TRADITIONAL_NEPALI', 'PAGODA', 'STUPA', 'SHIKHARA', 'MODERN', 'COLONIAL',
    'GOTHIC', 'MUGHAL', 'DOME', 'MIXED', 'VERNACULAR', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create construction_material enum
DO $$ 
BEGIN
  CREATE TYPE construction_material AS ENUM (
    'STONE', 'BRICK', 'WOOD', 'MUD', 'CONCRETE', 'MARBLE', 'METAL', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create religious_significance enum
DO $$ 
BEGIN
  CREATE TYPE religious_significance AS ENUM (
    'LOCAL', 'REGIONAL', 'NATIONAL', 'INTERNATIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create preservation_status enum
DO $$ 
BEGIN
  CREATE TYPE preservation_status AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED', 'UNDER_RENOVATION', 'REBUILT'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the religious place table
CREATE TABLE IF NOT EXISTS acme_religious_place (
    id VARCHAR(36) PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL, -- SEO-friendly URL slug
    description TEXT,
    type religious_place_type NOT NULL,
    
    -- Location details
    ward_number INTEGER,
    location TEXT, -- Village/Tole/Area name
    address TEXT,
    
    -- Physical details
    area_in_square_meters DECIMAL(10,2),
    architectural_style architectural_style,
    construction_material construction_material,
    year_established INTEGER, -- Year it was first built
    year_renovated INTEGER, -- Year of latest major renovation
    
    -- Religious details
    main_deity TEXT, -- Primary deity or figure worshipped
    secondary_deities TEXT,
    religious_tradition TEXT, -- E.g., "Shaivism", "Vaishnavism", "Sufism"
    religious_significance religious_significance,
    religious_story TEXT, -- Mythology or story associated with the place
    
    -- Cultural and historical significance
    historical_significance TEXT,
    cultural_significance TEXT,
    is_heritage_site BOOLEAN DEFAULT false,
    heritage_designation TEXT, -- E.g., "UNESCO World Heritage", "National Monument"
    inscriptions TEXT, -- Details about any inscriptions
    has_archaeological_value BOOLEAN DEFAULT false,
    archaeological_details TEXT,
    
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
    total_building_count INTEGER,
    has_main_hall BOOLEAN DEFAULT false,
    main_hall_capacity INTEGER,
    has_community_space BOOLEAN DEFAULT false,
    has_accommodation BOOLEAN DEFAULT false,
    accommodation_capacity INTEGER,
    has_kitchen BOOLEAN DEFAULT false,
    has_dining_hall BOOLEAN DEFAULT false,
    dining_capacity INTEGER,
    has_library BOOLEAN DEFAULT false,
    has_museum BOOLEAN DEFAULT false,
    
    -- Facilities and amenities
    has_parking BOOLEAN DEFAULT false,
    parking_capacity INTEGER,
    has_toilets BOOLEAN DEFAULT false,
    has_handicap_access BOOLEAN DEFAULT false,
    has_electricity BOOLEAN DEFAULT true,
    has_water_supply BOOLEAN DEFAULT true,
    has_drinking_water BOOLEAN DEFAULT false,
    has_footwear_facility BOOLEAN DEFAULT false, -- For storage of shoes/footwear
    has_cloth_storage BOOLEAN DEFAULT false,
    
    -- Preservation and restoration
    preservation_status preservation_status,
    last_restoration_year INTEGER,
    restoration_details TEXT,
    has_regular_maintenance BOOLEAN DEFAULT false,
    maintenance_details TEXT,
    funding_source TEXT, -- Where restoration/maintenance funds come from
    
    -- Religious activities
    regular_prayers TEXT, -- Details about regular prayer times
    special_rituals TEXT, -- Specific rituals performed
    annual_festivals TEXT, -- Major annual events
    festival_months TEXT, -- E.g., "Baisakh, Dashain, Tihar"
    festival_details TEXT,
    special_offerings TEXT, -- E.g., "Prasad, Flowers, Incense"
    
    -- Visitor information
    estimated_daily_visitors INTEGER,
    estimated_yearly_visitors INTEGER,
    peak_visitation_months TEXT,
    has_overseas_visitors BOOLEAN DEFAULT false,
    guides_available BOOLEAN DEFAULT false,
    visitor_dress_code TEXT,
    photo_allowed BOOLEAN DEFAULT true,
    photo_restrictions TEXT,
    
    -- Community engagement
    community_benefits TEXT,
    social_services_offered TEXT,
    educational_activities TEXT,
    
    -- Economic aspects
    has_shops BOOLEAN DEFAULT false,
    shop_count INTEGER,
    shop_types TEXT, -- E.g., "Religious items, Souvenirs, Food"
    economic_impact TEXT, -- How it contributes to local economy
    total_annual_revenue DECIMAL(14,2),
    annual_operating_budget DECIMAL(14,2),
    
    -- Environmental aspects
    has_garden BOOLEAN DEFAULT false,
    garden_area_in_square_meters DECIMAL(10,2),
    has_significant_trees BOOLEAN DEFAULT false,
    significant_tree_details TEXT,
    has_water_body BOOLEAN DEFAULT false,
    water_body_details TEXT,
    
    -- Safety and security
    has_security_personnel BOOLEAN DEFAULT false,
    has_cctv BOOLEAN DEFAULT false,
    has_fire_safety BOOLEAN DEFAULT false,
    disaster_preparedness TEXT, -- Measures for earthquakes, floods, etc.
    
    -- Artworks and treasures
    has_significant_artwork BOOLEAN DEFAULT false,
    artwork_details TEXT, -- Details about murals, paintings, statues
    has_historical_artifacts BOOLEAN DEFAULT false,
    artifacts_details TEXT,
    has_registered_treasures BOOLEAN DEFAULT false,
    treasure_details TEXT,
    
    -- Challenges and needs
    current_challenges TEXT,
    conservation_needs TEXT,
    development_plans TEXT,
    
    -- Linkages to other entities
    linked_cultural_events JSONB DEFAULT '[]'::jsonb,
    linked_cultural_organizations JSONB DEFAULT '[]'::jsonb,
    
    -- SEO fields
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT,
    
    -- Geometry fields
    location_point GEOMETRY(Point, 4326),
    complex_boundary GEOMETRY(Polygon, 4326),
    
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
CREATE INDEX IF NOT EXISTS idx_religious_place_location_point 
    ON acme_religious_place USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_religious_place_boundary 
    ON acme_religious_place USING GIST (complex_boundary);

-- Create indexes for other common lookups
CREATE INDEX IF NOT EXISTS idx_religious_place_type 
    ON acme_religious_place(type);
CREATE INDEX IF NOT EXISTS idx_religious_place_name 
    ON acme_religious_place(name);
CREATE INDEX IF NOT EXISTS idx_religious_place_ward 
    ON acme_religious_place(ward_number);
CREATE INDEX IF NOT EXISTS idx_religious_place_style 
    ON acme_religious_place(architectural_style);
CREATE INDEX IF NOT EXISTS idx_religious_place_significance 
    ON acme_religious_place(religious_significance);
CREATE INDEX IF NOT EXISTS idx_religious_place_preservation 
    ON acme_religious_place(preservation_status);
CREATE INDEX IF NOT EXISTS idx_religious_place_is_verified 
    ON acme_religious_place(is_verified);
CREATE INDEX IF NOT EXISTS idx_religious_place_is_heritage 
    ON acme_religious_place(is_heritage_site);

-- Add index for the slug for faster lookups when accessing via SEO-friendly URLs
CREATE INDEX IF NOT EXISTS idx_religious_place_slug 
    ON acme_religious_place(slug);
