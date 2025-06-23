import { createTRPCRouter } from "@/server/api/trpc";
import { getAllPublicTransports } from "./procedures/get-public-transports";
import { getPublicTransportById } from "./procedures/get-public-transport-by-id";
import { getPublicTransportBySlug } from "./procedures/get-public-transport-by-slug";
import { createPublicTransport } from "./procedures/create-public-transport";
import { updatePublicTransport } from "./procedures/update-public-transport";
import { deletePublicTransport } from "./procedures/delete-public-transport";

export const publicTransportRouter = createTRPCRouter({
  getAll: getAllPublicTransports,
  getById: getPublicTransportById,
  getBySlug: getPublicTransportBySlug,
  create: createPublicTransport,
  update: updatePublicTransport,
  delete: deletePublicTransport,
});
