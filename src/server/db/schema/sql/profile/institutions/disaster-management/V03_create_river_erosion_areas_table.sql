-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the river erosion areas table
CREATE TABLE IF NOT EXISTS acme_river_erosion_area (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  location_description TEXT,
  river_name TEXT NOT NULL,
  river_section TEXT,
  river_type river_type,

  -- Erosion characteristics
  erosion_severity erosion_severity NOT NULL,
  erosion_status erosion_status NOT NULL,
  initial_occurrence_date DATE,
  most_recent_assessment_date DATE,

  -- Physical attributes
  affected_length_m DECIMAL(10, 2),
  eroded_area_sq_m DECIMAL(14, 2),
  average_erosion_rate_m_per_year DECIMAL(6, 2),
  maximum_erosion_rate_m_per_year DECIMAL(6, 2),
  bank_height_m DECIMAL(6, 2),
  channel_width_m DECIMAL(8, 2),
  average_water_velocity_mps DECIMAL(6, 2),
  river_bed_material TEXT,
  river_bank_material TEXT,

  -- Hydrological factors
  average_flow_cumecs_dry DECIMAL(10, 3),
  average_flow_cumecs_wet DECIMAL(10, 3),
  flood_frequency TEXT,
  last_major_flood_date DATE,
  flood_recurrence TEXT,
  sediment_load_description TEXT,

  -- Impact assessment
  land_area_lost_sq_m DECIMAL(14, 2),
  agricultural_land_lost_sq_m DECIMAL(14, 2),
  residential_land_lost_sq_m DECIMAL(14, 2),
  forest_land_lost_sq_m DECIMAL(14, 2),
  public_land_lost_sq_m DECIMAL(14, 2),
  affected_families_count INTEGER,
  displaced_people_count INTEGER,
  buildings_at_risk_count INTEGER,
  buildings_lost_count INTEGER,

  -- Infrastructure impact
  infrastructure_affected TEXT,
  roads_affected_km DECIMAL(8, 2),
  bridges_affected TEXT,
  water_supply_affected TEXT,
  irrigation_canals_affected_km DECIMAL(8, 2),
  electrical_infrastructure_affected TEXT,
  economic_loss_estimate_npr DECIMAL(14, 2),

  -- Risk factors
  risk_level TEXT, -- High, Medium, Low
  future_risk_assessment TEXT,
  vulnerable_structures TEXT,
  potential_impact_zone TEXT,
  estimated_risk_population INTEGER,

  -- Monitoring details
  is_being_monitored BOOLEAN DEFAULT false,
  monitoring_methods TEXT, -- Surveys, remote sensing, etc.
  monitoring_frequency TEXT,
  last_inspection_date DATE,
  has_river_gauges BOOLEAN DEFAULT false,
  gauge_locations TEXT,
  has_early_warning_system BOOLEAN DEFAULT false,
  early_warning_system_details TEXT,

  -- Mitigation and management
  mitigation_measures_taken TEXT,
  mitigation_effectiveness TEXT,
  embankment_details TEXT,
  embankment_length_m DECIMAL(10, 2),
  gabion_boxes_installed BOOLEAN DEFAULT false,
  gabion_box_length_m DECIMAL(10, 2),
  bio_engineering_solutions TEXT,
  channel_regulation_works TEXT,
  spurs_details TEXT,
  spurs_count INTEGER,
  vegetation_planting TEXT,
  other_control_measures TEXT,
  proposed_future_measures TEXT,

  -- Response and recovery
  emergency_response_actions TEXT,
  recovery_efforts TEXT,
  relief_provided_details TEXT,
  resettlement_details TEXT,
  compensation_provided_npr DECIMAL(14, 2),

  -- Responsible authorities
  lead_agency TEXT,
  supporting_agencies TEXT,
  local_contact_person TEXT,
  local_contact_phone TEXT,

  -- Community aspects
  community_awareness_level TEXT,
  community_mitigation_participation TEXT,
  community_training_conducted BOOLEAN DEFAULT false,
  community_training_details TEXT,

  -- Environmental impacts
  environmental_impacts TEXT,
  biodiversity_impacts TEXT,
  aquatic_ecosystem_changes TEXT,
  water_quality_changes TEXT,
  sedimentation_issues TEXT,

  -- Financial aspects
  estimated_mitigation_cost_npr DECIMAL(14, 2),
  allocated_budget_npr DECIMAL(14, 2),
  funding_source TEXT,
  annual_maintenance_cost_npr DECIMAL(14, 2),

  -- Linkages to other entities and assets
  linked_disaster_management_centers JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_evacuation_centers JSONB DEFAULT '[]'::jsonb,
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_rivers JSONB DEFAULT '[]'::jsonb,
  linked_flooded_areas JSONB DEFAULT '[]'::jsonb,

  -- Research and documentation
  scientific_studies_conducted TEXT,
  research_institutions_involved TEXT,
  historical_erosion_data TEXT,

  -- Notes and additional information
  additional_notes TEXT,
  seasonal_variations TEXT,
  reference_materials TEXT,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  affected_area GEOMETRY(Polygon, 4326),
  erosion_line GEOMETRY(LineString, 4326),
  protection_structures GEOMETRY(MultiLineString, 4326),
  monitoring_points GEOMETRY(MultiPoint, 4326),

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
CREATE INDEX IF NOT EXISTS idx_river_erosion_location_point ON acme_river_erosion_area USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_river_erosion_affected_area ON acme_river_erosion_area USING GIST (affected_area);
CREATE INDEX IF NOT EXISTS idx_river_erosion_erosion_line ON acme_river_erosion_area USING GIST (erosion_line);
CREATE INDEX IF NOT EXISTS idx_river_erosion_protection ON acme_river_erosion_area USING GIST (protection_structures);
CREATE INDEX IF NOT EXISTS idx_river_erosion_monitoring_points ON acme_river_erosion_area USING GIST (monitoring_points);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_river_erosion_name ON acme_river_erosion_area(name);
CREATE INDEX IF NOT EXISTS idx_river_erosion_slug ON acme_river_erosion_area(slug);
CREATE INDEX IF NOT EXISTS idx_river_erosion_severity ON acme_river_erosion_area(erosion_severity);
CREATE INDEX IF NOT EXISTS idx_river_erosion_status ON acme_river_erosion_area(erosion_status);
CREATE INDEX IF NOT EXISTS idx_river_erosion_river_type ON acme_river_erosion_area(river_type);
