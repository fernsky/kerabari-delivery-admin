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
import { Loader, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoadMapInput } from "../../create/_components/road-map-input";
import { BasicRoadDetails } from "../../create/_components/basic-road-details";
import { RoadFeaturesDetails } from "../../create/_components/road-features-details";
import { RoadMediaSection } from "./road-media-section";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "सडकको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    [
      "HIGHWAY",
      "URBAN",
      "RURAL",
      "GRAVEL",
      "EARTHEN",
      "AGRICULTURAL",
      "ALLEY",
      "BRIDGE",
    ],
    {
      required_error: "सडकको प्रकार आवश्यक छ",
    },
  ),
  widthInMeters: z
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
  maintenanceYear: z.string().optional(),
  length: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  hasStreetLights: z.boolean().default(false),
  hasDivider: z.boolean().default(false),
  hasPedestrian: z.boolean().default(false),
  hasBicycleLane: z.boolean().default(false),
  roadPath: z
    .object({
      type: z.literal("LineString"),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    })
    .optional(),
  representativePoint: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoadEditFormProps {
  initialData: any;
  roadId: string;
}

export function RoadEditForm({ initialData, roadId }: RoadEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with initial values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: roadId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || undefined,
      widthInMeters: initialData?.widthInMeters
        ? Number(initialData.widthInMeters)
        : undefined,
      condition: initialData?.condition || undefined,
      drainageSystem: initialData?.drainageSystem || undefined,
      maintenanceYear: initialData?.maintenanceYear || "",
      length: initialData?.length ? Number(initialData.length) : undefined,
      startPoint: initialData?.startPoint || "",
      endPoint: initialData?.endPoint || "",
      hasStreetLights: initialData?.hasStreetLights || false,
      hasDivider: initialData?.hasDivider || false,
      hasPedestrian: initialData?.hasPedestrian || false,
      hasBicycleLane: initialData?.hasBicycleLane || false,
      roadPath: initialData?.roadPath || undefined,
      representativePoint: initialData?.representativePoint || undefined,
    },
  });

  // Update road mutation
  const { mutate: updateRoad, isLoading } =
    api.profile.transportation.roads.update.useMutation({
      onSuccess: () => {
        toast.success("सडक सफलतापूर्वक अपडेट गरियो");
        router.refresh();
      },
      onError: (error) => {
        toast.error(`सडक अपडेट गर्न असफल: ${error.message}`);
      },
    });

  // Handle geometry selection from map
  const handleRoadGeometrySelect = (
    roadPath?: { type: "LineString"; coordinates: [number, number][] },
    representativePoint?: { type: "Point"; coordinates: [number, number] },
  ) => {
    if (roadPath) {
      form.setValue("roadPath", roadPath);
    }

    if (representativePoint) {
      form.setValue("representativePoint", representativePoint);
    }
  };

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updateRoad({
      ...values,
      widthInMeters: values.widthInMeters
        ? Number(values.widthInMeters)
        : undefined,
      length: values.length ? Number(values.length) : undefined,
    });
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="location">नक्सा र स्थान</TabsTrigger>
          <TabsTrigger value="media">फोटोहरू</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicRoadDetails form={form} />
              <RoadFeaturesDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  फिर्ता जानुहोस्
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

        <TabsContent value="location">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="text-lg font-medium">सडकको भौगोलिक जानकारी</div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Location coordinates display, shown when we have coordinates */}
                  {(form.watch("roadPath") ||
                    form.watch("representativePoint")) && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {form.watch("representativePoint") && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <span>
                              प्रतिनिधि बिन्दु:{" "}
                              {form
                                .watch("representativePoint")
                                ?.coordinates[1].toFixed(6)}
                              ,
                              {form
                                .watch("representativePoint")
                                ?.coordinates[0].toFixed(6)}
                            </span>
                          </div>
                        )}

                        {form.watch("roadPath") && (
                          <div className="flex items-center mt-1">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4 mr-1 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 17l2-4 4-2 3 3 3-5 3 2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>
                              सडकको रेखा:{" "}
                              {form.watch("roadPath")?.coordinates.length || 0}{" "}
                              बिन्दुहरू
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <RoadMapInput
                      onRoadGeometrySelect={handleRoadGeometrySelect}
                      initialRoadPath={form.watch("roadPath")}
                      initialRepresentativePoint={form.watch(
                        "representativePoint",
                      )}
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

        <TabsContent value="media">
          <div className="space-y-8">
            <RoadMediaSection
              roadId={roadId}
              initialMedia={initialData?.media || []}
            />

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("location")}
              >
                पछिल्लो
              </Button>
              <Button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/digital-profile/institutions/transportation/roads",
                  )
                }
              >
                सूचीमा फर्कनुहोस्
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
