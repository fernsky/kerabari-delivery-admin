import { createTRPCRouter } from "@/server/api/trpc";
import { getAllFishFarms } from "./procedures/get-fish-farms";
import { getFishFarmById } from "./procedures/get-fish-farm-by-id";
import { getFishFarmBySlug } from "./procedures/get-fish-farm-by-slug";
import { createFishFarm } from "./procedures/create-fish-farm";
import { updateFishFarm } from "./procedures/update-fish-farm";
import { deleteFishFarm } from "./procedures/delete-fish-farm";

export const fishFarmRouter = createTRPCRouter({
  getAll: getAllFishFarms,
  getById: getFishFarmById,
  getBySlug: getFishFarmBySlug,
  create: createFishFarm,
  update: updateFishFarm,
  delete: deleteFishFarm,
});
