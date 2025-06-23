-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Picnic spot type enum
DO $$ 
BEGIN
  CREATE TYPE picnic_spot_type AS ENUM (
    'RIVERSIDE', 'LAKESIDE', 'HILLTOP', 'FOREST', 'GARDEN', 
    'PUBLIC_PARK', 'WATERFALL_AREA', 'MEADOW', 'BEACH', 
    'ORCHARD', 'MIXED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the picnic_spot table
CREATE TABLE IF NOT EXISTS acme_picnic_spot (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  spot_type picnic_spot_type NOT NULL,
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
  total_area_hectares DECIMAL(10, 2),
  terrain_type TEXT,
  vegetation_type TEXT,
  landscape_features TEXT,
  view_description TEXT,
  water_bodies_nearby TEXT,
  
  -- Facilities
  has_shelters BOOLEAN DEFAULT false,
  shelter_count INTEGER,
  shelter_types TEXT,
  has_benches BOOLEAN DEFAULT true,
  bench_count INTEGER,
  has_picnic_tables BOOLEAN DEFAULT true,
  picnic_table_count INTEGER,
  has_grilling_facilities BOOLEAN DEFAULT false,
  grilling_facility_count INTEGER,
  has_trash_bins BOOLEAN DEFAULT true,
  trash_bin_count INTEGER,
  has_toilets BOOLEAN DEFAULT false,
  toilet_details TEXT,
  has_water_source BOOLEAN DEFAULT false,
  water_source_details TEXT,
  has_playground BOOLEAN DEFAULT false,
  playground_equipment TEXT,
  has_sports_facilities BOOLEAN DEFAULT false,
  sports_facilities_details TEXT,
  has_parking BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_electricity BOOLEAN DEFAULT false,
  has_lighting BOOLEAN DEFAULT false,
  lighting_details TEXT,
  
  -- Accessibility
  accessibility_level tourist_area_accessibility_level,
  distance_from_city_center_km DECIMAL(8, 2),
  distance_from_main_road_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  has_disabled_access BOOLEAN DEFAULT false,
  disabled_access_details TEXT,
  trail_conditions TEXT,
  
  -- Administrative details
  maintenance_level maintenance_level,
  managed_by TEXT,
  staff_count INTEGER,
  security_personnel_count INTEGER,
  
  -- Visitation
  average_daily_visitors INTEGER,
  annual_visitors INTEGER,
  peak_visiting_months TEXT,
  peak_visiting_days TEXT,
  visit_frequency visit_frequency,
  is_accessible_all_year BOOLEAN DEFAULT true,
  seasonal_accessibility TEXT,
  popular_visiting_times TEXT,
  
  -- Entrance and fees
  entrance_fee_type entrance_fee_type,
  entry_fee_npr DECIMAL(10, 2),
  group_usage_fee_npr DECIMAL(10, 2),
  reservation_required BOOLEAN DEFAULT false,
  reservation_process TEXT,
  facility_rental_fees_npr DECIMAL(10, 2),
  
  -- Financial aspects
  annual_maintenance_cost_npr DECIMAL(14, 2),
  funding_sources TEXT,
  revenue_streams TEXT,
  
  -- Environmental aspects
  environmental_issues TEXT,
  waste_management_system TEXT,
  has_recycling_program BOOLEAN DEFAULT false,
  fire_safety_measures TEXT,
  
  -- Conservation and sustainability
  conservation_status tourist_area_conservation_status,
  conservation_efforts TEXT,
  sustainable_practices TEXT,
  ecological_challenges TEXT,
  
  -- Community impact
  community_use TEXT,
  social_significance TEXT,
  cultural_importance TEXT,
  special_events_hosted TEXT,
  
  -- Activities
  common_activities TEXT,
  permitted_activities TEXT,
  prohibited_activities TEXT,
  seasonal_activities TEXT,
  
  -- Development and planning
  recent_improvements TEXT,
  planned_improvements TEXT,
  expansion_potential TEXT,
  
  -- Issues and challenges
  visitor_management_challenges TEXT,
  maintenance_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  
  -- Safety and security
  safety_measures TEXT,
  known_hazards TEXT,
  emergency_contacts TEXT,
  first_aid_availability TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  booking_information TEXT,
  
  -- Media and marketing
  has_signage BOOLEAN DEFAULT false,
  promotional_activities TEXT,
  
  -- Reviews and ratings
  average_rating DECIMAL(3, 1),
  visitor_feedback TEXT,
  
  -- Weather and climate
  best_season_to_visit TEXT,
  weather_considerations TEXT,
  shaded_area_percentage INTEGER,
  
  -- Linkages to other entities
  linked_attractions JSONB DEFAULT '[]'::jsonb,
  linked_tour_packages JSONB DEFAULT '[]'::jsonb,
  linked_accommodations JSONB DEFAULT '[]'::jsonb,
  linked_food_services JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  spot_boundary GEOMETRY(Polygon, 4326),
  access_paths GEOMETRY(MultiLineString, 4326),
  facility_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_picnic_spot_location_point ON acme_picnic_spot USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_boundary ON acme_picnic_spot USING GIST (spot_boundary);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_access_paths ON acme_picnic_spot USING GIST (access_paths);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_facility_points ON acme_picnic_spot USING GIST (facility_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_picnic_spot_name ON acme_picnic_spot(name);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_slug ON acme_picnic_spot(slug);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_type ON acme_picnic_spot(spot_type);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_status ON acme_picnic_spot(status);
CREATE INDEX IF NOT EXISTS idx_picnic_spot_ownership ON acme_picnic_spot(ownership_type);
