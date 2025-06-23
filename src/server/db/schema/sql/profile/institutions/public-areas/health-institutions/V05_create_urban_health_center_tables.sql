-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Urban health center type enum
DO $$ 
BEGIN
  CREATE TYPE urban_health_center_type AS ENUM (
    'PRIMARY_UHC', 'SECONDARY_UHC', 'COMPREHENSIVE_UHC', 'SPECIALIZED_UHC',
    'URBAN_POLYCLINIC', 'URBAN_OUTPOST', 'SATELLITE_CLINIC', 'MUNICIPAL_CLINIC',
    'MODEL_UHC', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Urban health center location enum
DO $$ 
BEGIN
  CREATE TYPE urban_health_center_location AS ENUM (
    'CITY_CENTER', 'SUBURBAN', 'SLUM_AREA', 'COMMERCIAL_ZONE', 
    'RESIDENTIAL_AREA', 'URBAN_PERIPHERY', 'INDUSTRIAL_ZONE', 
    'TRANSIT_HUB_AREA', 'MIXED_AREA'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Urban health center building condition
DO $$ 
BEGIN
  CREATE TYPE uhc_building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 'NEEDS_RECONSTRUCTION',
    'UNDER_CONSTRUCTION', 'TEMPORARY', 'RENTED_FACILITY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the urban health center table
CREATE TABLE IF NOT EXISTS acme_urban_health_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  health_center_type urban_health_center_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  location_type urban_health_center_location,
  population_served INTEGER,
  catchment_area_description TEXT,
  slum_population_coverage INTEGER,
  
  -- Basic information
  established_date DATE,
  registration_number VARCHAR(50),
  registered_with TEXT,
  ownership_type health_facility_ownership NOT NULL,
  operating_authority TEXT,
  parent_institution_id VARCHAR(36),
  is_part_of_network BOOLEAN DEFAULT FALSE,
  network_details TEXT,
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  emergency_contact_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  is_open_weekends BOOLEAN DEFAULT FALSE,
  is_open_holidays BOOLEAN DEFAULT FALSE,
  special_timings TEXT,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  building_ownership TEXT, -- Owned, Rented, Donated
  building_condition uhc_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  total_floors INTEGER,
  total_rooms INTEGER,
  consultation_room_count INTEGER,
  procedure_room_count INTEGER,
  waiting_area_capacity INTEGER,
  is_building_purpose_built BOOLEAN DEFAULT TRUE,
  has_separate_entry_exit BOOLEAN DEFAULT FALSE,
  has_adequate_ventilation BOOLEAN DEFAULT TRUE,
  has_adequate_lighting BOOLEAN DEFAULT TRUE,
  has_wheelchair_access BOOLEAN DEFAULT FALSE,
  has_ramp BOOLEAN DEFAULT FALSE,
  has_patient_toilet BOOLEAN DEFAULT TRUE,
  has_separate_gender_toilets BOOLEAN DEFAULT FALSE,
  has_handwashing_stations BOOLEAN DEFAULT TRUE,
  has_water_supply BOOLEAN DEFAULT TRUE,
  water_source_type water_source_type,
  water_availability TEXT,
  has_electricity BOOLEAN DEFAULT TRUE,
  power_outage_frequency TEXT,
  has_power_backup BOOLEAN DEFAULT FALSE,
  power_backup_type power_backup_type,
  has_waste_management BOOLEAN DEFAULT TRUE,
  waste_segregation_practice TEXT,
  has_biohazard_disposal BOOLEAN DEFAULT TRUE,
  
  -- Services offered
  general_outpatient_services BOOLEAN DEFAULT TRUE,
  maternal_health_services BOOLEAN DEFAULT TRUE,
  child_health_services BOOLEAN DEFAULT TRUE,
  immunization_services BOOLEAN DEFAULT TRUE,
  family_planning_services BOOLEAN DEFAULT TRUE,
  adolescent_health_services BOOLEAN DEFAULT FALSE,
  geriatric_services BOOLEAN DEFAULT FALSE,
  ncd_services BOOLEAN DEFAULT TRUE, -- Non-Communicable Disease
  communicable_disease_treatment BOOLEAN DEFAULT TRUE,
  tb_services BOOLEAN DEFAULT TRUE,
  hiv_services BOOLEAN DEFAULT FALSE,
  mental_health_services BOOLEAN DEFAULT FALSE,
  dental_services BOOLEAN DEFAULT FALSE,
  eye_care_services BOOLEAN DEFAULT FALSE,
  specialized_clinics TEXT,
  specialized_clinic_schedule TEXT,
  has_laboratory_services BOOLEAN DEFAULT FALSE,
  laboratory_test_types TEXT,
  has_pharmacy BOOLEAN DEFAULT TRUE,
  pharmacy_operation_hours TEXT,
  has_emergency_services BOOLEAN DEFAULT FALSE,
  emergency_service_details TEXT,
  has_ambulance BOOLEAN DEFAULT FALSE,
  ambulance_contact_number TEXT,
  has_referral_system BOOLEAN DEFAULT TRUE,
  referral_hospitals TEXT,
  offers_home_visits BOOLEAN DEFAULT FALSE,
  home_visit_details TEXT,
  mobile_clinic_services BOOLEAN DEFAULT FALSE,
  mobile_clinic_frequency TEXT,
  health_education_programs BOOLEAN DEFAULT TRUE,
  health_education_details TEXT,
  
  -- Urban-specific services
  has_occupational_health_services BOOLEAN DEFAULT FALSE,
  environmental_health_monitoring BOOLEAN DEFAULT FALSE,
  water_quality_monitoring BOOLEAN DEFAULT FALSE,
  air_quality_monitoring BOOLEAN DEFAULT FALSE,
  urban_disease_surveillance BOOLEAN DEFAULT TRUE,
  epidemic_response_readiness BOOLEAN DEFAULT TRUE,
  migrant_health_services BOOLEAN DEFAULT FALSE,
  homeless_population_services BOOLEAN DEFAULT FALSE,
  special_urban_programs TEXT,
  
  -- Staff details
  total_staff_count INTEGER,
  doctor_count INTEGER,
  specialized_doctor_count INTEGER,
  nurse_count INTEGER,
  health_assistant_count INTEGER,
  vaccinator_count INTEGER,
  counselor_count INTEGER,
  lab_technician_count INTEGER,
  pharmacist_count INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  community_health_volunteer_count INTEGER,
  female_staff_percentage INTEGER,
  staff_shortage_areas TEXT,
  staff_training_frequency TEXT,
  
  -- Equipment and supplies
  has_basic_equipment BOOLEAN DEFAULT TRUE,
  equipment_condition equipment_condition,
  has_diagnostic_equipment BOOLEAN DEFAULT FALSE,
  diagnostic_equipment_details TEXT,
  has_cold_chain_equipment BOOLEAN DEFAULT TRUE,
  cold_chain_condition equipment_condition,
  essential_medicine_availability service_availability,
  medicine_stock_out_frequency TEXT,
  supply_chain_management TEXT,
  inventory_management_system TEXT,
  
  -- Patient statistics
  average_daily_patients INTEGER,
  monthly_patient_load INTEGER,
  annual_patient_count INTEGER,
  patient_distribution_by_age TEXT,
  patient_distribution_by_gender TEXT,
  top_ten_morbidities TEXT,
  seasonal_disease_patterns TEXT,
  ncd_patient_percentage DECIMAL(5, 2),
  
  -- Health information system
  has_digital_record_system BOOLEAN DEFAULT FALSE,
  digital_system_name TEXT,
  digital_system_coverage TEXT, -- Partial, Complete
  has_internet_for_reporting BOOLEAN DEFAULT FALSE,
  reporting_frequency TEXT,
  reports_to_authorities TEXT,
  uses_mobile_health_applications BOOLEAN DEFAULT FALSE,
  mobile_applications_details TEXT,
  
  -- Quality and monitoring
  quality_assurance_mechanism TEXT,
  has_patient_feedback_system BOOLEAN DEFAULT FALSE,
  patient_satisfaction_measured BOOLEAN DEFAULT FALSE,
  patient_satisfaction_level TEXT,
  has_regular_audits BOOLEAN DEFAULT FALSE,
  audit_frequency TEXT,
  last_external_assessment_date DATE,
  accreditation_status TEXT,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(14, 2),
  primary_funding_source TEXT,
  government_funding_percent DECIMAL(5, 2),
  local_government_contribution_percent DECIMAL(5, 2),
  donor_funding_percent DECIMAL(5, 2),
  user_fees_collected BOOLEAN DEFAULT FALSE,
  fee_structure TEXT,
  has_exemption_system BOOLEAN DEFAULT TRUE,
  exemption_details TEXT,
  insurance_accepted BOOLEAN DEFAULT FALSE,
  insurance_details TEXT,
  financial_sustainability_level TEXT,
  
  -- Community engagement
  community_engagement_strategies TEXT,
  has_user_committee BOOLEAN DEFAULT TRUE,
  user_committee_meeting_frequency TEXT,
  conducts_outreach_programs BOOLEAN DEFAULT TRUE,
  outreach_program_details TEXT,
  partnership_with_local_groups BOOLEAN DEFAULT FALSE,
  partner_organizations TEXT,
  community_awareness_campaigns TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  service_delivery_challenges TEXT,
  human_resource_challenges TEXT,
  financial_challenges TEXT,
  urban_specific_challenges TEXT,
  priority_improvement_areas TEXT,
  
  -- Future development
  expansion_plans TEXT,
  service_enhancement_plans TEXT,
  technology_upgrade_plans TEXT,
  
  -- Disaster preparedness
  disaster_preparedness_level TEXT,
  has_emergency_response_plan BOOLEAN DEFAULT FALSE,
  emergency_response_details TEXT,
  conducts_emergency_drills BOOLEAN DEFAULT FALSE,
  emergency_supply_reserves BOOLEAN DEFAULT FALSE,
  
  -- Linkages to other entities
  linked_hospitals JSONB DEFAULT '[]'::jsonb,
  linked_health_posts JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_community_organizations JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  service_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_uhc_location_point ON acme_urban_health_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_uhc_building_footprint ON acme_urban_health_center USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_uhc_service_area ON acme_urban_health_center USING GIST (service_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_uhc_name ON acme_urban_health_center(name);
CREATE INDEX IF NOT EXISTS idx_uhc_slug ON acme_urban_health_center(slug);
CREATE INDEX IF NOT EXISTS idx_uhc_type ON acme_urban_health_center(health_center_type);
CREATE INDEX IF NOT EXISTS idx_uhc_ward ON acme_urban_health_center(ward_number);
