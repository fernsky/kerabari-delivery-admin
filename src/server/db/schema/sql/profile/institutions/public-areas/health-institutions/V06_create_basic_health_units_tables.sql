-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Basic health unit type enum
DO $$ 
BEGIN
  CREATE TYPE basic_health_unit_type AS ENUM (
    'BASIC_HEALTH_UNIT', 'SATELLITE_CLINIC', 'MOBILE_CLINIC', 'OUTREACH_CENTER',
    'PRIMARY_CARE_UNIT', 'COMMUNITY_HEALTH_OUTPOST', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Building condition enum for BHU
DO $$ 
BEGIN
  CREATE TYPE bhu_building_condition AS ENUM (
    'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR', 'NEEDS_RECONSTRUCTION',
    'UNDER_CONSTRUCTION', 'TEMPORARY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Mobile clinic frequency enum
DO $$ 
BEGIN
  CREATE TYPE mobile_clinic_frequency AS ENUM (
    'DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY', 'QUARTERLY',
    'SEASONAL', 'ON_DEMAND', 'IRREGULAR'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Basic health unit operation schedule
DO $$ 
BEGIN
  CREATE TYPE bhu_operation_schedule AS ENUM (
    'DAILY', 'WEEKDAYS_ONLY', 'SPECIFIC_DAYS_PER_WEEK',
    'SPECIFIC_DAYS_PER_MONTH', 'SEASONAL', 'ON_DEMAND'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the basic health unit table
CREATE TABLE IF NOT EXISTS acme_basic_health_unit (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  unit_type basic_health_unit_type NOT NULL,
  
  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  permanent_location BOOLEAN DEFAULT TRUE,
  mobile_route_details TEXT,
  target_communities TEXT,
  
  -- Basic information
  established_date DATE,
  registration_number VARCHAR(50),
  operating_authority TEXT,
  parent_facility_id VARCHAR(36),
  parent_facility_name TEXT,
  catchment_population INTEGER,
  catchment_area_description TEXT,
  distance_to_nearest_health_facility_km DECIMAL(6, 2),
  
  -- Contact information
  contact_person TEXT,
  contact_position TEXT,
  contact_phone TEXT,
  alternate_contact TEXT,
  email TEXT,
  
  -- Operating schedule
  operation_schedule bhu_operation_schedule,
  operating_days TEXT,
  opening_time TIME,
  closing_time TIME,
  average_operational_hours_per_week INTEGER,
  seasonal_operation_details TEXT,
  
  -- For mobile clinics
  is_mobile BOOLEAN DEFAULT FALSE,
  mobile_clinic_frequency mobile_clinic_frequency,
  mobile_clinic_schedule TEXT,
  transport_type TEXT,
  stops_per_trip INTEGER,
  average_time_per_stop_minutes INTEGER,
  
  -- Physical infrastructure (if permanent)
  has_permanent_structure BOOLEAN DEFAULT TRUE,
  total_area_sq_m DECIMAL(10, 2),
  building_ownership TEXT, -- Owned, Rented, Donated, Community-provided
  building_condition bhu_building_condition,
  construction_year INTEGER,
  last_renovated_year INTEGER,
  number_of_rooms INTEGER,
  has_waiting_area BOOLEAN DEFAULT TRUE,
  waiting_area_capacity INTEGER,
  has_consultation_room BOOLEAN DEFAULT TRUE,
  has_treatment_room BOOLEAN DEFAULT FALSE,
  has_storage_room BOOLEAN DEFAULT FALSE,
  has_toilet BOOLEAN DEFAULT FALSE,
  toilet_condition TEXT,
  has_clean_water BOOLEAN DEFAULT TRUE,
  water_source_type water_source_type,
  has_electricity BOOLEAN DEFAULT FALSE,
  electricity_availability_hours INTEGER,
  has_solar_power BOOLEAN DEFAULT FALSE,
  solar_power_details TEXT,
  
  -- Services offered
  primary_healthcare_services BOOLEAN DEFAULT TRUE,
  maternal_health_services BOOLEAN DEFAULT FALSE,
  maternal_services_details TEXT,
  child_health_services BOOLEAN DEFAULT FALSE,
  child_services_details TEXT,
  immunization_services BOOLEAN DEFAULT FALSE,
  immunization_schedule TEXT,
  family_planning_services BOOLEAN DEFAULT FALSE,
  family_planning_details TEXT,
  basic_first_aid BOOLEAN DEFAULT TRUE,
  minor_injury_treatment BOOLEAN DEFAULT TRUE,
  common_illness_treatment BOOLEAN DEFAULT TRUE,
  ncd_management BOOLEAN DEFAULT FALSE, -- Non-Communicable Disease
  ncd_services_details TEXT,
  tb_screening BOOLEAN DEFAULT FALSE,
  malaria_services BOOLEAN DEFAULT FALSE,
  nutrition_services BOOLEAN DEFAULT FALSE,
  health_education BOOLEAN DEFAULT TRUE,
  health_education_topics TEXT,
  referral_services BOOLEAN DEFAULT TRUE,
  referral_destinations TEXT,
  primary_focus_areas TEXT,
  
  -- Staff details
  total_staff_count INTEGER,
  health_assistant_count INTEGER,
  nurse_count INTEGER,
  community_health_worker_count INTEGER,
  other_staff_count INTEGER,
  visiting_professionals_frequency TEXT,
  visiting_professionals_specialties TEXT,
  staff_training_frequency TEXT,
  staff_training_topics TEXT,
  staffing_challenges TEXT,
  
  -- Equipment and supplies
  has_basic_equipment BOOLEAN DEFAULT TRUE,
  equipment_condition equipment_condition,
  basic_equipment_available TEXT,
  has_diagnostic_tools BOOLEAN DEFAULT FALSE,
  diagnostic_tools_details TEXT,
  essential_medicine_availability service_availability,
  common_medicines_available TEXT,
  medicine_storage_condition TEXT,
  medical_supplies_source TEXT,
  supply_frequency TEXT,
  supply_challenges TEXT,
  
  -- Health records and data
  record_keeping_system TEXT,  -- Paper-based, Electronic, Mixed
  has_electronic_records BOOLEAN DEFAULT FALSE,
  electronic_system_details TEXT,
  data_reporting_frequency TEXT,
  reports_to_facility TEXT,
  patient_tracking_system TEXT,
  
  -- Utilization statistics
  average_daily_patients INTEGER,
  monthly_patient_visits INTEGER,
  annual_patient_count INTEGER,
  most_common_consultations TEXT,
  seasonal_caseload_variation TEXT,
  outreach_activities_conducted BOOLEAN DEFAULT FALSE,
  outreach_activity_details TEXT,
  
  -- Community engagement
  community_involvement_level TEXT,
  community_health_volunteers BOOLEAN DEFAULT FALSE,
  volunteer_count INTEGER,
  community_based_activities TEXT,
  community_awareness_campaigns TEXT,
  health_promotion_activities TEXT,
  
  -- Financial aspects
  funding_source TEXT,
  operational_cost_monthly_npr DECIMAL(14, 2),
  service_charges BOOLEAN DEFAULT FALSE,
  fee_structure TEXT,
  financial_sustainability TEXT,
  receives_regular_budget BOOLEAN DEFAULT FALSE,
  budget_source TEXT,
  financial_challenges TEXT,
  
  -- Monitoring and quality
  supervision_frequency TEXT,
  supervising_entity TEXT,
  last_supervision_date DATE,
  quality_improvement_measures TEXT,
  patient_feedback_mechanism BOOLEAN DEFAULT FALSE,
  feedback_collection_method TEXT,
  
  -- Challenges and needs
  infrastructure_challenges TEXT,
  service_delivery_challenges TEXT,
  equipment_needs TEXT,
  medicine_supply_challenges TEXT,
  other_critical_needs TEXT,
  priority_improvement_areas TEXT,
  
  -- Program support
  supported_by_donors BOOLEAN DEFAULT FALSE,
  donor_organizations TEXT,
  special_program_support TEXT,
  program_support_duration TEXT,
  
  -- Disaster response
  has_disaster_response_role BOOLEAN DEFAULT FALSE,
  disaster_response_details TEXT,
  emergency_preparedness_level TEXT,
  emergency_supplies_available BOOLEAN DEFAULT FALSE,
  emergency_supplies_details TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  service_improvement_plans TEXT,
  infrastructure_development_plans TEXT,
  sustainability_strategy TEXT,
  
  -- Linkages to other entities
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_community_organizations JSONB DEFAULT '[]'::jsonb,
  linked_schools JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  building_footprint GEOMETRY(Polygon, 4326),
  service_area GEOMETRY(MultiPolygon, 4326),
  mobile_route GEOMETRY(MultiLineString, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_bhu_location_point ON acme_basic_health_unit USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_bhu_building_footprint ON acme_basic_health_unit USING GIST (building_footprint);
CREATE INDEX IF NOT EXISTS idx_bhu_service_area ON acme_basic_health_unit USING GIST (service_area);
CREATE INDEX IF NOT EXISTS idx_bhu_mobile_route ON acme_basic_health_unit USING GIST (mobile_route);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_bhu_name ON acme_basic_health_unit(name);
CREATE INDEX IF NOT EXISTS idx_bhu_slug ON acme_basic_health_unit(slug);
CREATE INDEX IF NOT EXISTS idx_bhu_type ON acme_basic_health_unit(unit_type);
CREATE INDEX IF NOT EXISTS idx_bhu_ward ON acme_basic_health_unit(ward_number);
