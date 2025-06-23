-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Viewpoint type enum
DO $$ 
BEGIN
  CREATE TYPE viewpoint_type AS ENUM (
    'MOUNTAINTOP', 'HILLSIDE', 'LAKESIDE', 'RIVERSIDE', 'CLIFF_EDGE',
    'OBSERVATION_TOWER', 'LOOKOUT_PLATFORM', 'SCENIC_OVERLOOK',
    'ROOFTOP', 'TEMPLE_VIEWPOINT', 'FORT_VIEWPOINT', 'GEOLOGICAL_FEATURE',
    'URBAN_VIEWPOINT', 'ROADSIDE_VIEWPOINT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the viewpoint table
CREATE TABLE IF NOT EXISTS acme_viewpoint (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  viewpoint_type viewpoint_type NOT NULL,
  status tourist_attraction_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  
  -- Basic information
  since_year INTEGER,
  ownership_type tourist_area_ownership_type NOT NULL,
  operating_organization TEXT,
  
  -- Physical characteristics
  terrain_type TEXT,
  natural_feature_type TEXT,
  vista_description TEXT,
  viewing_radius_km DECIMAL(6, 2),
  viewing_angle_degrees INTEGER,
  visibility_conditions TEXT,
  best_visibility_season TEXT,
  best_visibility_time TEXT,
  sunrise_visibility BOOLEAN DEFAULT true,
  sunset_visibility BOOLEAN DEFAULT true,
  night_view_quality TEXT,
  light_pollution_level TEXT,
  notable_landmarks_visible TEXT,
  notable_geographic_features_visible TEXT,
  
  -- Facilities
  has_viewing_platform BOOLEAN DEFAULT false,
  platform_material TEXT,
  platform_area_sqm DECIMAL(8, 2),
  platform_capacity INTEGER,
  has_telescopes BOOLEAN DEFAULT false,
  telescope_count INTEGER,
  has_interpretation_panels BOOLEAN DEFAULT false,
  interpretation_panel_count INTEGER,
  panel_languages TEXT,
  has_seating BOOLEAN DEFAULT false,
  seating_capacity INTEGER,
  has_railings BOOLEAN DEFAULT true,
  railing_type TEXT,
  has_shelters BOOLEAN DEFAULT false,
  shelter_type TEXT,
  has_toilets BOOLEAN DEFAULT false,
  toilet_details TEXT,
  has_parking BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_food_services BOOLEAN DEFAULT false,
  food_service_details TEXT,
  has_souvenir_shop BOOLEAN DEFAULT false,
  has_waste_bins BOOLEAN DEFAULT true,
  has_lighting BOOLEAN DEFAULT false,
  lighting_details TEXT,
  
  -- Accessibility
  accessibility_level tourist_area_accessibility_level,
  distance_from_city_center_km DECIMAL(8, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  trail_length_to_viewpoint_km DECIMAL(6, 2),
  trail_difficulty TEXT,
  hiking_time_minutes INTEGER,
  public_transport_accessibility TEXT,
  has_disabled_access BOOLEAN DEFAULT false,
  disabled_access_details TEXT,
  last_mile_connectivity TEXT,
  
  -- Administrative details
  maintenance_level maintenance_level,
  managed_by TEXT,
  staff_count INTEGER,
  security_personnel_count INTEGER,
  management_challenges TEXT,
  
  -- Visitation
  average_daily_visitors INTEGER,
  annual_visitors INTEGER,
  peak_visiting_months TEXT,
  peak_visiting_days TEXT,
  popular_viewing_times TEXT,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  seasonal_restrictions TEXT,
  
  -- Entrance and fees
  entrance_fee_type entrance_fee_type,
  entry_fee_npr DECIMAL(10, 2),
  telescope_usage_fee_npr DECIMAL(10, 2),
  photography_fee_npr DECIMAL(10, 2),
  commercial_filming_fee_npr DECIMAL(10, 2),
  
  -- Photography aspects
  photography_popularity TEXT,
  popular_photography_subjects TEXT,
  photography_challenges TEXT,
  best_photography_conditions TEXT,
  drone_usage_allowed BOOLEAN DEFAULT false,
  drone_usage_restrictions TEXT,
  
  -- Cultural and historical
  cultural_significance TEXT,
  historical_significance TEXT,
  religious_significance TEXT,
  traditional_importance TEXT,
  local_stories TEXT,
  associated_events TEXT,
  
  -- Environmental aspects
  environmental_sensitivity TEXT,
  environmental_threats TEXT,
  conservation_measures TEXT,
  human_impact TEXT,
  erosion_issues TEXT,
  
  -- Weather and climate
  microclimate TEXT,
  temperature_range_c TEXT,
  average_annual_rainfall_mm DECIMAL(8, 2),
  weather_hazards TEXT,
  weather_constraints TEXT,
  
  -- Safety
  safety_measures TEXT,
  known_hazards TEXT,
  safety_incidents TEXT,
  warning_signs_present BOOLEAN DEFAULT true,
  emergency_access TEXT,
  cell_phone_reception TEXT,
  nearest_medical_facility_km DECIMAL(8, 2),
  
  -- Development and planning
  recent_improvements TEXT,
  planned_improvements TEXT,
  future_development_vision TEXT,
  visitor_management_plan TEXT,
  
  -- Tourism aspects
  tourism_importance TEXT,
  inclusion_in_tour_packages BOOLEAN DEFAULT false,
  tourism_potential TEXT,
  visitor_experience TEXT,
  
  -- Economic impact
  local_employment_generated INTEGER,
  revenue_for_local_economy TEXT,
  local_entrepreneurship_opportunities TEXT,
  
  -- Publicity and promotion
  featured_in_publications TEXT,
  media_coverage TEXT,
  social_media_popularity TEXT,
  promotional_activities TEXT,
  
  -- Reviews and ratings
  average_rating DECIMAL(3, 1),
  visitor_feedback TEXT,
  tripadvisor_rating DECIMAL(3, 1),
  google_rating DECIMAL(3, 1),
  
  -- Contact information
  contact_person TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  website TEXT,
  
  -- Educational aspects
  educational_value TEXT,
  geological_information TEXT,
  geographical_information TEXT,
  historical_information TEXT,
  cultural_information TEXT,
  
  -- Linkages to other entities
  linked_attractions JSONB DEFAULT '[]'::jsonb,
  linked_trails JSONB DEFAULT '[]'::jsonb,
  linked_tour_packages JSONB DEFAULT '[]'::jsonb,
  linked_accommodation JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  viewpoint_area GEOMETRY(Polygon, 4326),
  access_path GEOMETRY(LineString, 4326),
  viewing_cone GEOMETRY(Polygon, 4326), -- Represents the actual visible area
  
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
CREATE INDEX IF NOT EXISTS idx_viewpoint_location_point ON acme_viewpoint USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_viewpoint_area ON acme_viewpoint USING GIST (viewpoint_area);
CREATE INDEX IF NOT EXISTS idx_viewpoint_access_path ON acme_viewpoint USING GIST (access_path);
CREATE INDEX IF NOT EXISTS idx_viewpoint_viewing_cone ON acme_viewpoint USING GIST (viewing_cone);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_viewpoint_name ON acme_viewpoint(name);
CREATE INDEX IF NOT EXISTS idx_viewpoint_slug ON acme_viewpoint(slug);
CREATE INDEX IF NOT EXISTS idx_viewpoint_type ON acme_viewpoint(viewpoint_type);
CREATE INDEX IF NOT EXISTS idx_viewpoint_status ON acme_viewpoint(status);
CREATE INDEX IF NOT EXISTS idx_viewpoint_ownership ON acme_viewpoint(ownership_type);
