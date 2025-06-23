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
import { RoadMapInput } from "./road-map-input";
import { BasicRoadDetails } from "./basic-road-details";
import { RoadFeaturesDetails } from "./road-features-details";

// Define the form schema
const formSchema = z.object({
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

export function CreateRoadForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      widthInMeters: undefined,
      condition: undefined,
      drainageSystem: undefined,
      maintenanceYear: "",
      length: undefined,
      startPoint: "",
      endPoint: "",
      hasStreetLights: false,
      hasDivider: false,
      hasPedestrian: false,
      hasBicycleLane: false,
    },
  });

  // Create road mutation
  const { mutate: createRoad, isLoading } =
    api.profile.transportation.roads.create.useMutation({
      onSuccess: (data) => {
        toast.success("सडक सफलतापूर्वक सिर्जना गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/transportation/roads/${data.id}`,
        );
      },
      onError: (error) => {
        toast.error(`सडक सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createRoad({
      ...values,
      widthInMeters: values.widthInMeters
        ? Number(values.widthInMeters)
        : undefined,
      length: values.length ? Number(values.length) : undefined,
    });
  };

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

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="location">नक्सा र स्थान</TabsTrigger>
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
                <div className="text-lg font-medium">सडकको भौगोलिक जानकारी</div>
                <div className="grid grid-cols-1 gap-6">
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
