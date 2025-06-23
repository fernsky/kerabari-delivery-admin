-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- PHC type enum
DO $$ 
BEGIN
  CREATE TYPE phc_type AS ENUM (
    'GOVERNMENT', 'COMMUNITY', 'PRIVATE', 'NGO_OPERATED', 'PUBLIC_PRIVATE_PARTNERSHIP',
    'MUNICIPAL', 'PROVINCIAL', 'FEDERAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- PHC level enum
DO $$ 
BEGIN
  CREATE TYPE phc_level AS ENUM (
    'PRIMARY_HEALTH_CENTER', 'HEALTH_POST', 'SUB_HEALTH_POST',
    'URBAN_HEALTH_CENTER', 'COMMUNITY_HEALTH_UNIT', 'BASIC_HEALTH_SERVICE_CENTER',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the primary health center table
CREATE TABLE IF NOT EXISTS acme_primary_health_center (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  phc_type phc_type NOT NULL,
  phc_level phc_level NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_date DATE,
  registration_number VARCHAR(50),
  registered_with TEXT,
  pan_number VARCHAR(20),
  catchment_population INTEGER,
  catchment_area_description TEXT,
  
  -- Contact information
  phone_number TEXT,
  emergency_number TEXT,
  fax_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Leadership information
  in_charge_name TEXT,
  in_charge_designation TEXT,
  in_charge_contact_number TEXT,
  
  -- Operating hours
  is_open_24_hours BOOLEAN DEFAULT FALSE,
  opening_time TIME,
  closing_time TIME,
  open_days TEXT,
  special_clinic_days TEXT,
  emergency_service_hours TEXT,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  building_count INTEGER,
  main_building_floors INTEGER,
  building_condition phc_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  has_staff_quarters BOOLEAN DEFAULT FALSE,
  staff_quarters_details TEXT,
  total_rooms INTEGER,
  consultation_room_count INTEGER,
  has_separate_waiting_area BOOLEAN DEFAULT FALSE,
  waiting_area_capacity INTEGER,
  has_emergency_room BOOLEAN DEFAULT FALSE,
  has_delivery_room BOOLEAN DEFAULT FALSE,
  has_laboratory_room BOOLEAN DEFAULT FALSE,
  has_pharmacy_room BOOLEAN DEFAULT FALSE,
  has_meeting_hall BOOLEAN DEFAULT FALSE,
  has_administrative_section BOOLEAN DEFAULT FALSE,
  has_store_room BOOLEAN DEFAULT FALSE,
  has_medical_waste_management_system BOOLEAN DEFAULT FALSE,
  waste_management_details TEXT,
  
  -- Basic utilities
  has_electricity BOOLEAN DEFAULT TRUE,
  electricity_availability_hours INTEGER,
  has_power_backup BOOLEAN DEFAULT FALSE,
  power_backup_type power_backup_type,
  power_backup_details TEXT,
  has_water_supply BOOLEAN DEFAULT TRUE,
  water_source_type water_source_type,
  water_availability_hours INTEGER,
  has_internet BOOLEAN DEFAULT FALSE,
  internet_type TEXT,
  internet_speed TEXT,
  has_landline_phone BOOLEAN DEFAULT FALSE,
  
  -- Staff details
  total_staff_count INTEGER,
  doctor_count INTEGER,
  medical_officer_count INTEGER,
  health_assistant_count INTEGER,
  staff_nurse_count INTEGER,
  anm_count INTEGER, -- Auxiliary Nurse Midwife
  ahw_count INTEGER, -- Auxiliary Health Worker
  lab_technician_count INTEGER,
  pharmacist_count INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  female_staff_percentage INTEGER,
  staff_quarter_availability TEXT,
  vacant_positions INTEGER,
  staff_training_frequency TEXT,
  
  -- Services offered
  general_health_services BOOLEAN DEFAULT TRUE,
  maternal_health_services BOOLEAN DEFAULT TRUE,
  child_health_services BOOLEAN DEFAULT TRUE,
  immunization_services BOOLEAN DEFAULT TRUE,
  family_planning_services BOOLEAN DEFAULT TRUE,
  nutrition_services BOOLEAN DEFAULT TRUE,
  tb_services BOOLEAN DEFAULT TRUE,
  hiv_services BOOLEAN DEFAULT FALSE,
  mental_health_services BOOLEAN DEFAULT FALSE,
  ncd_services BOOLEAN DEFAULT FALSE, -- Non-Communicable Disease
  geriatric_services BOOLEAN DEFAULT FALSE,
  speciality_services_available TEXT,
  speciality_clinic_frequency TEXT,
  has_birthing_center BOOLEAN DEFAULT FALSE,
  monthly_delivery_count INTEGER,
  has_emergency_obstetric_care BOOLEAN DEFAULT FALSE,
  offers_csection BOOLEAN DEFAULT FALSE,
  offers_anesthesia BOOLEAN DEFAULT FALSE,
  has_blood_transfusion BOOLEAN DEFAULT FALSE,
  has_ambulance_service BOOLEAN DEFAULT FALSE,
  ambulance_count INTEGER,
  ambulance_contact_number TEXT,
  
  -- Diagnostic facilities
  has_laboratory BOOLEAN DEFAULT FALSE,
  laboratory_service_details TEXT,
  has_xray BOOLEAN DEFAULT FALSE,
  has_ultrasound BOOLEAN DEFAULT FALSE,
  has_ecg BOOLEAN DEFAULT FALSE,
  other_diagnostic_services TEXT,
  
  -- Medicines and supplies
  essential_medicine_availability service_availability,
  medicine_stock_out_frequency TEXT,
  has_pharmacy BOOLEAN DEFAULT TRUE,
  pharmacy_operation_hours TEXT,
  medicine_supply_frequency TEXT,
  medicine_supply_system TEXT,
  has_cold_chain BOOLEAN DEFAULT TRUE,
  cold_chain_equipment_condition TEXT,
  
  -- Outreach services
  conducts_outreach_clinics BOOLEAN DEFAULT TRUE,
  outreach_clinic_frequency TEXT,
  outreach_services_provided TEXT,
  fcv_count INTEGER, -- Female Community Volunteer
  catchment_area_coverage_percentage DECIMAL(5, 2),
  health_awareness_activities TEXT,
  
  -- Patient statistics
  average_daily_opd_patients INTEGER,
  annual_opd_patients INTEGER,
  average_monthly_inpatients INTEGER,
  annual_inpatient_admissions INTEGER,
  bed_occupancy_rate DECIMAL(5, 2),
  average_length_of_stay DECIMAL(5, 2),
  referral_rate DECIMAL(5, 2),
  common_diseases TEXT,
  seasonal_disease_patterns TEXT,
  
  -- Referral system
  referral_protocol_exists BOOLEAN DEFAULT TRUE,
  referral_facilities TEXT,
  referral_transport_means TEXT,
  emergency_referral_system TEXT,
  
  -- Monitoring and supervision
  supervisory_authority TEXT,
  supervision_frequency TEXT,
  last_supervision_date DATE,
  hmis_reporting_status TEXT,
  hmis_reporting_frequency TEXT,
  quality_improvement_initiatives TEXT,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(14, 2),
  government_funding_percentage INTEGER,
  local_government_funding_percentage INTEGER,
  donor_funding_percentage INTEGER,
  user_fee_collection BOOLEAN DEFAULT FALSE,
  user_fee_structure TEXT,
  free_service_availability TEXT,
  free_medicine_availability TEXT,
  health_insurance_accepted BOOLEAN DEFAULT FALSE,
  insurance_coverage_percentage INTEGER,
  
  -- Infrastructure needs
  building_adequacy TEXT,
  building_improvement_needs TEXT,
  equipment_needs TEXT,
  staff_needs TEXT,
  
  -- Challenges and issues
  service_delivery_challenges TEXT,
  resource_challenges TEXT,
  management_challenges TEXT,
  community_issues TEXT,
  priority_areas_for_improvement TEXT,
  
  -- Community participation
  has_health_facility_committee BOOLEAN DEFAULT TRUE,
  committee_meeting_frequency TEXT,
  community_participation_level TEXT,
  community_feedback_mechanism TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  service_improvement_plans TEXT,
  infrastructure_development_plans TEXT,
  
  -- Linkages to other entities
  linked_health_posts JSONB DEFAULT '[]'::jsonb,
  linked_hospitals JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_community_organizations JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  catchment_area GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_phc_location_point ON acme_primary_health_center USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_phc_building_footprint ON acme_primary_health_center USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_phc_catchment_area ON acme_primary_health_center USING GIST (catchment_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_phc_name ON acme_primary_health_center(name);
CREATE INDEX IF NOT EXISTS idx_phc_slug ON acme_primary_health_center(slug);
CREATE INDEX IF NOT EXISTS idx_phc_type ON acme_primary_health_center(phc_type);
CREATE INDEX IF NOT EXISTS idx_phc_level ON acme_primary_health_center(phc_level);
CREATE INDEX IF NOT EXISTS idx_phc_ward ON acme_primary_health_center(ward_number);
