-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define cbo_building_type enum
DO $$ 
BEGIN
  CREATE TYPE cbo_building_type AS ENUM (
    'NGO_OFFICE', 'COOPERATIVE_BUILDING', 'DEVELOPMENT_ORGANIZATION',
    'SOCIAL_SERVICE_CENTER', 'MICROFINANCE_INSTITUTION', 'FARMER_GROUP_BUILDING',
    'FOREST_USER_GROUP_BUILDING', 'WATER_USER_GROUP_BUILDING',
    'COMMUNITY_DISASTER_MANAGEMENT_CENTER', 'CIVIL_SOCIETY_ORGANIZATION',
    'MULTIPURPOSE_CBO_BUILDING', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define cbo_focus_area enum
DO $$ 
BEGIN
  CREATE TYPE cbo_focus_area AS ENUM (
    'POVERTY_REDUCTION', 'AGRICULTURE', 'EDUCATION', 'HEALTH',
    'GENDER_EQUALITY', 'NATURAL_RESOURCE_MANAGEMENT', 'MICROFINANCE',
    'DISASTER_MANAGEMENT', 'LIVELIHOOD_IMPROVEMENT', 'INFRASTRUCTURE_DEVELOPMENT',
    'CLIMATE_CHANGE_ADAPTATION', 'WATER_AND_SANITATION', 'RIGHTS_ADVOCACY',
    'MULTIPLE_FOCUS', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the community_based_organization_building table
CREATE TABLE IF NOT EXISTS acme_community_based_organization_building (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  building_type cbo_building_type NOT NULL,
  focus_area cbo_focus_area NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_year INTEGER,
  organization_established_year INTEGER,
  management_type management_type NOT NULL,
  registration_number VARCHAR(50),
  pan_number VARCHAR(20),
  registered_with TEXT,
  registration_date DATE,
  last_renewal_date DATE,
  is_affiliated_with_federation BOOLEAN DEFAULT false,
  federation_affiliation_details TEXT,
  
  -- Organization details
  organizational_vision TEXT,
  organizational_mission TEXT,
  organizational_objectives TEXT,
  target_beneficiaries TEXT,
  geographical_coverage TEXT,
  has_strategic_plan BOOLEAN DEFAULT false,
  strategic_plan_period TEXT,
  legal_status TEXT,
  annual_report_available BOOLEAN DEFAULT false,
  
  -- Membership details
  is_membership_based BOOLEAN DEFAULT false,
  total_member_count INTEGER,
  active_member_count INTEGER,
  male_member_count INTEGER,
  female_member_count INTEGER,
  other_gender_member_count INTEGER,
  dalit_member_count INTEGER,
  janajati_member_count INTEGER,
  brahmin_chhetri_member_count INTEGER,
  madhesi_member_count INTEGER,
  muslim_member_count INTEGER,
  other_ethnicity_member_count INTEGER,
  pwd_member_count INTEGER,
  youth_member_count INTEGER,
  women_member_count INTEGER,
  membership_fee_npr DECIMAL(10, 2),
  
  -- Physical infrastructure
  has_dedicated_building BOOLEAN DEFAULT true,
  building_ownership TEXT,
  monthly_rent_npr DECIMAL(10, 2),
  total_area_sq_m DECIMAL(10, 2),
  building_condition building_condition,
  construction_year INTEGER,
  construction_material building_construction_material,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  meeting_hall_capacity INTEGER,
  has_training_hall BOOLEAN DEFAULT false,
  training_hall_capacity INTEGER,
  has_office_space BOOLEAN DEFAULT false,
  has_reception_area BOOLEAN DEFAULT false,
  has_waiting_area BOOLEAN DEFAULT false,
  has_storage BOOLEAN DEFAULT false,
  has_kitchen BOOLEAN DEFAULT false,
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT true,
  has_power_backup BOOLEAN DEFAULT false,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT true,
  has_toilets BOOLEAN DEFAULT true,
  has_separate_toilets_for_genders BOOLEAN DEFAULT false,
  has_internet_connectivity BOOLEAN DEFAULT false,
  internet_type TEXT,
  internet_speed TEXT,
  
  -- Equipment and resources
  has_computers BOOLEAN DEFAULT false,
  computer_count INTEGER,
  has_laptops BOOLEAN DEFAULT false,
  laptop_count INTEGER,
  has_printers BOOLEAN DEFAULT false,
  printer_count INTEGER,
  has_photocopiers BOOLEAN DEFAULT false,
  photocopier_count INTEGER,
  has_projector BOOLEAN DEFAULT false,
  has_vehicles BOOLEAN DEFAULT false,
  vehicle_types TEXT,
  vehicle_count INTEGER,
  has_motorbikes BOOLEAN DEFAULT false,
  motorbike_count INTEGER,
  has_technical_equipment BOOLEAN DEFAULT false,
  technical_equipment_details TEXT,
  
  -- Activities and operations
  meeting_frequency TEXT,
  regular_programs TEXT,
  annual_program_count INTEGER,
  beneficiaries_served_annually INTEGER,
  major_services TEXT,
  community_outreach_activities TEXT,
  advocacy_activities TEXT,
  skill_development_programs TEXT,
  major_annual_events TEXT,
  usage_frequency usage_frequency,
  office_opening_time TIME,
  office_closing_time TIME,
  weekly_off_days TEXT,
  
  -- Financial aspects
  has_bank_account BOOLEAN DEFAULT true,
  bank_account_details TEXT,
  annual_budget_npr DECIMAL(18, 2),
  annual_operating_cost_npr DECIMAL(18, 2),
  annual_program_cost_npr DECIMAL(18, 2),
  funding_sources TEXT,
  has_multiple_year_funding BOOLEAN DEFAULT false,
  has_endowment_fund BOOLEAN DEFAULT false,
  endowment_fund_size_npr DECIMAL(18, 2),
  has_emergency_fund BOOLEAN DEFAULT false,
  has_annual_audit BOOLEAN DEFAULT true,
  last_audit_date DATE,
  receives_external_funding BOOLEAN DEFAULT false,
  external_funding_sources TEXT,
  receives_government_funding BOOLEAN DEFAULT false,
  government_funding_details TEXT,
  has_incoming_generating_activities BOOLEAN DEFAULT false,
  income_generating_activities_details TEXT,
  
  -- For cooperatives and microfinance
  has_saving_credit_program BOOLEAN DEFAULT false,
  total_savings_npr DECIMAL(18, 2),
  loan_portfolio_size_npr DECIMAL(18, 2),
  interest_rate_percent DECIMAL(5, 2),
  default_rate_percent DECIMAL(5, 2),
  active_borrower_count INTEGER,
  female_borrower_percent INTEGER,
  performing_loan_percent INTEGER,
  
  -- Governance and leadership
  has_written_constitution BOOLEAN DEFAULT true,
  has_operational_manual BOOLEAN DEFAULT false,
  has_human_resource_policy BOOLEAN DEFAULT false,
  has_financial_policy BOOLEAN DEFAULT false,
  has_procurement_policy BOOLEAN DEFAULT false,
  has_child_protection_policy BOOLEAN DEFAULT false,
  has_gender_policy BOOLEAN DEFAULT false,
  board_size INTEGER,
  female_in_board INTEGER,
  marginalised_groups_in_board INTEGER,
  board_selection_process TEXT,
  board_term_years INTEGER,
  last_board_election_date DATE,
  has_general_assembly BOOLEAN DEFAULT true,
  general_assembly_frequency TEXT,
  decision_making_process TEXT,
  has_subcommittees BOOLEAN DEFAULT false,
  subcommittee_details TEXT,
  has_conflict_of_interest_policy BOOLEAN DEFAULT false,
  
  -- Staff and human resources
  has_full_time_staff BOOLEAN DEFAULT false,
  full_time_staff_count INTEGER,
  has_part_time_staff BOOLEAN DEFAULT false,
  part_time_staff_count INTEGER,
  male_staff_count INTEGER,
  female_staff_count INTEGER,
  inclusive_staffing_policy BOOLEAN DEFAULT false,
  staff_turnover_rate_percent DECIMAL(5, 2),
  staff_training_budget_percent DECIMAL(5, 2),
  volunteer_count INTEGER,
  uses_external_consultants BOOLEAN DEFAULT false,
  has_social_security BOOLEAN DEFAULT false,
  has_insurance_for_staff BOOLEAN DEFAULT false,
  
  -- Project and program management
  ongoing_project_count INTEGER,
  completed_project_count INTEGER,
  has_logical_framework BOOLEAN DEFAULT false,
  has_monitoring_evaluation_system BOOLEAN DEFAULT false,
  monitoring_evaluation_details TEXT,
  has_baseline_data BOOLEAN DEFAULT false,
  conducts_beneficiary_satisfaction_survey BOOLEAN DEFAULT false,
  has_external_evaluation BOOLEAN DEFAULT false,
  major_project_details TEXT,
  project_success_rate INTEGER,
  
  -- Partnerships and networks
  has_partnership_with_local_government BOOLEAN DEFAULT false,
  local_government_partnership_details TEXT,
  has_partnership_with_provincial_government BOOLEAN DEFAULT false,
  provincial_government_partnership_details TEXT,
  has_partnership_with_federal_government BOOLEAN DEFAULT false,
  federal_government_partnership_details TEXT,
  has_partnership_with_ingos BOOLEAN DEFAULT false,
  ingo_partnership_details TEXT,
  has_partnership_with_private_sector BOOLEAN DEFAULT false,
  private_sector_partnership_details TEXT,
  has_partnership_with_academia BOOLEAN DEFAULT false,
  academia_partnership_details TEXT,
  network_memberships TEXT,
  
  -- Accessibility and inclusion
  accessibility_level accessibility_level,
  distance_from_main_road_km DECIMAL(6, 2),
  distance_from_city_or_bazar_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  inclusion_policies TEXT,
  inclusion_challenges TEXT,
  gender_mainstreaming TEXT,
  disabled_accessibility TEXT,
  
  -- Impact and achievements
  major_achievements TEXT,
  community_impact TEXT,
  success_stories TEXT,
  innovation_initiatives TEXT,
  good_practices TEXT,
  awards_and_recognition TEXT,
  research_publications TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  technical_challenges TEXT,
  financial_challenges TEXT,
  social_challenges TEXT,
  governance_challenges TEXT,
  capacity_building_needs TEXT,
  funding_needs TEXT,
  
  -- Future plans
  strategic_priorities TEXT,
  expansion_plans TEXT,
  sustainability_plans TEXT,
  future_projects_planned TEXT,
  partnership_plans TEXT,
  innovation_plans TEXT,
  
  -- Security and safety
  has_safety_protocol BOOLEAN DEFAULT false,
  safety_protocol_details TEXT,
  has_first_aid_kit BOOLEAN DEFAULT false,
  has_fire_extinguisher BOOLEAN DEFAULT false,
  has_emergency_exits BOOLEAN DEFAULT false,
  has_security_guard BOOLEAN DEFAULT false,
  has_cctv BOOLEAN DEFAULT false,
  has_boundary_wall BOOLEAN DEFAULT false,
  
  -- Contact information
  contact_person_name TEXT,
  contact_person_designation TEXT,
  chairperson_name TEXT,
  executive_director_name TEXT,
  contact_phone TEXT,
  alternate_contact_phone TEXT,
  contact_email TEXT,
  official_email TEXT,
  
  -- Digital presence
  has_social_media_presence BOOLEAN DEFAULT false,
  facebook_page TEXT,
  website_url TEXT,
  other_social_media TEXT,
  has_digital_database BOOLEAN DEFAULT false,
  uses_accounting_software BOOLEAN DEFAULT false,
  accounting_software_details TEXT,
  uses_hr_software BOOLEAN DEFAULT false,
  uses_program_management_software BOOLEAN DEFAULT false,
  software_details TEXT,
  
  -- Linkages to other entities
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_ngos JSONB DEFAULT '[]'::jsonb,
  linked_private_sector JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  compound_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_cbo_building_location_point ON acme_community_based_organization_building USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_cbo_building_footprint ON acme_community_based_organization_building USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_cbo_building_compound_area ON acme_community_based_organization_building USING GIST (compound_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_cbo_building_name ON acme_community_based_organization_building(name);
CREATE INDEX IF NOT EXISTS idx_cbo_building_slug ON acme_community_based_organization_building(slug);
CREATE INDEX IF NOT EXISTS idx_cbo_building_type ON acme_community_based_organization_building(building_type);
CREATE INDEX IF NOT EXISTS idx_cbo_focus_area ON acme_community_based_organization_building(focus_area);
CREATE INDEX IF NOT EXISTS idx_cbo_building_ward_number ON acme_community_based_organization_building(ward_number);
CREATE INDEX IF NOT EXISTS idx_cbo_building_registration_number ON acme_community_based_organization_building(registration_number);
