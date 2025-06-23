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
import { PetrolPumpLocationMap } from "../../create/_components/petrol-pump-location-map";
import { BasicPetrolPumpDetails } from "../../create/_components/basic-petrol-pump-details";
import { PetrolPumpFacilitiesDetails } from "../../create/_components/petrol-pump-facilities-details";
import { SEOFields } from "./seo-fields";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "पेट्रोल पम्पको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    ["PETROL", "DIESEL", "PETROL_DIESEL", "CNG", "EV_CHARGING", "MULTIPURPOSE"],
    {
      required_error: "पेट्रोल पम्पको प्रकार आवश्यक छ",
    },
  ),

  // Location details
  wardNumber: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  locality: z.string().optional(),
  address: z.string().optional(),

  // Owner details
  ownerName: z.string().optional(),
  ownerContact: z.string().optional(),
  ownerEmail: z.string().email().optional().or(z.literal("")),
  ownerWebsite: z.string().url().optional().or(z.literal("")),

  // Facilities
  hasEVCharging: z.boolean().default(false),
  hasCarWash: z.boolean().default(false),
  hasConvenienceStore: z.boolean().default(false),
  hasRestroom: z.boolean().default(false),
  hasAirFilling: z.boolean().default(false),
  operatingHours: z.string().optional(),

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
});

type FormValues = z.infer<typeof formSchema>;

interface PetrolPumpEditFormProps {
  petrolPump: any;
}

export function PetrolPumpEditForm({ petrolPump }: PetrolPumpEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with petrol pump data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: petrolPump.id,
      name: petrolPump.name || "",
      description: petrolPump.description || "",
      type: petrolPump.type,
      wardNumber: petrolPump.wardNumber?.toString() || "",
      locality: petrolPump.locality || "",
      address: petrolPump.address || "",
      ownerName: petrolPump.ownerName || "",
      ownerContact: petrolPump.ownerContact || "",
      ownerEmail: petrolPump.ownerEmail || "",
      ownerWebsite: petrolPump.ownerWebsite || "",
      hasEVCharging: petrolPump.hasEVCharging || false,
      hasCarWash: petrolPump.hasCarWash || false,
      hasConvenienceStore: petrolPump.hasConvenienceStore || false,
      hasRestroom: petrolPump.hasRestroom || false,
      hasAirFilling: petrolPump.hasAirFilling || false,
      operatingHours: petrolPump.operatingHours || "",
      metaTitle: petrolPump.metaTitle || "",
      metaDescription: petrolPump.metaDescription || "",
      keywords: petrolPump.keywords || "",
      locationPoint: petrolPump.locationPoint,
    },
  });

  // Update petrol pump mutation
  const { mutate: updatePetrolPump, isLoading } =
    api.profile.transportation.petrolPumps.update.useMutation({
      onSuccess: () => {
        toast.success("पेट्रोल पम्प सफलतापूर्वक अपडेट गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/transportation/petrol-pumps/${petrolPump.id}`,
        );
      },
      onError: (error) => {
        toast.error(`पेट्रोल पम्प अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updatePetrolPump({
      ...values,
      wardNumber: Number(values.wardNumber),
    });
  };

  // Handle geometry selection from map
  const handleGeometrySelect = (locationPoint?: {
    type: "Point";
    coordinates: [number, number];
  }) => {
    if (locationPoint) {
      form.setValue("locationPoint", locationPoint);
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
              <BasicPetrolPumpDetails form={form} />
              <PetrolPumpFacilitiesDetails form={form} />

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
                <div className="text-lg font-medium">
                  पेट्रोल पम्पको स्थान जानकारी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <PetrolPumpLocationMap
                      onGeometrySelect={handleGeometrySelect}
                      initialLocationPoint={form.watch("locationPoint")}
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
