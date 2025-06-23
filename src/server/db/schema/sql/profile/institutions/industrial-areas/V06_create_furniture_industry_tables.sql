-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Furniture industry type enum
DO $$ 
BEGIN
  CREATE TYPE furniture_industry_type AS ENUM (
    'WOODEN_FURNITURE', 
    'METAL_FURNITURE', 
    'BAMBOO_FURNITURE',
    'MIXED_MATERIAL', 
    'UPHOLSTERED_FURNITURE', 
    'PLASTIC_FURNITURE',
    'CUSTOM_CARPENTRY', 
    'INDUSTRIAL_FURNITURE',
    'INTERIOR_DESIGN_AND_FURNITURE', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Furniture production scale enum
DO $$ 
BEGIN
  CREATE TYPE furniture_production_scale AS ENUM (
    'MICRO_SCALE', 
    'SMALL_SCALE', 
    'MEDIUM_SCALE', 
    'LARGE_SCALE', 
    'COTTAGE_INDUSTRY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the furniture_industry table
CREATE TABLE IF NOT EXISTS acme_furniture_industry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  industry_type furniture_industry_type NOT NULL,
  production_scale furniture_production_scale NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Registration details
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT, -- Department, Office, Municipality
  pan_number VARCHAR(20),
  vat_registered BOOLEAN DEFAULT false,
  vat_number VARCHAR(20),
  
  -- Basic information
  established_year INTEGER,
  ownership_type VARCHAR(50), -- Private, Public, Cooperative, Family, etc.
  owner_name TEXT,
  manager_name TEXT,
  legal_status TEXT, -- Sole proprietorship, Partnership, Company, etc.
  
  -- Facility details
  factory_area_sqm DECIMAL(10, 2),
  workshop_area_sqm DECIMAL(10, 2),
  showroom_area_sqm DECIMAL(10, 2),
  storage_area_sqm DECIMAL(10, 2),
  office_area_sqm DECIMAL(10, 2),
  facility_ownership VARCHAR(50), -- Owned, Rented, Leased
  monthly_rent_npr DECIMAL(10, 2),
  building_condition TEXT,
  has_dedicated_showroom BOOLEAN DEFAULT false,
  showroom_location TEXT,
  
  -- Production details
  operational_status VARCHAR(50), -- Fully operational, Partially operational, etc.
  production_capacity_per_month TEXT, -- E.g., "200 chairs, 50 tables"
  actual_production_per_month TEXT,
  main_products TEXT,
  specialty_items TEXT,
  custom_order_capability BOOLEAN DEFAULT true,
  design_capability VARCHAR(50), -- In-house design, Copying designs, etc.
  production_process_details TEXT,
  quality_control_process TEXT,
  peak_production_months TEXT,
  
  -- Equipment and technology
  has_power_machinery BOOLEAN DEFAULT true,
  main_machinery_types TEXT,
  machinery_count INTEGER,
  tools_and_equipment TEXT,
  technology_level TEXT, -- Traditional, Semi-automated, Automated
  machine_maintenance_system TEXT,
  recent_technology_adoptions TEXT,
  
  -- Raw materials
  primary_wood_types TEXT,
  other_materials_used TEXT,
  raw_material_sources TEXT, -- Local market, Imports, Forest products, etc.
  monthly_wood_consumption_cubic_m DECIMAL(10, 2),
  monthly_other_materials_consumption TEXT,
  material_quality_standards TEXT,
  material_storage_conditions TEXT,
  material_supply_challenges TEXT,
  
  -- Employment
  total_employees INTEGER,
  skilled_craftsmen INTEGER,
  unskilled_workers INTEGER,
  administrative_staff INTEGER,
  male_employees INTEGER,
  female_employees INTEGER,
  average_monthly_wage_npr DECIMAL(10, 2),
  employee_benefits TEXT,
  training_programs TEXT,
  craftsman_training_system TEXT,
  
  -- Environmental aspects
  has_environmental_clearance BOOLEAN DEFAULT false,
  waste_management_system TEXT,
  wood_waste_recycling BOOLEAN DEFAULT false,
  waste_recycling_methods TEXT,
  dust_control_measures TEXT,
  noise_control_measures TEXT,
  uses_sustainable_wood BOOLEAN DEFAULT false,
  sustainable_practices TEXT,
  environmental_challenges TEXT,
  
  -- Market and sales
  primary_market_area TEXT,
  export_markets TEXT,
  main_customer_types TEXT, -- Households, Businesses, Institutions, etc.
  sales_channels TEXT, -- Direct sales, Dealers, Online, etc.
  has_online_sales BOOLEAN DEFAULT false,
  online_sales_platform TEXT,
  average_monthly_sales_npr DECIMAL(14, 2),
  annual_sales_volume_npr DECIMAL(18, 2),
  peak_sales_season TEXT,
  marketing_strategies TEXT,
  has_branding BOOLEAN DEFAULT false,
  branding_details TEXT,
  
  -- Financial aspects
  initial_investment_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(18, 2),
  profitability_status TEXT,
  has_loan_financing BOOLEAN DEFAULT false,
  financing_sources TEXT,
  financial_challenges TEXT,
  annual_revenue_npr DECIMAL(18, 2),
  
  -- Innovation and design
  design_process TEXT,
  has_catalogues BOOLEAN DEFAULT false,
  new_product_development_frequency TEXT,
  follows_market_trends BOOLEAN DEFAULT true,
  design_influences TEXT,
  traditional_elements_incorporated TEXT,
  modernization_approaches TEXT,
  
  -- Quality and standards
  has_quality_standards BOOLEAN DEFAULT false,
  quality_certification TEXT,
  warranty_offered BOOLEAN DEFAULT false,
  warranty_details TEXT,
  quality_testing_methods TEXT,
  customer_return_policy TEXT,
  
  -- Occupational safety
  has_safety_equipment BOOLEAN DEFAULT false,
  safety_equipment_details TEXT,
  has_fire_safety BOOLEAN DEFAULT false,
  fire_safety_equipment TEXT,
  occupational_health_measures TEXT,
  accident_history TEXT,
  
  -- Industry associations
  member_of_furniture_association BOOLEAN DEFAULT false,
  association_details TEXT,
  collective_initiatives TEXT,
  industry_collaboration_details TEXT,
  
  -- Government support and regulation
  received_government_support BOOLEAN DEFAULT false,
  government_support_details TEXT,
  regulatory_challenges TEXT,
  tax_incentives_received TEXT,
  policy_recommendations TEXT,
  
  -- Challenges and needs
  production_challenges TEXT,
  market_challenges TEXT,
  skilled_labor_challenges TEXT,
  infrastructure_needs TEXT,
  technical_assistance_needs TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  technology_upgrade_plans TEXT,
  market_expansion_plans TEXT,
  succession_planning TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  website TEXT,
  social_media_handles TEXT,
  
  -- Additional details
  unique_selling_points TEXT,
  furniture_styles_specialized TEXT,
  historical_significance TEXT,
  local_economic_impact TEXT,
  community_engagement TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  showroom_location_point GEOMETRY(Point, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_furniture_industry_location_point ON acme_furniture_industry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_furniture_industry_boundary ON acme_furniture_industry USING GIST (facility_boundary);
CREATE INDEX IF NOT EXISTS idx_furniture_industry_showroom ON acme_furniture_industry USING GIST (showroom_location_point);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_furniture_industry_name ON acme_furniture_industry(name);
CREATE INDEX IF NOT EXISTS idx_furniture_industry_slug ON acme_furniture_industry(slug);
CREATE INDEX IF NOT EXISTS idx_furniture_industry_type ON acme_furniture_industry(industry_type);
CREATE INDEX IF NOT EXISTS idx_furniture_industry_scale ON acme_furniture_industry(production_scale);
