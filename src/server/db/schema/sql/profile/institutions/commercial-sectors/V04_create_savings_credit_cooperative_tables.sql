-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define cooperative type enum
DO $$ 
BEGIN
  CREATE TYPE cooperative_type AS ENUM (
    'SAVINGS_AND_CREDIT',
    'MULTIPURPOSE',
    'AGRICULTURE',
    'DAIRY',
    'CONSUMER',
    'WORKERS',
    'HOUSING',
    'ELECTRICITY',
    'WOMEN_FOCUSED',
    'YOUTH_FOCUSED',
    'COMMUNITY_BASED',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define membership focus enum
DO $$ 
BEGIN
  CREATE TYPE membership_focus AS ENUM (
    'GENERAL_PUBLIC',
    'WOMEN_ONLY',
    'FARMERS',
    'SPECIFIC_COMMUNITY',
    'EMPLOYEES',
    'LOW_INCOME',
    'YOUTH',
    'ENTREPRENEURS',
    'MIXED_FOCUS',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define financial health status enum
DO $$ 
BEGIN
  CREATE TYPE financial_health_status AS ENUM (
    'EXCELLENT',
    'GOOD',
    'SATISFACTORY',
    'AVERAGE',
    'NEEDS_IMPROVEMENT',
    'POOR',
    'CRITICAL',
    'UNDER_REVIEW'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the savings and credit cooperative table
CREATE TABLE IF NOT EXISTS acme_savings_credit_cooperative (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_in_local_language TEXT,
  description TEXT,
  cooperative_type cooperative_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  landmark TEXT,
  gps_coordinates TEXT,
  
  -- Basic information
  established_year INTEGER,
  registration_number VARCHAR(50),
  registration_date DATE,
  registered_with TEXT,
  pan_number VARCHAR(20),
  license_number VARCHAR(30),
  regulatory_body TEXT,
  membership_focus membership_focus,
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  email TEXT,
  website_url TEXT,
  facebook_page TEXT,
  
  -- Management details
  chairperson_name TEXT,
  manager_name TEXT,
  board_members_count INTEGER,
  female_board_members_count INTEGER,
  board_election_frequency_years INTEGER,
  last_board_election_date DATE,
  next_board_election_date DATE,
  
  -- Staff information
  total_staff_count INTEGER,
  permanent_staff_count INTEGER,
  temporary_staff_count INTEGER,
  female_staff_count INTEGER,
  accountant_count INTEGER,
  loan_officer_count INTEGER,
  cashier_count INTEGER,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  working_days TEXT,
  off_days TEXT,
  
  -- Physical infrastructure
  has_own_building BOOLEAN DEFAULT false,
  building_type TEXT,
  building_condition facility_condition,
  total_area_sq_m DECIMAL(10, 2),
  office_area_sq_m DECIMAL(10, 2),
  number_of_counters INTEGER,
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_capacity INTEGER,
  has_separate_departments BOOLEAN DEFAULT false,
  departments TEXT,
  has_meeting_room BOOLEAN DEFAULT false,
  has_training_hall BOOLEAN DEFAULT false,
  training_hall_capacity INTEGER,
  
  -- Membership details
  total_members_count INTEGER,
  active_members_count INTEGER,
  female_members_percentage DECIMAL(5, 2),
  youth_members_percentage DECIMAL(5, 2),
  membership_growth_rate_yearly DECIMAL(5, 2),
  membership_fee_npr DECIMAL(10, 2),
  share_value_npr DECIMAL(10, 2),
  minimum_shares_required INTEGER,
  
  -- Financial information
  total_share_capital_npr DECIMAL(18, 2),
  total_savings_npr DECIMAL(18, 2),
  total_loan_portfolio_npr DECIMAL(18, 2),
  total_assets_npr DECIMAL(18, 2),
  reserve_fund_npr DECIMAL(18, 2),
  annual_turnover_npr DECIMAL(18, 2),
  profit_last_fiscal_year_npr DECIMAL(18, 2),
  operational_self_sufficiency_percentage DECIMAL(5, 2),
  capital_adequacy_ratio DECIMAL(5, 2),
  financial_health_status financial_health_status,
  
  -- Savings products
  number_of_saving_products INTEGER,
  saving_products_details JSONB DEFAULT '[]'::jsonb,
  minimum_saving_amount_npr DECIMAL(10, 2),
  maximum_interest_rate_on_savings DECIMAL(5, 2),
  minimum_interest_rate_on_savings DECIMAL(5, 2),
  interest_calculation_method TEXT,
  interest_payment_frequency TEXT,
  total_savings_accounts INTEGER,
  
  -- Loan products
  number_of_loan_products INTEGER,
  loan_products_details JSONB DEFAULT '[]'::jsonb,
  minimum_loan_amount_npr DECIMAL(10, 2),
  maximum_loan_amount_npr DECIMAL(18, 2),
  minimum_interest_rate_on_loans DECIMAL(5, 2),
  maximum_interest_rate_on_loans DECIMAL(5, 2),
  loan_processing_fee_percentage DECIMAL(5, 2),
  loan_insurance_requirement TEXT,
  loan_disbursement_method TEXT,
  total_active_loans INTEGER,
  
  -- Portfolio quality
  portfolio_at_risk_30_days_percentage DECIMAL(5, 2),
  non_performing_loan_ratio DECIMAL(5, 2),
  loan_loss_provision_ratio DECIMAL(5, 2),
  recovery_rate_percentage DECIMAL(5, 2),
  loan_collection_method TEXT,
  default_management_procedures TEXT,
  
  -- Other financial services
  provides_remittance_services BOOLEAN DEFAULT false,
  remittance_service_providers JSONB DEFAULT '[]'::jsonb,
  provides_insurance_services BOOLEAN DEFAULT false,
  insurance_service_details TEXT,
  provides_atm_services BOOLEAN DEFAULT false,
  atm_count INTEGER,
  provides_mobile_banking BOOLEAN DEFAULT false,
  mobile_banking_details TEXT,
  provides_internet_banking BOOLEAN DEFAULT false,
  other_financial_services TEXT,
  
  -- Digital capabilities
  has_computerized_system BOOLEAN DEFAULT true,
  software_used TEXT,
  has_online_transaction_capability BOOLEAN DEFAULT false,
  has_sms_banking BOOLEAN DEFAULT false,
  offers_digital_financial_literacy BOOLEAN DEFAULT false,
  online_services_offered TEXT,
  digital_payment_options JSONB DEFAULT '[]'::jsonb,
  connectivity_challenges TEXT,
  
  -- Compliance and governance
  has_operating_manual BOOLEAN DEFAULT true,
  has_credit_policy BOOLEAN DEFAULT true,
  has_investment_policy BOOLEAN DEFAULT true,
  has_hr_policy BOOLEAN DEFAULT true,
  has_term_limits_for_board BOOLEAN DEFAULT true,
  complies_with_nrb_directives BOOLEAN DEFAULT true,
  compliance_challenges TEXT,
  governance_issues TEXT,
  last_audit_date DATE,
  audit_rating TEXT,
  
  -- Member support and education
  offers_financial_literacy_training BOOLEAN DEFAULT false,
  financial_literacy_program_details TEXT,
  offers_business_development_support BOOLEAN DEFAULT false,
  business_support_details TEXT,
  offers_member_welfare_programs BOOLEAN DEFAULT false,
  welfare_program_details TEXT,
  offers_scholarships BOOLEAN DEFAULT false,
  scholarship_details TEXT,
  
  -- Community impact
  community_development_initiatives TEXT,
  social_programs JSONB DEFAULT '[]'::jsonb,
  environmental_initiatives TEXT,
  economic_impact_on_community TEXT,
  jobs_created_through_loans INTEGER,
  businesses_supported_count INTEGER,
  
  -- Partnerships and networks
  affiliated_with_federation BOOLEAN DEFAULT false,
  federation_name TEXT,
  partner_organizations JSONB DEFAULT '[]'::jsonb,
  international_partnerships TEXT,
  government_coordination_details TEXT,
  
  -- Challenges and issues
  operational_challenges TEXT,
  financial_challenges TEXT,
  market_competition TEXT,
  regulatory_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  planned_new_products TEXT,
  digitalization_plans TEXT,
  strategic_goals TEXT,
  
  -- Security measures
  has_physical_cash_security BOOLEAN DEFAULT true,
  cash_security_measures TEXT,
  has_data_security_measures BOOLEAN DEFAULT true,
  data_security_details TEXT,
  has_disaster_recovery_plan BOOLEAN DEFAULT false,
  has_insurance_coverage BOOLEAN DEFAULT true,
  insurance_coverage_details TEXT,
  
  -- Linkages to other entities
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  linked_business_enterprises JSONB DEFAULT '[]'::jsonb,
  linked_training_centers JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  service_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_cooperative_location_point ON acme_savings_credit_cooperative USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_cooperative_service_area ON acme_savings_credit_cooperative USING GIST (service_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_cooperative_name ON acme_savings_credit_cooperative(name);
CREATE INDEX IF NOT EXISTS idx_cooperative_slug ON acme_savings_credit_cooperative(slug);
CREATE INDEX IF NOT EXISTS idx_cooperative_type ON acme_savings_credit_cooperative(cooperative_type);
CREATE INDEX IF NOT EXISTS idx_cooperative_ward ON acme_savings_credit_cooperative(ward_number);
CREATE INDEX IF NOT EXISTS idx_cooperative_health ON acme_savings_credit_cooperative(financial_health_status);
