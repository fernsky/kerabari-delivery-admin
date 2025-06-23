-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Enable PostGIS extension if not already enabled
CREATE EXTENSION IF NOT EXISTS postgis;

-- Define showroom type enum
DO $$ 
BEGIN
  CREATE TYPE showroom_type AS ENUM (
    'NEW_VEHICLES',
    'USED_VEHICLES',
    'MIXED_VEHICLES',
    'TWO_WHEELER',
    'FOUR_WHEELER',
    'COMMERCIAL_VEHICLES',
    'HEAVY_EQUIPMENT',
    'MULTI_BRAND',
    'SINGLE_BRAND',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Define showroom size category enum
DO $$ 
BEGIN
  CREATE TYPE showroom_size_category AS ENUM (
    'SMALL',
    'MEDIUM',
    'LARGE',
    'FLAGSHIP'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create the auto showroom table
CREATE TABLE IF NOT EXISTS acme_auto_showroom (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  showroom_type showroom_type NOT NULL,

  -- Location details
  ward_number INTEGER,
  location TEXT,
  address TEXT,
  nearest_landmark TEXT,
  distance_from_city_or_bazar_km DECIMAL(6, 2),
  gps_coordinates TEXT,
  
  -- Business information
  established_year INTEGER,
  registration_number VARCHAR(50),
  registered_with TEXT,
  pan_vat_number VARCHAR(20),
  size_category showroom_size_category,
  is_franchise BOOLEAN DEFAULT false,
  franchise_details TEXT,
  is_authorized_dealer BOOLEAN DEFAULT false,
  parent_company_distributor TEXT,
  
  -- Contact information
  phone_number TEXT,
  alternate_phone_number TEXT,
  customer_service_number TEXT,
  email TEXT,
  sales_email TEXT,
  service_email TEXT,
  website_url TEXT,
  facebook_page TEXT,
  instagram_handle TEXT,
  twitter_handle TEXT,
  youtube_channel TEXT,
  other_social_media TEXT,
  
  -- Ownership and management
  owner_name TEXT,
  owner_contact_details TEXT,
  managing_director_name TEXT,
  parent_company_name TEXT,
  ownership_type TEXT,
  
  -- Operating hours
  opening_time TIME,
  closing_time TIME,
  weekly_off_days TEXT,
  is_open_on_public_holidays BOOLEAN DEFAULT false,
  special_operating_hours_notes TEXT,
  
  -- Facility details
  total_area_sq_m DECIMAL(10, 2),
  showroom_area_sq_m DECIMAL(10, 2),
  display_capacity_vehicles INTEGER,
  facility_condition facility_condition,
  last_renovation_year INTEGER,
  has_multiple_floors BOOLEAN DEFAULT false,
  total_floors INTEGER,
  has_display_windows BOOLEAN DEFAULT true,
  has_waiting_area BOOLEAN DEFAULT true,
  waiting_area_capacity INTEGER,
  has_customer_lounge BOOLEAN DEFAULT false,
  has_refreshment_area BOOLEAN DEFAULT false,
  has_kids_play_area BOOLEAN DEFAULT false,
  has_digital_display BOOLEAN DEFAULT false,
  has_product_info_desk BOOLEAN DEFAULT false,
  
  -- Vehicle information
  vehicle_brands JSONB DEFAULT '[]'::jsonb,
  primary_vehicle_brand TEXT,
  vehicle_types JSONB DEFAULT '[]'::jsonb,
  vehicle_segments JSONB DEFAULT '[]'::jsonb,
  new_vehicle_display_count INTEGER,
  used_vehicle_display_count INTEGER,
  top_selling_models JSONB DEFAULT '[]'::jsonb,
  price_range_minimum_npr DECIMAL(14, 2),
  price_range_maximum_npr DECIMAL(14, 2),
  has_electric_vehicles BOOLEAN DEFAULT false,
  electric_vehicle_count INTEGER,
  
  -- Sales facilities
  has_sales_consultants BOOLEAN DEFAULT true,
  sales_consultant_count INTEGER,
  has_test_drive_facility BOOLEAN DEFAULT true,
  test_drive_vehicle_count INTEGER,
  offers_trading_facility BOOLEAN DEFAULT false,
  has_financing_options BOOLEAN DEFAULT true,
  financing_partners JSONB DEFAULT '[]'::jsonb,
  has_insurance_services BOOLEAN DEFAULT true,
  insurance_partners JSONB DEFAULT '[]'::jsonb,
  has_vehicle_registration_assistance BOOLEAN DEFAULT true,
  has_warranty_services BOOLEAN DEFAULT true,
  warranty_details TEXT,
  has_extended_warranty_options BOOLEAN DEFAULT false,
  extended_warranty_details TEXT,
  offers_door_delivery BOOLEAN DEFAULT false,
  
  -- Service facility
  has_service_center BOOLEAN DEFAULT false,
  service_center TEXT,
  service_center_at_same_location BOOLEAN DEFAULT false,
  service_center_distance_km DECIMAL(6, 2),
  service_center_capacity_per_day INTEGER,
  has_express_service BOOLEAN DEFAULT false,
  has_mobile_service BOOLEAN DEFAULT false,
  has_pickup_drop_service BOOLEAN DEFAULT false,
  offers_cost_estimate_before_service BOOLEAN DEFAULT false,
  has_brand_trained_technicians BOOLEAN DEFAULT false,
  trained_technician_count INTEGER,
  
  -- Spare parts
  has_spare_parts BOOLEAN DEFAULT false,
  spare_parts_inventory_value_npr DECIMAL(14, 2),
  offers_fast_moving_parts BOOLEAN DEFAULT false,
  has_oem_parts BOOLEAN DEFAULT true,
  has_aftermarket_parts BOOLEAN DEFAULT false,
  spare_parts_delivery_timeline_days DECIMAL(5, 2),
  
  -- Accessories
  has_accessories_shop BOOLEAN DEFAULT false,
  accessory_types JSONB DEFAULT '[]'::jsonb,
  offer_custom_accessories BOOLEAN DEFAULT false,
  
  -- Customer service
  has_dedicated_customer_service BOOLEAN DEFAULT false,
  customer_service_staff_count INTEGER,
  has_24_hour_helpline BOOLEAN DEFAULT false,
  helpline_number TEXT,
  has_road_assistance BOOLEAN DEFAULT false,
  road_assistance_details TEXT,
  has_customer_feedback_system BOOLEAN DEFAULT false,
  average_customer_satisfaction_rating DECIMAL(3, 1),
  
  -- Business metrics
  average_monthly_visitors INTEGER,
  average_monthly_inquiries INTEGER,
  average_monthly_sales_count INTEGER,
  annual_sales_count_previous_year INTEGER,
  annual_sales_growth_percent DECIMAL(5, 2),
  market_share_percentage DECIMAL(5, 2),
  sales_target_achievement_percent DECIMAL(5, 2),
  top_selling_segment TEXT,
  business_volume business_volume,
  peak_sales_months TEXT,
  low_sales_months TEXT,
  
  -- Staff and HR
  total_staff_count INTEGER,
  sales_staff_count INTEGER,
  administrative_staff_count INTEGER,
  technical_staff_count INTEGER,
  female_staff_count INTEGER,
  staff_training_frequency TEXT,
  has_incentive_program BOOLEAN DEFAULT true,
  incentive_program_details TEXT,
  
  -- Marketing and promotion
  marketing_budget_percentage DECIMAL(5, 2),
  advertising_channels JSONB DEFAULT '[]'::jsonb,
  has_loyalty_program BOOLEAN DEFAULT false,
  loyalty_program_details TEXT,
  organizes_community_events BOOLEAN DEFAULT false,
  community_event_details TEXT,
  has_car_shows_participation BOOLEAN DEFAULT false,
  car_show_details TEXT,
  
  -- Digital capabilities
  has_crm BOOLEAN DEFAULT false,
  crm_system TEXT,
  has_digital_sales_tools BOOLEAN DEFAULT false,
  digital_sales_tool_details TEXT,
  has_online_booking_system BOOLEAN DEFAULT false,
  has_virtual_showroom_tour BOOLEAN DEFAULT false,
  has_digital_catalog BOOLEAN DEFAULT false,
  
  -- Security
  has_cctv BOOLEAN DEFAULT true,
  cctv_camera_count INTEGER,
  has_security_personnel BOOLEAN DEFAULT true,
  security_personnel_count INTEGER,
  has_fire_safety_system BOOLEAN DEFAULT true,
  fire_safety_equipment TEXT,
  
  -- Parking and facilities
  has_parking BOOLEAN DEFAULT true,
  customer_parking_spaces INTEGER,
  staff_parking_spaces INTEGER,
  has_display_vehicle_parking BOOLEAN DEFAULT true,
  display_vehicle_parking_capacity INTEGER,
  has_ev_charging_station BOOLEAN DEFAULT false,
  ev_charging_station_count INTEGER,
  
  -- Financial information
  annual_turnover_npr DECIMAL(18, 2),
  profit_margin_percentage DECIMAL(5, 2),
  inventory_value_npr DECIMAL(18, 2),
  average_inventory_days INTEGER,
  payment_methods_accepted JSONB DEFAULT '[]'::jsonb,
  accepts_digital_payments BOOLEAN DEFAULT true,
  digital_payment_options JSONB DEFAULT '[]'::jsonb,
  offer_emi_options BOOLEAN DEFAULT true,
  minimum_down_payment_percentage DECIMAL(5, 2),
  
  -- Environmental initiatives
  has_green_initiatives BOOLEAN DEFAULT false,
  green_initiative_details TEXT,
  has_waste_management BOOLEAN DEFAULT false,
  waste_management_details TEXT,
  uses_renewable_energy BOOLEAN DEFAULT false,
  renewable_energy_details TEXT,
  has_water_conservation BOOLEAN DEFAULT false,
  water_conservation_details TEXT,
  offers_paperless_transactions BOOLEAN DEFAULT false,
  
  -- Compliance
  has_all_required_permits BOOLEAN DEFAULT true,
  required_permits JSONB DEFAULT '[]'::jsonb,
  last_compliance_check_date DATE,
  compliance_issues TEXT,
  regulatory_challenges TEXT,
  
  -- Future plans
  expansion_plans TEXT,
  upcoming_vehicle_models JSONB DEFAULT '[]'::jsonb,
  planned_facility_upgrades TEXT,
  future_investment_plans_npr DECIMAL(18, 2),
  anticipated_market_trends TEXT,
  
  -- Challenges and competition
  major_challenges TEXT,
  competitor_analysis TEXT,
  nearest_competitor_distance_km DECIMAL(6, 2),
  market_differentiators TEXT,
  
  -- Social impact
  employment_generated INTEGER,
  local_employment_percentage INTEGER,
  contribution_to_local_economy_npr DECIMAL(18, 2),
  community_development_initiatives TEXT,
  
  -- Linkages to other entities
  linked_service_centers JSONB DEFAULT '[]'::jsonb,
  linked_spare_parts_dealers JSONB DEFAULT '[]'::jsonb,
  linked_financial_institutions JSONB DEFAULT '[]'::jsonb,
  linked_insurance_providers JSONB DEFAULT '[]'::jsonb,
  linked_ward_offices JSONB DEFAULT '[]'::jsonb,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,
  
  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  showroom_area GEOMETRY(Polygon, 4326),
  
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
CREATE INDEX IF NOT EXISTS idx_auto_showroom_location_point ON acme_auto_showroom USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_auto_showroom_area ON acme_auto_showroom USING GIST (showroom_area);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_auto_showroom_name ON acme_auto_showroom(name);
CREATE INDEX IF NOT EXISTS idx_auto_showroom_slug ON acme_auto_showroom(slug);
CREATE INDEX IF NOT EXISTS idx_auto_showroom_type ON acme_auto_showroom(showroom_type);
CREATE INDEX IF NOT EXISTS idx_auto_showroom_ward ON acme_auto_showroom(ward_number);
CREATE INDEX IF NOT EXISTS idx_auto_showroom_size ON acme_auto_showroom(size_category);
