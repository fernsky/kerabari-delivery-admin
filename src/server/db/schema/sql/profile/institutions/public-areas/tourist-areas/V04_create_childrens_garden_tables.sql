-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Childrens garden type enum
DO $$ 
BEGIN
  CREATE TYPE childrens_garden_type AS ENUM (
    'PLAYGROUND', 'EDUCATIONAL_GARDEN', 'ADVENTURE_GARDEN', 'THERAPEUTIC_GARDEN',
    'SENSORY_GARDEN', 'FAIRY_GARDEN', 'INTERACTIVE_GARDEN', 'NATURE_PLAY_AREA',
    'WATER_PLAY_GARDEN', 'MIXED_TYPE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Age group focus enum
DO $$ 
BEGIN
  CREATE TYPE age_group_focus AS ENUM (
    'TODDLER', 'PRESCHOOL', 'ELEMENTARY', 'ALL_AGES', 
    'MIXED_AGE_SPECIFIC', 'INCLUSIVE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the childrens_garden table
CREATE TABLE IF NOT EXISTS acme_childrens_garden (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  garden_type childrens_garden_type NOT NULL,
  age_focus age_group_focus NOT NULL,
  status tourist_attraction_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  
  -- Basic information
  established_year INTEGER,
  ownership_type tourist_area_ownership_type NOT NULL,
  operating_organization TEXT,
  
  -- Physical characteristics
  total_area_sqm DECIMAL(10, 2),
  play_area_sqm DECIMAL(10, 2),
  garden_area_sqm DECIMAL(10, 2),
  landscaped_percentage INTEGER,
  terrain_type TEXT,
  
  -- Play equipment and features
  has_swings BOOLEAN DEFAULT true,
  swing_count INTEGER,
  has_slides BOOLEAN DEFAULT true,
  slide_count INTEGER,
  has_climbing_structures BOOLEAN DEFAULT true,
  climbing_structure_details TEXT,
  has_sandpit BOOLEAN DEFAULT false,
  sandpit_area_sqm DECIMAL(8, 2),
  has_water_play BOOLEAN DEFAULT false,
  water_play_features TEXT,
  has_musical_elements BOOLEAN DEFAULT false,
  musical_element_details TEXT,
  has_art_installations BOOLEAN DEFAULT false,
  art_installation_details TEXT,
  has_educational_elements BOOLEAN DEFAULT false,
  educational_element_details TEXT,
  has_interactive_features BOOLEAN DEFAULT false,
  interactive_feature_details TEXT,
  equipment_material TEXT,
  equipment_condition TEXT,
  last_equipment_upgrade_date DATE,
  
  -- Garden elements
  plant_species_count INTEGER,
  notable_plants TEXT,
  has_butterfly_garden BOOLEAN DEFAULT false,
  has_vegetable_garden BOOLEAN DEFAULT false,
  has_herb_garden BOOLEAN DEFAULT false,
  has_fruit_trees BOOLEAN DEFAULT false,
  fruit_tree_types TEXT,
  has_flower_beds BOOLEAN DEFAULT false,
  flower_types TEXT,
  has_sensory_plants BOOLEAN DEFAULT false,
  sensory_plant_details TEXT,
  seasonal_plantings TEXT,
  
  -- Facilities
  has_shade_structures BOOLEAN DEFAULT true,
  shade_structure_details TEXT,
  has_seating_for_adults BOOLEAN DEFAULT true,
  seating_capacity INTEGER,
  has_picnic_tables BOOLEAN DEFAULT false,
  picnic_table_count INTEGER,
  has_toilets BOOLEAN DEFAULT true,
  has_child_sized_toilets BOOLEAN DEFAULT false,
  has_baby_changing_facilities BOOLEAN DEFAULT false,
  has_drinking_water BOOLEAN DEFAULT true,
  has_handwashing_stations BOOLEAN DEFAULT true,
  has_fence_or_boundary BOOLEAN DEFAULT true,
  boundary_security_level TEXT,
  has_shelter BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_first_aid BOOLEAN DEFAULT true,
  
  -- Accessibility
  accessibility_level tourist_area_accessibility_level,
  distance_from_city_center_km DECIMAL(8, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  has_disabled_access BOOLEAN DEFAULT false,
  has_inclusive_play_equipment BOOLEAN DEFAULT false,
  inclusive_features TEXT,
  has_paved_pathways BOOLEAN DEFAULT true,
  stroller_accessibility TEXT,
  
  -- Administrative details
  maintenance_level maintenance_level,
  managed_by TEXT,
  staff_count INTEGER,
  has_garden_educator BOOLEAN DEFAULT false,
  has_play_supervisor BOOLEAN DEFAULT false,
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  
  -- Visitation
  average_daily_visitors INTEGER,
  busiest_time_of_day TEXT,
  peak_visiting_days TEXT,
  seasonal_usage_patterns TEXT,
  average_visit_duration_minutes INTEGER,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  seasonal_hours TEXT,
  
  -- Entrance and fees
  entrance_fee_type entrance_fee_type,
  entry_fee_npr DECIMAL(10, 2),
  annual_pass_available BOOLEAN DEFAULT false,
  annual_pass_fee_npr DECIMAL(10, 2),
  special_program_fees TEXT,
  
  -- Programs and activities
  educational_programs TEXT,
  regular_activities TEXT,
  special_events TEXT,
  seasonal_programs TEXT,
  has_guided_tours BOOLEAN DEFAULT false,
  has_gardening_programs BOOLEAN DEFAULT false,
  has_nature_programs BOOLEAN DEFAULT false,
  has_art_programs BOOLEAN DEFAULT false,
  
  -- Financial aspects
  annual_operating_cost_npr DECIMAL(14, 2),
  maintenance_budget_npr DECIMAL(14, 2),
  funding_sources TEXT,
  revenue_streams TEXT,
  has_community_support BOOLEAN DEFAULT false,
  community_support_details TEXT,
  
  -- Environmental aspects
  environmental_education_focus TEXT,
  sustainability_features TEXT,
  uses_organic_practices BOOLEAN DEFAULT false,
  water_conservation_measures TEXT,
  uses_renewable_energy BOOLEAN DEFAULT false,
  renewable_energy_details TEXT,
  
  -- Safety
  safety_measures TEXT,
  surface_materials TEXT,
  fall_protection_measures TEXT,
  equipment_safety_standard TEXT,
  safety_inspection_frequency TEXT,
  last_safety_inspection_date DATE,
  accident_history TEXT,
  emergency_procedures TEXT,
  
  -- Community impact
  school_usage TEXT,
  family_engagement TEXT,
  community_events TEXT,
  health_impact TEXT,
  educational_impact TEXT,
  
  -- Development and planning
  recent_improvements TEXT,
  planned_improvements TEXT,
  expansion_plans TEXT,
  maintenance_schedule TEXT,
  
  -- Issues and challenges
  maintenance_challenges TEXT,
  vandalism_issues TEXT,
  user_conflicts TEXT,
  safety_concerns TEXT,
  funding_challenges TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_phone TEXT,
  email TEXT,
  website TEXT,
  social_media TEXT,
  
  -- Reviews and feedback
  average_rating DECIMAL(3, 1),
  parent_feedback TEXT,
  child_feedback TEXT,
  educator_feedback TEXT,
  
  -- Linkages to other entities
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_daycare_centers JSONB DEFAULT '[]'::jsonb,
  linked_educational_programs JSONB DEFAULT '[]'::jsonb,
  linked_parks JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  garden_boundary GEOMETRY(Polygon, 4326),
  play_equipment_points GEOMETRY(MultiPoint, 4326),
  pathways GEOMETRY(MultiLineString, 4326),
  garden_beds GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_childrens_garden_location_point ON acme_childrens_garden USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_boundary ON acme_childrens_garden USING GIST (garden_boundary);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_equipment ON acme_childrens_garden USING GIST (play_equipment_points);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_pathways ON acme_childrens_garden USING GIST (pathways);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_beds ON acme_childrens_garden USING GIST (garden_beds);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_childrens_garden_name ON acme_childrens_garden(name);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_slug ON acme_childrens_garden(slug);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_type ON acme_childrens_garden(garden_type);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_age ON acme_childrens_garden(age_focus);
CREATE INDEX IF NOT EXISTS idx_childrens_garden_status ON acme_childrens_garden(status);
