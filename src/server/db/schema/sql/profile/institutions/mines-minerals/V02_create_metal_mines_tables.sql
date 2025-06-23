-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Metal type enum
DO $$ 
BEGIN
  CREATE TYPE metal_type AS ENUM (
    'IRON', 'COPPER', 'ZINC', 'LEAD', 'ALUMINUM', 'GOLD', 'SILVER', 
    'PLATINUM', 'NICKEL', 'TIN', 'CHROMIUM', 'MANGANESE', 'TITANIUM', 
    'MOLYBDENUM', 'TUNGSTEN', 'COBALT', 'MIXED_METALS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the metal_mine table
CREATE TABLE IF NOT EXISTS acme_metal_mine (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  primary_metal metal_type NOT NULL,
  secondary_metals TEXT,
  status mine_status NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  elevation_m DECIMAL(8, 2),
  area_hectares DECIMAL(12, 2),
  geological_setting TEXT,
  
  -- Basic information
  established_year INTEGER,
  discovery_year INTEGER,
  discovered_by TEXT,
  ownership_type mine_ownership_type NOT NULL,
  operating_company TEXT,
  license_number VARCHAR(50),
  license_issue_date DATE,
  license_expiry_date DATE,
  license_authority TEXT,
  operation_scale mine_operation_scale,
  
  -- Mineral resources and reserves
  proven_reserves_tonnes DECIMAL(18, 2),
  probable_reserves_tonnes DECIMAL(18, 2),
  measured_resources_tonnes DECIMAL(18, 2),
  indicated_resources_tonnes DECIMAL(18, 2),
  inferred_resources_tonnes DECIMAL(18, 2),
  average_ore_grade TEXT,
  contained_metal_estimate_tonnes DECIMAL(18, 2),
  reserve_estimation_date DATE,
  reserve_estimation_standard TEXT,
  estimated_mine_life_years INTEGER,
  
  -- Production details
  operational_status TEXT,
  annual_production_tonnes DECIMAL(18, 2),
  production_capacity_tonnes_per_day DECIMAL(14, 2),
  actual_production_tonnes_per_day DECIMAL(14, 2),
  cumulative_production_tonnes DECIMAL(18, 2),
  production_data_year INTEGER,
  operational_days_per_year INTEGER,
  operating_hours_per_day INTEGER,
  
  -- Mining methods
  mining_method extraction_method,
  mining_method_details TEXT,
  mining_depth_m DECIMAL(8, 2),
  pit_dimensions TEXT,
  tunnel_length_m DECIMAL(10, 2),
  number_of_levels INTEGER,
  bench_height_m DECIMAL(6, 2),
  slope_angle_degrees DECIMAL(5, 2),
  strip_ratio DECIMAL(6, 2),
  
  -- Processing details
  has_onsite_processing BOOLEAN DEFAULT false,
  processing_method processing_method,
  processing_capacity_tonnes_per_day DECIMAL(14, 2),
  processing_facility_details TEXT,
  recovery_rate_percentage DECIMAL(5, 2),
  product_types TEXT,
  product_quality TEXT,
  processing_chemicals_used TEXT,
  
  -- Employment and workforce
  total_employees INTEGER,
  direct_employees INTEGER,
  contractor_employees INTEGER,
  local_employment_percentage DECIMAL(5, 2),
  female_employment_percentage DECIMAL(5, 2),
  technical_staff_count INTEGER,
  unskilled_labor_count INTEGER,
  administrative_staff_count INTEGER,
  foreign_experts_count INTEGER,
  worker_accommodation_available BOOLEAN DEFAULT false,
  accommodation_capacity INTEGER,
  
  -- Economic impact
  annual_revenue_npr DECIMAL(18, 2),
  revenue_data_year INTEGER,
  estimated_value_of_reserves_npr DECIMAL(20, 2),
  annual_royalty_payment_npr DECIMAL(18, 2),
  tax_contribution_npr DECIMAL(18, 2),
  local_procurement_percentage DECIMAL(5, 2),
  csr_spending_npr DECIMAL(14, 2),
  local_economy_contribution TEXT,
  
  -- Infrastructure
  has_dedicated_power_supply BOOLEAN DEFAULT false,
  power_source TEXT,
  power_requirement_mw DECIMAL(8, 2),
  has_water_supply_system BOOLEAN DEFAULT false,
  water_source TEXT,
  water_usage_liters_per_day INTEGER,
  has_waste_management BOOLEAN DEFAULT false,
  waste_management_details TEXT,
  has_tailings_dam BOOLEAN DEFAULT false,
  tailings_dam_capacity_cubic_m DECIMAL(18, 2),
  tailings_dam_safety_measures TEXT,
  has_waste_rock_dump BOOLEAN DEFAULT true,
  waste_rock_dump_details TEXT,
  
  -- Transportation
  primary_transport_method TEXT,
  distance_to_nearest_highway_km DECIMAL(6, 2),
  distance_to_processing_facility_km DECIMAL(6, 2),
  distance_to_market_km DECIMAL(6, 2),
  has_dedicated_transport_infrastructure BOOLEAN DEFAULT false,
  transport_infrastructure_details TEXT,
  
  -- Environmental aspects
  environmental_impact_assessment_conducted BOOLEAN DEFAULT false,
  eia_approval_date DATE,
  eia_approving_authority TEXT,
  environmental_impact mine_environmental_impact,
  has_environmental_management_plan BOOLEAN DEFAULT false,
  environmental_monitoring_frequency TEXT,
  air_quality_monitoring BOOLEAN DEFAULT false,
  water_quality_monitoring BOOLEAN DEFAULT false,
  soil_quality_monitoring BOOLEAN DEFAULT false,
  noise_monitoring BOOLEAN DEFAULT false,
  dust_suppression_measures TEXT,
  water_pollution_control_measures TEXT,
  acid_mine_drainage_issues BOOLEAN DEFAULT false,
  acid_mine_drainage_management TEXT,
  
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
  resettlement_required BOOLEAN DEFAULT false,
  resettled_households INTEGER,
  compensation_provided BOOLEAN DEFAULT false,
  compensation_details TEXT,
  community_development_programs TEXT,
  community_agreements_in_place BOOLEAN DEFAULT false,
  community_agreement_details TEXT,
  local_concerns TEXT,
  community_engagement_approach TEXT,
  
  -- Health and safety
  safety_rating mine_safety_rating,
  accident_statistics TEXT,
  fatalities_last_year INTEGER,
  fatalities_total INTEGER,
  lost_time_injuries_last_year INTEGER,
  safety_training_program BOOLEAN DEFAULT false,
  safety_measures TEXT,
  emergency_response_plan BOOLEAN DEFAULT false,
  health_monitoring_program BOOLEAN DEFAULT false,
  common_health_issues TEXT,
  
  -- Legal and compliance
  regulatory_compliance_level mine_compliance_level,
  recent_violations TEXT,
  pending_legal_cases TEXT,
  inspection_frequency TEXT,
  last_inspection_date DATE,
  inspecting_authority TEXT,
  inspection_findings TEXT,
  
  -- Challenges and issues
  operational_challenges TEXT,
  geological_challenges TEXT,
  financial_challenges TEXT,
  environmental_challenges TEXT,
  social_challenges TEXT,
  security_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  planned_investments_npr DECIMAL(18, 2),
  technology_upgrade_plans TEXT,
  sustainability_initiatives TEXT,
  
  -- Research and development
  research_activities TEXT,
  collaborations_with_institutions TEXT,
  innovative_technologies_used TEXT,
  
  -- Contact information
  manager_name TEXT,
  manager_phone TEXT,
  office_phone TEXT,
  email TEXT,
  website TEXT,
  corporate_headquarters TEXT,
  
  -- Linkages to other entities
  linked_processing_facilities JSONB DEFAULT '[]'::jsonb,
  linked_transport_infrastructure JSONB DEFAULT '[]'::jsonb,
  linked_power_sources JSONB DEFAULT '[]'::jsonb,
  linked_water_sources JSONB DEFAULT '[]'::jsonb,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  mine_boundary GEOMETRY(Polygon, 4326),
  operation_area GEOMETRY(Polygon, 4326),
  tunnel_network GEOMETRY(MultiLineString, 4326),
  waste_dump_areas GEOMETRY(MultiPolygon, 4326),
  water_monitoring_points GEOMETRY(MultiPoint, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_metal_mine_location_point ON acme_metal_mine USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_metal_mine_boundary ON acme_metal_mine USING GIST (mine_boundary);
CREATE INDEX IF NOT EXISTS idx_metal_mine_operation_area ON acme_metal_mine USING GIST (operation_area);
CREATE INDEX IF NOT EXISTS idx_metal_mine_tunnel_network ON acme_metal_mine USING GIST (tunnel_network);
CREATE INDEX IF NOT EXISTS idx_metal_mine_waste_dump_areas ON acme_metal_mine USING GIST (waste_dump_areas);
CREATE INDEX IF NOT EXISTS idx_metal_mine_water_monitoring ON acme_metal_mine USING GIST (water_monitoring_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_metal_mine_name ON acme_metal_mine(name);
CREATE INDEX IF NOT EXISTS idx_metal_mine_slug ON acme_metal_mine(slug);
CREATE INDEX IF NOT EXISTS idx_metal_mine_primary_metal ON acme_metal_mine(primary_metal);
CREATE INDEX IF NOT EXISTS idx_metal_mine_status ON acme_metal_mine(status);
CREATE INDEX IF NOT EXISTS idx_metal_mine_ownership ON acme_metal_mine(ownership_type);
