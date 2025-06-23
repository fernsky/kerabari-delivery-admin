import { createTRPCRouter } from "@/server/api/trpc";
import { safeMotherhoodIndicatorsRouter } from "./safe-motherhood-indicators.procedure";
import { wardWiseDeliveryPlacesRouter } from "./ward-wise-delivery-place.procedure";
import { wardWiseChildBearersRouter } from "./ward-wise-child-bearers.procedure";
import { wardAgeWiseFirstChildBirthAgeRouter } from "./ward-age-wise-first-child-birth-age.procedure";

export const fertilityRouter = createTRPCRouter({
  safeMotherhoodIndicators: safeMotherhoodIndicatorsRouter,
  wardWiseDeliveryPlaces: wardWiseDeliveryPlacesRouter,
  wardWiseChildBearers: wardWiseChildBearersRouter,
  wardAgeWiseFirstChildBirthAge: wardAgeWiseFirstChildBirthAgeRouter,
  // Add other fertility-related routers here in the future
});
