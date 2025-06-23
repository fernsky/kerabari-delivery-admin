import { adminRouter } from "./routers/admin/admin.procedure";
import { wardRouter } from "./routers/ward/ward.procedure";
import { userRouter } from "./routers/user/user.procedure";
import { createTRPCRouter } from "./trpc";
import { areaRouter } from "./routers/areas/areas.procedure";
import { superadminRouter } from "./routers/superadmin/superadmin.procedure";
import { enumeratorRouter } from "./routers/enumerators/enumerators.procedure";
import { buildingRouter } from "./routers/building/building.procedure";
import { areaManagementRouter } from "./routers/area-management/area-management.procedure";
import { familyRouter } from "./routers/families/families.procedure";
import { deathRouter } from "./routers/deaths/deaths.procedure";
import { analyticsRouter } from "./routers/analytics/analytics.procedure";
import { enumwiseRouter } from "./routers/enumwise/enumwise.procedure";
import { profileRouter } from "./routers/profile";
import { commonRouter } from "./routers/common";
import { grazingAreaRouter } from "./routers/profile/agricultural/grazingAreas/grazingArea.router";
import { householdRouter } from "./routers/households/households.procedure";
import {individualRouter} from "./routers/individuals/individuals.procedure";
import {businessRouter} from "./routers/businesses/business.procedure"

export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  area: areaRouter,
  ward: wardRouter,
  superadmin: superadminRouter,
  enumerator: enumeratorRouter,
  areaManagement: areaManagementRouter,
  building: buildingRouter,
  business: businessRouter,
  family: familyRouter,
  death: deathRouter,
  analytics: analyticsRouter,
  enumWise: enumwiseRouter,
  profile: profileRouter,
  common: commonRouter,
  grazingArea: grazingAreaRouter,
  households: householdRouter,
  individuals: individualRouter,
});

export type AppRouter = typeof appRouter;
