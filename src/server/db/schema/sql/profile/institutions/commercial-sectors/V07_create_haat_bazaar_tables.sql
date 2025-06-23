-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define haat bazaar frequency enum
DO $$ 
BEGIN
  CREATE TYPE haat_bazaar_frequency AS ENUM (
    'DAILY',
    'WEEKLY',
    'BIWEEKLY',
    'FORTNIGHTLY',
    'MONTHLY',
    'SEASONAL',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define haat bazaar scale enum
DO $$ 
BEGIN
  CREATE TYPE haat_bazaar_scale AS ENUM (
    'SMALL',
    'MEDIUM',
    'LARGE',
    'VERY_LARGE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define haat bazaar primary product enum
DO $$ 
BEGIN
  CREATE TYPE haat_bazaar_primary_product AS ENUM (
    'AGRICULTURAL',
    'LIVESTOCK',
    'HANDICRAFT',
    'TEXTILES',
    'GENERAL_MERCHANDISE',
    'FOOD',
    'MIXED',
    'SPECIALIZED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define operating space enum
DO $$ 
BEGIN
  CREATE TYPE operating_space AS ENUM (
    'OPEN_GROUND',
    'COVERED_SHED',
    'STREET',
    'MIXED',
    'PURPOSE_BUILT',
    'TEMPORARY_STRUCTURES',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the haat bazaar table
CREATE TABLE IF NOT EXISTS acme_haat_bazaar (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_in_local_language TEXT,
  frequency haat_bazaar_frequency NOT NULL,
  scale haat_bazaar_scale NOT NULL,
  primary_product haat_bazaar_primary_product NOT NULL,
  operating_space operating_space NOT NULL,
  description TEXT,
  short_description TEXT,

  -- Basic information
  established_year INTEGER,
  operating_days TEXT, -- Specific days like "Monday", "Sunday and Thursday"
  registration_status TEXT,
  registration_number VARCHAR(50),
  registered_with TEXT,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  address TEXT,
  landmark TEXT,

  -- Contact information
  contact_person TEXT, -- Market manager or local authority
  contact_phone TEXT,
  alternate_phone TEXT,

  -- Operating hours
  start_time TIME,
  end_time TIME,
  peak_hours TEXT,
  setup_time TIME, -- When vendors start setting up

  -- Area and infrastructure
  total_area_sq_m DECIMAL(12, 2),
  has_designated_boundary BOOLEAN DEFAULT false,
  has_permanent_structures BOOLEAN DEFAULT false,
  has_covered_area BOOLEAN DEFAULT false,
  covered_area_percent INTEGER,
  has_drainage_system BOOLEAN DEFAULT false,
  has_electricity BOOLEAN DEFAULT false,
  electricity_type TEXT, -- Grid, generator, solar
  has_water_supply BOOLEAN DEFAULT false,
  water_supply_type TEXT,

  -- Vendor information
  estimated_vendor_count INTEGER,
  registered_vendor_count INTEGER,
  regular_vendor_count INTEGER,
  seasonal_vendor_count INTEGER,
  female_vendor_percent INTEGER,
  vendors_from_other_districts_percent INTEGER,
  vendor_registration_fee_npr DECIMAL(10, 2),
  daily_tax_per_vendor_npr DECIMAL(10, 2),
  average_vendor_earning_per_day_npr DECIMAL(10, 2),

  -- Products and services
  agricultural_produce_sold_types TEXT,
  livestock_sold_types TEXT,
  handicraft_sold_types TEXT,
  manufactured_goods_sold_types TEXT,
  food_service_types TEXT,
  has_ready_to_eat_food BOOLEAN DEFAULT true,
  has_live_animal_trading BOOLEAN DEFAULT false,
  specialized_products TEXT,
  local_specialties TEXT,
  service_leverage TEXT, -- Services like mobile repairs, haircuts, etc.

  -- Visitors and economic activity
  estimated_daily_footfall INTEGER,
  peak_season_months TEXT,
  low_season_months TEXT,
  visitor_demographics TEXT,
  estimated_daily_transaction_volume_npr DECIMAL(18, 2),
  average_purchase_value_npr DECIMAL(10, 2),
  economic_importance TEXT,

  -- Management and operations
  managed_by TEXT, -- Local government, community committee, etc.
  has_market_committee BOOLEAN DEFAULT false,
  market_committee_details TEXT,
  has_tax_collection BOOLEAN DEFAULT false,
  tax_collection_method TEXT,
  estimated_tax_revenue_per_event_npr DECIMAL(14, 2),
  annual_revenue_estimate_npr DECIMAL(18, 2),
  revenue_used_for TEXT,

  -- Amenities and facilities
  has_public_toilets BOOLEAN DEFAULT false,
  toilet_count INTEGER,
  has_handwashing_stations BOOLEAN DEFAULT false,
  handwashing_station_count INTEGER,
  has_waste_collection BOOLEAN DEFAULT false,
  waste_collection_details TEXT,
  has_designated_parking_space BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  has_loading_unloading_area BOOLEAN DEFAULT false,
  has_resting_area BOOLEAN DEFAULT false,

  -- Accessibility
  distance_from_main_road_km DECIMAL(6, 2),
  distance_from_nearest_city_km DECIMAL(6, 2),
  accessibility_rating TEXT,
  public_transport_availability TEXT,
  road_condition TEXT,

  -- Security and safety
  security_arrangement TEXT,
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  has_fire_safety_measures BOOLEAN DEFAULT false,
  safety_issues TEXT,

  -- Cultural and social aspects
  cultural_significance TEXT,
  traditional_practices TEXT,
  social_gathering_importance TEXT,
  community_events TEXT,

  -- Supply chain connections
  source_of_products TEXT, -- Where products come from
  product_destinations TEXT, -- Where products go after market
  supply_chain_role TEXT,
  connected_markets TEXT,

  -- Weather and climate impact
  all_weather_operational BOOLEAN DEFAULT false,
  weather_vulnerabilities TEXT,
  seasonal_variations TEXT,

  -- Challenges and development
  major_challenges TEXT,
  infrastructure_needs TEXT,
  development_plans TEXT,
  support_required_from TEXT,

  -- Linkages to other entities
  linked_market_centers JSONB DEFAULT '[]'::jsonb,
  linked_agriculture_areas JSONB DEFAULT '[]'::jsonb,
  linked_transport_routes JSONB DEFAULT '[]'::jsonb,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  market_area GEOMETRY(Polygon, 4326),

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
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_location_point ON acme_haat_bazaar USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_market_area ON acme_haat_bazaar USING GIST (market_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_name ON acme_haat_bazaar(name);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_slug ON acme_haat_bazaar(slug);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_frequency ON acme_haat_bazaar(frequency);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_ward ON acme_haat_bazaar(ward_number);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_scale ON acme_haat_bazaar(scale);
CREATE INDEX IF NOT EXISTS idx_haat_bazaar_primary_product ON acme_haat_bazaar(primary_product);
