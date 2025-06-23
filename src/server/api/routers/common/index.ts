import { createTRPCRouter } from "@/server/api/trpc";
import { mediaRouter } from "./procedures/media.router";

export const commonRouter = createTRPCRouter({
  media: mediaRouter,
});
