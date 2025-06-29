import { createTRPCRouter } from "@/server/api/trpc";
import { demographicsRouter } from "./demographics";
import { localAreasRouter } from "./local-areas";
import { economicsRouter } from "./economics";
import { transportationRouter } from "./transportation";
import { agriculturalRouter } from "./agricultural";
import { educationRouter } from "./education";
import { physicalRouter } from "./physical";
import { healthRouter } from "./health";
import { fertilityRouter } from "./fertility";
import { socialRouter } from "./social";
import { waterAndSanitationRouter } from "./water-and-sanitation";
import { climateRouter } from "./climate";

export const profileRouter = createTRPCRouter({
  demographics: demographicsRouter,
  economics: economicsRouter,
  localAreas: localAreasRouter,
  transportation: transportationRouter,
  agriculture: agriculturalRouter,
  education: educationRouter,
  physical: physicalRouter,
  health: healthRouter,
  fertility: fertilityRouter,
  social: socialRouter,
  waterAndSanitation: waterAndSanitationRouter,
  climate: climateRouter,
  // Add other profile-related routers here in the future
});
