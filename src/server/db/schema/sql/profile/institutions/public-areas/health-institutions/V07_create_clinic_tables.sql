-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Clinic type enum
DO $$ 
BEGIN
  CREATE TYPE clinic_type AS ENUM (
    'GENERAL_CLINIC', 'DENTAL_CLINIC', 'EYE_CLINIC', 'MATERNAL_CHILD_HEALTH_CLINIC',
    'SPECIALIST_CLINIC', 'POLYCLINIC', 'DIAGNOSTIC_CLINIC', 'AYURVEDIC_CLINIC',
    'HOMEOPATHIC_CLINIC', 'PHYSIOTHERAPY_CLINIC', 'MENTAL_HEALTH_CLINIC',
    'FAMILY_PLANNING_CLINIC', 'VACCINATION_CLINIC', 'MOBILE_CLINIC',
    'TELEMEDICINE_CLINIC', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Clinic ownership enum
DO $$ 
BEGIN
  CREATE TYPE clinic_ownership AS ENUM (
    'GOVERNMENT', 'PRIVATE', 'COMMUNITY', 'NGO', 'COOPERATIVE', 'RELIGIOUS',
    'PUBLIC_PRIVATE_PARTNERSHIP', 'UNIVERSITY', 'INSURANCE_COMPANY', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Clinic building condition enum
DO $$ 
BEGIN
  CREATE TYPE clinic_building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_MAINTENANCE', 'POOR',
    'UNDER_CONSTRUCTION', 'UNDER_RENOVATION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Clinic service availability enum
DO $$ 
BEGIN
  CREATE TYPE clinic_service_availability AS ENUM (
    'ALWAYS_AVAILABLE', 'REGULAR_HOURS', 'SCHEDULED_DAYS', 'ON_CALL',
    'LIMITED_HOURS', 'SEASONAL', 'NOT_CURRENTLY_AVAILABLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Clinic accessibility enum
DO $$ 
BEGIN
  CREATE TYPE clinic_accessibility AS ENUM (
    'HIGHLY_ACCESSIBLE', 'MODERATELY_ACCESSIBLE', 'LIMITED_ACCESSIBILITY',
    'POORLY_ACCESSIBLE', 'NOT_ACCESSIBLE'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Quality standard enum
DO $$ 
BEGIN
  CREATE TYPE quality_standard AS ENUM (
    'EXCELLENT', 'GOOD', 'SATISFACTORY', 'NEEDS_IMPROVEMENT', 'POOR', 'NOT_ASSESSED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the clinic table
CREATE TABLE IF NOT EXISTS acme_clinic (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  clinic_type clinic_type NOT NULL,
  specialization TEXT,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  
  -- Basic information
  registration_number VARCHAR(50),
  registered_with TEXT,
  established_date DATE,
  ownership clinic_ownership NOT NULL,
  owner_name TEXT,
  parent_institution_id VARCHAR(36),
  parent_institution_name TEXT,
  is_standalone BOOLEAN DEFAULT TRUE,
  catchment_population INTEGER,
  catchment_area_description TEXT,
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  emergency_contact_number TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Social media and online presence
  facebook_handle TEXT,
  twitter_handle TEXT,
  instagram_handle TEXT,
  youtube_channel TEXT,
  has_online_appointment BOOLEAN DEFAULT FALSE,
  online_appointment_details TEXT,
  
  -- Operating hours
  operating_days TEXT,
  opening_time TIME,
  closing_time TIME,
  has_shift_system BOOLEAN DEFAULT FALSE,
  shift_details TEXT,
  is_24_hour_service BOOLEAN DEFAULT FALSE,
  average_wait_time_minutes INTEGER,
  appointment_system BOOLEAN DEFAULT FALSE,
  appointment_system_details TEXT,
  
  -- Infrastructure
  building_ownership TEXT,
  building_condition clinic_building_condition,
  total_floors INTEGER,
  total_rooms INTEGER,
  building_area_sq_m DECIMAL(10, 2),
  construction_year INTEGER,
  last_renovation_year INTEGER,
  consultation_rooms_count INTEGER,
  procedure_rooms_count INTEGER,
  waiting_area_capacity INTEGER,
  has_reception_area BOOLEAN DEFAULT TRUE,
  has_separate_consultation_rooms BOOLEAN DEFAULT TRUE,
  has_waiting_room BOOLEAN DEFAULT TRUE,
  has_patient_toilets BOOLEAN DEFAULT TRUE,
  has_separate_toilets_for_genders BOOLEAN DEFAULT FALSE,
  has_ramp BOOLEAN DEFAULT FALSE,
  has_wheelchair_access BOOLEAN DEFAULT FALSE,
  has_adequate_ventilation BOOLEAN DEFAULT TRUE,
  has_proper_lighting BOOLEAN DEFAULT TRUE,
  
  -- Basic utilities
  has_electricity BOOLEAN DEFAULT TRUE,
  has_power_backup BOOLEAN DEFAULT FALSE,
  power_backup_type TEXT,
  has_water_supply BOOLEAN DEFAULT TRUE,
  water_source_type TEXT,
  has_internet_connectivity BOOLEAN DEFAULT FALSE,
  internet_speed TEXT,
  has_waste_management_system BOOLEAN DEFAULT FALSE,
  waste_management_details TEXT,
  has_biomedical_waste_management BOOLEAN DEFAULT FALSE,
  
  -- Services
  primary_services TEXT,
  has_laboratory_services BOOLEAN DEFAULT FALSE,
  laboratory_services_details TEXT,
  has_diagnostic_services BOOLEAN DEFAULT FALSE,
  diagnostic_services_details TEXT,
  has_pharmacy BOOLEAN DEFAULT FALSE,
  pharmacy_details TEXT,
  has_vaccination_services BOOLEAN DEFAULT FALSE,
  vaccination_services_details TEXT,
  has_maternal_services BOOLEAN DEFAULT FALSE,
  maternal_services_details TEXT,
  has_child_health_services BOOLEAN DEFAULT FALSE,
  child_health_services_details TEXT,
  has_emergency_services BOOLEAN DEFAULT FALSE,
  emergency_services_details TEXT,
  has_referral_system BOOLEAN DEFAULT FALSE,
  referral_system_details TEXT,
  common_treatments_provided TEXT,
  additional_specialized_services TEXT,
  community_outreach_activities TEXT,
  health_education_programs TEXT,
  
  -- Medical equipment
  has_medical_equipment BOOLEAN DEFAULT TRUE,
  basic_equipment_list TEXT,
  specialized_equipment_list TEXT,
  equipment_condition TEXT,
  equipment_maintenance_process TEXT,
  main_equipment_needs TEXT,
  
  -- Human resources
  total_staff_count INTEGER,
  doctor_count INTEGER,
  specialist_doctor_count INTEGER,
  specialist_details TEXT,
  nurse_count INTEGER,
  health_assistant_count INTEGER,
  lab_technician_count INTEGER,
  pharmacist_count INTEGER,
  reception_staff_count INTEGER,
  other_staff_count INTEGER,
  female_medical_staff_count INTEGER,
  administrative_staff_count INTEGER,
  staffing_adequacy TEXT,
  main_staffing_challenges TEXT,
  
  -- Patient statistics
  average_daily_patients INTEGER,
  annual_patient_count INTEGER,
  female_patient_percentage INTEGER,
  child_patient_percentage INTEGER,
  elderly_patient_percentage INTEGER,
  most_common_diagnoses TEXT,
  patient_record_system TEXT,
  has_electronic_records BOOLEAN DEFAULT FALSE,
  electronic_record_system_details TEXT,
  
  -- Fees and financial aspects
  consultation_fee_range TEXT,
  average_consultation_fee_npr DECIMAL(10, 2),
  has_insurance_acceptance BOOLEAN DEFAULT FALSE,
  insurance_details TEXT,
  accepted_payment_methods TEXT,
  has_digital_payment BOOLEAN DEFAULT FALSE,
  digital_payment_details TEXT,
  annual_budget_npr DECIMAL(18, 2),
  revenue_sources_details TEXT,
  financial_sustainability_status TEXT,
  
  -- Quality and standards
  is_registered_with_nmc BOOLEAN DEFAULT FALSE,
  nmc_registration_details TEXT,
  has_certifications BOOLEAN DEFAULT FALSE,
  certification_details TEXT,
  quality_assurance_mechanisms TEXT,
  infection_control_protocols TEXT,
  patient_safety_measures TEXT,
  service_quality_standard quality_standard,
  last_quality_assessment_date DATE,
  quality_improvement_plans TEXT,
  
  -- Medicine and supplies
  essential_medicine_availability TEXT,
  medicine_source_details TEXT,
  has_adequate_supply_chain BOOLEAN DEFAULT TRUE,
  supply_chain_challenges TEXT,
  medicine_storage_condition TEXT,
  cold_chain_availability BOOLEAN DEFAULT FALSE,
  cold_chain_details TEXT,
  
  -- Accessibility and inclusion
  accessibility_level clinic_accessibility,
  distance_from_main_road_km DECIMAL(6, 2),
  distance_from_nearest_hospital_km DECIMAL(6, 2),
  public_transport_accessibility TEXT,
  has_parking_facility BOOLEAN DEFAULT FALSE,
  parking_capacity INTEGER,
  gender_sensitive_services TEXT,
  disability_friendly_features TEXT,
  affordability_measures TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  service_challenges TEXT,
  equipment_challenges TEXT,
  human_resource_challenges TEXT,
  financial_challenges TEXT,
  priority_needs TEXT,
  support_required TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  service_improvement_plans TEXT,
  technology_upgrade_plans TEXT,
  staff_capacity_building_plans TEXT,
  
  -- Community engagement
  community_feedback_mechanism BOOLEAN DEFAULT FALSE,
  community_feedback_details TEXT,
  patient_satisfaction_level TEXT,
  community_outreach_programs TEXT,
  preventive_health_programs TEXT,
  health_awareness_activities TEXT,
  
  -- COVID-19 and emergency response
  covid_response_measures TEXT,
  has_covid19_testing BOOLEAN DEFAULT FALSE,
  covid19_vaccination_available BOOLEAN DEFAULT FALSE,
  disaster_preparedness_level TEXT,
  emergency_response_protocols TEXT,
  
  -- Linkages to other health systems
  referral_hospitals TEXT,
  linked_health_networks TEXT,
  public_private_partnership TEXT,
  linked_ambulance_services TEXT,
  government_program_participation TEXT,
  
  -- Linkages to other entities
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_pharmacies JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_community_groups JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  service_area_polygon GEOMETRY(MultiPolygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_clinic_location_point ON acme_clinic USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_clinic_building_footprint ON acme_clinic USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_clinic_service_area ON acme_clinic USING GIST (service_area_polygon);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_clinic_name ON acme_clinic(name);
CREATE INDEX IF NOT EXISTS idx_clinic_slug ON acme_clinic(slug);
CREATE INDEX IF NOT EXISTS idx_clinic_type ON acme_clinic(clinic_type);
CREATE INDEX IF NOT EXISTS idx_clinic_ownership ON acme_clinic(ownership);
CREATE INDEX IF NOT EXISTS idx_clinic_ward ON acme_clinic(ward_number);
