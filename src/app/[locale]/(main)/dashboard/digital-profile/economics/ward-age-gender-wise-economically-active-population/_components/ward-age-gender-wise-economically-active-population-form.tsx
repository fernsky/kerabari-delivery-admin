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
import {
  EconomicallyActiveAgeGroupEnum,
  GenderEnum,
} from "@/server/api/routers/profile/economics/ward-age-gender-wise-economically-active-population.schema";
import { Card, CardContent } from "@/components/ui/card";

// Create a schema for the form matching the backend schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce
    .number()
    .int()
    .min(1, "वडा नम्बर १ वा सो भन्दा बढी हुनुपर्छ"),
  ageGroup: z.enum(EconomicallyActiveAgeGroupEnum.options),
  gender: z.enum(GenderEnum.options),
  population: z.coerce
    .number()
    .int("जनसंख्या पूर्णांक हुनुपर्छ")
    .nonnegative("जनसंख्या नेगेटिभ हुन सक्दैन")
    .default(0),
});

interface WardAgeGenderWiseEconomicallyActivePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get age group display names
const getAgeGroupOptions = () => [
  { value: "AGE_0_TO_14", label: "० देखि १४ वर्ष" },
  { value: "AGE_15_TO_59", label: "१५ देखि ५९ वर्ष" },
  { value: "AGE_60_PLUS", label: "६० वर्ष वा सोभन्दा बढी" },
];

// Helper function to get gender display names
const getGenderOptions = () => [
  { value: "MALE", label: "पुरुष" },
  { value: "FEMALE", label: "महिला" },
  { value: "OTHER", label: "अन्य" },
];

export default function WardAgeGenderWiseEconomicallyActivePopulationForm({
  editId,
  onClose,
  existingData,
}: WardAgeGenderWiseEconomicallyActivePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const utils = api.useContext();
  const ageGroupOptions = getAgeGroupOptions();
  const genderOptions = getGenderOptions();

  // Extract unique ward numbers from existing data
  const uniqueWardNumbers = Array.from(
    new Set(existingData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.create.useMutation(
      {
        onSuccess: () => {
          toast.success(
            "नयाँ वडा अनुसार उमेर, लिङ्ग र आर्थिक रुपमा सक्रिय जनसंख्या डाटा सफलतापूर्वक थपियो",
          );
          utils.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.invalidate();
          setIsSubmitting(false);
          onClose();
        },
        onError: (error) => {
          toast.error(`त्रुटि: ${error.message}`);
          setIsSubmitting(false);
        },
      },
    );

  const updateMutation =
    api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.update.useMutation(
      {
        onSuccess: () => {
          toast.success(
            "वडा अनुसार उमेर, लिङ्ग र आर्थिक रुपमा सक्रिय जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो",
          );
          utils.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.invalidate();
          setIsSubmitting(false);
          onClose();
        },
        onError: (error) => {
          toast.error(`त्रुटि: ${error.message}`);
          setIsSubmitting(false);
        },
      },
    );

  // Set up the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: undefined,
      ageGroup: undefined as any,
      gender: undefined as any,
      population: 0,
    },
  });

  // Watch for changes to check for duplicates
  const watchWardNumber = form.watch("wardNumber");
  const watchAgeGroup = form.watch("ageGroup");
  const watchGender = form.watch("gender");

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          ageGroup: recordToEdit.ageGroup as any,
          gender: recordToEdit.gender as any,
          population: recordToEdit.population || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  // Check for duplicate entries when form values change
  useEffect(() => {
    setDuplicateError(null);

    if (watchWardNumber && watchAgeGroup && watchGender && !editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === watchWardNumber &&
          item.ageGroup === watchAgeGroup &&
          item.gender === watchGender,
      );

      if (duplicate) {
        const ageGroupLabel =
          ageGroupOptions.find((opt) => opt.value === watchAgeGroup)?.label ||
          watchAgeGroup;
        const genderLabel =
          genderOptions.find((opt) => opt.value === watchGender)?.label ||
          watchGender;

        setDuplicateError(
          `वडा ${watchWardNumber} को लागि ${ageGroupLabel} उमेर समूह र ${genderLabel} लिङ्गको डाटा पहिले नै अवस्थित छ`,
        );
      }
    }
  }, [
    watchWardNumber,
    watchAgeGroup,
    watchGender,
    existingData,
    editId,
    ageGroupOptions,
    genderOptions,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Don't submit if there's a duplicate error
    if (duplicateError) {
      toast.error(duplicateError);
      return;
    }

    setIsSubmitting(true);

    // Prepare data for submission
    const dataToSubmit = {
      ...values,
      ageGroup:
        values.ageGroup as keyof typeof EconomicallyActiveAgeGroupEnum.Values,
      gender: values.gender as keyof typeof GenderEnum.Values,
      population: values.population ?? 0,
    };

    if (editId) {
      updateMutation.mutate(dataToSubmit);
    } else {
      createMutation.mutate(dataToSubmit);
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
              <h3 className="text-sm font-medium mb-3">जनसंख्या विवरण</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>उमेर समूह</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="उमेर समूह चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ageGroupOptions.map((option) => (
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>लिङ्ग</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="लिङ्ग चयन गर्नुहोस्" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map((option) => (
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
                  name="population"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>जनसंख्या</FormLabel>
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
