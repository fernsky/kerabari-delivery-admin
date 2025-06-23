import { createTRPCRouter } from "@/server/api/trpc";
import { getIndividualsProcedure, getIndividualByIdProcedure, getIndividualsByHouseholdIdProcedure } from "./procedures/query";

export const individualRouter = createTRPCRouter({
  getIndividuals: getIndividualsProcedure,
  getIndividualById: getIndividualByIdProcedure,
  getIndividualsByHouseholdId: getIndividualsByHouseholdIdProcedure,
});