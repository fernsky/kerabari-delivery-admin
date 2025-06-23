-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Resting place type enum
DO $$ 
BEGIN
  CREATE TYPE resting_place_type AS ENUM (
    'TRADITIONAL_CHAUTARI', 'MODERN_WAITING_AREA', 'BUS_STOP_SHELTER', 
    'ROADSIDE_REST_AREA', 'PARK_RESTING_AREA', 'COVERED_PAVILION',
    'TOURIST_REST_STOP', 'MARKET_WAITING_AREA', 'TRANSIT_WAITING_AREA',
    'MULTIPURPOSE_REST_AREA', 'PEDESTRIAN_REST_AREA', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Resting place construction type enum
DO $$ 
BEGIN
  CREATE TYPE resting_place_construction_type AS ENUM (
    'TRADITIONAL_STONE_PLATFORM', 'CONCRETE_STRUCTURE', 'WOODEN_STRUCTURE',
    'STONE_AND_WOOD', 'METAL_STRUCTURE', 'BRICK_AND_CONCRETE',
    'BAMBOO_STRUCTURE', 'MIXED_MATERIALS', 'MODERN_PREFABRICATED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Shade type enum
DO $$ 
BEGIN
  CREATE TYPE shade_type AS ENUM (
    'NATURAL_TREE_SHADE', 'PERMANENT_ROOF', 'SEMI_PERMANENT_CANOPY',
    'THATCHED_ROOF', 'METAL_ROOF', 'TILED_ROOF', 'CONCRETE_ROOF',
    'FABRIC_SHADE', 'NO_SHADE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Resting place management type enum
DO $$ 
BEGIN
  CREATE TYPE resting_place_management_type AS ENUM (
    'GOVERNMENT_MANAGED', 'MUNICIPALITY_MANAGED', 'COMMUNITY_MANAGED',
    'PRIVATELY_MANAGED', 'USER_COMMITTEE_MANAGED', 'UNMANAGED',
    'NGO_MANAGED', 'TEMPLE_TRUST_MANAGED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Cultural significance enum
DO $$ 
BEGIN
  CREATE TYPE cultural_significance AS ENUM (
    'HIGH_HISTORICAL_VALUE', 'COMMUNITY_LANDMARK', 'MODERN_SIGNIFICANCE',
    'RELIGIOUS_SIGNIFICANCE', 'TRADITIONAL_GATHERING_PLACE', 'TOURIST_ATTRACTION',
    'MINIMAL_SIGNIFICANCE', 'NO_PARTICULAR_SIGNIFICANCE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the resting_place table
CREATE TABLE IF NOT EXISTS acme_resting_place (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  resting_place_type resting_place_type NOT NULL,
  local_name TEXT, -- Local name like "Chautari", "Chautara", etc.
  
  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  address TEXT,
  landmark TEXT, -- Nearby landmark for easy identification
  location_type TEXT, -- Road junction, trail point, marketplace, etc.
  
  -- Basic information
  established_year INTEGER,
  construction_type resting_place_construction_type NOT NULL,
  management_type resting_place_management_type,
  managing_body TEXT, -- Name of the committee/organization managing if any
  has_dedicated_caretaker BOOLEAN DEFAULT false,
  
  -- Historical and cultural significance
  historical_background TEXT,
  cultural_significance cultural_significance,
  associated_stories TEXT,
  design_significance TEXT,
  is_heritage_structure BOOLEAN DEFAULT false,
  heritage_designation_details TEXT,
  
  -- Physical infrastructure
  total_area_sqm DECIMAL(10, 2),
  platform_height_cm INTEGER, -- Especially for Chautari
  seating_capacity INTEGER,
  shade_type shade_type,
  has_tree_plantation BOOLEAN DEFAULT false,
  tree_count INTEGER,
  tree_species TEXT,
  tree_age_estimate_years INTEGER,
  building_condition TEXT,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  
  -- Facilities
  has_seating_benches BOOLEAN DEFAULT true,
  bench_count INTEGER,
  bench_material TEXT,
  has_water_facility BOOLEAN DEFAULT false,
  water_facility_type TEXT,
  has_trash_bins BOOLEAN DEFAULT false,
  trash_bin_count INTEGER,
  has_information_board BOOLEAN DEFAULT false,
  information_board_details TEXT,
  has_electricity BOOLEAN DEFAULT false,
  has_lighting BOOLEAN DEFAULT false,
  lighting_type TEXT,
  has_wifi BOOLEAN DEFAULT false,
  has_mobile_charging_station BOOLEAN DEFAULT false,
  has_toilet_nearby BOOLEAN DEFAULT false,
  distance_to_nearest_toilet_meters INTEGER,
  has_shops_nearby BOOLEAN DEFAULT false,
  shop_types TEXT,
  
  -- Additional features
  has_public_phone BOOLEAN DEFAULT false,
  has_emergency_contact_info BOOLEAN DEFAULT false,
  has_shelter_from_rain BOOLEAN DEFAULT false,
  has_view_point BOOLEAN DEFAULT false,
  view_description TEXT,
  has_garden_area BOOLEAN DEFAULT false,
  garden_area_sqm DECIMAL(10, 2),
  has_public_art BOOLEAN DEFAULT false,
  public_art_description TEXT,
  
  -- Accessibility
  accessibility_level TEXT,
  distance_from_main_road_meters INTEGER,
  has_wheelchair_access BOOLEAN DEFAULT false,
  has_clear_directional_signs BOOLEAN DEFAULT false,
  public_transport_accessibility TEXT,
  
  -- Usage and function
  usage_intensity usage_intensity,
  primary_user_groups TEXT, -- Local residents, travelers, etc.
  used_for_community_gatherings BOOLEAN DEFAULT false,
  community_gathering_types TEXT,
  used_for_commercial_purposes BOOLEAN DEFAULT false,
  commercial_use_details TEXT,
  seasonal_usage_pattern TEXT,
  
  -- Maintenance and upkeep
  maintenance_responsibility maintenance_responsibility,
  maintenance_frequency TEXT,
  last_maintenance_date DATE,
  cleanliness_level cleanliness_level,
  has_regular_cleaning BOOLEAN DEFAULT false,
  cleaning_frequency cleaning_frequency,
  annual_maintenance_budget_npr DECIMAL(10, 2),
  maintenance_funding_source TEXT,
  
  -- Safety and security
  safety_rating TEXT,
  lighting_after_dark BOOLEAN DEFAULT false,
  security_concerns TEXT,
  has_nearby_police_post BOOLEAN DEFAULT false,
  distance_to_nearest_police_post_km DECIMAL(5, 2),
  
  -- Environmental aspects
  environmental_concerns TEXT,
  drainage_facility BOOLEAN DEFAULT false,
  drainage_condition TEXT,
  flood_risk_level TEXT,
  has_antilittering_measures BOOLEAN DEFAULT false,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  maintenance_challenges TEXT,
  user_challenges TEXT,
  improvement_needs TEXT,
  
  -- Future plans
  planned_upgrades TEXT,
  community_recommendations TEXT,
  local_government_plans TEXT,
  
  -- Related attractions
  nearby_attractions TEXT,
  distance_to_nearest_tourist_spot_km DECIMAL(5, 2),
  part_of_trail_network BOOLEAN DEFAULT false,
  trail_network_details TEXT,
  
  -- Contact information
  contact_person_name TEXT,
  contact_phone TEXT,
  alternate_contact_details TEXT,
  
  -- Community involvement
  community_contribution_history TEXT,
  volunteer_involvement TEXT,
  local_support_level TEXT,
  
  -- Linkages to other entities
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_trails JSONB DEFAULT '[]'::jsonb,
  linked_tourist_sites JSONB DEFAULT '[]'::jsonb,
  linked_public_toilets JSONB DEFAULT '[]'::jsonb,
  linked_transport_stops JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  structure_footprint GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_resting_place_location_point ON acme_resting_place USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_resting_place_structure_footprint ON acme_resting_place USING GIST (structure_footprint);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_resting_place_name ON acme_resting_place(name);
CREATE INDEX IF NOT EXISTS idx_resting_place_slug ON acme_resting_place(slug);
CREATE INDEX IF NOT EXISTS idx_resting_place_type ON acme_resting_place(resting_place_type);
CREATE INDEX IF NOT EXISTS idx_resting_place_construction_type ON acme_resting_place(construction_type);
CREATE INDEX IF NOT EXISTS idx_resting_place_management_type ON acme_resting_place(management_type);
