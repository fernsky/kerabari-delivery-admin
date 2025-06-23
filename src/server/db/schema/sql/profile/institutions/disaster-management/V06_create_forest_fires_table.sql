-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the forest fires table
CREATE TABLE IF NOT EXISTS acme_forest_fire (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  location_description TEXT,
  forest_name TEXT,
  forest_type forest_type,
  forest_ownership TEXT, -- National, community, private, etc.

  -- Fire characteristics
  forest_fire_severity forest_fire_severity NOT NULL,
  forest_fire_status forest_fire_status NOT NULL,
  forest_fire_cause forest_fire_cause,
  ignition_point_description TEXT,
  start_date DATE,
  start_time TIME,
  containment_date DATE,
  extinguished_date DATE,
  duration_hours INTEGER,

  -- Physical attributes
  area_affected_hectares DECIMAL(10, 2),
  perimeter_km DECIMAL(8, 2),
  spread_rate_km_per_hour DECIMAL(6, 2),
  flame_height_m DECIMAL(6, 2),
  fire_intensity TEXT,

  -- Environmental conditions during fire
  temperature_c DECIMAL(5, 2),
  humidity INTEGER,
  wind_speed_kmh DECIMAL(6, 1),
  wind_direction TEXT,
  precipitation_mm DECIMAL(6, 2),
  drought_conditions TEXT,
  fuel_moisture_content TEXT,
  fuel_type TEXT, -- Description of vegetation/fuel

  -- Impact assessment
  casualties_count INTEGER,
  injuries_count INTEGER,
  evacuations_count INTEGER,
  buildings_destroyed_count INTEGER,
  livestock_lost_count INTEGER,
  critical_infrastructure_affected TEXT,
  economic_loss_estimate_npr DECIMAL(14, 2),

  -- Ecological impact
  timber_volume_affected_cubic_m DECIMAL(14, 2),
  carbon_release_estimate_tons DECIMAL(14, 2),
  endangered_species_affected TEXT,
  habitat_destruction TEXT,
  soil_erosion_risk TEXT,
  watershed_impact TEXT,
  biodiversity_loss TEXT,
  regeneration_prospect TEXT,
  long_term_ecological_impact TEXT,
  air_quality_impact TEXT,

  -- Response and suppression
  detection_method TEXT,
  detection_time TIMESTAMP,
  reporting_delay_minutes INTEGER,
  initial_response_time TIMESTAMP,
  response_time_minutes INTEGER,
  suppression_methods TEXT,
  equipment_used TEXT,
  firefighters_count INTEGER,
  water_sources_used TEXT,
  water_used_liters DECIMAL(14, 2),
  aircraft_deployment BOOLEAN DEFAULT false,
  aircraft_details TEXT,
  firebreaks_created_km DECIMAL(8, 2),
  control_strategies TEXT,
  logistical_challenges TEXT,

  -- Responsible authorities
  lead_response_agency TEXT,
  supporting_agencies TEXT,
  community_involvement TEXT,
  coordination_effectiveness TEXT,
  incident_commander_name TEXT,
  command_structure TEXT,

  -- Prevention and preparedness
  pre_fire_preparedness TEXT,
  existing_prevention_measures TEXT,
  early_warning_system_details TEXT,
  fire_danger_rating_system BOOLEAN DEFAULT false,
  fire_breaks_pre_existing BOOLEAN DEFAULT false,
  community_awareness_level TEXT,
  prevention_campaigns TEXT,

  -- Recovery and rehabilitation
  post_fire_management_plan TEXT,
  rehabilitation_measures TEXT,
  revegetation_plans TEXT,
  soil_stabilization_measures TEXT,
  community_recovery_initiatives TEXT,
  compensation_provided_npr DECIMAL(14, 2),

  -- Financial aspects
  suppression_cost_npr DECIMAL(14, 2),
  rehabilitation_cost_npr DECIMAL(14, 2),
  funding_sources_for_rehabilitation TEXT,
  insurance_coverage TEXT,

  -- Risk factors for future fires
  risk_factors TEXT,
  vulnerable_areas TEXT,
  recurrence_risk TEXT,
  climate_change_considerations TEXT,

  -- Monitoring details
  post_fire_monitoring TEXT,
  monitoring_frequency TEXT,
  hotspot_identification TEXT,
  satellite_surveillance BOOLEAN DEFAULT false,
  ground_patrols BOOLEAN DEFAULT false,
  fire_watch_towers BOOLEAN DEFAULT false,
  fire_watch_tower_count INTEGER,

  -- Community engagement
  community_training TEXT,
  public_education_campaigns TEXT,
  volunteer_firefighter_count INTEGER,
  local_fire_response_team BOOLEAN DEFAULT false,
  local_fire_response_team_details TEXT,

  -- Linkages to other entities and assets
  linked_disaster_management_centers JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_water_sources JSONB DEFAULT '[]'::jsonb,
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_forest_areas JSONB DEFAULT '[]'::jsonb,

  -- Research and documentation
  scientific_studies_conducted TEXT,
  research_institutions_involved TEXT,
  fire_data_collection TEXT,
  lessons_learned TEXT,

  -- Notes and additional information
  additional_notes TEXT,
  historical_fire_patterns TEXT,
  reference_materials TEXT,
  image_documentation TEXT,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  ignition_point GEOMETRY(Point, 4326),
  burn_area GEOMETRY(Polygon, 4326),
  fire_perimeter GEOMETRY(LineString, 4326),
  firebreak_lines GEOMETRY(MultiLineString, 4326),
  evacuation_zones GEOMETRY(MultiPolygon, 4326),
  firespread_time_zones GEOMETRY(MultiPolygon, 4326), -- Zones showing fire spread over time

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
CREATE INDEX IF NOT EXISTS idx_forest_fire_ignition_point ON acme_forest_fire USING GIST (ignition_point);
CREATE INDEX IF NOT EXISTS idx_forest_fire_burn_area ON acme_forest_fire USING GIST (burn_area);
CREATE INDEX IF NOT EXISTS idx_forest_fire_perimeter ON acme_forest_fire USING GIST (fire_perimeter);
CREATE INDEX IF NOT EXISTS idx_forest_fire_firebreak ON acme_forest_fire USING GIST (firebreak_lines);
CREATE INDEX IF NOT EXISTS idx_forest_fire_evacuation ON acme_forest_fire USING GIST (evacuation_zones);
CREATE INDEX IF NOT EXISTS idx_forest_fire_spread ON acme_forest_fire USING GIST (firespread_time_zones);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_forest_fire_name ON acme_forest_fire(name);
CREATE INDEX IF NOT EXISTS idx_forest_fire_slug ON acme_forest_fire(slug);
CREATE INDEX IF NOT EXISTS idx_forest_fire_severity ON acme_forest_fire(forest_fire_severity);
CREATE INDEX IF NOT EXISTS idx_forest_fire_status ON acme_forest_fire(forest_fire_status);
CREATE INDEX IF NOT EXISTS idx_forest_fire_cause ON acme_forest_fire(forest_fire_cause);
CREATE INDEX IF NOT EXISTS idx_forest_fire_forest_type ON acme_forest_fire(forest_type);
