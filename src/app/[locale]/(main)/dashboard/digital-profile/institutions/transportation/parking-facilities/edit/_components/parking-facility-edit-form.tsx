"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingLocationMap } from "../../create/_components/parking-location-map";
import { BasicParkingDetails } from "../../create/_components/basic-parking-details";
import { ParkingFacilitiesDetails } from "../../create/_components/parking-facilities-details";
import { SEOFields } from "./seo-fields";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "पार्किङ सुविधाको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    [
      "BUS_PARK",
      "TAXI_PARK",
      "TEMPO_PARK",
      "AUTO_RICKSHAW_PARK",
      "CAR_PARK",
      "BIKE_PARK",
      "MULTIPURPOSE_PARK",
      "OTHER",
    ],
    {
      required_error: "पार्किङ सुविधाको प्रकार आवश्यक छ",
    },
  ),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  location: z.string().optional(),
  address: z.string().optional(),

  // Physical details
  areaInSquareMeters: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  vehicleCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  condition: z
    .enum([
      "EXCELLENT",
      "GOOD",
      "FAIR",
      "POOR",
      "VERY_POOR",
      "UNDER_CONSTRUCTION",
    ])
    .optional(),
  drainageSystem: z.enum(["PROPER", "PARTIAL", "NONE", "BLOCKED"]).optional(),

  // Additional facilities
  hasRoof: z.boolean().default(false),
  hasToilet: z.boolean().default(false),
  hasWaitingArea: z.boolean().default(false),
  hasTicketCounter: z.boolean().default(false),
  hasFoodStalls: z.boolean().default(false),
  hasSecurityPersonnel: z.boolean().default(false),
  hasCCTV: z.boolean().default(false),
  operatingHours: z.string().optional(),

  // Management details
  operator: z.string().optional(),
  contactInfo: z.string().optional(),
  establishedYear: z.string().optional(),

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
  areaPolygon: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParkingFacilityEditFormProps {
  facility: any;
}

export function ParkingFacilityEditForm({
  facility,
}: ParkingFacilityEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with facility data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: facility.id,
      name: facility.name || "",
      description: facility.description || "",
      type: facility.type,
      wardNumber: facility.wardNumber?.toString() || "",
      location: facility.location || "",
      address: facility.address || "",
      areaInSquareMeters: facility.areaInSquareMeters?.toString() || "",
      vehicleCapacity: facility.vehicleCapacity?.toString() || "",
      condition: facility.condition,
      drainageSystem: facility.drainageSystem,
      hasRoof: facility.hasRoof || false,
      hasToilet: facility.hasToilet || false,
      hasWaitingArea: facility.hasWaitingArea || false,
      hasTicketCounter: facility.hasTicketCounter || false,
      hasFoodStalls: facility.hasFoodStalls || false,
      hasSecurityPersonnel: facility.hasSecurityPersonnel || false,
      hasCCTV: facility.hasCCTV || false,
      operatingHours: facility.operatingHours || "",
      operator: facility.operator || "",
      contactInfo: facility.contactInfo || "",
      establishedYear: facility.establishedYear || "",
      metaTitle: facility.metaTitle || "",
      metaDescription: facility.metaDescription || "",
      keywords: facility.keywords || "",
      locationPoint: facility.locationPoint,
      areaPolygon: facility.areaPolygon,
    },
  });

  // Update parking facility mutation
  const { mutate: updateParkingFacility, isLoading } =
    api.profile.transportation.parkingFacilities.update.useMutation({
      onSuccess: () => {
        toast.success("पार्किङ सुविधा सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/transportation/parking-facilities/${facility.id}`,
        );
      },
      onError: (error) => {
        toast.error(`पार्किङ सुविधा अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateParkingFacility({
      ...values,
      wardNumber: values.wardNumber ? Number(values.wardNumber) : undefined,
      areaInSquareMeters: values.areaInSquareMeters
        ? Number(values.areaInSquareMeters)
        : undefined,
      vehicleCapacity: values.vehicleCapacity
        ? Number(values.vehicleCapacity)
        : undefined,
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (
    locationPoint?: { type: "Point"; coordinates: [number, number] },
    areaPolygon?: { type: "Polygon"; coordinates: [number, number][][] },
  ) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
    }

    if (areaPolygon) {
      form.setValue("areaPolygon", areaPolygon);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="location">स्थान र नक्सा</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicParkingDetails form={form} />
              <ParkingFacilitiesDetails form={form} />

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
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="location">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="text-lg font-medium">पार्किङ स्थान जानकारी</div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <ParkingLocationMap
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
                  onClick={() => setActiveTab("basic")}
                >
                  पछिल्लो
                </Button>
                <Button type="button" onClick={() => setActiveTab("seo")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="seo">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <SEOFields form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("location")}
                >
                  पछिल्लो
                </Button>
                <Button type="submit" disabled={isLoading}>
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
