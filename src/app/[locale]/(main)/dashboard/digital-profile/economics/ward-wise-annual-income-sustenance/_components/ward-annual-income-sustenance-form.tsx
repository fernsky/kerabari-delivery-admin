"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  MonthsSustainedEnum,
  monthsSustainedLabels,
} from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

// Create a schema for the form matching the backend schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce
    .number()
    .int()
    .min(1, "वडा नम्बर १ वा सो भन्दा बढी हुनुपर्छ"),
  monthsSustained: z.string().min(1, "महिनाको अवधि श्रेणी आवश्यक छ"),
  households: z.coerce
    .number()
    .int("घरपरिवार संख्या पूर्णांक हुनुपर्छ")
    .nonnegative("घरपरिवार संख्या नेगेटिभ हुन सक्दैन")
    .default(0),
});

interface WardAnnualIncomeSustenanceFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get months sustained display options
const getMonthsSustainedOptions = () =>
  Object.entries(monthsSustainedLabels).map(([value, label]) => ({
    value,
    label,
  }));

export default function WardAnnualIncomeSustenanceForm({
  editId,
  onClose,
  existingData,
}: WardAnnualIncomeSustenanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const utils = api.useContext();
  const monthsSustainedOptions = getMonthsSustainedOptions();

  // Extract unique ward numbers from existing data
  const uniqueWardNumbers = Array.from(
    new Set(existingData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.wardWiseAnnualIncomeSustenance.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const addMutation =
    api.profile.economics.wardWiseAnnualIncomeSustenance.add.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.economics.wardWiseAnnualIncomeSustenance.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  // Set up the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: undefined,
      monthsSustained: "",
      households: 0,
    },
  });

  // Watch for changes to check for duplicates
  const watchWardNumber = form.watch("wardNumber");
  const watchMonthsSustained = form.watch("monthsSustained");

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          monthsSustained: recordToEdit.monthsSustained,
          households: recordToEdit.households || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  // Check for duplicate entries when form values change
  useEffect(() => {
    setDuplicateError(null);

    if (watchWardNumber && watchMonthsSustained && !editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === watchWardNumber &&
          item.monthsSustained === watchMonthsSustained,
      );

      if (duplicate) {
        const monthsSustainedLabel =
          monthsSustainedOptions.find(
            (opt) => opt.value === watchMonthsSustained,
          )?.label || watchMonthsSustained;

        setDuplicateError(
          `वडा ${watchWardNumber} को लागि "${monthsSustainedLabel}" महिनाको अवधि श्रेणीको डाटा पहिले नै अवस्थित छ`,
        );
      }
    }
  }, [
    watchWardNumber,
    watchMonthsSustained,
    existingData,
    editId,
    monthsSustainedOptions,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Don't submit if there's a duplicate error
    if (duplicateError) {
      toast.error(duplicateError);
      return;
    }

    setIsSubmitting(true);

    // For editing, we'll collect all the months sustained categories for this ward
    // and submit them together with our updated/new value
    if (editId) {
      // Get all existing entries for this ward
      const wardData = existingData.filter(
        (item) => item.wardNumber === values.wardNumber && item.id !== editId,
      );

      // Create an array of all months sustained categories for this ward
      const dataToSubmit = {
        wardNumber: values.wardNumber,
        data: [
          ...wardData.map((item) => ({
            monthsSustained:
              item.monthsSustained as keyof typeof MonthsSustainedEnum.Values,
            households: item.households,
          })),
          {
            monthsSustained:
              values.monthsSustained as keyof typeof MonthsSustainedEnum.Values,
            households: values.households,
          },
        ],
      };

      addMutation.mutate(dataToSubmit);
    } else {
      // For new entries
      const dataToSubmit = {
        wardNumber: values.wardNumber,
        data: [
          {
            monthsSustained:
              values.monthsSustained as keyof typeof MonthsSustainedEnum.Values,
            households: values.households,
          },
        ],
      };

      addMutation.mutate(dataToSubmit);
    }
  };

  if (editId && isLoadingEditData) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">डाटा लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {duplicateError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{duplicateError}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">वडा विवरण</h3>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="wardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>वडा नम्बर</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          field.onChange(parseInt(value, 10));
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="वडा चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Include both existing and new ward numbers (1-32) */}
                          {Array.from({ length: 32 }, (_, i) => i + 1).map(
                            (num) => (
                              <SelectItem
                                key={`ward-${num}`}
                                value={num.toString()}
                              >
                                वडा {num}{" "}
                                {uniqueWardNumbers.includes(num)
                                  ? "(अवस्थित)"
                                  : "(नयाँ)"}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        वडा नम्बर १ देखि ३२ सम्म मात्र हुन सक्छ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-muted/40 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">
                वार्षिक आम्दानी विवरण
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="monthsSustained"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        वार्षिक आम्दानीले धान्ने महिनाको अवधि
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="महिनाको अवधि श्रेणी चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {monthsSustainedOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="households"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>घरपरिवार संख्या</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value === "" ? "0" : e.target.value;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                रद्द गर्नुहोस्
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!duplicateError}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    सबमिट गर्दै...
                  </>
                ) : editId ? (
                  "अपडेट गर्नुहोस्"
                ) : (
                  "सेभ गर्नुहोस्"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
