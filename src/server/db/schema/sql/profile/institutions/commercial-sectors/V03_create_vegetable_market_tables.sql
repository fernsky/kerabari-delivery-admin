-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define market type enum
DO $$ 
BEGIN
  CREATE TYPE vegetable_market_type AS ENUM (
    'WHOLESALE_MARKET',
    'RETAIL_MARKET',
    'MIXED_MARKET',
    'FARMERS_MARKET',
    'ORGANIC_MARKET',
    'STREET_VENDOR_CLUSTER',
    'PERMANENT_MARKET',
    'SEASONAL_MARKET',
    'MOBILE_MARKET',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define market infrastructure type enum
DO $$ 
BEGIN
  CREATE TYPE market_infrastructure_type AS ENUM (
    'OPEN_AIR',
    'COVERED_SHED',
    'PERMANENT_BUILDING',
    'MIXED_STRUCTURE',
    'TEMPORARY_STALLS',
    'ROADSIDE_SETUP',
    'MODERN_FACILITY',
    'TRADITIONAL_STRUCTURE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define operating frequency enum
DO $$ 
BEGIN
  CREATE TYPE operating_frequency AS ENUM (
    'DAILY',
    'WEEKLY',
    'BIWEEKLY',
    'MONTHLY',
    'SEASONAL',
    'SPECIFIC_DAYS',
    'IRREGULAR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the vegetable market table
CREATE TABLE IF NOT EXISTS acme_vegetable_market (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  market_type vegetable_market_type NOT NULL,
  infrastructure_type market_infrastructure_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  gps_coordinates TEXT,
  distance_from_city_center_km DECIMAL(6, 2),
  
  -- Basic information
  established_year INTEGER,
  operating_frequency operating_frequency,
  operating_days TEXT,
  opening_time TIME,
  closing_time TIME,
  peak_business_hours TEXT,
  ownership_type business_ownership_type,
  management_type TEXT,
  managing_committee TEXT,
  registration_number VARCHAR(50),
  registered_with TEXT,
  
  -- Physical characteristics
  total_area_sq_m DECIMAL(10, 2),
  built_up_area_sq_m DECIMAL(10, 2),
  number_of_stalls INTEGER,
  number_of_shops INTEGER,
  retail_space_sq_m DECIMAL(10, 2),
  storage_space_sq_m DECIMAL(10, 2),
  facility_condition facility_condition,
  last_renovation_year INTEGER,
  has_multiple_floors BOOLEAN DEFAULT false,
  total_floors INTEGER,
  
  -- Vendor information
  regular_vendor_count INTEGER,
  seasonal_vendor_count INTEGER,
  women_vendor_percentage INTEGER,
  local_farmer_vendor_percentage INTEGER,
  average_stall_size_sq_m DECIMAL(6, 2),
  stall_rent_range_npr TEXT,
  vendor_association_exists BOOLEAN DEFAULT false,
  vendor_association_name TEXT,
  vendor_registration_system BOOLEAN DEFAULT false,
  
  -- Product information
  primary_products_sold TEXT,
  product_categories JSONB DEFAULT '[]'::jsonb,
  specialty_products TEXT,
  organic_products_available BOOLEAN DEFAULT false,
  organic_product_percentage INTEGER,
  local_produce_percentage INTEGER,
  imported_produce_percentage INTEGER,
  product_quality_control_measures TEXT,
  average_daily_product_volume_kg INTEGER,
  product_seasonality TEXT,
  
  -- Market infrastructure
  has_dedicated_loading_area BOOLEAN DEFAULT false,
  has_weighing_facilities BOOLEAN DEFAULT true,
  has_product_testing_facilities BOOLEAN DEFAULT false,
  has_sorting_facilities BOOLEAN DEFAULT false,
  has_cold_storage BOOLEAN DEFAULT false,
  cold_storage_capacity_cubic_m DECIMAL(10, 2),
  has_storage_facilities BOOLEAN DEFAULT false,
  storage_facility_details TEXT,
  has_packaging_facilities BOOLEAN DEFAULT false,
  has_waste_collection_point BOOLEAN DEFAULT false,
  waste_management_system TEXT,
  
  -- Utilities
  has_electricity BOOLEAN DEFAULT true,
  power_backup_available BOOLEAN DEFAULT false,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT true,
  water_supply_source TEXT,
  has_public_toilets BOOLEAN DEFAULT false,
  public_toilet_condition TEXT,
  has_drainage_system BOOLEAN DEFAULT true,
  drainage_system_condition TEXT,
  has_waste_water_treatment BOOLEAN DEFAULT false,
  
  -- Accessibility and facilities
  has_parking_facility BOOLEAN DEFAULT false,
  parking_capacity INTEGER,
  vehicle_accessibility TEXT,
  has_public_transport_access BOOLEAN DEFAULT true,
  nearest_public_transport_distance_m INTEGER,
  has_dedicated_pathways BOOLEAN DEFAULT false,
  has_wheelchair_access BOOLEAN DEFAULT false,
  has_resting_areas BOOLEAN DEFAULT false,
  has_public_seating BOOLEAN DEFAULT false,
  has_shelter_from_elements BOOLEAN DEFAULT false,
  has_fans_or_cooling BOOLEAN DEFAULT false,
  has_heating BOOLEAN DEFAULT false,
  
  -- Business metrics
  average_daily_customers INTEGER,
  peak_day_customers INTEGER,
  busy_days_of_week TEXT,
  busy_months TEXT,
  slow_months TEXT,
  estimated_daily_sales_volume_npr DECIMAL(14, 2),
  estimated_monthly_sales_volume_npr DECIMAL(18, 2),
  price_determination_method TEXT,
  price_information_system TEXT,
  price_fluctuation_factors TEXT,
  
  -- Services and facilities
  has_price_display_system BOOLEAN DEFAULT false,
  has_digital_payment_options BOOLEAN DEFAULT false,
  digital_payment_methods JSONB DEFAULT '[]'::jsonb,
  has_banking_services_nearby BOOLEAN DEFAULT false,
  banking_service_details TEXT,
  has_information_center BOOLEAN DEFAULT false,
  has_announcement_system BOOLEAN DEFAULT false,
  has_customer_feedback_system BOOLEAN DEFAULT false,
  has_security_personnel BOOLEAN DEFAULT false,
  security_personnel_count INTEGER,
  has_cctv BOOLEAN DEFAULT false,
  cctv_camera_count INTEGER,
  has_fire_safety_system BOOLEAN DEFAULT false,
  fire_safety_equipment TEXT,
  
  -- Food safety and hygiene
  hygiene_level TEXT,
  cleaning_frequency TEXT,
  has_food_safety_inspection BOOLEAN DEFAULT false,
  inspection_frequency TEXT,
  last_inspection_date DATE,
  food_safety_rating TEXT,
  common_hygiene_issues TEXT,
  pest_control_measures TEXT,
  pest_control_frequency TEXT,
  
  -- Economic impact
  employment_generated INTEGER,
  direct_employment_count INTEGER,
  indirect_employment_count INTEGER,
  women_employment_percentage INTEGER,
  economic_importance_to_area TEXT,
  supply_chain_effectiveness TEXT,
  market_linkages TEXT,
  
  -- Supply chain and logistics
  primary_source_regions TEXT,
  average_distance_from_production_km INTEGER,
  main_transportation_methods TEXT,
  logistics_challenges TEXT,
  average_product_loss_percentage DECIMAL(5, 2),
  product_loss_reasons TEXT,
  
  -- Market management
  management_structure TEXT,
  staff_count INTEGER,
  has_market_committees BOOLEAN DEFAULT false,
  committee_details TEXT,
  conflict_resolution_process TEXT,
  rules_and_regulations TEXT,
  enforcement_mechanism TEXT,
  
  -- Fees and revenue
  has_entry_fee BOOLEAN DEFAULT false,
  entry_fee_amount_npr DECIMAL(10, 2),
  has_stall_fee BOOLEAN DEFAULT true,
  stall_fee_structure TEXT,
  revenue_collection_method TEXT,
  annual_revenue_npr DECIMAL(14, 2),
  revenue_utilization TEXT,
  
  -- Challenges and issues
  major_challenges TEXT,
  infrastructure_needs TEXT,
  regulatory_challenges TEXT,
  market_competition TEXT,
  unauthorized_vending_issues TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  modernization_plans TEXT,
  upcoming_improvements TEXT,
  estimated_development_budget_npr DECIMAL(14, 2),
  
  -- Environmental impact
  environmental_concerns TEXT,
  waste_generation_kg_per_day INTEGER,
  waste_segregation_practices TEXT,
  recycling_initiatives TEXT,
  plastic_use_reduction_measures TEXT,
  
  -- Community relations
  community_perception TEXT,
  community_engagement_activities TEXT,
  customer_satisfaction_level TEXT,
  neighbors_issues TEXT,
  
  -- Contact information
  manager_name TEXT,
  manager_phone TEXT,
  office_phone TEXT,
  email TEXT,
  
  -- Linkages to other entities
  linked_farms JSONB DEFAULT '[]'::jsonb,
  linked_transport_services JSONB DEFAULT '[]'::jsonb,
  linked_processing_units JSONB DEFAULT '[]'::jsonb,
  linked_markets JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  market_area GEOMETRY(Polygon, 4326),
  stall_layouts GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_vegetable_market_location_point ON acme_vegetable_market USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_vegetable_market_area ON acme_vegetable_market USING GIST (market_area);
CREATE INDEX IF NOT EXISTS idx_vegetable_market_stall_layouts ON acme_vegetable_market USING GIST (stall_layouts);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_vegetable_market_name ON acme_vegetable_market(name);
CREATE INDEX IF NOT EXISTS idx_vegetable_market_slug ON acme_vegetable_market(slug);
CREATE INDEX IF NOT EXISTS idx_vegetable_market_type ON acme_vegetable_market(market_type);
CREATE INDEX IF NOT EXISTS idx_vegetable_market_ward ON acme_vegetable_market(ward_number);
