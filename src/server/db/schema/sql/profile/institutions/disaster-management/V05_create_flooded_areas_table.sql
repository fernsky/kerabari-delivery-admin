-- Set UTF-8 encoding
SET client_encoding = 'UTF8';

-- Create the flooded areas table
CREATE TABLE IF NOT EXISTS acme_flooded_area (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Location details
  ward_number INTEGER,
  location TEXT, -- Village/Tole/Area name
  location_description TEXT,

  -- Flood characteristics
  flood_severity flood_severity NOT NULL,
  flood_frequency flood_frequency,
  primary_flood_cause flood_cause,
  secondary_flood_causes TEXT,
  most_recent_flood_date DATE,
  last_major_flood_date DATE,

  -- Physical attributes
  area_affected_sq_km DECIMAL(10, 6),
  maximum_depth_m DECIMAL(6, 2),
  average_depth_m DECIMAL(6, 2),
  flood_duration_hours INTEGER,
  typical_inundation_period_days DECIMAL(5, 1),
  water_source_name TEXT, -- Name of river, stream, etc.
  water_source_type TEXT,
  flood_return_period_years INTEGER, -- 10-year flood, 100-year flood, etc.

  -- Hydrological factors
  rainfall_mm DECIMAL(7, 2),
  rainfall_duration_hours INTEGER,
  rainfall_intensity_mm_per_hour DECIMAL(7, 2),
  peak_water_level_m DECIMAL(6, 2),
  normal_water_level_m DECIMAL(6, 2),
  peak_discharge_cumecs DECIMAL(10, 2),
  soil_infiltration_rate TEXT,

  -- Impact assessment
  population_affected INTEGER,
  households_affected INTEGER,
  casualties_count INTEGER,
  injuries_count INTEGER,
  missing_persons_count INTEGER,
  displaced_people_count INTEGER,
  buildings_damaged_count INTEGER,
  buildings_destroyed_count INTEGER,
  schools_affected_count INTEGER,
  health_facilities_affected_count INTEGER,

  -- Agricultural and economic impact
  crops_affected_hectares DECIMAL(10, 2),
  crop_damage_value_npr DECIMAL(14, 2),
  livestock_lost_count INTEGER,
  agricultural_land_affected_hectares DECIMAL(10, 2),
  forest_area_affected_hectares DECIMAL(10, 2),
  businesses_affected_count INTEGER,
  total_economic_loss_npr DECIMAL(18, 2),

  -- Infrastructure impact
  roads_affected_km DECIMAL(8, 2),
  bridges_damaged_count INTEGER,
  water_supply_systems_affected TEXT,
  electrical_infrastructure_affected TEXT,
  communication_systems_affected TEXT,
  irrigation_systems_affected TEXT,

  -- Risk factors
  vulnerability_factors TEXT,
  critical_facilities_at_risk TEXT,
  settlement_pattern_issues TEXT,
  land_use_contributing_factors TEXT,
  population_at_risk INTEGER,
  future_risk_projection TEXT,
  climate_change_considerations TEXT,

  -- Monitoring details
  is_monitored BOOLEAN DEFAULT false,
  monitoring_methods TEXT, -- Gauges, remote sensing, etc.
  monitoring_frequency TEXT,
  water_level_monitoring_stations TEXT,
  has_flood_forecasting_system BOOLEAN DEFAULT false,
  forecasting_system_details TEXT,
  early_warning_system_details TEXT,
  warning_dissemination_methods TEXT,
  evacuation_plans TEXT,

  -- Mitigation and management
  structural_measures_implemented TEXT,
  non_structural_measures_implemented TEXT,
  flood_defense_type TEXT,
  embankment_details TEXT,
  embankment_length_km DECIMAL(8, 2),
  drainage_system_improvements TEXT,
  retention_basins_details TEXT,
  floodplain_management TEXT,
  land_use_regulations TEXT,

  -- Response and recovery
  emergency_response_actions TEXT,
  evacuation_effectiveness TEXT,
  temporary_shelter_details TEXT,
  relief_measures TEXT,
  rehabilitation_measures TEXT,
  recovery_time_months DECIMAL(5, 1),
  compensation_provided_npr DECIMAL(14, 2),

  -- Responsible authorities
  lead_agency TEXT,
  supporting_agencies TEXT,
  local_disaster_management_committee TEXT,
  local_contact_person TEXT,
  local_contact_phone TEXT,

  -- Community aspects
  community_preparedness TEXT,
  community_awareness_programs TEXT,
  local_knowledge_and_practices TEXT,
  community_based_early_warning TEXT,
  community_drills TEXT,

  -- Environmental impacts
  environmental_impacts TEXT,
  water_contamination_issues TEXT,
  ecological_changes TEXT,
  soil_erosion_impacts TEXT,
  sediment_deposition TEXT,

  -- Financial aspects
  mitigation_measures_cost_npr DECIMAL(14, 2),
  annual_maintenance_cost_npr DECIMAL(14, 2),
  insurance_coverage_details TEXT,
  allocated_disaster_fund_npr DECIMAL(14, 2),

  -- Reconstruction status
  reconstruction_status TEXT,
  infrastructure_repair_status TEXT,
  housing_reconstruction_status TEXT,
  pending_reconstruction_needs TEXT,

  -- Linkages to other entities and assets
  linked_disaster_management_centers JSONB DEFAULT '[]'::jsonb,
  linked_health_facilities JSONB DEFAULT '[]'::jsonb,
  linked_evacuation_centers JSONB DEFAULT '[]'::jsonb,
  linked_roads JSONB DEFAULT '[]'::jsonb,
  linked_settlements JSONB DEFAULT '[]'::jsonb,
  linked_rivers JSONB DEFAULT '[]'::jsonb,
  linked_river_erosion_areas JSONB DEFAULT '[]'::jsonb,

  -- Research and documentation
  scientific_studies_conducted TEXT,
  research_institutions_involved TEXT,
  historical_flood_data TEXT,
  flood_documentation TEXT,
  flood_risk_models TEXT,

  -- Notes and additional information
  additional_notes TEXT,
  seasonal_considerations TEXT,
  reference_materials TEXT,

  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT,

  -- Geometry fields
  location_point GEOMETRY(Point, 4326),
  flood_plain GEOMETRY(Polygon, 4326),
  flood_extent GEOMETRY(Polygon, 4326),
  drainage_system GEOMETRY(MultiLineString, 4326),
  flood_defense_structures GEOMETRY(MultiLineString, 4326),
  evacuation_routes GEOMETRY(MultiLineString, 4326),

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
CREATE INDEX IF NOT EXISTS idx_flooded_area_location_point ON acme_flooded_area USING GIST (location_point);
CREATE INDEX IF NOT EXISTS idx_flooded_area_flood_plain ON acme_flooded_area USING GIST (flood_plain);
CREATE INDEX IF NOT EXISTS idx_flooded_area_flood_extent ON acme_flooded_area USING GIST (flood_extent);
CREATE INDEX IF NOT EXISTS idx_flooded_area_drainage ON acme_flooded_area USING GIST (drainage_system);
CREATE INDEX IF NOT EXISTS idx_flooded_area_defense ON acme_flooded_area USING GIST (flood_defense_structures);
CREATE INDEX IF NOT EXISTS idx_flooded_area_evacuation ON acme_flooded_area USING GIST (evacuation_routes);

-- Create indexes for common lookups
CREATE INDEX IF NOT EXISTS idx_flooded_area_name ON acme_flooded_area(name);
CREATE INDEX IF NOT EXISTS idx_flooded_area_slug ON acme_flooded_area(slug);
CREATE INDEX IF NOT EXISTS idx_flooded_area_severity ON acme_flooded_area(flood_severity);
CREATE INDEX IF NOT EXISTS idx_flooded_area_frequency ON acme_flooded_area(flood_frequency);
CREATE INDEX IF NOT EXISTS idx_flooded_area_cause ON acme_flooded_area(primary_flood_cause);
