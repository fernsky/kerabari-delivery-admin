import { createTRPCRouter } from "@/server/api/trpc";
import { getAllFarms } from "./procedures/get-farms";
import { getFarmById } from "./procedures/get-farm-by-id";
import { getFarmBySlug } from "./procedures/get-farm-by-slug";
import { createFarm } from "./procedures/create-farm";
import { updateFarm } from "./procedures/update-farm";
import { deleteFarm } from "./procedures/delete-farm";

export const farmRouter = createTRPCRouter({
  getAll: getAllFarms,
  getById: getFarmById,
  getBySlug: getFarmBySlug,
  create: createFarm,
  update: updateFarm,
  delete: deleteFarm,
});
