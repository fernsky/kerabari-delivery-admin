-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Health post type enum
DO $$ 
BEGIN
  CREATE TYPE health_post_type AS ENUM (
    'PRIMARY_HEALTH_POST', 'SUB_HEALTH_POST', 'COMMUNITY_HEALTH_UNIT',
    'URBAN_HEALTH_CENTER', 'HEALTH_POST_WITH_BIRTHING_CENTER', 
    'AYURVEDIC_HEALTH_POST', 'MOBILE_HEALTH_POST', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Health post management type enum
DO $$ 
BEGIN
  CREATE TYPE health_post_management AS ENUM (
    'GOVERNMENT', 'COMMUNITY_MANAGED', 'PRIVATE_PUBLIC_PARTNERSHIP',
    'NGO_MANAGED', 'FAITH_BASED', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Service availability enum for health post
DO $$ 
BEGIN
  CREATE TYPE health_post_service_availability AS ENUM (
    'DAILY', 'WEEKDAYS_ONLY', 'SPECIFIC_DAYS',
    'EMERGENCY_ONLY', 'SEASONAL', 'LIMITED_HOURS',
    'TWENTY_FOUR_HOURS'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Service adequacy enum
DO $$ 
BEGIN
  CREATE TYPE service_adequacy AS ENUM (
    'HIGHLY_ADEQUATE', 'ADEQUATE', 'SOMEWHAT_ADEQUATE',
    'INADEQUATE', 'SEVERELY_INADEQUATE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the health post table
CREATE TABLE IF NOT EXISTS acme_health_post (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  health_post_type health_post_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_date DATE,
  registration_number VARCHAR(50),
  management_type health_post_management NOT NULL,
  parent_facility_id VARCHAR(36),
  catchment_population INTEGER,
  catchment_area_description TEXT,
  service_availability health_post_service_availability,
  
  -- Leadership and management
  in_charge_title TEXT,
  in_charge_name TEXT,
  in_charge_contact_number TEXT,
  supervising_officer TEXT,
  supervising_entity TEXT,
  has_management_committee BOOLEAN DEFAULT FALSE,
  management_committee_details TEXT,
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  emergency_contact_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  is_24_hour_service BOOLEAN DEFAULT FALSE,
  weekly_off_day TEXT,
  service_hours_per_week INTEGER,
  has_emergency_services BOOLEAN DEFAULT FALSE,
  emergency_service_details TEXT,
  
  -- Facility details
  building_ownership TEXT,
  building_condition health_post_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  total_area_sq_m DECIMAL(10, 2),
  has_adequate_waiting_area BOOLEAN DEFAULT FALSE,
  has_toilets BOOLEAN DEFAULT TRUE,
  has_separate_toilets_for_genders BOOLEAN DEFAULT FALSE,
  has_patient_privacy BOOLEAN DEFAULT FALSE,
  has_wheelchair_access BOOLEAN DEFAULT FALSE,
  has_electricity BOOLEAN DEFAULT TRUE,
  electricity_availability_hours_per_day INTEGER,
  has_power_backup BOOLEAN DEFAULT FALSE,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT TRUE,
  water_source_type TEXT,
  water_availability TEXT,
  has_birthing_center BOOLEAN DEFAULT FALSE,
  has_laboratory BOOLEAN DEFAULT FALSE,
  has_pharmacy BOOLEAN DEFAULT FALSE,
  has_waste_management BOOLEAN DEFAULT FALSE,
  waste_management_details TEXT,
  has_handwashing_facility BOOLEAN DEFAULT FALSE,
  is_covid19_ready BOOLEAN DEFAULT FALSE,
  facility_condition TEXT,
  has_furniture BOOLEAN DEFAULT TRUE,
  furniture_condition TEXT,
  
  -- Staff details
  total_staff_count INTEGER,
  health_assistant_count INTEGER,
  anm_count INTEGER,
  ahw_count INTEGER,
  mch_worker_count INTEGER,
  vaccinator_count INTEGER,
  support_staff_count INTEGER,
  volunteer_count INTEGER,
  female_cht_count INTEGER,
  male_cht_count INTEGER,
  any_staff_shortage_current BOOLEAN DEFAULT FALSE,
  staff_shortage_details TEXT,
  staff_training_status TEXT,
  staff_residency_available BOOLEAN DEFAULT FALSE,
  
  -- Services offered
  general_health_services BOOLEAN DEFAULT TRUE,
  maternal_health_services BOOLEAN DEFAULT TRUE,
  child_health_services BOOLEAN DEFAULT TRUE,
  immunization_services BOOLEAN DEFAULT TRUE,
  family_planning_services BOOLEAN DEFAULT TRUE,
  nutrition_services BOOLEAN DEFAULT TRUE,
  tuberculosis_services BOOLEAN DEFAULT TRUE,
  hiv_services BOOLEAN DEFAULT FALSE,
  mental_health_services BOOLEAN DEFAULT FALSE,
  geriatric_services BOOLEAN DEFAULT FALSE,
  laboratory_conducts_tests BOOLEAN DEFAULT FALSE,
  laboratory_test_types TEXT,
  regular_vaccination_days TEXT,
  antenatal_care_services BOOLEAN DEFAULT TRUE,
  post_natal_care_services BOOLEAN DEFAULT TRUE,
  outreach_clinics_held_monthly INTEGER,
  offers_telemedicine BOOLEAN DEFAULT FALSE,
  telemedicine_details TEXT,
  referral_services BOOLEAN DEFAULT TRUE,
  referral_destination TEXT,
  ambulance_accessible BOOLEAN DEFAULT FALSE,
  ambulance_contact_number TEXT,
  has_referral_protocols BOOLEAN DEFAULT FALSE,
  additional_services TEXT,
  
  -- Equipment and medications
  has_basic_equipment BOOLEAN DEFAULT TRUE,
  basic_equipment_condition equipment_condition,
  has_diagnostic_equipment BOOLEAN DEFAULT FALSE,
  diagnostic_equipment_detail TEXT,
  has_cold_chain BOOLEAN DEFAULT FALSE,
  cold_chain_condition equipment_condition,
  has_essential_medicines BOOLEAN DEFAULT TRUE,
  essential_medicines_availability TEXT,
  medicine_stockout_frequency TEXT,
  has_prenatal_vitamins BOOLEAN DEFAULT TRUE,
  has_oral_rehydration_therapy BOOLEAN DEFAULT TRUE,
  has_antibiotics BOOLEAN DEFAULT TRUE,
  has_antimalarials BOOLEAN DEFAULT FALSE,
  has_basic_anesthesia BOOLEAN DEFAULT FALSE,
  has_oxygen_supply BOOLEAN DEFAULT FALSE,
  drug_inventory_system TEXT,
  regular_medicine_supply_frequency TEXT,
  
  -- Performance and utilization
  average_monthly_outpatients INTEGER,
  average_monthly_antenatal_visits INTEGER,
  average_monthly_deliveries INTEGER,
  average_monthly_child_checkups INTEGER,
  average_monthly_family_planning INTEGER,
  average_monthly_immunization INTEGER,
  service_utilization_trend TEXT,
  performance_evaluation_system TEXT,
  last_performance_review_date DATE,
  patient_satisfaction_measured BOOLEAN DEFAULT FALSE,
  patient_satisfaction_level TEXT,
  
  -- Health information system
  has_record_keeping_system BOOLEAN DEFAULT TRUE,
  record_keeping_type TEXT,
  has_electronic_health_records BOOLEAN DEFAULT FALSE,
  electronic_system_details TEXT,
  uses_hmis BOOLEAN DEFAULT FALSE,
  has_internet_for_reporting BOOLEAN DEFAULT FALSE,
  reporting_frequency TEXT,
  last_reporting_date DATE,
  has_surveillance_system BOOLEAN DEFAULT FALSE,
  surveillance_details TEXT,
  
  -- Community engagement
  has_community_outreach BOOLEAN DEFAULT FALSE,
  outreach_activities TEXT,
  fchv_count INTEGER,
  fchv_active_percent DECIMAL(5, 2),
  mother_groups_active BOOLEAN DEFAULT FALSE,
  mother_group_count INTEGER,
  health_education_sessions BOOLEAN DEFAULT FALSE,
  health_education_frequency TEXT,
  school_health_program BOOLEAN DEFAULT FALSE,
  community_based_activities TEXT,
  community_feedback_mechanism BOOLEAN DEFAULT FALSE,
  feedback_mechanism_details TEXT,
  
  -- Budget and finance
  annual_budget_npr DECIMAL(18, 2),
  budget_fiscal_year VARCHAR(9),
  government_funding_percent DECIMAL(5, 2),
  donor_funding_percent DECIMAL(5, 2),
  local_funding_percent DECIMAL(5, 2),
  user_fees_collected BOOLEAN DEFAULT FALSE,
  free_service_availability TEXT,
  annual_expenditure_npr DECIMAL(18, 2),
  financial_management_system TEXT,
  
  -- Supplies and logistics
  supply_chain_mechanism TEXT,
  medicine_supplier_type TEXT,
  supply_frequency TEXT,
  stockout_frequency TEXT,
  inventory_management_system TEXT,
  logistics_support TEXT,
  last_supply_received_date DATE,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  staffing_challenges TEXT,
  supply_challenges TEXT,
  service_challenges TEXT,
  other_challenges TEXT,
  priority_needs TEXT,
  service_improvement_plans TEXT,
  
  -- Monitoring and quality assurance
  regulatory_compliance BOOLEAN DEFAULT TRUE,
  last_supervision_date DATE,
  supervision_frequency TEXT,
  supervising_authority TEXT,
  quality_improvement_system BOOLEAN DEFAULT FALSE,
  quality_improvement_details TEXT,
  patient_safety_measures TEXT,
  infection_control_protocols BOOLEAN DEFAULT FALSE,
  waste_disposal_system TEXT,
  
  -- Partnerships and coordination
  partnership_with_ngos BOOLEAN DEFAULT FALSE,
  partner_ngo_details TEXT,
  local_coordination_mechanism TEXT,
  health_system_integration TEXT,
  private_sector_coordination BOOLEAN DEFAULT FALSE,
  community_group_coordination BOOLEAN DEFAULT FALSE,
  referral_network_strength TEXT,
  
  -- Service adequacy and quality
  service_adequacy service_adequacy,
  service_quality TEXT,
  patient_feedback TEXT,
  community_perception TEXT,
  staff_satisfaction TEXT,
  
  -- Disaster preparedness
  disaster_preparedness BOOLEAN DEFAULT FALSE,
  disaster_plan_details TEXT,
  emergency_response_capability TEXT,
  disaster_training_for_staff BOOLEAN DEFAULT FALSE,
  emergency_supplies_available BOOLEAN DEFAULT FALSE,
  
  -- Future development
  expansion_plans TEXT,
  planned_upgrades TEXT,
  service_enhancement_plans TEXT,
  community_future_plans TEXT,
  sustainability_plans TEXT,
  
  -- Linkages to other entities
  linked_referral_centers JSONB DEFAULT '[]'::jsonb,
  linked_community_centers JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  catchment_area_polygon GEOMETRY(MultiPolygon, 4326),
  
  -- Status and metadata
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(36),
  updated_by VARCHAR(36)
);

-- Create spatial indexes for faster geospatial queries
CREATE INDEX IF NOT EXISTS idx_health_post_location_point ON acme_health_post USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_health_post_building_footprint ON acme_health_post USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_health_post_catchment_area ON acme_health_post USING GIST (catchment_area_polygon);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_health_post_name ON acme_health_post(name);
CREATE INDEX IF NOT EXISTS idx_health_post_slug ON acme_health_post(slug);
CREATE INDEX IF NOT EXISTS idx_health_post_type ON acme_health_post(health_post_type);
CREATE INDEX IF NOT EXISTS idx_health_post_management ON acme_health_post(management_type);
CREATE INDEX IF NOT EXISTS idx_health_post_ward ON acme_health_post(ward_number);
