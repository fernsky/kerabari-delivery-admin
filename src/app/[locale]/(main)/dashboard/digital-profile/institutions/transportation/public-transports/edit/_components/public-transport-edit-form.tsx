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
import { TransportMapInput } from "../../create/_components/transport-map-input";
import { BasicTransportDetails } from "../../create/_components/basic-transport-details";
import { TransportRouteDetails } from "../../create/_components/transport-route-details";
import { TransportScheduleDetails } from "../../create/_components/transport-schedule-details";
import { TransportFeaturesDetails } from "../../create/_components/transport-features-details";

// Define the form schema
const formSchema = z.object({
  id: z.string(),
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
  operatorEmail: z.string().email().optional().or(z.literal("")),
  operatorWebsite: z.string().url().optional().or(z.literal("")),

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

  // SEO fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PublicTransportEditFormProps {
  initialData: any;
  transportId: string;
}

export function PublicTransportEditForm({
  initialData,
  transportId,
}: PublicTransportEditFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with initial values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: transportId,
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || undefined,

      // Operator details
      operatorName: initialData?.operatorName || "",
      operatorContact: initialData?.operatorContact || "",
      operatorEmail: initialData?.operatorEmail || "",
      operatorWebsite: initialData?.operatorWebsite || "",

      // Route details
      routeName: initialData?.routeName || "",
      startPoint: initialData?.startPoint || "",
      endPoint: initialData?.endPoint || "",
      viaPoints: initialData?.viaPoints || "",
      estimatedDuration: initialData?.estimatedDuration
        ? Number(initialData.estimatedDuration)
        : undefined,

      // Schedule details
      frequency: initialData?.frequency || undefined,
      startTime: initialData?.startTime || "",
      endTime: initialData?.endTime || "",
      intervalMinutes: initialData?.intervalMinutes
        ? Number(initialData.intervalMinutes)
        : undefined,

      // Vehicle details
      vehicleCount: initialData?.vehicleCount
        ? Number(initialData.vehicleCount)
        : undefined,
      seatingCapacity: initialData?.seatingCapacity
        ? Number(initialData.seatingCapacity)
        : undefined,
      vehicleCondition: initialData?.vehicleCondition || undefined,
      hasAirConditioning: initialData?.hasAirConditioning || false,
      hasWifi: initialData?.hasWifi || false,
      isAccessible: initialData?.isAccessible || false,

      // Fare details
      fareAmount: initialData?.fareAmount
        ? Number(initialData.fareAmount)
        : undefined,
      fareDescription: initialData?.fareDescription || "",

      // Geometry fields
      routePath: initialData?.routePath || undefined,
      stopPoints: initialData?.stopPoints || undefined,

      // SEO fields
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      keywords: initialData?.keywords || "",
    },
  });

  // Update public transport mutation
  const { mutate: updatePublicTransport, isLoading } =
    api.profile.transportation.publicTransports.update.useMutation({
      onSuccess: () => {
        toast.success("सार्वजनिक यातायात सफलतापूर्वक अपडेट गरियो");
        router.refresh();
      },
      onError: (error) => {
        toast.error(`सार्वजनिक यातायात अपडेट गर्न असफल: ${error.message}`);
      },
    });

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

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    updatePublicTransport({
      ...values,
      estimatedDuration:
        values.estimatedDuration !== undefined
          ? Number(values.estimatedDuration)
          : undefined,
      intervalMinutes:
        values.intervalMinutes !== undefined
          ? Number(values.intervalMinutes)
          : undefined,
      vehicleCount:
        values.vehicleCount !== undefined
          ? Number(values.vehicleCount)
          : undefined,
      seatingCapacity:
        values.seatingCapacity !== undefined
          ? Number(values.seatingCapacity)
          : undefined,
      fareAmount:
        values.fareAmount !== undefined ? Number(values.fareAmount) : undefined,
    });
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
