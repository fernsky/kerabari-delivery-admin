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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationMapInput } from "./location-map-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "नाम आवश्यक छ"),
  description: z.string().optional(),
  type: z.enum(["VILLAGE", "SETTLEMENT", "TOLE", "WARD", "SQUATTER_AREA"], {
    required_error: "प्रकार आवश्यक छ",
  }),
  isNewSettlement: z.boolean().default(false),
  isTownPlanned: z.boolean().default(false),
  pointGeometry: z
    .object({
      type: z.literal("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  polygonGeometry: z
    .object({
      type: z.literal("Polygon"),
      coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
    })
    .optional(),
  parentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateLocalAreaForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  // Set up the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      type: undefined,
      isNewSettlement: false,
      isTownPlanned: false,
    },
  });

  const { mutate: createLocation, isLoading } =
    api.profile.localAreas.locations.create.useMutation({
      onSuccess: (data) => {
        toast.success("स्थान सफलतापूर्वक सिर्जना गरियो");
        router.push("/dashboard/digital-profile/institutions/local-areas");
      },
      onError: (error) => {
        toast.error(`स्थान सिर्जना गर्न असफल: ${error.message}`);
      },
    });

  const locationTypes = [
    { value: "VILLAGE", label: "गाउँ" },
    { value: "SETTLEMENT", label: "बस्ती" },
    { value: "TOLE", label: "टोल" },
    { value: "WARD", label: "वडा" },
    { value: "SQUATTER_AREA", label: "सुकुम्बासी क्षेत्र" },
  ];

  // Get all existing locations for parent selection
  const { data: existingLocations, isLoading: isLocationsLoading } =
    api.profile.localAreas.locations.getAll.useQuery(undefined, {
      staleTime: 5000,
    });

  const onSubmit = (values: FormValues) => {
    createLocation(values);
  };

  const handleLocationSelect = (
    pointGeometry?: { type: "Point"; coordinates: [number, number] },
    polygonGeometry?: { type: "Polygon"; coordinates: [number, number][][] },
  ) => {
    if (pointGeometry) {
      form.setValue("pointGeometry", pointGeometry);
    }

    if (polygonGeometry) {
      form.setValue("polygonGeometry", polygonGeometry);
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="basic">आधारभूत जानकारी</TabsTrigger>
          <TabsTrigger value="location">स्थान</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>स्थानको नाम</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="स्थानको नाम लेख्नुहोस्"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>स्थानको प्रकार</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="स्थानको प्रकार छान्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>अभिभावक स्थान</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="अभिभावक स्थान छान्नुहोस् (वैकल्पिक)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLocationsLoading ? (
                            <SelectItem value="_loading" disabled>
                              लोड हुँदैछ...
                            </SelectItem>
                          ) : existingLocations &&
                            Array.isArray(existingLocations) &&
                            existingLocations.length > 0 ? (
                            existingLocations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.id || "_empty"}
                              >
                                {location.name} (
                                {
                                  locationTypes.find(
                                    (t) => t.value === location.type,
                                  )?.label
                                }
                                )
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="_no_locations" disabled>
                              कुनै स्थान उपलब्ध छैन
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        यो स्थान कुनै अर्को स्थान अन्तर्गत छ भने छान्नुहोस्
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>विवरण</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="स्थानको विवरण लेख्नुहोस्"
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <div className="text-lg font-medium">
                  स्थान प्रकार विशेषताहरू
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="isNewSettlement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>नयाँ बस्ती</FormLabel>
                          <FormDescription>
                            यो स्थान नयाँ बस्ती हो भने यो विकल्प छान्नुहोस्
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTownPlanned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>नियोजित शहरी क्षेत्र</FormLabel>
                          <FormDescription>
                            यो स्थान नियोजित शहरी क्षेत्र हो भने यो विकल्प
                            छान्नुहोस्
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                <div className="text-lg font-medium">स्थान भौगोलिक जानकारी</div>
                <div className="grid grid-cols-1 gap-6">
                  {/* Location coordinates display, shown when we have coordinates */}
                  {(form.watch("pointGeometry") ||
                    form.watch("polygonGeometry")) && (
                    <div className="bg-muted p-3 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {form.watch("pointGeometry") && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-primary" />
                            <span>
                              बिन्दु स्थान:{" "}
                              {form
                                .watch("pointGeometry")
                                ?.coordinates[1].toFixed(6)}
                              ,
                              {form
                                .watch("pointGeometry")
                                ?.coordinates[0].toFixed(6)}
                            </span>
                          </div>
                        )}

                        {form.watch("polygonGeometry") && (
                          <div className="flex items-center mt-1">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4 mr-1 text-primary"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>
                              बहुभुज क्षेत्र:{" "}
                              {form.watch("polygonGeometry")?.coordinates[0]
                                ?.length || 0}{" "}
                              बिन्दुहरू
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Always show the map in a larger container */}
                  <div className="border rounded-lg overflow-hidden">
                    <LocationMapInput
                      onLocationSelect={handleLocationSelect}
                      initialPoint={form.watch("pointGeometry")}
                      initialPolygon={form.watch("polygonGeometry")}
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
