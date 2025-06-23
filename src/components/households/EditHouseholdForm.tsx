"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Household, HouseholdStep } from "@/types/household";
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
import { useHouseholdStore } from "@/store/household-store";

interface HouseholdFormProps {
  currentStep: HouseholdStep;
  initialData: any;
}

export function HouseholdForm({
  currentStep,
  initialData,
}: HouseholdFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // Use refs to avoid causing re-renders
  const initialDataProcessed = useRef(false);
  
  // Use the Zustand store
  const { currentHousehold, setCurrentHousehold, updateCurrentHousehold } = useHouseholdStore();

  // Create a mutation for updating household data
  const updateHouseholdMutation = api.households.updateHousehold.useMutation({
    onSuccess: () => {
      toast.success("घरधुरी विवरण सफलतापूर्वक अपडेट गरियो!");
      router.push("/dashboard/households");
    },
    onError: (error) => {
      toast.error(`घरधुरी अपडेट गर्न असफल: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Memoize the mapping function to prevent unnecessary re-renders
  const mapInitialData = useCallback((data: any) => {
    if (!data) {
      return {};
    }

    const household = Array.isArray(data) ? data[0] : data;
    
    // Map the data to form fields with camelCase keys
    const mapped: Record<string, any> = {
      id: household.id,
      profileId: household.tenant_id || household.profileId || "",
      province: household.province || "",
      district: household.district || "",
      localLevel: household.local_level || household.localLevel || "",
      wardNo: household.ward_no || household.wardNo || 0,
      houseSymbolNo: household.house_symbol_no || household.houseSymbolNo || "",
      familySymbolNo:
        household.family_symbol_no || household.familySymbolNo || "",
      dateOfInterview:
        household.date_of_interview || household.dateOfInterview || null,
      householdLocation:
        household.household_location || household.householdLocation || null,
      locality: household.locality || "",
      developmentOrganization:
        household.development_organization ||
        household.developmentOrganization ||
        "",

      // Family information
      familyHeadName:
        household.family_head_name || household.familyHeadName || "",
      familyHeadPhoneNo:
        household.family_head_phone_no || household.familyHeadPhoneNo || "",
      totalMembers: household.total_members || household.totalMembers || 0,
      areMembersElsewhere:
        household.are_members_elsewhere || household.areMembersElsewhere || "",
      totalElsewhereMembers:
        household.total_elsewhere_members ||
        household.totalElsewhereMembers ||
        0,

      // House details
      houseOwnership:
        household.house_ownership || household.houseOwnership || "",
      houseOwnershipOther:
        household.house_ownership_other || household.houseOwnershipOther || "",
      landOwnership: household.land_ownership || household.landOwnership || "",
      landOwnershipOther:
        household.land_ownership_other || household.landOwnershipOther || "",
      houseBase: household.house_base || household.houseBase || "",
      houseBaseOther:
        household.house_base_other || household.houseBaseOther || "",
      houseOuterWall:
        household.house_outer_wall || household.houseOuterWall || "",
      houseOuterWallOther:
        household.house_outer_wall_other || household.houseOuterWallOther || "",
      houseRoof: household.house_roof || household.houseRoof || "",
      houseRoofOther:
        household.house_roof_other || household.houseRoofOther || "",
      houseFloor: household.house_floor || household.houseFloor || "",
      houseFloorOther:
        household.house_floor_other || household.houseFloorOther || "",
      houseFloors: household.house_floors || household.houseFloors || 0,
      roomCount: household.room_count || household.roomCount || 0,

      // Safety information
      isHousePassed: household.is_house_passed || household.isHousePassed || "",
      isMapArchived: household.is_map_archived || household.isMapArchived || "",
      isEarthquakeResistant:
        household.is_earthquake_resistant ||
        household.isEarthquakeResistant ||
        "",
      disasterRiskStatus:
        household.disaster_risk_status || household.disasterRiskStatus || "",
      naturalDisasters:
        household.natural_disasters || household.naturalDisasters || [],
      isSafe: household.is_safe || household.isSafe || "",

      // Water, sanitation and energy
      waterSource: household.water_source || household.waterSource || "",
      waterPurificationMethods:
        household.water_purification_methods ||
        household.waterPurificationMethods ||
        [],
      toiletType: household.toilet_type || household.toiletType || "",
      solidWasteManagement:
        household.solid_waste_management ||
        household.solidWasteManagement ||
        "",
      primaryCookingFuel:
        household.primary_cooking_fuel || household.primaryCookingFuel || "",
      primaryEnergySource:
        household.primary_energy_source || household.primaryEnergySource || "",

      // Accessibility
      roadStatus: household.road_status || household.roadStatus || "",
      timeToPublicBus:
        household.time_to_public_bus || household.timeToPublicBus || "",
      timeToMarket: household.time_to_market || household.timeToMarket || "",
      distanceToActiveRoad:
        household.distance_to_active_road ||
        household.distanceToActiveRoad ||
        "",
      facilities: household.facilities || [],

      // Economic details
      hasPropertiesElsewhere:
        household.has_properties_elsewhere ||
        household.hasPropertiesElsewhere ||
        "",
      hasFemaleNamedProperties:
        household.has_female_named_properties ||
        household.hasFemaleNamedProperties ||
        "",
      organizationsLoanedFrom:
        household.organizations_loaned_from ||
        household.organizationsLoanedFrom ||
        [],
      loanUses: household.loan_uses || household.loanUses || [],
      timeToBank: household.time_to_bank || household.timeToBank || "",
      financialAccounts:
        household.financial_accounts || household.financialAccounts || [],
      haveRemittance:
        household.have_remittance || household.haveRemittance || "",
      remittanceExpenses:
        household.remittance_expenses || household.remittanceExpenses || [],

      // Health
      haveHealthInsurance:
        household.have_health_insurance || household.haveHealthInsurance || "",
      consultingHealthOrganization:
        household.consulting_health_organization ||
        household.consultingHealthOrganization ||
        "",
      timeToHealthOrganization:
        household.time_to_health_organization ||
        household.timeToHealthOrganization ||
        "",

      // Municipal & Suggestions
      municipalSuggestions:
        household.municipal_suggestions || household.municipalSuggestions || [],

      // Agriculture & Livestock
      haveAgriculturalLand:
        household.have_agricultural_land ||
        household.haveAgriculturalLand ||
        "",
      agriculturalLands:
        household.agricultural_lands || household.agriculturalLands || [],
      areInvolvedInAgriculture:
        household.are_involved_in_agriculture ||
        household.areInvolvedInAgriculture ||
        "",
      foodCrops: household.food_crops || household.foodCrops || [],
      pulses: household.pulses || [],
      oilSeeds: household.oil_seeds || household.oilSeeds || [],
      vegetables: household.vegetables || [],
      fruits: household.fruits || [],
      spices: household.spices || [],
      cashCrops: household.cash_crops || household.cashCrops || [],
      areInvolvedInHusbandry:
        household.are_involved_in_husbandry ||
        household.areInvolvedInHusbandry ||
        "",
      animals: household.animals || [],
      animalProducts:
        household.animal_products || household.animalProducts || [],

      // Aquaculture & Apiary
      haveAquaculture:
        household.have_aquaculture || household.haveAquaculture || "",
      pondNumber: household.pond_number || household.pondNumber || 0,
      pondArea: household.pond_area || household.pondArea || 0,
      fishProduction:
        household.fish_production || household.fishProduction || 0,
      haveApiary: household.have_apiary || household.haveApiary || "",
      hiveNumber: household.hive_number || household.hiveNumber || 0,
      honeyProduction:
        household.honey_production || household.honeyProduction || 0,
      honeySales: household.honey_sales || household.honeySales || 0,
      honeyRevenue: household.honey_revenue || household.honeyRevenue || 0,

      // Agricultural operations
      hasAgriculturalInsurance:
        household.has_agricultural_insurance ||
        household.hasAgriculturalInsurance ||
        "",
      monthsInvolvedInAgriculture:
        household.months_involved_in_agriculture ||
        household.monthsInvolvedInAgriculture ||
        "",
      agriculturalMachines:
        household.agricultural_machines || household.agriculturalMachines || [],

      // Migration details
      birthPlace: household.birth_place || household.birthPlace || "",
      birthProvince: household.birth_province || household.birthProvince || "",
      birthDistrict: household.birth_district || household.birthDistrict || "",
      birthCountry: household.birth_country || household.birthCountry || "",
      priorLocation: household.prior_location || household.priorLocation || "",
      priorProvince: household.prior_province || household.priorProvince || "",
      priorDistrict: household.prior_district || household.priorDistrict || "",
      priorCountry: household.prior_country || household.priorCountry || "",
      residenceReason:
        household.residence_reason || household.residenceReason || "",

      // Business
      hasBusiness: household.has_business || household.hasBusiness || "",

      // System fields
      deviceId: household.device_id || household.deviceId || "",
    };

    console.log("Mapped data:", mapped);
    
    // Store the mapped data in the Zustand store
    setCurrentHousehold(mapped);
    
    return mapped;
  }, [setCurrentHousehold]);

  // Initialize form with initial values
  const methods = useForm({
    defaultValues: currentHousehold || {},
    mode: "onChange",
  });

  // Process initial data only once
  useEffect(() => {
    if (initialData && !initialDataProcessed.current) {
      const mappedData = mapInitialData(initialData);
      
      // Set the data in the store
      setCurrentHousehold(mappedData);
      
      // Reset the form with the data
      methods.reset(mappedData);
      
      // Mark as processed
      initialDataProcessed.current = true;
    }
  }, [initialData, mapInitialData, setCurrentHousehold, methods]);

  // Update form when store changes, but only if not during initial load
  useEffect(() => {
    if (currentHousehold && initialDataProcessed.current) {
      methods.reset(currentHousehold);
    }
  }, [currentHousehold, methods]);

  // Setup a debounced watcher for form changes
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Watch function that updates store
    const subscription = methods.watch((value) => {
      // Clear previous timeout
      if (timeout) {
        clearTimeout(timeout);
      }
      
      // Set a new timeout to debounce updates
      timeout = setTimeout(() => {
        if (value && Object.keys(value).length > 0) {
          updateCurrentHousehold(value as Partial<Household>);
        }
      }, 500); // 500ms debounce
    });
    
    return () => {
      subscription.unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [methods, updateCurrentHousehold]);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      // Prepare data for update - map to the API expected format
      const updateData = {
        id: initialData.id,

        // Basic information fields
        profileId: data.tenant_id || data.profileId,
        province: data.province,
        district: data.district,
        localLevel: data.local_level || data.localLevel,
        wardNo: data.ward_no || data.wardNo,
        houseSymbolNo: data.house_symbol_no || data.houseSymbolNo,
        familySymbolNo: data.family_symbol_no || data.familySymbolNo,
        dateOfInterview: data.date_of_interview || data.dateOfInterview,
        householdLocation: data.household_location || data.householdLocation,
        locality: data.locality,
        developmentOrganization:
          data.development_organization || data.developmentOrganization,

        // Family information
        familyHeadName: data.family_head_name || data.familyHeadName,
        familyHeadPhoneNo: data.family_head_phone_no || data.familyHeadPhoneNo,
        totalMembers: data.total_members || data.totalMembers,
        areMembersElsewhere:
          data.are_members_elsewhere || data.areMembersElsewhere,
        totalElsewhereMembers:
          data.total_elsewhere_members || data.totalElsewhereMembers,

        // House details
        houseOwnership: data.house_ownership || data.houseOwnership,
        houseOwnershipOther:
          data.house_ownership_other || data.houseOwnershipOther,
        landOwnership: data.land_ownership || data.landOwnership,
        landOwnershipOther:
          data.land_ownership_other || data.landOwnershipOther,
        houseBase: data.house_base || data.houseBase,
        houseBaseOther: data.house_base_other || data.houseBaseOther,
        houseOuterWall: data.house_outer_wall || data.houseOuterWall,
        houseOuterWallOther:
          data.house_outer_wall_other || data.houseOuterWallOther,
        houseRoof: data.house_roof || data.houseRoof,
        houseRoofOther: data.house_roof_other || data.houseRoofOther,
        houseFloor: data.house_floor || data.houseFloor,
        houseFloorOther: data.house_floor_other || data.houseFloorOther,
        houseFloors: data.house_floors || data.houseFloors,
        roomCount: data.room_count || data.roomCount,

        // Safety information
        isHousePassed: data.is_house_passed || data.isHousePassed,
        isMapArchived: data.is_map_archived || data.isMapArchived,
        isEarthquakeResistant:
          data.is_earthquake_resistant || data.isEarthquakeResistant,
        disasterRiskStatus:
          data.disaster_risk_status || data.disasterRiskStatus,
        naturalDisasters: data.natural_disasters || data.naturalDisasters,
        isSafe: data.is_safe || data.isSafe,

        // Water, sanitation and energy
        waterSource: data.water_source || data.waterSource,
        waterPurificationMethods:
          data.water_purification_methods || data.waterPurificationMethods,
        toiletType: data.toilet_type || data.toiletType,
        solidWasteManagement:
          data.solid_waste_management || data.solidWasteManagement,
        primaryCookingFuel:
          data.primary_cooking_fuel || data.primaryCookingFuel,
        primaryEnergySource:
          data.primary_energy_source || data.primaryEnergySource,

        // Accessibility
        roadStatus: data.road_status || data.roadStatus,
        timeToPublicBus: data.time_to_public_bus || data.timeToPublicBus,
        timeToMarket: data.time_to_market || data.timeToMarket,
        distanceToActiveRoad:
          data.distance_to_active_road || data.distanceToActiveRoad,
        facilities: data.facilities,

        // Economic details
        hasPropertiesElsewhere:
          data.has_properties_elsewhere || data.hasPropertiesElsewhere,
        hasFemaleNamedProperties:
          data.has_female_named_properties || data.hasFemaleNamedProperties,
        organizationsLoanedFrom:
          data.organizations_loaned_from || data.organizationsLoanedFrom,
        loanUses: data.loan_uses || data.loanUses,
        timeToBank: data.time_to_bank || data.timeToBank,
        financialAccounts: data.financial_accounts || data.financialAccounts,
        haveRemittance: data.have_remittance || data.haveRemittance,
        remittanceExpenses: data.remittance_expenses || data.remittanceExpenses,

        // Health
        haveHealthInsurance:
          data.have_health_insurance || data.haveHealthInsurance,
        consultingHealthOrganization:
          data.consulting_health_organization ||
          data.consultingHealthOrganization,
        timeToHealthOrganization:
          data.time_to_health_organization || data.timeToHealthOrganization,

        // Municipal & Suggestions
        municipalSuggestions:
          data.municipal_suggestions || data.municipalSuggestions,

        // Agriculture & Livestock
        haveAgriculturalLand:
          data.have_agricultural_land || data.haveAgriculturalLand,
        agriculturalLands: data.agricultural_lands || data.agriculturalLands,
        areInvolvedInAgriculture:
          data.are_involved_in_agriculture || data.areInvolvedInAgriculture,
        foodCrops: data.food_crops || data.foodCrops,
        pulses: data.pulses || data.pulses,
        oilSeeds: data.oil_seeds || data.oilSeeds,
        vegetables: data.vegetables || data.vegetables,
        fruits: data.fruits || data.fruits,
        spices: data.spices || data.spices,
        cashCrops: data.cash_crops || data.cashCrops,
        areInvolvedInHusbandry:
          data.are_involved_in_husbandry || data.areInvolvedInHusbandry,
        animals: data.animals,
        animalProducts: data.animal_products || data.animalProducts,

        // Aquaculture & Apiary
        haveAquaculture: data.have_aquaculture || data.haveAquaculture,
        pondNumber: data.pond_number || data.pondNumber,
        pondArea: data.pond_area || data.pondArea,
        fishProduction: data.fish_production || data.fishProduction,
        haveApiary: data.have_apiary || data.haveApiary,
        hiveNumber: data.hive_number || data.hiveNumber,
        honeyProduction: data.honey_production || data.honeyProduction,
        honeySales: data.honey_sales || data.honeySales,
        honeyRevenue: data.honey_revenue || data.honeyRevenue,

        // Agricultural operations
        hasAgriculturalInsurance:
          data.has_agricultural_insurance || data.hasAgriculturalInsurance,
        monthsInvolvedInAgriculture:
          data.months_involved_in_agriculture ||
          data.monthsInvolvedInAgriculture,
        agriculturalMachines:
          data.agricultural_machines || data.agriculturalMachines,

        // Migration details
        birthPlace: data.birth_place || data.birthPlace,
        birthProvince: data.birth_province || data.birthProvince,
        birthDistrict: data.birth_district || data.birthDistrict,
        birthCountry: data.birth_country || data.birthCountry,
        priorLocation: data.prior_location || data.priorLocation,
        priorProvince: data.prior_province || data.priorProvince,
        priorDistrict: data.prior_district || data.priorDistrict,
        priorCountry: data.prior_country || data.priorCountry,
        residenceReason: data.residence_reason || data.residenceReason,

        // Business
        hasBusiness: data.has_business || data.hasBusiness,

        // System fields
        deviceId: data.device_id || data.deviceId,
      };

      await updateHouseholdMutation.mutateAsync(updateData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("घरधुरी अपडेट गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।");
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
            isEditing={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {/* Debug section with safer implementation */}
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <details>
            <summary className="text-sm text-gray-500 cursor-pointer">
              Debug Form Data
            </summary>
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  console.log("Form values:", methods.getValues());
                  console.log("Store values:", currentHousehold);
                }}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
              >
                Log data
              </button>
            </div>
          </details>
        </div>
        
        {renderStepContent()}
      </form>
    </FormProvider>
  );
}
