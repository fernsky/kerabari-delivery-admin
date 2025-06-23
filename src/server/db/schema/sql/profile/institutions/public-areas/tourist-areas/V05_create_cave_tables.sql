-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Cave type enum
DO $$ 
BEGIN
  CREATE TYPE cave_type AS ENUM (
    'LIMESTONE_CAVE', 'LAVA_TUBE', 'SEA_CAVE', 'ROCK_SHELTER',
    'ICE_CAVE', 'TALUS_CAVE', 'SOLUTION_CAVE', 'EROSION_CAVE',
    'TECTONIC_CAVE', 'RELIGIOUS_CAVE', 'HISTORICAL_CAVE',
    'ARCHAEOLOGICAL_CAVE', 'MIXED_TYPE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Cave exploration difficulty enum
DO $$ 
BEGIN
  CREATE TYPE cave_difficulty_level AS ENUM (
    'EASY', 'MODERATE', 'CHALLENGING', 'DIFFICULT', 'EXPERT_ONLY',
    'UNEXPLORED', 'TECHNICAL', 'VARIABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the cave table
CREATE TABLE IF NOT EXISTS acme_cave (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  alternative_names TEXT,
  description TEXT,
  cave_type cave_type NOT NULL,
  status tourist_attraction_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  geographic_context TEXT,
  mountain_range TEXT,
  hiding_feature TEXT, -- e.g., "Located beneath a cliff face"
  
  -- Geological information
  geological_formation TEXT,
  rock_type TEXT,
  formation_age TEXT,
  formation_process TEXT,
  
  -- Physical characteristics
  entrance_count INTEGER,
  main_entrance_height_m DECIMAL(8, 2),
  main_entrance_width_m DECIMAL(8, 2),
  known_length_m DECIMAL(10, 2),
  maximum_depth_m DECIMAL(8, 2),
  temperature_range_c TEXT,
  humidity_percentage INTEGER,
  has_water_features BOOLEAN DEFAULT false,
  water_feature_details TEXT,
  has_stalactites BOOLEAN DEFAULT false,
  has_stalagmites BOOLEAN DEFAULT false,
  has_columns BOOLEAN DEFAULT false,
  has_flowstone BOOLEAN DEFAULT false,
  has_crystals BOOLEAN DEFAULT false,
  formation_details TEXT,
  notable_features TEXT,
  
  -- Biological features
  has_bat_population BOOLEAN DEFAULT false,
  bat_species TEXT,
  estimated_bat_count INTEGER,
  has_troglodytes BOOLEAN DEFAULT false, -- cave-dwelling species
  troglodyte_species TEXT,
  other_fauna TEXT,
  has_cave_flora BOOLEAN DEFAULT false,
  flora_details TEXT,
  ecological_significance TEXT,
  
  -- Discovery and exploration
  discovery_year INTEGER,
  discovered_by TEXT,
  exploration_history TEXT,
  most_recent_exploration_year INTEGER,
  exploration_status TEXT,
  has_been_fully_mapped BOOLEAN DEFAULT false,
  mapping_details TEXT,
  exploration_difficulty cave_difficulty_level,
  accessibility_level tourist_area_accessibility_level,
  requires_climbing_equipment BOOLEAN DEFAULT false,
  requires_swimming BOOLEAN DEFAULT false,
  technical_requirements TEXT,
  
  -- Tourism and access
  distance_from_city_center_km DECIMAL(8, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  trail_length_to_entrance_km DECIMAL(6, 2),
  trail_difficulty TEXT,
  is_open_to_public BOOLEAN DEFAULT true,
  tourist_accessible_length_m DECIMAL(8, 2),
  access_restrictions TEXT,
  requires_guide BOOLEAN DEFAULT false,
  guide_service_details TEXT,
  requires_permit BOOLEAN DEFAULT false,
  permit_details TEXT,
  
  -- Facilities
  has_developed_entrance BOOLEAN DEFAULT false,
  entrance_development_details TEXT,
  has_artificial_lighting BOOLEAN DEFAULT false,
  lighting_details TEXT,
  has_walkways BOOLEAN DEFAULT false,
  walkway_details TEXT,
  has_handrails BOOLEAN DEFAULT false,
  has_steps_or_ladders BOOLEAN DEFAULT false,
  has_interpretive_signs BOOLEAN DEFAULT false,
  has_visitor_center BOOLEAN DEFAULT false,
  visitor_center_facilities TEXT,
  has_parking BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_toilets BOOLEAN DEFAULT false,
  has_resting_areas BOOLEAN DEFAULT false,
  has_food_services BOOLEAN DEFAULT false,
  
  -- Safety
  safety_measures TEXT,
  known_hazards TEXT,
  emergency_protocols TEXT,
  rescue_equipment_available BOOLEAN DEFAULT false,
  mobile_reception_availability TEXT,
  accident_history TEXT,
  safety_equipment_required TEXT,
  safety_briefing_provided BOOLEAN DEFAULT true,
  
  -- Cultural and historical
  cultural_significance TEXT,
  historical_significance TEXT,
  archaeological_findings TEXT,
  has_rock_art BOOLEAN DEFAULT false,
  rock_art_details TEXT,
  has_artifacts BOOLEAN DEFAULT false,
  artifact_details TEXT,
  has_religious_significance BOOLEAN DEFAULT false,
  religious_significance_details TEXT,
  local_legends TEXT,
  indigenous_knowledge TEXT,
  
  -- Administrative details
  ownership_type tourist_area_ownership_type,
  managed_by TEXT,
  management_plan_exists BOOLEAN DEFAULT false,
  protection_status TEXT,
  protected_since_year INTEGER,
  research_restrictions TEXT,
  
  -- Visitation
  average_daily_visitors INTEGER,
  annual_visitors INTEGER,
  peak_visiting_months TEXT,
  peak_visiting_days TEXT,
  maximum_group_size INTEGER,
  visit_duration_minutes INTEGER,
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  seasonal_accessibility TEXT,
  
  -- Entrance and fees
  entrance_fee_type entrance_fee_type,
  entry_fee_npr DECIMAL(10, 2),
  guide_fee_npr DECIMAL(10, 2),
  equipment_rental_fee_npr DECIMAL(10, 2),
  annual_fee_revenue_npr DECIMAL(14, 2),
  
  -- Conservation
  conservation_status tourist_area_conservation_status,
  conservation_challenges TEXT,
  conservation_measures TEXT,
  monitoring_programs TEXT,
  monitoring_frequency TEXT,
  rehabilitation_efforts TEXT,
  
  -- Research and education
  scientific_importance TEXT,
  research_studies TEXT,
  ongoing_research TEXT,
  educational_programs TEXT,
  educational_materials TEXT,
  
  -- Development and planning
  recent_developments TEXT,
  planned_improvements TEXT,
  tourist_potential TEXT,
  
  -- Issues and challenges
  environmental_threats TEXT,
  vandalism_issues TEXT,
  visitor_impact TEXT,
  management_challenges TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  website TEXT,
  
  -- Media and marketing
  has_brochure BOOLEAN DEFAULT false,
  has_virtual_tour BOOLEAN DEFAULT false,
  virtual_tour_url TEXT,
  promotional_activities TEXT,
  
  -- Linkages to other entities
  linked_attractions JSONB DEFAULT '[]'::jsonb,
  linked_trails JSONB DEFAULT '[]'::jsonb,
  linked_tour_operators JSONB DEFAULT '[]'::jsonb,
  linked_research_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  entrance_point GEOMETRY(Point, 4326),
  cave_extent GEOMETRY(Polygon, 4326),
  access_route GEOMETRY(LineString, 4326),
  cave_system_line GEOMETRY(MultiLineString, 4326), -- For cave mapping
  
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
CREATE INDEX IF NOT EXISTS idx_cave_entrance_point ON acme_cave USING GIST (entrance_point);
CREATE INDEX IF NOT EXISTS idx_cave_extent ON acme_cave USING GIST (cave_extent);
CREATE INDEX IF NOT EXISTS idx_cave_access_route ON acme_cave USING GIST (access_route);
CREATE INDEX IF NOT EXISTS idx_cave_system_line ON acme_cave USING GIST (cave_system_line);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_cave_name ON acme_cave(name);
CREATE INDEX IF NOT EXISTS idx_cave_slug ON acme_cave(slug);
CREATE INDEX IF NOT EXISTS idx_cave_type ON acme_cave(cave_type);
CREATE INDEX IF NOT EXISTS idx_cave_status ON acme_cave(status);
CREATE INDEX IF NOT EXISTS idx_cave_difficulty ON acme_cave(exploration_difficulty);
