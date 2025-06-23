import { createTRPCRouter } from "@/server/api/trpc";
import { buildingsRouter } from "./procedures/buildings";
import { familyRouter } from "./procedures/family";

export const enumwiseRouter = createTRPCRouter({
  buildings: buildingsRouter,
  family: familyRouter,
});
