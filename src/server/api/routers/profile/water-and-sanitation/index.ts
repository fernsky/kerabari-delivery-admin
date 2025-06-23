import { createTRPCRouter } from "@/server/api/trpc";
import { wardWiseDrinkingWaterSourceRouter } from "./ward-wise-drinking-water-source.procedure";
import { wardWiseWaterPurificationRouter } from "./ward-wise-water-purification.procedure";
import { wardWiseToiletTypeRouter } from "./ward-wise-toilet-type.procedure";
import { wardWiseSolidWasteManagementRouter } from "./ward-wise-solid-waste-management.procedure";

export const waterAndSanitationRouter = createTRPCRouter({
  wardWiseDrinkingWaterSource: wardWiseDrinkingWaterSourceRouter,
  wardWiseWaterPurification: wardWiseWaterPurificationRouter,
  wardWiseToiletType: wardWiseToiletTypeRouter,
  wardWiseSolidWasteManagement: wardWiseSolidWasteManagementRouter,
  
});
