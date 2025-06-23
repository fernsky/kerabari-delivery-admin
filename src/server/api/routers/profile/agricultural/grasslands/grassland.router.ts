import { createTRPCRouter } from "@/server/api/trpc";
import { getAllGrasslands } from "./procedures/get-grasslands";
import { getGrasslandById } from "./procedures/get-grassland-by-id";
import { getGrasslandBySlug } from "./procedures/get-grassland-by-slug";
import { createGrassland } from "./procedures/create-grassland";
import { updateGrassland } from "./procedures/update-grassland";
import { deleteGrassland } from "./procedures/delete-grassland";

export const grasslandRouter = createTRPCRouter({
  getAll: getAllGrasslands,
  getById: getGrasslandById,
  getBySlug: getGrasslandBySlug,
  create: createGrassland,
  update: updateGrassland,
  delete: deleteGrassland,
});
