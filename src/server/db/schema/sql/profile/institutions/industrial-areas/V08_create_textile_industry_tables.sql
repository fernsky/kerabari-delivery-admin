-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Textile industry type enum
DO $$ 
BEGIN
  CREATE TYPE textile_industry_type AS ENUM (
    'SPINNING_MILL', 
    'WEAVING_UNIT', 
    'KNITTING_UNIT',
    'DYEING_AND_PRINTING', 
    'GARMENT_MANUFACTURING', 
    'CARPET_MANUFACTURING',
    'HANDICRAFT_TEXTILES', 
    'HANDLOOM',
    'PASHMINA_PRODUCTION', 
    'INTEGRATED_TEXTILE_MILL', 
    'MIXED_PRODUCTION', 
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Textile production scale enum
DO $$ 
BEGIN
  CREATE TYPE textile_production_scale AS ENUM (
    'MICRO_SCALE', 
    'SMALL_SCALE', 
    'MEDIUM_SCALE', 
    'LARGE_SCALE', 
    'COTTAGE_INDUSTRY',
    'HOME_BASED', 
    'INDUSTRIAL_SCALE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Raw material type enum
DO $$ 
BEGIN
  CREATE TYPE textile_raw_material AS ENUM (
    'COTTON', 
    'WOOL', 
    'SILK', 
    'SYNTHETIC_FIBER', 
    'JUTE',
    'HEMP', 
    'MIXED_FIBER', 
    'PASHMINA', 
    'ACRYLIC', 
    'POLYESTER',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the textile_industry table
CREATE TABLE IF NOT EXISTS acme_textile_industry (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  industry_type textile_industry_type NOT NULL,
  production_scale textile_production_scale NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Registration details
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT, -- Department/Authority
  pan_number VARCHAR(20),
  vat_registered BOOLEAN DEFAULT false,
  vat_number VARCHAR(20),
  
  -- Basic information
  established_year INTEGER,
  ownership_type VARCHAR(50), -- Private, Public, Cooperative, etc.
  owner_name TEXT,
  manager_name TEXT,
  legal_status TEXT, -- Sole proprietorship, Partnership, Company, etc.
  is_part_of_larger_group BOOLEAN DEFAULT false,
  parent_company TEXT,
  
  -- Facility details
  facility_area_sqm DECIMAL(10, 2),
  production_area_sqm DECIMAL(10, 2),
  storage_area_sqm DECIMAL(10, 2),
  showroom_area_sqm DECIMAL(10, 2),
  facility_ownership VARCHAR(50), -- Owned, Rented, Leased
  monthly_rent_npr DECIMAL(10, 2),
  building_condition TEXT,
  
  -- Production details
  operational_status VARCHAR(50),
  production_capacity_per_month TEXT, -- E.g., "10,000 meters fabric"
  actual_production_per_month TEXT,
  shift_operation TEXT, -- Single shift, Double shift, etc.
  operational_days_per_week INTEGER,
  operational_hours_per_day INTEGER,
  seasonal_operation BOOLEAN DEFAULT false,
  peak_production_months TEXT,
  
  -- Raw materials
  primary_raw_material textile_raw_material,
  secondary_raw_materials TEXT,
  raw_material_sources TEXT,
  raw_material_imported_percentage DECIMAL(5, 2),
  monthly_raw_material_consumption TEXT,
  raw_material_storage_capacity TEXT,
  raw_material_challenges TEXT,
  average_raw_material_cost_npr TEXT,
  
  -- Products
  main_products TEXT,
  product_specialties TEXT,
  traditional_designs BOOLEAN DEFAULT false,
  traditional_design_details TEXT,
  contemporary_designs BOOLEAN DEFAULT false,
  custom_order_capability BOOLEAN DEFAULT false,
  main_product_sizes TEXT,
  product_quality_levels TEXT,
  price_range_npr TEXT,
  
  -- Equipment and technology
  machinery_types TEXT,
  machinery_count INTEGER,
  machinery_age_years TEXT,
  machinery_source TEXT, -- Imported, Domestic, etc.
  automation_level TEXT,
  has_computerized_systems BOOLEAN DEFAULT false,
  computerized_system_details TEXT,
  technology_upgrades_last_5_years TEXT,
  equipment_maintenance_system TEXT,
  
  -- Production process
  pre_production_processes TEXT, -- Spinning, Yarn preparation, etc.
  main_production_processes TEXT, -- Weaving, Knitting, etc.
  post_production_processes TEXT, -- Dyeing, Printing, etc.
  finishing_processes TEXT,
  quality_control_processes TEXT,
  production_bottlenecks TEXT,
  
  -- Employment
  total_employees INTEGER,
  skilled_workers INTEGER,
  unskilled_workers INTEGER,
  administrative_staff INTEGER,
  male_employees INTEGER,
  female_employees INTEGER,
  local_employees_percentage DECIMAL(5, 2),
  average_monthly_wage_npr DECIMAL(10, 2),
  employee_benefits TEXT,
  staff_training_programs TEXT,
  
  -- Market and sales
  primary_market_area TEXT,
  sells_domestically BOOLEAN DEFAULT true,
  domestic_market_percentage DECIMAL(5, 2),
  exports_products BOOLEAN DEFAULT false,
  export_percentage DECIMAL(5, 2),
  export_destinations TEXT,
  sales_channels TEXT,
  has_direct_retail BOOLEAN DEFAULT false,
  retail_outlet_count INTEGER,
  institutional_customers TEXT,
  average_monthly_sales_npr DECIMAL(14, 2),
  annual_revenue_npr DECIMAL(18, 2),
  seasonal_sales_pattern TEXT,
  
  -- Marketing and branding
  has_branded_products BOOLEAN DEFAULT false,
  brand_names TEXT,
  marketing_strategies TEXT,
  has_online_presence BOOLEAN DEFAULT false,
  online_presence_details TEXT,
  participates_in_exhibitions BOOLEAN DEFAULT false,
  exhibition_participation_details TEXT,
  
  -- Financial aspects
  initial_investment_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(18, 2),
  profitability_status TEXT,
  has_loan_financing BOOLEAN DEFAULT false,
  financing_sources TEXT,
  financial_challenges TEXT,
  credit_access_difficulties TEXT,
  
  -- Environmental aspects
  has_environmental_clearance BOOLEAN DEFAULT false,
  has_effluent_treatment BOOLEAN DEFAULT false,
  effluent_treatment_details TEXT,
  water_consumption_liters_per_day DECIMAL(10, 2),
  water_source TEXT,
  energy_consumption_units_per_month DECIMAL(10, 2),
  energy_source TEXT,
  waste_management_system TEXT,
  uses_eco_friendly_processes BOOLEAN DEFAULT false,
  eco_friendly_process_details TEXT,
  environmental_challenges TEXT,
  
  -- Quality and standards
  has_quality_certification BOOLEAN DEFAULT false,
  certification_details TEXT,
  quality_testing_methods TEXT,
  follow_national_standards BOOLEAN DEFAULT false,
  follow_international_standards BOOLEAN DEFAULT false,
  standards_followed TEXT,
  quality_issues TEXT,
  rejection_rate_percentage DECIMAL(5, 2),
  
  -- Design and innovation
  has_design_department BOOLEAN DEFAULT false,
  design_staff_count INTEGER,
  design_process TEXT,
  new_design_frequency TEXT,
  innovation_initiatives TEXT,
  product_development_process TEXT,
  design_inspiration_sources TEXT,
  
  -- Industry associations
  member_of_textile_association BOOLEAN DEFAULT false,
  association_details TEXT,
  benefits_from_associations TEXT,
  industry_collaboration_details TEXT,
  
  -- Government support and regulation
  received_government_support BOOLEAN DEFAULT false,
  government_support_details TEXT,
  regulatory_compliance_challenges TEXT,
  policy_support_needs TEXT,
  
  -- Challenges and needs
  production_challenges TEXT,
  raw_material_challenges TEXT,
  market_challenges TEXT,
  skilled_labor_challenges TEXT,
  technology_challenges TEXT,
  infrastructure_needs TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  diversification_plans TEXT,
  upgrading_plans TEXT,
  market_expansion_plans TEXT,
  
  -- Cultural and traditional aspects
  preserves_traditional_techniques BOOLEAN DEFAULT false,
  traditional_techniques_details TEXT,
  cultural_significance_of_products TEXT,
  generational_knowledge_transfer TEXT,
  contributes_to_cultural_heritage BOOLEAN DEFAULT false,
  cultural_heritage_contribution TEXT,
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  website TEXT,
  
  -- Additional details
  unique_selling_points TEXT,
  local_economic_impact TEXT,
  community_engagement TEXT,
  csr_activities TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  facility_boundary GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_textile_industry_location_point ON acme_textile_industry USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_textile_industry_boundary ON acme_textile_industry USING GIST (facility_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_textile_industry_name ON acme_textile_industry(name);
CREATE INDEX IF NOT EXISTS idx_textile_industry_slug ON acme_textile_industry(slug);
CREATE INDEX IF NOT EXISTS idx_textile_industry_type ON acme_textile_industry(industry_type);
CREATE INDEX IF NOT EXISTS idx_textile_industry_scale ON acme_textile_industry(production_scale);
