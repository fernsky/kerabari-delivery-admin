"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { BasicFarmDetails } from "./basic-farm-details";
import { FarmLocationMap } from "./farm-location-map";
import { CropsAndLivestockDetails } from "./crops-livestock-details";
import { FarmInfrastructureDetails } from "./farm-infrastructure-details";
import { FarmerDetails } from "./farmer-details";
import { ManagementPractices } from "./management-practices";
import { EconomicsDetails } from "./economics-details";

// Define the form schema
const formSchema = z.object({
  // Basic details
  name: z.string().min(1, "कृषि फार्म नाम आवश्यक छ"),
  description: z.string().optional(),
  farmType: z.string().min(1, "फार्मको प्रकार आवश्यक छ"),
  farmingSystem: z.string().optional(),

  // Location details
  wardNumber: z.number().int().positive().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
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

  // Land details
  totalAreaInHectares: z.number().positive().optional(),
  cultivatedAreaInHectares: z.number().positive().optional(),
  landOwnership: z.string().optional(),
  soilType: z.string().optional(),
  irrigationType: z.string().optional(),
  irrigationSourceDetails: z.string().optional(),
  irrigatedAreaInHectares: z.number().positive().optional(),

  // Crop details
  mainCrops: z.string().optional(),
  secondaryCrops: z.string().optional(),
  cropRotation: z.boolean().optional(),
  cropRotationDetails: z.string().optional(),
  intercropping: z.boolean().optional(),
  croppingSeasons: z.string().optional(),
  annualCropYieldMT: z.number().positive().optional(),
  recordedYearCrops: z.string().optional(),

  // Livestock details
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
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      farmType: "MIXED_FARM",
      farmingSystem: "",
      // All other fields will default to undefined
    },
  });

  // Create farm mutation
  const { mutate: createFarm, isLoading } =
    api.profile.agriculture.farms.create.useMutation({
      onSuccess: (data) => {
        toast.success("फार्म सफलतापूर्वक सिर्जना गरियो");

        // Redirect to farm detail page
        if (data?.id) {
          router.push(
            `/dashboard/digital-profile/institutions/agricultural/farms/${data.slug}`,
          );
        }
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message || "फार्म सिर्जना गर्न सकिएन"}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createFarm(values);
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
                  सेव गर्नुहोस्
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
}
