import { createTRPCRouter } from "@/server/api/trpc";
import { getAllRoads } from "./procedures/get-roads";
import { getRoadById } from "./procedures/get-road-by-id";
import { getRoadBySlug } from "./procedures/get-road-by-slug";
import { createRoad } from "./procedures/create-road";
import { updateRoad } from "./procedures/update-road";
import { deleteRoad } from "./procedures/delete-road";
import { getRoadSummary } from "./procedures/get-summary";

export const roadRouter = createTRPCRouter({
  getAll: getAllRoads,
  getById: getRoadById,
  getBySlug: getRoadBySlug,
  create: createRoad,
  update: updateRoad,
  delete: deleteRoad,
  summary: getRoadSummary, // Add the new summary procedure
});
