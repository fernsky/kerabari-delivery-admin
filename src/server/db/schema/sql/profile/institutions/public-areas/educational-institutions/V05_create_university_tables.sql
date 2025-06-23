-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- University type enum
DO $$ 
BEGIN
  CREATE TYPE university_type AS ENUM (
    'PUBLIC', 'PRIVATE', 'COMMUNITY', 'DEEMED', 'AUTONOMOUS',
    'TECHNICAL', 'MEDICAL', 'AGRICULTURE', 'ENGINEERING',
    'COMPREHENSIVE', 'RESEARCH', 'OPEN', 'INTERNATIONAL', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the university table
CREATE TABLE IF NOT EXISTS acme_university (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  local_name TEXT,
  description TEXT,
  university_type university_type NOT NULL,
  status educational_institution_status NOT NULL,
  motto TEXT,
  
  -- Location details
  headquarters_ward_number INTEGER,
  headquarters_location TEXT,
  headquarters_address TEXT,
  
  -- Basic information
  established_year INTEGER,
  charter_act TEXT,
  registration_number TEXT,
  ownership_type educational_institution_ownership NOT NULL,
  chancellor_name TEXT,
  vice_chancellor_name TEXT,
  registrar_name TEXT,
  
  -- Scale and coverage
  total_campus_count INTEGER,
  constituent_campus_count INTEGER,
  affiliated_campus_count INTEGER,
  district_coverage_count INTEGER,
  province_coverage_count INTEGER,
  total_area_hectares DECIMAL(10, 2),
  built_up_area_hectares DECIMAL(10, 2),
  
  -- Academic information
  faculties_count INTEGER,
  faculty_names TEXT, -- Comma-separated
  departments_count INTEGER,
  centers_of_excellence_count INTEGER,
  centers_of_excellence_details TEXT,
  research_centers_count INTEGER,
  research_center_details TEXT,
  program_levels TEXT, -- Bachelors, Masters, MPhil, PhD
  total_programs_offered INTEGER,
  flagship_programs TEXT,
  
  -- Enrollment and capacity
  total_enrolled_students INTEGER,
  undergraduate_students_count INTEGER,
  graduate_students_count INTEGER,
  doctoral_students_count INTEGER,
  female_students_percentage DECIMAL(5, 2),
  international_students_count INTEGER,
  international_students_countries TEXT,
  annual_graduation_count INTEGER,
  
  -- Staff information
  total_teaching_staff INTEGER,
  full_time_faculty_count INTEGER,
  part_time_faculty_count INTEGER,
  phd_holder_faculty_count INTEGER,
  international_faculty_count INTEGER,
  female_faculty_percentage DECIMAL(5, 2),
  professor_count INTEGER,
  associate_professor_count INTEGER,
  assistant_professor_count INTEGER,
  lecturer_count INTEGER,
  administrative_staff_count INTEGER,
  technical_staff_count INTEGER,
  support_staff_count INTEGER,
  total_employee_count INTEGER,
  
  -- Academic quality and rankings
  national_ranking TEXT,
  international_rankings TEXT,
  accreditation_status TEXT,
  accreditation_bodies TEXT,
  quality_assurance_mechanisms TEXT,
  academic_audit_frequency TEXT,
  key_performance_indicators TEXT,
  
  -- Research and publications
  annual_research_budget_npr DECIMAL(14, 2),
  research_budget_percentage DECIMAL(5, 2),
  research_grant_volume_npr DECIMAL(14, 2),
  annual_publication_count INTEGER,
  indexed_publication_count INTEGER,
  annual_patent_count INTEGER,
  annual_research_projects_count INTEGER,
  national_collaboration_count INTEGER,
  international_collaboration_count INTEGER,
  major_research_areas TEXT,
  
  -- Infrastructure
  central_library_status BOOLEAN DEFAULT true,
  total_library_count INTEGER,
  book_volume_count INTEGER,
  journal_subscription_count INTEGER,
  laboratory_count INTEGER,
  major_laboratory_details TEXT,
  has_central_computer_center BOOLEAN DEFAULT false,
  has_conference_facilities BOOLEAN DEFAULT true,
  conference_facilities_details TEXT,
  has_sports_complex BOOLEAN DEFAULT false,
  sports_facilities_details TEXT,
  has_health_services BOOLEAN DEFAULT false,
  health_service_details TEXT,
  has_student_hostels BOOLEAN DEFAULT false,
  student_hostel_capacity INTEGER,
  has_staff_housing BOOLEAN DEFAULT false,
  staff_housing_capacity INTEGER,
  
  -- Technology and digital infrastructure
  has_campus_network BOOLEAN DEFAULT false,
  internet_bandwidth_gbps DECIMAL(10, 2),
  has_data_center BOOLEAN DEFAULT false,
  digital_infrastructure_details TEXT,
  has_learning_management_system BOOLEAN DEFAULT false,
  lms_details TEXT,
  has_digital_library_resources BOOLEAN DEFAULT false,
  digital_library_details TEXT,
  has_video_conferencing_facilities BOOLEAN DEFAULT false,
  has_smart_classrooms BOOLEAN DEFAULT false,
  smart_classroom_count INTEGER,
  
  -- Student services
  has_career_counseling BOOLEAN DEFAULT false,
  has_placement_cell BOOLEAN DEFAULT false,
  has_alumni_relations_office BOOLEAN DEFAULT false,
  has_international_relations_office BOOLEAN DEFAULT false,
  has_student_welfare_office BOOLEAN DEFAULT false,
  has_scholarship_programs BOOLEAN DEFAULT true,
  scholarship_details TEXT,
  has_student_exchange_programs BOOLEAN DEFAULT false,
  exchange_program_details TEXT,
  has_cultural_center BOOLEAN DEFAULT false,
  cultural_center_details TEXT,
  
  -- Governance and administration
  governance_structure TEXT,
  has_senate BOOLEAN DEFAULT true,
  has_syndicate BOOLEAN DEFAULT true,
  has_academic_council BOOLEAN DEFAULT true,
  major_committees TEXT,
  administrative_structure TEXT,
  management_information_system TEXT,
  quality_management_approach TEXT,
  
  -- Finances
  annual_budget_npr DECIMAL(18, 2),
  government_funding_percentage DECIMAL(5, 2),
  own_source_revenue_percentage DECIMAL(5, 2),
  tuition_fee_percentage DECIMAL(5, 2),
  endowment_fund_npr DECIMAL(14, 2),
  revenue_diversification_strategies TEXT,
  financial_sustainability_measures TEXT,
  
  -- Community engagement and impact
  community_outreach_programs TEXT,
  extension_activities TEXT,
  local_development_contributions TEXT,
  industry_partnerships_count INTEGER,
  industry_partnership_details TEXT,
  technology_transfer_initiatives TEXT,
  startup_incubation_details TEXT,
  
  -- Internationalization
  international_mou_count INTEGER,
  key_international_partners TEXT,
  international_program_count INTEGER,
  international_program_details TEXT,
  international_accreditation_details TEXT,
  global_engagement_strategy TEXT,
  
  -- Alumni relations
  registered_alumni_count INTEGER,
  notable_alumni TEXT,
  alumni_association_status TEXT,
  alumni_contribution_details TEXT,
  alumni_engagement_programs TEXT,
  
  -- Challenges and issues
  major_challenges TEXT,
  infrastructure_challenges TEXT,
  academic_challenges TEXT,
  research_challenges TEXT,
  financial_challenges TEXT,
  
  -- Development plans
  strategic_plan_status TEXT,
  strategic_plan_period TEXT,
  expansion_plans TEXT,
  academic_development_plans TEXT,
  infrastructure_development_plans TEXT,
  internationalization_plans TEXT,
  
  -- Contact information
  contact_office TEXT,
  contact_phone TEXT,
  general_information_email TEXT,
  administration_email TEXT,
  admissions_email TEXT,
  website TEXT,
  social_media_links TEXT,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  headquarters_location_point GEOMETRY(Point, 4326),
  main_campus_boundary GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_university_location_point ON acme_university USING GIST (headquarters_location_point);
CREATE INDEX IF NOT EXISTS idx_university_campus_boundary ON acme_university USING GIST (main_campus_boundary);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_university_name ON acme_university(name);
CREATE INDEX IF NOT EXISTS idx_university_slug ON acme_university(slug);
CREATE INDEX IF NOT EXISTS idx_university_type ON acme_university(university_type);
CREATE INDEX IF NOT EXISTS idx_university_status ON acme_university(status);
CREATE INDEX IF NOT EXISTS idx_university_ownership ON acme_university(ownership_type);
