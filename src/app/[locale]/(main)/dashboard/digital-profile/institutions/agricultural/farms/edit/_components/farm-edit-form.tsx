"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FarmLocationMap } from "../../create/_components/farm-location-map";
import { BasicFarmDetails } from "../../create/_components/basic-farm-details";
import { CropsAndLivestockDetails } from "../../create/_components/crops-livestock-details";
import { FarmInfrastructureDetails } from "../../create/_components/farm-infrastructure-details";
import { FarmerDetails } from "../../create/_components/farmer-details";
import { ManagementPractices } from "../../create/_components/management-practices";
import { EconomicsDetails } from "../../create/_components/economics-details";
import { SEOFields } from "./seo-fields";

// Define the form schema based on the farm data structure
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "फार्मको नाम आवश्यक छ"),
  description: z.string().optional(),
  farmType: z.string(),
  farmingSystem: z.string().optional(),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Land details
  totalAreaInHectares: z.number().positive().optional(),
  cultivatedAreaInHectares: z.number().positive().optional(),
  landOwnership: z.string().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  irrigationSourceDetails: z.string().optional(),
  irrigatedAreaInHectares: z.number().positive().optional(),

  // Crops
  mainCrops: z.string().optional(),
  secondaryCrops: z.string().optional(),
  cropRotation: z.boolean().optional(),
  cropRotationDetails: z.string().optional(),
  intercropping: z.boolean().optional(),
  croppingSeasons: z.string().optional(),
  annualCropYieldMT: z.number().positive().optional(),
  recordedYearCrops: z.string().optional(),

  // Livestock
  hasLivestock: z.boolean().optional(),
  livestockTypes: z.string().optional(),
  cattleCount: z.number().int().nonnegative().optional(),
  buffaloCount: z.number().int().nonnegative().optional(),
  goatCount: z.number().int().nonnegative().optional(),
  sheepCount: z.number().int().nonnegative().optional(),
  pigCount: z.number().int().nonnegative().optional(),
  poultryCount: z.number().int().nonnegative().optional(),
  otherLivestockCount: z.number().int().nonnegative().optional(),
  otherLivestockDetails: z.string().optional(),
  livestockHousingType: z.string().optional(),
  livestockManagementDetails: z.string().optional(),
  annualMilkProductionLiters: z.number().nonnegative().optional(),
  annualEggProduction: z.number().nonnegative().optional(),
  annualMeatProductionKg: z.number().nonnegative().optional(),
  recordedYearLivestock: z.string().optional(),

  // Farmer details
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  farmerType: z.string().optional(),
  farmerEducation: z.string().optional(),
  farmerExperienceYears: z.number().int().nonnegative().optional(),
  hasCooperativeMembership: z.boolean().optional(),
  cooperativeName: z.string().optional(),

  // Labor and economics
  familyLaborCount: z.number().int().nonnegative().optional(),
  hiredLaborCount: z.number().int().nonnegative().optional(),
  annualInvestmentNPR: z.number().nonnegative().optional(),
  annualIncomeNPR: z.number().nonnegative().optional(),
  profitableOperation: z.boolean().optional(),
  marketAccessDetails: z.string().optional(),
  majorBuyerTypes: z.string().optional(),

  // Infrastructure
  hasFarmHouse: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  storageCapacityMT: z.number().nonnegative().optional(),
  hasFarmEquipment: z.boolean().optional(),
  equipmentDetails: z.string().optional(),
  hasElectricity: z.boolean().optional(),
  hasRoadAccess: z.boolean().optional(),
  roadAccessType: z.string().optional(),

  // Sustainability and practices
  usesChemicalFertilizer: z.boolean().optional(),
  usesPesticides: z.boolean().optional(),
  usesOrganicMethods: z.boolean().optional(),
  composting: z.boolean().optional(),
  soilConservationPractices: z.string().optional(),
  rainwaterHarvesting: z.boolean().optional(),
  manureManagement: z.string().optional(),
  hasCertifications: z.boolean().optional(),
  certificationDetails: z.string().optional(),

  // Technical support and training
  receivesExtensionServices: z.boolean().optional(),
  extensionServiceProvider: z.string().optional(),
  trainingReceived: z.string().optional(),
  technicalSupportNeeds: z.string().optional(),

  // Challenges and opportunities
  majorChallenges: z.string().optional(),
  disasterVulnerabilities: z.string().optional(),
  growthOpportunities: z.string().optional(),
  futureExpansionPlans: z.string().optional(),

  // Linked entities
  linkedGrazingAreas: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedProcessingCenters: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedAgricZones: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),
  linkedGrasslands: z
    .array(z.object({ id: z.string(), name: z.string().optional() }))
    .optional(),

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),

  // Geometry fields
  locationPoint: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  farmBoundary: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),

  // Status
  isVerified: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FarmEditFormProps {
  farm: any;
}

