import { createTRPCRouter } from "@/server/api/trpc";
import { consolidatedClimateRouter } from "./consolidated-climate.procedure";

export const climateRouter = createTRPCRouter({
  consolidated: consolidatedClimateRouter,
});
