"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Household, HouseholdStep, householdSchema } from "@/types/household";
import BasicInformationStep from "./form-steps/BasicInformationStep";
import FamilyDetailsStep from "./form-steps/FamilyDetailsStep";
import HouseDetailsStep from "./form-steps/HouseDetailsStep";
import WaterSanitationStep from "./form-steps/WaterSanitationStep";
import EconomicDetailsStep from "./form-steps/EconomicDetailsStep";
import AgriculturalDetailsStep from "./form-steps/AgriculturalDetailsStep";
import MigrationDetailsStep from "./form-steps/MigrationDetailsStep";
import ReviewStep from "./form-steps/ReviewStep";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface HouseholdFormProps {
  currentStep: HouseholdStep;
}

export function HouseholdForm({ currentStep }: HouseholdFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const createHouseholdMutation = api.households.createHousehold.useMutation({
    onSuccess: () => {
      toast.success("घरधुरी सफलतापूर्वक दर्ता गरियो!");
      router.push("/dashboard/households");
    },
    onError: (error) => {
      toast.error(`घरधुरी दर्ता गर्न असफल: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const methods = useForm<Household>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      tenant_id: "khajura",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: Household) => {
    try {
      setIsSubmitting(true);

      // Transform form data to API format
      const formattedData = {
        profileId: data.tenant_id,
        province: data.province || "",
        district: data.district || "",
        localLevel: data.local_level || "",
        wardNo: data.ward_no || 0,
        houseSymbolNo: data.house_symbol_no || "",
        familySymbolNo: data.family_symbol_no || "",
        dateOfInterview: data.date_of_interview,
        householdLocation: data.household_location || [],
        locality: data.locality || "",
        developmentOrganization: data.development_organization || "",

        // Family information
        familyHeadName: data.family_head_name,
        familyHeadPhoneNo: data.family_head_phone_no || "",
        totalMembers: data.total_members || 0,
        areMembersElsewhere: data.are_members_elsewhere || "",
        totalElsewhereMembers: data.total_elsewhere_members || 0,

        // House details
        houseOwnership: data.house_ownership || "",
        houseOwnershipOther: data.house_ownership_other || "",
        landOwnership: data.land_ownership || "",
        houseBase: data.house_base || "",
        houseBaseOther: data.house_base_other || "",
        houseOuterWall: data.house_outer_wall || "",
        houseOuterWallOther: data.house_outer_wall_other || "",
        houseRoof: data.house_roof || "",
        houseRoofOther: data.house_roof_other || "",
        houseFloor: data.house_floor || "",
        houseFloorOther: data.house_floor_other || "",
        houseFloors: data.house_floors || 0,
        roomCount: data.room_count || 0,

        // Safety information
        isHousePassed: data.is_house_passed || "",
        isEarthquakeResistant: data.is_earthquake_resistant || "",
        disasterRiskStatus: data.disaster_risk_status || "",
        naturalDisasters: data.natural_disasters || [],
        isSafe: data.is_safe || "",

        // Water, sanitation and energy
        waterSource: data.water_source || "",
        waterPurificationMethods: data.water_purification_methods || [],
        toiletType: data.toilet_type || "",
        solidWasteManagement: data.solid_waste_management || "",
        primaryCookingFuel: data.primary_cooking_fuel || "",
        primaryEnergySource: data.primary_energy_source || "",

        // Accessibility
        roadStatus: data.road_status || "",
        timeToPublicBus: data.time_to_public_bus || "",
        timeToMarket: data.time_to_market || "",
        distanceToActiveRoad: data.distance_to_active_road || "",
        facilities: data.facilities || [],

        // Economic details
        hasPropertiesElsewhere: data.has_properties_elsewhere || "",
        hasFemaleNamedProperties: data.has_female_named_properties || "",
        organizationsLoanedFrom: data.organizations_loaned_from || [],
        loanUses: data.loan_uses || [],
        timeToBank: data.time_to_bank || "",
        financialAccounts: data.financial_accounts || [],
        haveRemittance: data.have_remittance || "",
        remittanceExpenses: data.remittance_expenses || [],

        // Health
        haveHealthInsurance: data.have_health_insurance || "",
        consultingHealthOrganization: data.consulting_health_organization || "",
        timeToHealthOrganization: data.time_to_health_organization || "",

        // Municipal & Suggestions
        municipalSuggestions: data.municipal_suggestions || [],

        // Agriculture & Livestock
        haveAgriculturalLand: data.have_agricultural_land || "",
        agriculturalLands: data.agricultural_lands || [],
        areInvolvedInAgriculture: data.are_involved_in_agriculture || "",
        foodCrops: data.food_crops || [],
        pulses: data.pulses || [],
        oilSeeds: data.oil_seeds || [],
        vegetables: data.vegetables || [],
        fruits: data.fruits || [],
        spices: data.spices || [],
        cashCrops: data.cash_crops || [],
        areInvolvedInHusbandry: data.are_involved_in_husbandry || "",
        animals: data.animals || [],
        animalProducts: data.animal_products || [],

        // Aquaculture & Apiary
        haveAquaculture: data.have_aquaculture || "",
        pondNumber: data.pond_number || 0,
        pondArea: data.pond_area || 0,
        fishProduction: data.fish_production || 0,
        haveApiary: data.have_apiary || "",
        hiveNumber: data.hive_number || 0,
        honeyProduction: data.honey_production || 0,
        honeySales: data.honey_sales || 0,
        honeyRevenue: data.honey_revenue || 0,

        // Agricultural operations
        hasAgriculturalInsurance: data.has_agricultural_insurance || "",
        monthsInvolvedInAgriculture: data.months_involved_in_agriculture || "",
        agriculturalMachines: data.agricultural_machines || [],

        // Migration details
        birthPlace: data.birth_place || "",
        birthProvince: data.birth_province || "",
        birthDistrict: data.birth_district || "",
        birthCountry: data.birth_country || "",
        priorLocation: data.prior_location || "",
        priorProvince: data.prior_province || "",
        priorDistrict: data.prior_district || "",
        priorCountry: data.prior_country || "",
        residenceReason: data.residence_reason || "",

        // Business
        hasBusiness: data.has_business || "",

        // System fields
        deviceId: data.device_id || "",
      };
      //@ts-ignore
      await createHouseholdMutation.mutateAsync(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("घरधुरी दर्ता गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।");
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "आधारभूत जानकारी":
        return <BasicInformationStep />;
      case "परिवार विवरण":
        return <FamilyDetailsStep />;
      case "घरको विवरण":
        return <HouseDetailsStep />;
      case "पानी तथा सरसफाई":
        return <WaterSanitationStep />;
      case "आर्थिक विवरण":
        return <EconomicDetailsStep />;
      case "कृषि विवरण":
        return <AgriculturalDetailsStep />;
      case "बसाइँसराई विवरण":
        return <MigrationDetailsStep />;
      case "समीक्षा":
        return (
          <ReviewStep
            onSubmit={() => methods.handleSubmit(onSubmit)()}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {renderStepContent()}
      </form>
    </FormProvider>
  );
}
