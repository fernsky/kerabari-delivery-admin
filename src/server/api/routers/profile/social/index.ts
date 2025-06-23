import { createTRPCRouter } from "@/server/api/trpc";
import { wardAgeGenderWiseFirstMarriageAgeRouter } from "./ward-age-gender-wise-first-marriage-age.procedure";
import { wardWiseDisabledPopulationRouter } from "./ward-wise-disabled-population.procedure";
import { wardWiseOldAgePopulationAndSingleWomenRouter } from "./ward-wise-old-age-population-and-single-women.procedure";

export const socialRouter = createTRPCRouter({

  wardAgeGenderWiseFirstMarriageAge: wardAgeGenderWiseFirstMarriageAgeRouter,
  wardWiseDisabledPopulation: wardWiseDisabledPopulationRouter,
  wardWiseOldAgePopulationAndSingleWomen:
    wardWiseOldAgePopulationAndSingleWomenRouter,
  // Add other social profile-related routers here in the future
});
