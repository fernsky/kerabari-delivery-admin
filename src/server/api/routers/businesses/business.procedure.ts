import { createTRPCRouter } from "@/server/api/trpc";
// import { create } from "./procedures/create";
import { 
  getAll, 
  getById, 
} from "./procedures/query";


export const businessRouter = createTRPCRouter({
  getAll,
  getById,
});
