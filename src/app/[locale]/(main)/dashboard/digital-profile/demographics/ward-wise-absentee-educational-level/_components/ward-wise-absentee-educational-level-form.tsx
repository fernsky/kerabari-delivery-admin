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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { educationalLevelEnum } from "@/server/db/schema/profile/demographics/ward-wise-absentee-educational-level";
import type { WardWiseAbsenteeEducationalLevelData } from "@/server/api/routers/profile/demographics/ward-wise-absentee-educational-level.schema";

// Create education level options
const educationalLevelOptions = [
  { value: "CHILD_DEVELOPMENT_CENTER", label: "बालविकास केन्द्र / मंटेस्वोरी" },
  { value: "NURSERY", label: "नर्सरी/केजी" },
  { value: "CLASS_1", label: "कक्षा १" },
  { value: "CLASS_2", label: "कक्षा २" },
  { value: "CLASS_3", label: "कक्षा ३" },
  { value: "CLASS_4", label: "कक्षा ४" },
  { value: "CLASS_5", label: "कक्षा ५" },
  { value: "CLASS_6", label: "कक्षा ६" },
  { value: "CLASS_7", label: "कक्षा ७" },
  { value: "CLASS_8", label: "कक्षा ८" },
  { value: "CLASS_9", label: "कक्षा ९" },
  { value: "CLASS_10", label: "कक्षा १०" },
  { value: "SLC_LEVEL", label: "एसईई/एसएलसी/सो सरह" },
  { value: "CLASS_12_LEVEL", label: "कक्षा १२ वा PCL वा सो सरह" },
  { value: "BACHELOR_LEVEL", label: "स्नातक वा सो सरह" },
  { value: "MASTERS_LEVEL", label: "स्नातकोत्तर वा सो सरह" },
  { value: "PHD_LEVEL", label: "पीएचडी वा सो सरह" },
  { value: "OTHER", label: "अन्य शैक्षिक योग्यता" },
  { value: "INFORMAL_EDUCATION", label: "अनौपचारिक शिक्षा" },
  { value: "EDUCATED", label: "साक्षर" },
  { value: "UNKNOWN", label: "थाहा नभएको" },
];

// Create a schema for the form that matches the server schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().positive("वडा नम्बर आवश्यक छ"),
  educationalLevel: z.enum(educationalLevelEnum.enumValues, {
    errorMap: () => ({ message: "शैक्षिक स्तर आवश्यक छ" }),
  }),
  population: z.coerce.number().int().nonnegative("जनसंख्या 0 वा बढी हुनुपर्छ"),
});

interface WardWiseAbsenteeEducationalLevelFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: WardWiseAbsenteeEducationalLevelData[];
}

export default function WardWiseAbsenteeEducationalLevelForm({
  editId,
  onClose,
  existingData,
}: WardWiseAbsenteeEducationalLevelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get ward data for selection
  const { data: wardData } =
    api.profile.demographics.wardWiseDemographicSummary.getAll.useQuery();

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseAbsenteeEducationalLevel.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseAbsenteeEducationalLevel.create.useMutation(
      {
        onSuccess: () => {
          toast.success("नयाँ अनुपस्थित शैक्षिक स्तर डाटा सफलतापूर्वक थपियो");
          utils.profile.demographics.wardWiseAbsenteeEducationalLevel.getAll.invalidate();
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
    api.profile.demographics.wardWiseAbsenteeEducationalLevel.update.useMutation(
      {
        onSuccess: () => {
          toast.success("अनुपस्थित शैक्षिक स्तर डाटा सफलतापूर्वक अपडेट गरियो");
          utils.profile.demographics.wardWiseAbsenteeEducationalLevel.getAll.invalidate();
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
      educationalLevel: undefined,
      population: undefined,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId && editingData) {
      const recordToEdit = editingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          educationalLevel: recordToEdit.educationalLevel,
          population: recordToEdit.population,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and educational level (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.educationalLevel === values.educationalLevel,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} को लागि यो शैक्षिक स्तरको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    if (editId) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  if (editId && isLoadingEditData) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <span className="ml-2">डाटा लोड गर्दै...</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडा नम्बर</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(value) => {
                      const wardNumber = parseInt(value);
                      field.onChange(wardNumber);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="वडा नम्बर चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {wardData?.map((ward) => (
                        <SelectItem
                          key={ward.id}
                          value={ward.wardNumber.toString()}
                        >
                          वडा {ward.wardNumber}{" "}
                          {ward.wardName ? `- ${ward.wardName}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            अनुपस्थित शैक्षिक स्तर विवरण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="educationalLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>शैक्षिक स्तर</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="शैक्षिक स्तर चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationalLevelOptions.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
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
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            रद्द गर्नुहोस्
          </Button>
          <Button type="submit" disabled={isSubmitting}>
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
  );
}
