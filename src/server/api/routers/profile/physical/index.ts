import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseTimeToPublicTransportRouter } from "./ward-wise-time-to-public-transport.procedure";
import { wardWiseTimeToMarketCenterRouter } from "./ward-wise-time-to-market-center.procedure";
import { wardWiseCookingFuelRouter } from "./ward-wise-cooking-fuel.procedure";
import { wardWiseElectricitySourceRouter } from "./ward-wise-electricity-source.procedure";
import { wardWiseFacilitiesRouter } from "./ward-wise-facilities.procedure";
import { wardWiseHouseMapPassedRouter } from "./ward-wise-house-map-passed.procedure";
import { wardWiseHouseholdFloorRouter } from "./ward-wise-household-floor.procedure";
import { wardWiseHouseholdRoofRouter } from "./ward-wise-household-roof.procedure";
import { wardWiseRoadStatusRouter } from "./ward-wise-road-status.procedure";
import { wardWiseTimeToActiveRoadRouter } from "./ward-wise-time-to-active-road.procedure";
import { wardWiseTimeToHealthOrganizationRouter } from "../health/ward-wise-time-to-health-organization.procedure";

export const physicalRouter = createTRPCRouter({
  wardWiseTimeToPublicTransport: wardWiseTimeToPublicTransportRouter,
  wardWiseTimeToMarketCenter: wardWiseTimeToMarketCenterRouter,
  wardWiseCookingFuel: wardWiseCookingFuelRouter,
  wardWiseElectricitySource: wardWiseElectricitySourceRouter,
  wardWiseFacilities: wardWiseFacilitiesRouter,
  wardWiseHouseMapPassed: wardWiseHouseMapPassedRouter,
  wardWiseHouseholdFloor: wardWiseHouseholdFloorRouter,
  wardWiseHouseholdRoof: wardWiseHouseholdRoofRouter,
  wardWiseRoadStatus: wardWiseRoadStatusRouter,
  wardWiseTimeToActiveRoad: wardWiseTimeToActiveRoadRouter,
  wardWiseTimeToHealthOrganization: wardWiseTimeToHealthOrganizationRouter,
  // Add other physical profile-related routers here in the future
});