export function FarmEditForm({ farm }: FarmEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with farm data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: farm.id,
      name: farm.name || "",
      description: farm.description || "",
      farmType: farm.farmType || "MIXED_FARM",
      farmingSystem: farm.farmingSystem || undefined,

      // Location details
      wardNumber: farm.wardNumber || undefined,
      location: farm.location || "",
      address: farm.address || "",

      // Land details
      totalAreaInHectares: farm.totalAreaInHectares || undefined,
      cultivatedAreaInHectares: farm.cultivatedAreaInHectares || undefined,
      landOwnership: farm.landOwnership || undefined,
      soilType: farm.soilType || undefined,
      irrigationType: farm.irrigationType || undefined,
      irrigationSourceDetails: farm.irrigationSourceDetails || "",
      irrigatedAreaInHectares: farm.irrigatedAreaInHectares || undefined,

      // Crops
      mainCrops: farm.mainCrops || "",
      secondaryCrops: farm.secondaryCrops || "",
      cropRotation: farm.cropRotation || false,
      cropRotationDetails: farm.cropRotationDetails || "",
      intercropping: farm.intercropping || false,
      croppingSeasons: farm.croppingSeasons || "",
      annualCropYieldMT: farm.annualCropYieldMT || undefined,
      recordedYearCrops: farm.recordedYearCrops || undefined,

      // Livestock
      hasLivestock: farm.hasLivestock || false,
      livestockTypes: farm.livestockTypes || "",
      cattleCount: farm.cattleCount || undefined,
      buffaloCount: farm.buffaloCount || undefined,
      goatCount: farm.goatCount || undefined,
      sheepCount: farm.sheepCount || undefined,
      pigCount: farm.pigCount || undefined,
      poultryCount: farm.poultryCount || undefined,
      otherLivestockCount: farm.otherLivestockCount || undefined,
      otherLivestockDetails: farm.otherLivestockDetails || "",
      livestockHousingType: farm.livestockHousingType || undefined,
      livestockManagementDetails: farm.livestockManagementDetails || "",
      annualMilkProductionLiters: farm.annualMilkProductionLiters || undefined,
      annualEggProduction: farm.annualEggProduction || undefined,
      annualMeatProductionKg: farm.annualMeatProductionKg || undefined,
      recordedYearLivestock: farm.recordedYearLivestock || undefined,

      // Farmer details
      ownerName: farm.ownerName || "",
      ownerContact: farm.ownerContact || "",
      farmerType: farm.farmerType || "",
      farmerEducation: farm.farmerEducation || undefined,
      farmerExperienceYears: farm.farmerExperienceYears || undefined,
      hasCooperativeMembership: farm.hasCooperativeMembership || false,
      cooperativeName: farm.cooperativeName || "",

      // Labor and economics
      familyLaborCount: farm.familyLaborCount || undefined,
      hiredLaborCount: farm.hiredLaborCount || undefined,
      annualInvestmentNPR: farm.annualInvestmentNPR || undefined,
      annualIncomeNPR: farm.annualIncomeNPR || undefined,
      profitableOperation: farm.profitableOperation || false,
      marketAccessDetails: farm.marketAccessDetails || "",
      majorBuyerTypes: farm.majorBuyerTypes || "",

      // Infrastructure
      hasFarmHouse: farm.hasFarmHouse || false,
      hasStorage: farm.hasStorage || false,
      storageCapacityMT: farm.storageCapacityMT || undefined,
      hasFarmEquipment: farm.hasFarmEquipment || false,
      equipmentDetails: farm.equipmentDetails || "",
      hasElectricity: farm.hasElectricity || false,
      hasRoadAccess: farm.hasRoadAccess || false,
      roadAccessType: farm.roadAccessType || "",

      // Sustainability and practices
      usesChemicalFertilizer: farm.usesChemicalFertilizer || false,
      usesPesticides: farm.usesPesticides || false,
      usesOrganicMethods: farm.usesOrganicMethods || false,
      composting: farm.composting || false,
      soilConservationPractices: farm.soilConservationPractices || "",
      rainwaterHarvesting: farm.rainwaterHarvesting || false,
      manureManagement: farm.manureManagement || "",
      hasCertifications: farm.hasCertifications || false,
      certificationDetails: farm.certificationDetails || "",

      // Technical support and training
      receivesExtensionServices: farm.receivesExtensionServices || false,
      extensionServiceProvider: farm.extensionServiceProvider || "",
      trainingReceived: farm.trainingReceived || "",
      technicalSupportNeeds: farm.technicalSupportNeeds || "",

      // Challenges and opportunities
      majorChallenges: farm.majorChallenges || "",
      disasterVulnerabilities: farm.disasterVulnerabilities || "",
      growthOpportunities: farm.growthOpportunities || "",
      futureExpansionPlans: farm.futureExpansionPlans || "",

      // Linked entities
      linkedGrazingAreas: farm.linkedGrazingAreas || [],
      linkedProcessingCenters: farm.linkedProcessingCenters || [],
      linkedAgricZones: farm.linkedAgricZones || [],
      linkedGrasslands: farm.linkedGrasslands || [],

      // SEO fields
      metaTitle: farm.metaTitle || "",
      metaDescription: farm.metaDescription || "",
      keywords: farm.keywords || "",

      // Geometry fields
      locationPoint: farm.locationPoint || undefined,
      farmBoundary: farm.farmBoundary || undefined,

      // Status
      isVerified: farm.isVerified || false,
    },
  });

  // Update farm mutation
  const { mutate: updateFarm, isLoading } =
    api.profile.agriculture.farms.update.useMutation({
      onSuccess: () => {
        toast.success("फार्म सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/farms/${farm.id}`,
        );
      },
      onError: (error) => {
        toast.error(`फार्म अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateFarm(values);
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    farmBoundary?: {
      type: "Polygon";
      coordinates: Array<Array<[number, number]>>;
    },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (farmBoundary) {
      form.setValue("farmBoundary", farmBoundary);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="basic">आधारभूत विवरण</TabsTrigger>
          <TabsTrigger value="location">स्थान विवरण</TabsTrigger>
          <TabsTrigger value="crops">बाली र पशुधन</TabsTrigger>
          <TabsTrigger value="farmer">किसान विवरण</TabsTrigger>
          <TabsTrigger value="infrastructure">पूर्वाधार विवरण</TabsTrigger>
          <TabsTrigger value="practices">व्यवस्थापन अभ्यास</TabsTrigger>
          <TabsTrigger value="economics">आर्थिक विवरण</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="basic">
              <BasicFarmDetails form={form} />

              <SEOFields form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button type="button" onClick={() => setActiveTab("location")}>
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="location">
              <FarmLocationMap
                onGeometrySelect={handleGeometrySelect}
                initialLocationPoint={form.watch("locationPoint")}
                initialFarmBoundary={form.watch("farmBoundary")}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                >
                  पछाडि
                </Button>
                <Button type="button" onClick={() => setActiveTab("crops")}>
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="crops">
              <CropsAndLivestockDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("location")}
                >
                  पछाडि
                </Button>
                <Button type="button" onClick={() => setActiveTab("farmer")}>
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="farmer">
              <FarmerDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("crops")}
                >
                  पछाडि
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("infrastructure")}
                >
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="infrastructure">
              <FarmInfrastructureDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("farmer")}
                >
                  पछाडि
                </Button>
                <Button type="button" onClick={() => setActiveTab("practices")}>
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="practices">
              <ManagementPractices form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("infrastructure")}
                >
                  पछाडि
                </Button>
                <Button type="button" onClick={() => setActiveTab("economics")}>
                  अर्को
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="economics">
              <EconomicsDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("practices")}
                >
                  पछाडि
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  सुरक्षित गर्नुहोस्
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
}
