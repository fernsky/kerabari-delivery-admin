import { createTRPCRouter } from "@/server/api/trpc";
import { roadRouter } from "./roads/road.router";
import { parkingFacilityRouter } from "./parkingFacilities/parkingFacility.router";
import { publicTransportRouter } from "./publicTransport/publicTransport.router";
import { petrolPumpRouter } from "./petrolPump";

export const transportationRouter = createTRPCRouter({
  roads: roadRouter,
  parkingFacilities: parkingFacilityRouter,
  publicTransports: publicTransportRouter,
  petrolPumps: petrolPumpRouter,
  // Other transportation-related routers can be added here in the future
});

// Export for backward compatibility
export { roadRouter };
