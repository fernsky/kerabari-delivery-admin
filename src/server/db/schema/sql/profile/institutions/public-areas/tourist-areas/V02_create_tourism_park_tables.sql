-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Tourism park type enum
DO $$ 
BEGIN
  CREATE TYPE tourism_park_type AS ENUM (
    'RECREATIONAL_PARK', 'THEME_PARK', 'WATER_PARK', 'AMUSEMENT_PARK',
    'CULTURAL_PARK', 'ECOLOGICAL_PARK', 'ADVENTURE_PARK', 'HERITAGE_PARK',
    'URBAN_PARK', 'SCULPTURE_PARK', 'BIODIVERSITY_PARK', 'MIXED_TYPE',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the tourism_park table
CREATE TABLE IF NOT EXISTS acme_tourism_park (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  park_type tourism_park_type NOT NULL,
  status tourist_attraction_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  
  -- Basic information
  establishment_year INTEGER,
  ownership_type tourist_area_ownership_type NOT NULL,
  operating_organization TEXT,
  registration_number VARCHAR(50),
  registered_with TEXT,
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  landscaped_area_hectares DECIMAL(10, 2),
  forested_area_hectares DECIMAL(10, 2),
  water_body_area_hectares DECIMAL(10, 2),
  terrain_type TEXT,
  
  -- Attractions and features
  main_attractions TEXT,
  has_rides BOOLEAN DEFAULT false,
  rides_count INTEGER,
  ride_types TEXT,
  has_water_features BOOLEAN DEFAULT false,
  water_feature_details TEXT,
  has_gardens BOOLEAN DEFAULT false,
  garden_types TEXT,
  has_playground BOOLEAN DEFAULT false,
  playground_details TEXT,
  has_walking_paths BOOLEAN DEFAULT false,
  walking_path_length_km DECIMAL(6, 2),
  has_viewpoints BOOLEAN DEFAULT false,
  viewpoint_details TEXT,
  has_cultural_elements BOOLEAN DEFAULT false,
  cultural_element_details TEXT,
  has_historical_elements BOOLEAN DEFAULT false,
  historical_element_details TEXT,
  
  -- Flora and fauna
  notable_flora TEXT,
  notable_fauna TEXT,
  tree_species TEXT,
  tree_count INTEGER,
  endangered_species TEXT,
  
  -- Facilities
  has_entrance_gate BOOLEAN DEFAULT true,
  number_of_gates INTEGER,
  has_toilets BOOLEAN DEFAULT true,
  toilet_details TEXT,
  has_parking BOOLEAN DEFAULT true,
  parking_capacity INTEGER,
  has_food_outlets BOOLEAN DEFAULT false,
  food_outlet_count INTEGER,
  has_shops BOOLEAN DEFAULT false,
  shop_count INTEGER,
  has_picnic_areas BOOLEAN DEFAULT false,
  picnic_area_details TEXT,
  has_seating BOOLEAN DEFAULT true,
  seating_capacity INTEGER,
  has_shelters BOOLEAN DEFAULT false,
  shelter_count INTEGER,
  has_camping_facilities BOOLEAN DEFAULT false,
  camping_details TEXT,
  has_first_aid BOOLEAN DEFAULT false,
  has_information_center BOOLEAN DEFAULT false,
  has_wifi BOOLEAN DEFAULT false,
  
  -- Accessibility
  accessibility_level tourist_area_accessibility_level,
  distance_from_city_center_km DECIMAL(8, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  has_disabled_access BOOLEAN DEFAULT false,
  disabled_access_details TEXT,
  
  -- Administrative details
  maintenance_level maintenance_level,
  managed_by TEXT,
  staff_count INTEGER,
  security_personnel_count INTEGER,
  has_management_plan BOOLEAN DEFAULT false,
  management_plan_details TEXT,
  
  -- Visitation
  average_daily_visitors INTEGER,
  annual_visitors INTEGER,
  peak_visiting_months TEXT,
  peak_visiting_days TEXT,
  visit_frequency visit_frequency,
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  seasonal_operation TEXT,
  closed_during TEXT,
  
  -- Entrance and fees
  entrance_fee_type entrance_fee_type,
  adult_entry_fee_npr DECIMAL(10, 2),
  child_entry_fee_npr DECIMAL(10, 2),
  foreigner_entry_fee_npr DECIMAL(10, 2),
  group_discounts_available BOOLEAN DEFAULT false,
  fee_collection_method TEXT,
  annual_fee_revenue_npr DECIMAL(14, 2),
  
  -- Financial aspects
  annual_operating_cost_npr DECIMAL(14, 2),
  funding_sources TEXT,
  revenue_streams TEXT,
  is_profitable BOOLEAN DEFAULT false,
  has_entry_ticket_system BOOLEAN DEFAULT false,
  ticket_system_details TEXT,
  
  -- Environmental aspects
  environmental_issues TEXT,
  waste_management_system TEXT,
  has_recycling_program BOOLEAN DEFAULT false,
  water_conservation_measures TEXT,
  energy_sources TEXT,
  has_renewable_energy BOOLEAN DEFAULT false,
  renewable_energy_details TEXT,
  
  -- Conservation and sustainability
  conservation_status tourist_area_conservation_status,
  conservation_efforts TEXT,
  sustainable_practices TEXT,
  ecological_challenges TEXT,
  biodiversity_management TEXT,
  
  -- Community impact
  economic_impact TEXT,
  employment_generation INTEGER,
  community_involvement TEXT,
  community_benefits TEXT,
  educational_value TEXT,
  
  -- Events and activities
  regular_events TEXT,
  major_annual_events TEXT,
  recreational_activities TEXT,
  educational_programs TEXT,
  
  -- Development and planning
  recent_developments TEXT,
  ongoing_projects TEXT,
  future_development_plans TEXT,
  expansion_plans TEXT,
  investment_needs TEXT,
  
  -- Issues and challenges
  visitor_management_challenges TEXT,
  maintenance_challenges TEXT,
  financial_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  
  -- Safety and security
  safety_measures TEXT,
  emergency_protocols TEXT,
  has_cctv BOOLEAN DEFAULT false,
  accident_history TEXT,
  
  -- Contact information
  manager_name TEXT,
  manager_phone TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Media and marketing
  has_brochure BOOLEAN DEFAULT false,
  has_social_media_presence BOOLEAN DEFAULT false,
  facebook_page TEXT,
  instagram_handle TEXT,
  promotional_activities TEXT,
  
  -- Reviews and ratings
  average_rating DECIMAL(3, 1),
  visitor_feedback_mechanism TEXT,
  common_visitor_complaints TEXT,
  
  -- Linkages to other entities
  linked_attractions JSONB DEFAULT '[]'::jsonb,
  linked_tour_packages JSONB DEFAULT '[]'::jsonb,
  linked_hotels JSONB DEFAULT '[]'::jsonb,
  linked_restaurants JSONB DEFAULT '[]'::jsonb,
  linked_transportation_services JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  park_boundary GEOMETRY(Polygon, 4326),
  walkways GEOMETRY(MultiLineString, 4326),
  key_attractions_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_tourism_park_location_point ON acme_tourism_park USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_tourism_park_boundary ON acme_tourism_park USING GIST (park_boundary);
CREATE INDEX IF NOT EXISTS idx_tourism_park_walkways ON acme_tourism_park USING GIST (walkways);
CREATE INDEX IF NOT EXISTS idx_tourism_park_attractions_points ON acme_tourism_park USING GIST (key_attractions_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_tourism_park_name ON acme_tourism_park(name);
CREATE INDEX IF NOT EXISTS idx_tourism_park_slug ON acme_tourism_park(slug);
CREATE INDEX IF NOT EXISTS idx_tourism_park_type ON acme_tourism_park(park_type);
CREATE INDEX IF NOT EXISTS idx_tourism_park_status ON acme_tourism_park(status);
CREATE INDEX IF NOT EXISTS idx_tourism_park_ownership ON acme_tourism_park(ownership_type);
