import { createTRPCRouter } from "@/server/api/trpc";
import { locationRouter } from "./location.router";

export const localAreasRouter = createTRPCRouter({
  locations: locationRouter,
});

// Export for backward compatibility
export { locationRouter };
