-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Quarry material type enum
DO $$ 
BEGIN
  CREATE TYPE quarry_material_type AS ENUM (
    'LIMESTONE', 'SAND', 'GRAVEL', 'GRANITE', 'MARBLE', 'SLATE', 'SANDSTONE',
    'CLAY', 'LATERITE', 'PEBBLES', 'BOULDERS', 'DIMENSION_STONE',
    'CONSTRUCTION_AGGREGATE', 'MIXED_MATERIALS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the quarry table
CREATE TABLE IF NOT EXISTS acme_quarry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  primary_material quarry_material_type NOT NULL,
  other_materials TEXT,
  status mine_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  area_hectares DECIMAL(12, 2),
  geological_formation TEXT,
  
  -- Basic information
  established_year INTEGER,
  ownership_type mine_ownership_type NOT NULL,
  operating_company TEXT,
  license_number VARCHAR(50),
  license_issue_date DATE,
  license_expiry_date DATE,
  license_authority TEXT,
  operation_scale mine_operation_scale,
  is_seasonal BOOLEAN DEFAULT false,
  operational_seasons TEXT,
  
  -- Resources and reserves
  estimated_reserves_cubic_m DECIMAL(18, 2),
  resource_quality TEXT,
  resource_assessment_method TEXT,
  resource_assessment_year INTEGER,
  estimated_quarry_life_years INTEGER,
  
  -- Production details
  operational_status TEXT,
  daily_production_cubic_m DECIMAL(14, 2),
  monthly_production_cubic_m DECIMAL(18, 2),
  annual_production_cubic_m DECIMAL(18, 2),
  production_data_year INTEGER,
  operational_days_per_year INTEGER,
  operational_hours_per_day INTEGER,
  
  -- Extraction methods
  extraction_method TEXT,
  extraction_equipment TEXT,
  blasting_used BOOLEAN DEFAULT false,
  blasting_frequency TEXT,
  blasting_safety_measures TEXT,
  excavation_depth_m DECIMAL(8, 2),
  bench_height_m DECIMAL(6, 2),
  slope_angle_degrees DECIMAL(5, 2),
  
  -- Processing details
  has_onsite_processing BOOLEAN DEFAULT false,
  crushing_facility_available BOOLEAN DEFAULT false,
  crushing_capacity_tonnes_per_day DECIMAL(14, 2),
  screening_facility_available BOOLEAN DEFAULT false,
  washing_facility_available BOOLEAN DEFAULT false,
  processing_details TEXT,
  product_sizes_available TEXT,
  product_standards_followed TEXT,
  
  -- Employment and workforce
  total_employees INTEGER,
  direct_employees INTEGER,
  contractor_employees INTEGER,
  local_employment_percentage DECIMAL(5, 2),
  female_employment_percentage DECIMAL(5, 2),
  seasonal_employment_count INTEGER,
  equipment_operators_count INTEGER,
  technical_staff_count INTEGER,
  worker_accommodation_available BOOLEAN DEFAULT false,
  
  -- Economic impact
  annual_revenue_npr DECIMAL(18, 2),
  revenue_data_year INTEGER,
  average_material_price_npr_per_cubic_m DECIMAL(10, 2),
  annual_royalty_payment_npr DECIMAL(18, 2),
  tax_contribution_npr DECIMAL(18, 2),
  local_economy_contribution TEXT,
  major_construction_projects_supplied TEXT,
  
  -- Market and sales
  primary_market_area TEXT,
  distance_to_main_market_km DECIMAL(10, 2),
  major_customers TEXT,
  material_transport_method TEXT,
  average_transport_distance_km DECIMAL(10, 2),
  market_challenges TEXT,
  price_fluctuation_factors TEXT,
  
  -- Infrastructure
  has_dedicated_power_supply BOOLEAN DEFAULT false,
  power_source TEXT,
  power_requirement_kw DECIMAL(8, 2),
  has_water_supply_system BOOLEAN DEFAULT false,
  water_source TEXT,
  water_usage_liters_per_day INTEGER,
  drainage_system TEXT,
  internal_roads_condition TEXT,
  
  -- Transportation
  material_transport_vehicles TEXT,
  number_of_transport_vehicles INTEGER,
  distance_to_nearest_highway_km DECIMAL(6, 2),
  access_road_condition TEXT,
  dedicated_loading_facility BOOLEAN DEFAULT false,
  loading_equipment TEXT,
  
  -- Environmental aspects
  environmental_impact_assessment_conducted BOOLEAN DEFAULT false,
  eia_approval_date DATE,
  eia_approving_authority TEXT,
  environmental_impact mine_environmental_impact,
  has_environmental_management_plan BOOLEAN DEFAULT false,
  environmental_monitoring_frequency TEXT,
  dust_management_measures TEXT,
  noise_management_measures TEXT,
  water_pollution_control_measures TEXT,
  erosion_control_measures TEXT,
  visual_impact_mitigation TEXT,
  
  -- Rehabilitation and closure
  progressive_rehabilitation BOOLEAN DEFAULT false,
  has_quarry_closure_plan BOOLEAN DEFAULT false,
  rehabilitation_status rehabilitation_status,
  rehabilitation_activities TEXT,
  closure_fund_established BOOLEAN DEFAULT false,
  closure_fund_amount_npr DECIMAL(18, 2),
  post_quarrying_land_use_plan TEXT,
  area_rehabilitated_hectares DECIMAL(10, 2),
  
  -- Community relations
  affected_communities TEXT,
  distance_to_nearest_settlement_km DECIMAL(6, 2),
  community_issues TEXT,
  dust_impact_on_communities BOOLEAN DEFAULT false,
  noise_impact_on_communities BOOLEAN DEFAULT false,
  traffic_impact_on_communities BOOLEAN DEFAULT false,
  water_impact_on_communities BOOLEAN DEFAULT false,
  community_benefit_programs TEXT,
  compensation_mechanisms TEXT,
  
  -- Health and safety
  safety_rating mine_safety_rating,
  accident_statistics TEXT,
  fatalities_last_year INTEGER,
  fatalities_total INTEGER,
  lost_time_injuries_last_year INTEGER,
  safety_training_frequency TEXT,
  safety_equipment_provided TEXT,
  dust_protection_measures TEXT,
  noise_protection_measures TEXT,
  emergency_response_plan BOOLEAN DEFAULT false,
  
  -- Legal and compliance
  regulatory_compliance_level mine_compliance_level,
  recent_violations TEXT,
  pending_legal_cases TEXT,
  inspection_frequency TEXT,
  last_inspection_date DATE,
  inspecting_authority TEXT,
  local_permits_required TEXT,
  compliance_challenges TEXT,
  
  -- Challenges and issues
  operational_challenges TEXT,
  geological_challenges TEXT,
  financial_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  seasonal_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  modernization_plans TEXT,
  sustainability_initiatives TEXT,
  
  -- Contact information
  manager_name TEXT,
  manager_phone TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  local_representative TEXT,
  
  -- Linkages to other entities
  linked_construction_projects JSONB DEFAULT '[]'::jsonb,
  linked_transport_systems JSONB DEFAULT '[]'::jsonb,
  linked_watershed_areas JSONB DEFAULT '[]'::jsonb,
  linked_local_industries JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  quarry_boundary GEOMETRY(Polygon, 4326),
  active_extraction_areas GEOMETRY(MultiPolygon, 4326),
  access_roads GEOMETRY(MultiLineString, 4326),
  stockpile_areas GEOMETRY(MultiPolygon, 4326),
  water_management_structures GEOMETRY(MultiLineString, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_quarry_location_point ON acme_quarry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_quarry_boundary ON acme_quarry USING GIST (quarry_boundary);
CREATE INDEX IF NOT EXISTS idx_quarry_extraction_areas ON acme_quarry USING GIST (active_extraction_areas);
CREATE INDEX IF NOT EXISTS idx_quarry_access_roads ON acme_quarry USING GIST (access_roads);
CREATE INDEX IF NOT EXISTS idx_quarry_stockpile_areas ON acme_quarry USING GIST (stockpile_areas);
CREATE INDEX IF NOT EXISTS idx_quarry_water_structures ON acme_quarry USING GIST (water_management_structures);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_quarry_name ON acme_quarry(name);
CREATE INDEX IF NOT EXISTS idx_quarry_slug ON acme_quarry(slug);
CREATE INDEX IF NOT EXISTS idx_quarry_primary_material ON acme_quarry(primary_material);
CREATE INDEX IF NOT EXISTS idx_quarry_status ON acme_quarry(status);
CREATE INDEX IF NOT EXISTS idx_quarry_ownership ON acme_quarry(ownership_type);
