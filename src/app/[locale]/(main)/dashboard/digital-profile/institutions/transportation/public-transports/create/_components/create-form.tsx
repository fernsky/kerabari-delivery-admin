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
import { BasicTransportDetails } from "./basic-transport-details";
import { TransportRouteDetails } from "./transport-route-details";
import { TransportScheduleDetails } from "./transport-schedule-details";
import { TransportMapInput } from "./transport-map-input";
import { TransportFeaturesDetails } from "./transport-features-details";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "यातायातको नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(
    [
      "BUS",
      "MINIBUS",
      "MICROBUS",
      "TEMPO",
      "AUTO_RICKSHAW",
      "TAXI",
      "E_RICKSHAW",
      "OTHER",
    ],
    {
      required_error: "यातायातको प्रकार आवश्यक छ",
    },
  ),

  // Operator details
  operatorName: z.string().optional(),
  operatorContact: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorWebsite: z.string().url().optional(),

  // Route details
  routeName: z.string().optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  viaPoints: z.string().optional(),
  estimatedDuration: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Schedule details
  frequency: z
    .enum(["DAILY", "WEEKDAYS_ONLY", "WEEKENDS_ONLY", "OCCASIONAL", "SEASONAL"])
    .optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  intervalMinutes: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),

  // Vehicle details
  vehicleCount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  seatingCapacity: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  vehicleCondition: z
    .enum([
      "EXCELLENT",
      "GOOD",
      "FAIR",
      "POOR",
      "VERY_POOR",
      "UNDER_MAINTENANCE",
    ])
    .optional(),
  hasAirConditioning: z.boolean().default(false),
  hasWifi: z.boolean().default(false),
  isAccessible: z.boolean().default(false),

  // Fare details
  fareAmount: z
    .string()
    .transform((val) => Number(val) || undefined)
    .optional(),
  fareDescription: z.string().optional(),

  // Geometry fields
  routePath: z
    .object({
      type: z.literal("LineString"),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    })
    .optional(),
  stopPoints: z
    .object({
      type: z.literal("MultiPoint"),
      coordinates: z.array(z.tuple([z.number(), z.number()])),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePublicTransportForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      operatorName: "",
      operatorContact: "",
      operatorEmail: "",
      operatorWebsite: "",
      routeName: "",
      startPoint: "",
      endPoint: "",
      viaPoints: "",
      estimatedDuration: undefined,
      frequency: undefined,
      startTime: "",
      endTime: "",
      intervalMinutes: undefined,
      vehicleCount: undefined,
      seatingCapacity: undefined,
      vehicleCondition: undefined,
      hasAirConditioning: false,
      hasWifi: false,
      isAccessible: false,
      fareAmount: undefined,
      fareDescription: "",
    },
  });

  // Create public transport mutation
  const { mutate: createPublicTransport, isLoading } =
    api.profile.transportation.publicTransports.create.useMutation({
      onSuccess: (data) => {
        toast.success("सार्वजनिक यातायात सफलतापूर्वक सिर्जना गरियो");
        router.push(
          `/dashboard/digital-profile/institutions/transportation/public-transports/${data.id}`,
        );
      },
      onError: (error) => {
        toast.error(`सार्वजनिक यातायात सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    createPublicTransport({
      ...values,
      estimatedDuration: values.estimatedDuration
        ? Number(values.estimatedDuration)
        : undefined,
      intervalMinutes: values.intervalMinutes
        ? Number(values.intervalMinutes)
        : undefined,
      vehicleCount: values.vehicleCount
        ? Number(values.vehicleCount)
        : undefined,
      seatingCapacity: values.seatingCapacity
        ? Number(values.seatingCapacity)
        : undefined,
      fareAmount: values.fareAmount ? Number(values.fareAmount) : undefined,
    });
  };

  // Handle geometry selection from map
  const handleTransportGeometrySelect = (
    routePath?: { type: "LineString"; coordinates: [number, number][] },
    stopPoints?: { type: "MultiPoint"; coordinates: [number, number][] },
  ) => {
    if (routePath) {
      form.setValue("routePath", routePath);
    }

    if (stopPoints) {
      form.setValue("stopPoints", stopPoints);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="details">मार्ग र समय तालिका</TabsTrigger>
          <TabsTrigger value="location">नक्सा र स्थान</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <BasicTransportDetails form={form} />
              <TransportFeaturesDetails form={form} />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  रद्द गर्नुहोस्
                </Button>
                <Button type="button" onClick={() => setActiveTab("details")}>
                  अर्को
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="details">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TransportRouteDetails form={form} />
              <TransportScheduleDetails form={form} />

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
                  यातायात मार्ग र बिसौनी
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <TransportMapInput
                      onTransportGeometrySelect={handleTransportGeometrySelect}
                      initialRoutePath={form.watch("routePath")}
                      initialStopPoints={form.watch("stopPoints")}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveTab("details")}
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
