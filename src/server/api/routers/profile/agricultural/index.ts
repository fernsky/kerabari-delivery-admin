import { createTRPCRouter } from "@/server/api/trpc";
import { grazingAreaRouter } from "./grazingAreas/grazingArea.router";
import { grasslandRouter } from "./grasslands/grassland.router";
import { agricZoneRouter } from "./agricZones/agricZone.router";
import { processingCenterRouter } from "./processingCenters/processingCenter.router";
import { farmRouter } from "./farms/farm.router";
import { fishFarmRouter } from "./fishFarms/fish-farm.router";

export const agriculturalRouter = createTRPCRouter({
  grazingAreas: grazingAreaRouter,
  grasslands: grasslandRouter,
  agricZones: agricZoneRouter,
  processingCenters: processingCenterRouter,
  farms: farmRouter,
  fishFarms: fishFarmRouter,
});
