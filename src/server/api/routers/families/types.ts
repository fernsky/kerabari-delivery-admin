import { family } from "@/server/db/schema";
import { productAnimalProduct } from "@/server/db/schema/family/animal-products";
import { productAnimal } from "@/server/db/schema/family/animals";
import { productCrop } from "@/server/db/schema/family/crops";
import productAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { productIndividual } from "@/server/db/schema/family/individual";

export type FamilyResult = typeof family.$inferSelect & {
  agriculturalLands: (typeof productAgriculturalLand.$inferSelect)[];
  animals: (typeof productAnimal.$inferSelect)[];
  animalProducts: (typeof productAnimalProduct.$inferSelect)[];
  crops: (typeof productCrop.$inferSelect)[];
  individuals: (typeof productIndividual.$inferSelect)[];
};
