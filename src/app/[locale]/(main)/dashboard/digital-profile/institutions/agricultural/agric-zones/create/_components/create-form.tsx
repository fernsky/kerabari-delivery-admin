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
import { AgricZoneLocationMap } from "./agric-zone-location-map";
import { BasicAgricZoneDetails } from "./basic-agric-zone-details";
import { AgricZoneFacilitiesDetails } from "./agric-zone-facilities-details";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "कृषि क्षेत्रको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    [
      "PULSES",
      "OILSEEDS",
      "COMMERCIAL_FLOWER",
      "SEASONAL_CROPS",
      "SUPER_ZONE",
      "POCKET_AREA",
      "MIXED",
      "OTHER",
    ],
    {
      required_error: "कृषि क्षेत्रको प्रकार आवश्यक छ",
    },
  ),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().positive().optional()),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInHectares: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().positive().optional()),
  soilQuality: z
    .enum(["EXCELLENT", "GOOD", "AVERAGE", "POOR", "VERY_POOR"])
    .optional(),
  irrigationSystem: z
    .enum([
      "CANAL",
      "SPRINKLER",
      "DRIP",
      "GROUNDWATER",
      "RAINWATER_HARVESTING",
      "SEASONAL_RIVER",
      "NONE",
      "MIXED",
    ])
    .optional(),

  // Agricultural details
  majorCrops: z.string().optional(),
  seasonalAvailability: z.string().optional(),
  annualProduction: z
    .string()
    .transform((val) => Number(val) || undefined)
    .pipe(z.number().int().positive().optional()),
  productionYear: z.string().optional(),

  // Management details
  isGovernmentOwned: z.boolean().default(false),
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  caretakerName: z.string().optional(),
  caretakerContact: z.string().optional(),

  // Additional facilities
  hasStorage: z.boolean().default(false),
  hasProcessingUnit: z.boolean().default(false),
  hasFarmersCooperative: z.boolean().default(false),

  // Geometry fields
  locationPoint: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  areaPolygon: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAgricZoneForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      wardNumber: undefined,
      location: "",
      address: "",
      areaInHectares: undefined,
      soilQuality: undefined,
      irrigationSystem: undefined,
      majorCrops: "",
      seasonalAvailability: "",
      annualProduction: undefined,
      productionYear: "",
      isGovernmentOwned: false,
      ownerName: "",
      ownerContact: "",
      caretakerName: "",
      caretakerContact: "",
      hasStorage: false,
      hasProcessingUnit: false,
      hasFarmersCooperative: false,
    },
  });

  // Create agricultural zone mutation
  const { mutate: createAgricZone, isLoading } =
    api.profile.agriculture.agricZones.create.useMutation({
      onSuccess: (data) => {
        toast.success("कृषि क्षेत्र सफलतापूर्वक सिर्जना गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/agricultural/agric-zones/${data.id}`,
        );
      },
      onError: (error) => {
        toast.error(`कृषि क्षेत्र सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createAgricZone({
      ...values,
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      areaInHectares: values.areaInHectares
        ? Number(values.areaInHectares)
        : undefined,
      annualProduction: values.annualProduction
        ? Number(values.annualProduction)
        : undefined,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: any },
    areaPolygon?: { type: "Polygon"; coordinates: any },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }
    if (areaPolygon) {
      form.setValue("areaPolygon", areaPolygon as any);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="agriculture">कृषि विवरण</TabsTrigger>
          <TabsTrigger value="location">स्थान र नक्सा</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicAgricZoneDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("agriculture")}
                >
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="agriculture">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <AgricZoneFacilitiesDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("basic")}
                >
                  पछिल्लो
                </Button>
                <Button type="button" onClick={() => setActiveTab("location")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="location">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="text-lg font-medium">
                  कृषि क्षेत्रको स्थान जानकारी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="border rounded-lg overflow-hidden">
                    <AgricZoneLocationMap
                      onGeometrySelect={handleGeometrySelect}
                      initialLocationPoint={form.watch("locationPoint")}
                      initialAreaPolygon={form.watch("areaPolygon")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("agriculture")}
                >
                  पछिल्लो
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isValid}
                >
                  {isLoading && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  सुरक्षित गर्नुहोस्
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
