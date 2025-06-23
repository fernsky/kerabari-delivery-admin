-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Hospital type enum
DO $$ 
BEGIN
  CREATE TYPE hospital_type AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'COMMUNITY', 'TEACHING', 'SPECIALIZED',
    'MISSION', 'NGO_OPERATED', 'MILITARY', 'AYURVEDIC', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Hospital level enum
DO $$ 
BEGIN
  CREATE TYPE hospital_level AS ENUM (
    'HEALTH_POST', 'PRIMARY_HOSPITAL', 'SECONDARY_HOSPITAL', 'TERTIARY_HOSPITAL',
    'SUPER_SPECIALTY', 'DISTRICT_HOSPITAL', 'ZONAL_HOSPITAL', 'REGIONAL_HOSPITAL',
    'CENTRAL_HOSPITAL', 'UNIVERSITY_HOSPITAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the hospital table
CREATE TABLE IF NOT EXISTS acme_hospital (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  hospital_type hospital_type NOT NULL,
  hospital_level hospital_level NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  established_date DATE,
  registration_number VARCHAR(50),
  registered_with TEXT,
  pan_number VARCHAR(20),
  ownership TEXT,
  affiliated_institution TEXT,
  
  -- Contact information
  phone_number TEXT,
  emergency_number TEXT,
  ambulance_number TEXT,
  fax_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Social media and online presence
  facebook_handle TEXT,
  twitter_handle TEXT,
  instagram_handle TEXT,
  
  -- Operating hours
  is_open_24_hours BOOLEAN DEFAULT TRUE,
  outpatient_opening_time TIME,
  outpatient_closing_time TIME,
  outpatient_open_days TEXT,
  emergency_hours TEXT,
  
  -- Physical infrastructure
  total_area_sq_m DECIMAL(10, 2),
  building_count INTEGER,
  main_building_floors INTEGER,
  building_condition building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  has_emergency_building BOOLEAN DEFAULT FALSE,
  has_outpatient_building BOOLEAN DEFAULT FALSE,
  has_administrative_building BOOLEAN DEFAULT FALSE,
  has_staff_quarters BOOLEAN DEFAULT FALSE,
  has_other_buildings BOOLEAN DEFAULT FALSE,
  other_buildings_details TEXT,
  
  -- Capacity and beds
  total_bed_count INTEGER,
  general_bed_count INTEGER,
  private_bed_count INTEGER,
  icu_bed_count INTEGER,
  nicu_bed_count INTEGER,
  picu_bed_count INTEGER,
  emergency_bed_count INTEGER,
  maternity_bed_count INTEGER,
  isolation_bed_count INTEGER,
  ventilator_count INTEGER,
  bed_occupancy_rate_percent DECIMAL(5, 2),
  average_length_of_stay_days DECIMAL(5, 2),
  annual_admission_count INTEGER,
  annual_outpatient_count INTEGER,
  annual_emergency_count INTEGER,
  annual_surgery_count INTEGER,
  annual_delivery_count INTEGER,
  
  -- Departments and services
  has_casualty_department BOOLEAN DEFAULT FALSE,
  has_general_medicine BOOLEAN DEFAULT FALSE,
  has_general_surgery BOOLEAN DEFAULT FALSE,
  has_obstetrics BOOLEAN DEFAULT FALSE,
  has_gynecology BOOLEAN DEFAULT FALSE,
  has_pediatrics BOOLEAN DEFAULT FALSE,
  has_orthopedics BOOLEAN DEFAULT FALSE,
  has_ent BOOLEAN DEFAULT FALSE,
  has_ophthalmology BOOLEAN DEFAULT FALSE,
  has_dermatology BOOLEAN DEFAULT FALSE,
  has_psychiatry BOOLEAN DEFAULT FALSE,
  has_dental_services BOOLEAN DEFAULT FALSE,
  has_cardiology BOOLEAN DEFAULT FALSE,
  has_neurology BOOLEAN DEFAULT FALSE,
  has_oncology BOOLEAN DEFAULT FALSE,
  has_nicu BOOLEAN DEFAULT FALSE,
  has_icu BOOLEAN DEFAULT FALSE,
  has_ccu BOOLEAN DEFAULT FALSE,
  has_hdu BOOLEAN DEFAULT FALSE,
  has_pathology BOOLEAN DEFAULT FALSE,
  has_radiology BOOLEAN DEFAULT FALSE,
  has_physiotherapy BOOLEAN DEFAULT FALSE,
  has_emergency_services BOOLEAN DEFAULT FALSE,
  emergency_service_level emergency_service_level,
  other_departments TEXT,
  
  -- Diagnostic facilities
  has_laboratory BOOLEAN DEFAULT FALSE,
  has_x_ray BOOLEAN DEFAULT FALSE,
  has_ultrasound BOOLEAN DEFAULT FALSE,
  has_ct_scan BOOLEAN DEFAULT FALSE,
  has_mri BOOLEAN DEFAULT FALSE,
  has_ecg BOOLEAN DEFAULT FALSE,
  has_eeg BOOLEAN DEFAULT FALSE,
  has_mammography BOOLEAN DEFAULT FALSE,
  has_endoscopy BOOLEAN DEFAULT FALSE,
  has_dialysis BOOLEAN DEFAULT FALSE,
  dialysis_unit_count INTEGER,
  other_diagnostic_facilities TEXT,
  
  -- Surgery and specialized services
  has_operation_theater BOOLEAN DEFAULT FALSE,
  operation_theater_count INTEGER,
  has_laparoscopy BOOLEAN DEFAULT FALSE,
  has_blood_bank BOOLEAN DEFAULT FALSE,
  blood_bank_type TEXT,
  has_ambulance_service BOOLEAN DEFAULT FALSE,
  ambulance_count INTEGER,
  
  -- Staff details
  total_staff_count INTEGER,
  doctor_count INTEGER,
  specialist_doctor_count INTEGER,
  nurse_count INTEGER,
  paramedic_count INTEGER,
  lab_technician_count INTEGER,
  radiographer_count INTEGER,
  pharmacist_count INTEGER,
  administrative_staff_count INTEGER,
  support_staff_count INTEGER,
  female_staff_percentage INTEGER,
  vacant_positions INTEGER,
  doctor_beds_ratio DECIMAL(6, 2),
  nurse_beds_ratio DECIMAL(6, 2),
  
  -- Basic facilities
  has_electricity BOOLEAN DEFAULT TRUE,
  has_power_backup BOOLEAN DEFAULT FALSE,
  power_backup_type TEXT,
  power_backup_capacity_kw DECIMAL(10, 2),
  has_water_supply BOOLEAN DEFAULT TRUE,
  water_source_type TEXT,
  has_water_treatment BOOLEAN DEFAULT FALSE,
  has_heating BOOLEAN DEFAULT FALSE,
  has_cooling BOOLEAN DEFAULT FALSE,
  has_oxygen_supply BOOLEAN DEFAULT FALSE,
  oxygen_supply_type TEXT,
  has_oxygen_plant BOOLEAN DEFAULT FALSE,
  oxygen_plant_capacity TEXT,
  
  -- Facility improvements
  has_waiting_area BOOLEAN DEFAULT FALSE,
  waiting_area_capacity INTEGER,
  has_public_toilets BOOLEAN DEFAULT FALSE,
  toilet_count INTEGER,
  has_canteen BOOLEAN DEFAULT FALSE,
  has_pharmacy BOOLEAN DEFAULT FALSE,
  is_pharmacy_24_hours BOOLEAN DEFAULT FALSE,
  has_atm BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  parking_capacity INTEGER,
  has_ambulance_parking BOOLEAN DEFAULT FALSE,
  has_helicopter_landing_facility BOOLEAN DEFAULT FALSE,
  
  -- Digital infrastructure
  has_electronic_health_records BOOLEAN DEFAULT FALSE,
  ehr_system_name TEXT,
  has_hospital_management_system BOOLEAN DEFAULT FALSE,
  hms_system_name TEXT,
  has_internet_connectivity BOOLEAN DEFAULT FALSE,
  internet_type TEXT,
  internet_speed TEXT,
  has_telemedecine_service BOOLEAN DEFAULT FALSE,
  telemedicine_details TEXT,
  has_pacs_system BOOLEAN DEFAULT FALSE,
  has_biometric_attendance BOOLEAN DEFAULT FALSE,
  has_cctv_coverage BOOLEAN DEFAULT FALSE,
  
  -- Quality and standards
  accreditation_status accreditation_status,
  accrediting_body TEXT,
  last_accreditation_year INTEGER,
  has_infection_control BOOLEAN DEFAULT FALSE,
  infection_control_protocols TEXT,
  has_quality_assurance_team BOOLEAN DEFAULT FALSE,
  quality_assurance_details TEXT,
  has_waste_management BOOLEAN DEFAULT FALSE,
  waste_management_details TEXT,
  has_mortality_review BOOLEAN DEFAULT FALSE,
  patient_satisfaction_measurement BOOLEAN DEFAULT FALSE,
  patient_satisfaction_percent INTEGER,
  
  -- Financial aspects
  annual_budget_npr DECIMAL(18, 2),
  government_funding_percentage INTEGER,
  donor_funding_percentage INTEGER,
  patient_fee_percentage INTEGER,
  has_insurance_acceptance BOOLEAN DEFAULT FALSE,
  accepted_insurance_providers TEXT,
  has_free_services BOOLEAN DEFAULT FALSE,
  free_services_details TEXT,
  has_subsidy_programs BOOLEAN DEFAULT FALSE,
  subsidy_details TEXT,
  average_outpatient_fee_npr DECIMAL(10, 2),
  average_inpatient_daily_fee_npr DECIMAL(10, 2),
  
  -- Public health activities
  provides_immunization BOOLEAN DEFAULT FALSE,
  provides_family_planning BOOLEAN DEFAULT FALSE,
  provides_antenatal_care BOOLEAN DEFAULT FALSE,
  provides_nutrition_programs BOOLEAN DEFAULT FALSE,
  provides_health_education BOOLEAN DEFAULT FALSE,
  provides_outreach_programs BOOLEAN DEFAULT FALSE,
  outreach_program_details TEXT,
  runs_community_programs BOOLEAN DEFAULT FALSE,
  community_program_details TEXT,
  
  -- Teaching and research
  is_teaching_hospital BOOLEAN DEFAULT FALSE,
  teaching_programs TEXT,
  has_research_activities BOOLEAN DEFAULT FALSE,
  research_focus_areas TEXT,
  published_papers_count INTEGER,
  
  -- Disasters and emergencies
  has_disaster_management_plan BOOLEAN DEFAULT FALSE,
  disaster_management_details TEXT,
  has_mass_calsualty_management BOOLEAN DEFAULT FALSE,
  has_earthquake_resistant_building BOOLEAN DEFAULT FALSE,
  earthquake_protection_details TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  equipment_challenges TEXT,
  staffing_challenges TEXT,
  supply_chain_challenges TEXT,
  funding_challenges TEXT,
  quality_challenges TEXT,
  other_challenges TEXT,
  immediate_needs TEXT,
  
  -- Future development
  expansion_plans TEXT,
  upgrade_needs TEXT,
  future_departments TEXT,
  technology_improvement_plans TEXT,
  
  -- Hospital specialty and focus areas
  specialty_areas TEXT,
  center_of_excellence_areas TEXT,
  unique_services TEXT,
  
  -- Coordination and referrals
  referral_hospitals TEXT,
  collaborating_institutions TEXT,
  part_of_health_network BOOLEAN DEFAULT FALSE,
  health_network_details TEXT,
  
  -- Recent significant changes
  recent_upgrades TEXT,
  recent_equipment_additions TEXT,
  recent_staff_changes TEXT,
  
  -- External support and linkages
  external_donor_support TEXT,
  ngo_partnerships TEXT,
  international_affiliations TEXT,
  
  -- Linkages to other entities
  linked_municipality_offices JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  linked_health_institutions JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  campus_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_hospital_location_point ON acme_hospital USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_hospital_building_footprint ON acme_hospital USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_hospital_campus_area ON acme_hospital USING GIST (campus_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_hospital_name ON acme_hospital(name);
CREATE INDEX IF NOT EXISTS idx_hospital_slug ON acme_hospital(slug);
CREATE INDEX IF NOT EXISTS idx_hospital_type ON acme_hospital(hospital_type);
CREATE INDEX IF NOT EXISTS idx_hospital_level ON acme_hospital(hospital_level);
CREATE INDEX IF NOT EXISTS idx_hospital_ward ON acme_hospital(ward_number);
