-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Gemstone type enum
DO $$ 
BEGIN
  CREATE TYPE gemstone_type AS ENUM (
    'RUBY', 'SAPPHIRE', 'EMERALD', 'DIAMOND', 'AQUAMARINE', 'TOURMALINE', 
    'GARNET', 'KYANITE', 'BERYL', 'JADE', 'OPAL', 'TURQUOISE', 'AMETHYST',
    'TOPAZ', 'QUARTZ', 'LAPIS_LAZULI', 'SPINEL', 'PERIDOT', 'ZIRCON',
    'MIXED_GEMSTONES', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Gemstone quality enum
DO $$ 
BEGIN
  CREATE TYPE gemstone_quality AS ENUM (
    'PREMIUM', 'FINE', 'GOOD', 'MEDIUM', 'LOW', 'MIXED', 'UNGRADED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the precious_gemstone_mine table
CREATE TABLE IF NOT EXISTS acme_precious_gemstone_mine (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  primary_gemstone gemstone_type NOT NULL,
  secondary_gemstones TEXT,
  gemstone_quality gemstone_quality,
  status mine_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  area_hectares DECIMAL(12, 2),
  geological_setting TEXT,
  mineral_deposit_type TEXT,
  
  -- Basic information
  established_year INTEGER,
  discovery_year INTEGER,
  discovered_by TEXT,
  discovery_story TEXT,
  ownership_type mine_ownership_type NOT NULL,
  operating_company TEXT,
  license_number VARCHAR(50),
  license_issue_date DATE,
  license_expiry_date DATE,
  license_authority TEXT,
  operation_scale mine_operation_scale,
  
  -- Resources and reserves
  resource_estimate TEXT, -- Often less formalized than metal mines
  resource_estimation_method TEXT,
  average_gemstone_density TEXT, -- Findings per cubic meter/ton
  prospecting_results TEXT,
  notable_finds TEXT, -- Significant gemstones found in the past
  largest_gemstone_found_carats DECIMAL(10, 2),
  highest_value_find_npr DECIMAL(18, 2),
  estimated_mine_life_years INTEGER,
  
  -- Production details
  operational_status TEXT,
  production_volume_per_month TEXT, -- Often measured in carats or kilograms
  annual_production_carats DECIMAL(14, 2), -- For cut stones
  annual_production_kg DECIMAL(14, 2), -- For rough stones
  production_data_year INTEGER,
  operational_days_per_year INTEGER,
  operational_seasons TEXT, -- Some mines are seasonal
  
  -- Mining methods
  mining_method extraction_method,
  mining_method_details TEXT,
  excavation_depth_m DECIMAL(8, 2),
  tunnel_length_m DECIMAL(10, 2),
  extraction_techniques TEXT,
  sorting_methods TEXT,
  
  -- Processing details
  has_onsite_processing BOOLEAN DEFAULT false,
  initial_sorting_method TEXT,
  cutting_facilities_available BOOLEAN DEFAULT false,
  polishing_facilities_available BOOLEAN DEFAULT false,
  grading_system TEXT,
  value_addition_activities TEXT,
  gemstone_treatment_methods TEXT,
  certification_available BOOLEAN DEFAULT false,
  certification_details TEXT,
  
  -- Employment and workforce
  total_employees INTEGER,
  direct_employees INTEGER,
  contractor_employees INTEGER,
  local_employment_percentage DECIMAL(5, 2),
  female_employment_percentage DECIMAL(5, 2),
  skilled_artisans_count INTEGER,
  gemstone_cutters_count INTEGER,
  foreign_experts_count INTEGER,
  traditional_miners_involvement TEXT,
  worker_accommodation_available BOOLEAN DEFAULT false,
  accommodation_capacity INTEGER,
  
  -- Economic impact
  annual_revenue_npr DECIMAL(18, 2),
  revenue_data_year INTEGER,
  estimated_total_value_npr DECIMAL(20, 2),
  annual_royalty_payment_npr DECIMAL(18, 2),
  tax_contribution_npr DECIMAL(18, 2),
  export_percentage DECIMAL(5, 2),
  major_export_destinations TEXT,
  local_economy_contribution TEXT,
  
  -- Market and sales
  primary_markets TEXT,
  market_access_challenges TEXT,
  typical_buyers TEXT,
  pricing_mechanism TEXT,
  average_price_per_carat_npr DECIMAL(14, 2),
  price_fluctuation_factors TEXT,
  gemstone_authentication_process TEXT,
  
  -- Infrastructure
  has_dedicated_power_supply BOOLEAN DEFAULT false,
  power_source TEXT,
  has_water_supply_system BOOLEAN DEFAULT false,
  water_source TEXT,
  water_usage_liters_per_day INTEGER,
  has_waste_management BOOLEAN DEFAULT false,
  waste_management_details TEXT,
  security_infrastructure TEXT, -- Important for gemstone mines
  storage_facilities TEXT,
  
  -- Transportation
  primary_transport_method TEXT,
  distance_to_nearest_highway_km DECIMAL(6, 2),
  distance_to_processing_facility_km DECIMAL(6, 2),
  distance_to_market_km DECIMAL(6, 2),
  gemstone_transportation_security TEXT,
  
  -- Environmental aspects
  environmental_impact_assessment_conducted BOOLEAN DEFAULT false,
  eia_approval_date DATE,
  eia_approving_authority TEXT,
  environmental_impact mine_environmental_impact,
  has_environmental_management_plan BOOLEAN DEFAULT false,
  environmental_monitoring_frequency TEXT,
  land_degradation_issues TEXT,
  rehabilitation_practices TEXT,
  water_pollution_issues BOOLEAN DEFAULT false,
  water_management_practices TEXT,
  
  -- Rehabilitation and closure
  has_mine_closure_plan BOOLEAN DEFAULT false,
  rehabilitation_status rehabilitation_status,
  rehabilitation_activities TEXT,
  closure_fund_established BOOLEAN DEFAULT false,
  closure_fund_amount_npr DECIMAL(18, 2),
  post_mining_land_use_plan TEXT,
  area_rehabilitated_hectares DECIMAL(10, 2),
  
  -- Community relations
  affected_communities TEXT,
  community_benefit_sharing TEXT,
  community_development_programs TEXT,
  local_artisanal_mining_relationship TEXT,
  cultural_significance_of_gemstones TEXT,
  community_conflicts TEXT,
  conflict_resolution_approaches TEXT,
  
  -- Health and safety
  safety_rating mine_safety_rating,
  accident_statistics TEXT,
  common_health_hazards TEXT,
  safety_training_provided BOOLEAN DEFAULT false,
  safety_equipment_provision TEXT,
  emergency_response_capability TEXT,
  
  -- Legal and compliance
  regulatory_compliance_level mine_compliance_level,
  recent_violations TEXT,
  pending_legal_cases TEXT,
  inspection_frequency TEXT,
  last_inspection_date DATE,
  inspecting_authority TEXT,
  informal_mining_issues BOOLEAN DEFAULT false,
  smuggling_concerns TEXT,
  
  -- Artisanal and small-scale mining
  artisanal_mining_permitted BOOLEAN DEFAULT false,
  artisanal_miners_count INTEGER,
  relationship_with_artisanal_miners TEXT,
  formalization_efforts TEXT,
  
  -- Challenges and issues
  operational_challenges TEXT,
  geological_challenges TEXT,
  financial_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  market_challenges TEXT,
  security_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  modernization_plans TEXT,
  diversification_plans TEXT,
  sustainability_initiatives TEXT,
  
  -- Heritage and tourism
  historical_significance TEXT,
  tourism_potential TEXT,
  visitor_facilities_available BOOLEAN DEFAULT false,
  visitor_facilities_details TEXT,
  annual_visitors INTEGER,
  
  -- Contact information
  manager_name TEXT,
  manager_phone TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  sales_contact TEXT,
  
  -- Linkages to other entities
  linked_processing_centers JSONB DEFAULT '[]'::jsonb,
  linked_markets JSONB DEFAULT '[]'::jsonb,
  linked_transportation JSONB DEFAULT '[]'::jsonb,
  linked_tourism_facilities JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  mine_boundary GEOMETRY(Polygon, 4326),
  operation_area GEOMETRY(Polygon, 4326),
  tunnel_network GEOMETRY(MultiLineString, 4326),
  waste_dump_areas GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_location_point ON acme_precious_gemstone_mine USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_boundary ON acme_precious_gemstone_mine USING GIST (mine_boundary);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_operation_area ON acme_precious_gemstone_mine USING GIST (operation_area);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_tunnel_network ON acme_precious_gemstone_mine USING GIST (tunnel_network);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_waste_dump_areas ON acme_precious_gemstone_mine USING GIST (waste_dump_areas);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_name ON acme_precious_gemstone_mine(name);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_slug ON acme_precious_gemstone_mine(slug);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_primary_gemstone ON acme_precious_gemstone_mine(primary_gemstone);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_quality ON acme_precious_gemstone_mine(gemstone_quality);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_status ON acme_precious_gemstone_mine(status);
CREATE INDEX IF NOT EXISTS idx_gemstone_mine_ownership ON acme_precious_gemstone_mine(ownership_type);
