import { createTRPCRouter } from "@/server/api/trpc";
import { wardAgeGenderWiseEconomicallyActivePopulationRouter } from "./ward-age-gender-wise-economically-active-population.procedure";
import { wardTimeWiseHouseholdChoresRouter } from "./ward-time-wise-household-chores.procedure";
import { wardWiseHouseholdIncomeSourceRouter } from "./ward-wise-household-income-source.procedure";
import { wardWiseRemittanceExpensesRouter } from "./ward-wise-remittance-expenses.procedure";
import { wardWiseAnnualIncomeSustenanceRouter } from "./ward-wise-annual-income-sustenance.procedure";
import { wardWiseHouseholdsOnLoanRouter } from "./ward-wise-households-on-loan.procedure";
import { wardWiseHouseholdsLoanUseRouter } from "./ward-wise-households-loan-use.procedure";
import { wardWiseTrainedPopulationRouter } from "./ward-wise-trained-population.procedure";
import { wardWiseMajorSkillsRouter } from "./ward-wise-major-skills.procedure";
import { exportedProductsRouter } from "./exported-products.procedure";
import { importedProductsRouter } from "./imported-products.procedure";
import { wardWiseHouseholdLandPossessionsRouter } from "./ward-wise-household-land-possessions.procedure";
import { wardWiseHouseOwnershipRouter } from "./ward-wise-house-ownership.procedure";
import { wardWiseHouseholdBaseRouter } from "./ward-wise-household-base.procedure";
import { wardWiseHouseholdOuterWallRouter } from "../economics/ward-wise-household-outer-wall.procedure";
import { wardWiseForeignEmploymentCountriesRouter } from "./ward-wise-foreign-employment-countries.procedure";
import { wardWiseRemittanceRouter } from "./ward-wise-remittance.procedure";
import { wardWiseLandOwnershipRouter } from "./ward-wise-land-ownership.procedure";
import { wardWiseIrrigatedAreaRouter } from "./ward-wise-irrigated-area.procedure";
import { municipalityWideIrrigationSourceRouter } from "./municipality-wide-irrigation-source.procedure";
import { municipalityWideFoodCropsRouter } from "./municipality-wide-food-crops.procedure";
import { municipalityWidePulsesRouter } from "./municipality-wide-pulses.procedure";
import { municipalityWideOilSeedsRouter } from "./municipality-wide-oil-seeds.procedure";
import { municipalityWideFruitsRouter } from "./municipality-wide-fruits.procedure";
import { municipalityWideSpicesRouter } from "./municipality-wide-spices.procedure";
import { municipalityWideVegetablesRouter } from "./municipality-wide-vegetables.procedure";
import { municipalityWideAnimalProductsRouter } from "./municipality-wide-animal-products.procedure";
import { municipalityWideCropDiseasesRouter } from "./municipality-wide-crop-diseases.procedure";
import { municipalityWideVegetablesAndFruitsDiseasesRouter } from "./municipality-wide-vegetables-and-fruits-diseases.procedure";
import { municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupRouter } from "./municipality-wide-commercial-agricultural-animal-husbandry-farmers-group.procedure";
import { municipalityWideAgricultureRelatedFarmersGroupRouter } from "./municipality-wide-agriculture-related-farmers-group.procedure";
import { wardWiseHouseholdsInAgricultureRouter } from "./ward-wise-households-in-agriculture.procedure";
import { wardWiseTimeToFinancialOrganizationRouter } from "./ward-wise-time-to-financial-organization.procedure";
import { wardWiseFinancialAccountsRouter } from "./ward-wise-financial-accounts.procedure";
import {cooperativesRouter} from "./cooperatives.procedure";

export const economicsRouter = createTRPCRouter({
  wardAgeGenderWiseEconomicallyActivePopulation:
    wardAgeGenderWiseEconomicallyActivePopulationRouter,
  wardTimeWiseHouseholdChores: wardTimeWiseHouseholdChoresRouter,
  wardWiseHouseholdIncomeSource: wardWiseHouseholdIncomeSourceRouter,
  wardWiseRemittanceExpenses: wardWiseRemittanceExpensesRouter,
  wardWiseAnnualIncomeSustenance: wardWiseAnnualIncomeSustenanceRouter,
  wardWiseHouseholdsOnLoan: wardWiseHouseholdsOnLoanRouter,
  wardWiseHouseholdsLoanUse: wardWiseHouseholdsLoanUseRouter,
  wardWiseTrainedPopulation: wardWiseTrainedPopulationRouter,
  wardWiseMajorSkills: wardWiseMajorSkillsRouter,
  importedProducts: importedProductsRouter,
  exportedProducts: exportedProductsRouter,
  wardWiseHouseholdLandPossessions: wardWiseHouseholdLandPossessionsRouter,
  wardWiseHouseOwnership: wardWiseHouseOwnershipRouter,
  wardWiseHouseholdBase: wardWiseHouseholdBaseRouter,
  wardWiseHouseholdOuterWall: wardWiseHouseholdOuterWallRouter,
  wardWiseForeignEmploymentCountries: wardWiseForeignEmploymentCountriesRouter,
  wardWiseRemittance: wardWiseRemittanceRouter,
  wardWiseLandOwnership: wardWiseLandOwnershipRouter,
  wardWiseIrrigatedArea: wardWiseIrrigatedAreaRouter,
  municipalityWideIrrigationSource: municipalityWideIrrigationSourceRouter,
  municipalityWideFoodCrops: municipalityWideFoodCropsRouter,
  municipalityWidePulses: municipalityWidePulsesRouter,
  municipalityWideOilSeeds: municipalityWideOilSeedsRouter,
  municipalityWideFruits: municipalityWideFruitsRouter,
  municipalityWideSpices: municipalityWideSpicesRouter,
  municipalityWideVegetables: municipalityWideVegetablesRouter,
  municipalityWideAnimalProducts: municipalityWideAnimalProductsRouter,
  municipalityWideCropDiseases: municipalityWideCropDiseasesRouter,
  municipalityWideVegetablesAndFruitsDiseases:
    municipalityWideVegetablesAndFruitsDiseasesRouter,
  municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroup:
    municipalityWideCommercialAgriculturalAnimalHusbandryFarmersGroupRouter,
  municipalityWideAgricultureRelatedFarmersGroup:
    municipalityWideAgricultureRelatedFarmersGroupRouter,
  wardWiseHouseholdsInAgriculture: wardWiseHouseholdsInAgricultureRouter,
  wardWiseTimeToFinancialOrganization: wardWiseTimeToFinancialOrganizationRouter,
  wardWiseFinancialAccounts: wardWiseFinancialAccountsRouter,
  cooperatives: cooperativesRouter,
});
