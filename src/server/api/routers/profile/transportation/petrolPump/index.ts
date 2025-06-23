import { createTRPCRouter } from "@/server/api/trpc";
import { getAllPetrolPumps } from "./procedures/get-petrol-pumps";
import { getPetrolPumpById } from "./procedures/get-petrol-pump-by-id";
import { getPetrolPumpBySlug } from "./procedures/get-petrol-pump-by-slug";
import { createPetrolPump } from "./procedures/create-petrol-pump";
import { updatePetrolPump } from "./procedures/update-petrol-pump";
import { deletePetrolPump } from "./procedures/delete-petrol-pump";

export const petrolPumpRouter = createTRPCRouter({
  getAll: getAllPetrolPumps,
  getById: getPetrolPumpById,
  getBySlug: getPetrolPumpBySlug,
  create: createPetrolPump,
  update: updatePetrolPump,
  delete: deletePetrolPump,
});
