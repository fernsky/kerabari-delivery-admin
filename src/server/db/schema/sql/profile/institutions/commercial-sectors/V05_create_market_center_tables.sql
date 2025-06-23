-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define market center type enum
DO $$ 
BEGIN
  CREATE TYPE market_center_type AS ENUM (
    'TRADITIONAL_MARKET',
    'MODERN_SHOPPING_COMPLEX',
    'MIXED_USE_COMMERCIAL_CENTER',
    'SPECIALTY_MARKET',
    'BUSINESS_DISTRICT',
    'TRADING_HUB',
    'RETAIL_CORRIDOR',
    'WHOLESALE_MARKET_CENTER',
    'TRANSIT_ORIENTED_MARKET',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define market center scale enum
DO $$ 
BEGIN
  CREATE TYPE market_center_scale AS ENUM (
    'LOCAL',
    'NEIGHBORHOOD',
    'WARD_LEVEL',
    'MUNICIPALITY_LEVEL', 
    'DISTRICT_LEVEL',
    'REGIONAL',
    'NATIONAL'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the market center table
CREATE TABLE IF NOT EXISTS acme_market_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  center_type market_center_type NOT NULL,
  market_scale market_center_scale NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  gps_coordinates TEXT,
  catchment_area_radius_km DECIMAL(6, 2),
  population_served INTEGER,
  
  -- Basic information
  established_year INTEGER,
  historical_significance TEXT,
  ownership_type business_ownership_type,
  management_entity TEXT,
  registration_status TEXT,
  
  -- Physical characteristics
  total_area_hectares DECIMAL(10, 2),
  built_up_area_sq_m DECIMAL(10, 2),
  open_space_percentage DECIMAL(5, 2),
  total_buildings INTEGER,
  spatial_layout_description TEXT,
  
  -- Business composition
  total_business_units INTEGER,
  retail_shop_count INTEGER,
  wholesale_business_count INTEGER,
  service_provider_count INTEGER,
  food_establishment_count INTEGER,
  financial_service_provider_count INTEGER,
  primary_business_types TEXT,
  specialty_products TEXT,
  anchor_businesses TEXT,
  
  -- Market infrastructure
  infrastructure_condition facility_condition,
  has_dedicated_loading_area BOOLEAN DEFAULT false,
  has_storage_facilities BOOLEAN DEFAULT false,
  storage_capacity_details TEXT,
  has_cold_storage BOOLEAN DEFAULT false,
  cold_storage_capacity_cubic_m DECIMAL(10, 2),
  has_waste_collection_system BOOLEAN DEFAULT false,
  waste_management_system TEXT,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  power_backup_available BOOLEAN DEFAULT false,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT true,
  water_supply_source TEXT,
  has_public_toilets BOOLEAN DEFAULT false,
  toilet_facilities_details TEXT,
  has_drainage_system BOOLEAN DEFAULT true,
  drainage_system_condition TEXT,
  has_waste_water_treatment BOOLEAN DEFAULT false,
  internet_connectivity TEXT,
  telecommunication_services TEXT,
  
  -- Transportation and access
  primary_access_roads TEXT,
  road_condition TEXT,
  has_parking_facility BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  vehicle_accessibility TEXT,
  traffic_congestion_level TEXT,
  public_transport_connectivity TEXT,
  nearest_public_transport_stop TEXT,
  
  -- Pedestrian facilities
  has_dedicated_walkways BOOLEAN DEFAULT false,
  walkway_condition TEXT,
  has_street_furniture BOOLEAN DEFAULT false,
  street_furniture_details TEXT,
  is_pedestrian_friendly BOOLEAN DEFAULT false,
  has_covered_walkways BOOLEAN DEFAULT false,
  has_accessibility_features BOOLEAN DEFAULT false,
  accessibility_feature_details TEXT,
  
  -- Environmental aspects
  green_space_percentage DECIMAL(5, 2),
  has_tree_planting BOOLEAN DEFAULT false,
  tree_count INTEGER,
  environmental_issues TEXT,
  noise_level TEXT,
  air_quality TEXT,
  cleanliness_level TEXT,
  
  -- Safety and security
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  has_police_post BOOLEAN DEFAULT false,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_fire_safety_system BOOLEAN DEFAULT false,
  fire_safety_equipment TEXT,
  emergency_response_system TEXT,
  crime_incidents_reported_yearly INTEGER,
  
  -- Economic aspects
  estimated_daily_visitors INTEGER,
  peak_business_days TEXT,
  peak_business_hours TEXT,
  estimated_daily_transaction_volume_npr DECIMAL(18, 2),
  estimated_annual_turnover_npr DECIMAL(18, 2),
  employment_generated INTEGER,
  business_license_fee_structure TEXT,
  revenue_generation_for_local_government_npr DECIMAL(14, 2),
  economic_importance_remarks TEXT,
  
  -- Market dynamics
  competitiveness TEXT,
  business_turnover_rate TEXT,
  vacancy_rate DECIMAL(5, 2),
  average_rental_rate_per_sq_m_npr DECIMAL(10, 2),
  rental_trends TEXT,
  property_value_trends TEXT,
  
  -- Social aspects
  cultural_significance TEXT,
  social_gathering_spaces TEXT,
  community_events_hosted TEXT,
  inclusivity_aspects TEXT,
  
  -- Governance and management
  management_structure TEXT,
  has_business_association BOOLEAN DEFAULT false,
  business_association_details TEXT,
  management_challenges TEXT,
  conflict_resolution_mechanisms TEXT,
  
  -- Development and planning
  development_status TEXT,
  recent_improvements TEXT,
  planned_improvements TEXT,
  zoning_regulations TEXT,
  building_codes_applicable TEXT,
  master_plan_exists BOOLEAN DEFAULT false,
  master_plan_details TEXT,
  
  -- Challenges and issues
  infrastructure_challenges TEXT,
  environmental_challenges TEXT,
  economic_challenges TEXT,
  social_challenges TEXT,
  regulatory_challenges TEXT,
  competition_challenges TEXT,
  
  -- Future prospects
  growth_potential TEXT,
  expansion_possibilities TEXT,
  modernization_needs TEXT,
  investment_opportunities TEXT,
  strategic_importance TEXT,
  
  -- Marketing and promotion
  has_brand_identity BOOLEAN DEFAULT false,
  promotion_activities TEXT,
  online_presence TEXT,
  tourism_potential TEXT,
  
  -- Community relations
  community_perception TEXT,
  stakeholder_involvement TEXT,
  public_private_partnership_details TEXT,
  
  -- Linkages to other entities
  linked_businesses JSONB DEFAULT '[]'::jsonb,
  linked_transportation_hubs JSONB DEFAULT '[]'::jsonb,
  linked_wholesale_markets JSONB DEFAULT '[]'::jsonb,
  linked_agricultural_production_centers JSONB DEFAULT '[]'::jsonb,
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  market_area GEOMETRY(Polygon, 4326),
  building_footprints GEOMETRY(MultiPolygon, 4326),
  access_roads GEOMETRY(MultiLineString, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_market_center_location_point ON acme_market_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_market_center_area ON acme_market_center USING GIST (market_area);
CREATE INDEX IF NOT EXISTS idx_market_center_buildings ON acme_market_center USING GIST (building_footprints);
CREATE INDEX IF NOT EXISTS idx_market_center_roads ON acme_market_center USING GIST (access_roads);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_market_center_name ON acme_market_center(name);
CREATE INDEX IF NOT EXISTS idx_market_center_slug ON acme_market_center(slug);
CREATE INDEX IF NOT EXISTS idx_market_center_type ON acme_market_center(center_type);
CREATE INDEX IF NOT EXISTS idx_market_center_ward ON acme_market_center(ward_number);
CREATE INDEX IF NOT EXISTS idx_market_center_scale ON acme_market_center(market_scale);
