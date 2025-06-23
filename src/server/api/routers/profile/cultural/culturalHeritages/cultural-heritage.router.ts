import { createTRPCRouter } from "@/server/api/trpc";
import { getAllCulturalHeritages } from "./procedures/get-cultural-heritages";
import { getCulturalHeritageById } from "./procedures/get-cultural-heritage-by-id";
import { getCulturalHeritageBySlug } from "./procedures/get-cultural-heritage-by-slug";
import { createCulturalHeritage } from "./procedures/create-cultural-heritage";
import { updateCulturalHeritage } from "./procedures/update-cultural-heritage";
import { deleteCulturalHeritage } from "./procedures/delete-cultural-heritage";

export const culturalHeritageRouter = createTRPCRouter({
  getAll: getAllCulturalHeritages,
  getById: getCulturalHeritageById,
  getBySlug: getCulturalHeritageBySlug,
  create: createCulturalHeritage,
  update: updateCulturalHeritage,
  delete: deleteCulturalHeritage,
});
