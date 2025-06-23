import { NavigationState } from "./slices/navigation-types";
import { LayerVisibilityState } from "./slices/layer-visibility-types";
import { AspectState } from "./slices/map-features/aspect-types";
import { ElevationState } from "./slices/map-features/elevation-slice";
import { LandUseState } from "./slices/map-features/land-use-slice";
import { SlopeState } from "./slices/map-features/slope-slice";
import { MunicipalityBoundaryState } from "./slices/map-features/municipality-boundary-slice";
import { HealthState } from "./slices/map-features/health-slice";
import { MunicipalityOfficeState } from "./slices/map-features/municipality-office-slice";
import { PhysicalInfrastructureState } from "./slices/map-features/physical-infrastructure-slice";
import { SchoolState } from "./slices/map-features/school-slice";
import { WardBoundaryState } from "./slices/map-features/ward-boundary-slice";
import { WardOfficeState } from "./slices/map-features/ward-office-slice";
import { SpringState } from "./slices/map-features/spring-slice";
import { RoadState } from "./slices/map-features/road-slice";
import { HighwayState } from "./slices/map-features/highway-slice";
import { VillageState } from "./slices/map-features/village-slice";
import { TouristPlaceState } from "./slices/map-features/tourist-place-slice";

export interface Route {
  id: string;
  path: string;
}

export type AppState = NavigationState &
  LayerVisibilityState &
  AspectState &
  ElevationState &
  LandUseState &
  MunicipalityBoundaryState &
  HealthState &
  MunicipalityOfficeState &
  PhysicalInfrastructureState &
  SchoolState &
  WardBoundaryState &
  WardOfficeState &
  SpringState &
  RoadState &
  HighwayState &
  VillageState &
  TouristPlaceState &
  SlopeState;

// Helper type for partial store initialization
export type PartialAppState = Partial<AppState>;

export interface LanguageParams {
  params: {
    lng: string;
  };
}
