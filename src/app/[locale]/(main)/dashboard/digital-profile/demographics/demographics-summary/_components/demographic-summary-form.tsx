"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

// Form schema based on the demographic summary data structure
const formSchema = z.object({
  totalPopulation: z.coerce.number().int().nonnegative().optional(),
  populationMale: z.coerce.number().int().nonnegative().optional(),
  populationFemale: z.coerce.number().int().nonnegative().optional(),
  populationOther: z.coerce.number().int().nonnegative().optional(),
  populationAbsenteeTotal: z.coerce.number().int().nonnegative().optional(),
  populationMaleAbsentee: z.coerce.number().int().nonnegative().optional(),
  populationFemaleAbsentee: z.coerce.number().int().nonnegative().optional(),
  populationOtherAbsentee: z.coerce.number().int().nonnegative().optional(),
  sexRatio: z.coerce.number().nonnegative().optional(),
  totalHouseholds: z.coerce.number().int().nonnegative().optional(),
  averageHouseholdSize: z.coerce.number().nonnegative().optional(),
  populationDensity: z.coerce.number().nonnegative().optional(),
  totalWards: z.coerce.number().int().nonnegative().optional(),
  totalLandArea: z.coerce.number().nonnegative().optional(),
  population0To14: z.coerce.number().int().nonnegative().optional(),
  population15To59: z.coerce.number().int().nonnegative().optional(),
  population60AndAbove: z.coerce.number().int().nonnegative().optional(),
  growthRate: z.coerce.number().nonnegative().optional(),
  literacyRateAbove15: z.coerce.number().nonnegative().optional(),
  literacyRate15To24: z.coerce.number().nonnegative().optional(),
});

export default function DemographicSummaryForm({
  initialData,
}: {
  initialData: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  const updateMutation = api.profile.demographics.summary.update.useMutation({
    onSuccess: () => {
      toast.success("जनसांख्यिकीय डाटा सफलतापूर्वक अपडेट गरियो");
      utils.profile.demographics.summary.get.invalidate();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`त्रुटि: ${error.message || "अपडेट गर्न असमर्थ"}`);
      setIsSubmitting(false);
    },
  });

  // Set up the form with default values from initialData
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalPopulation: initialData?.totalPopulation || undefined,
      populationMale: initialData?.populationMale || undefined,
      populationFemale: initialData?.populationFemale || undefined,
      populationOther: initialData?.populationOther || undefined,
      populationAbsenteeTotal:
        initialData?.populationAbsenteeTotal || undefined,
      populationMaleAbsentee: initialData?.populationMaleAbsentee || undefined,
      populationFemaleAbsentee:
        initialData?.populationFemaleAbsentee || undefined,
      populationOtherAbsentee:
        initialData?.populationOtherAbsentee || undefined,
      sexRatio: initialData?.sexRatio || undefined,
      totalHouseholds: initialData?.totalHouseholds || undefined,
      averageHouseholdSize: initialData?.averageHouseholdSize || undefined,
      populationDensity: initialData?.populationDensity || undefined,
      totalWards: initialData?.totalWards || undefined,
      totalLandArea: initialData?.totalLandArea || undefined,
      population0To14: initialData?.population0To14 || undefined,
      population15To59: initialData?.population15To59 || undefined,
      population60AndAbove: initialData?.population60AndAbove || undefined,
      growthRate: initialData?.growthRate || undefined,
      literacyRateAbove15: initialData?.literacyRateAbove15 || undefined,
      literacyRate15To24: initialData?.literacyRate15To24 || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    updateMutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">जनसंख्या आँकडा</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="totalPopulation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुल जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationMale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पुरुष जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationFemale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>महिला जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अन्य जनसंख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">अनुपस्थित जनसंख्या</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="populationAbsenteeTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुल अनुपस्थित</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationMaleAbsentee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पुरुष अनुपस्थित</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationFemaleAbsentee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>महिला अनुपस्थित</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">घरधुरी र घनत्व</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="totalHouseholds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुल घरधुरी</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="averageHouseholdSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>औसत घरधुरी आकार</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="populationDensity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>जनसंख्या घनत्व (प्रति वर्ग कि.मि.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sexRatio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>लिङ्ग अनुपात (प्रति १०० महिला)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalWards"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुल वडा संख्या</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalLandArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुल भूमि क्षेत्र (वर्ग कि.मि.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">उमेर समूह</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="population0To14"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>०-१४ वर्ष</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="population15To59"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>१५-५९ वर्ष</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="population60AndAbove"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>६० वर्ष र माथि</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-medium">वृद्धि र साक्षरता दर</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="growthRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>जनसंख्या वृद्धि दर (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="literacyRateAbove15"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>१५+ साक्षरता दर (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="literacyRate15To24"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>१५-२४ साक्षरता दर (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="px-6">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                सबमिट गर्दै...
              </>
            ) : (
              "सेव गर्नुहोस्"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
