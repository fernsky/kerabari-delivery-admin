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
import { LanguageTypeEnum } from "@/server/api/routers/profile/demographics/ward-wise-mother-tongue-population.schema";

// Create a schema for the form that aligns with the backend schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  languageType: z.nativeEnum(LanguageTypeEnum.Values, {
    errorMap: () => ({ message: "मातृभाषा आवश्यक छ" }),
  }),
  population: z.coerce.number().int().nonnegative().default(0),
  // Additional fields for UI purposes only
  wardName: z.string().optional(),
  percentage: z.string().optional(),
});

interface WardWiseMotherTonguePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get language display names
const getLanguageOptions = () => {
  const enumValues = Object.values(LanguageTypeEnum.Values);
  return enumValues.map((value) => ({
    value,
    label: value, // Using the enum value directly as label
  }));
};

export default function WardWiseMotherTonguePopulationForm({
  editId,
  onClose,
  existingData,
}: WardWiseMotherTonguePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();
  const languageOptions = getLanguageOptions();

  // Get unique wards from existing data
  const uniqueWards = Array.from(
    new Set(
      existingData.map((item) => ({
        id: String(item.wardNumber || ""),
        number: item.wardNumber || parseInt(item.id),
        name: item.wardName || "",
      })),
    ),
  ).sort((a, b) => a.number - b.number);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseMotherTonguePopulation.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseMotherTonguePopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ मातृभाषा जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseMotherTonguePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseMotherTonguePopulation.update.useMutation({
      onSuccess: () => {
        toast.success("मातृभाषा जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseMotherTonguePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  // Set up the form with proper defaults
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: undefined,
      wardName: "",
      languageType:
        undefined as unknown as keyof typeof LanguageTypeEnum.Values,
      population: 0,
      percentage: "",
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
          wardName: (recordToEdit as any).wardName || "",
          languageType: recordToEdit.languageType,
          population: recordToEdit.population || 0,
          percentage: (recordToEdit as any).percentage || "",
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and language (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.languageType === values.languageType,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} को लागि ${values.languageType} मातृभाषाको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Format data to match the expected schema for mutations
    const dataToSubmit = {
      id: values.id,
      wardNumber: values.wardNumber,
      languageType: values.languageType as keyof typeof LanguageTypeEnum.Values,
      population: values.population,
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
                      field.onChange(parseInt(value, 10));
                      // Update ward name if available
                      const selectedWard = uniqueWards.find(
                        (ward) => ward.number.toString() === value,
                      );
                      if (selectedWard) {
                        form.setValue("wardName", selectedWard.name);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="वडा चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueWards.map((ward) => (
                        <SelectItem
                          key={ward.id}
                          value={ward.number.toString()}
                        >
                          वडा {ward.number}
                        </SelectItem>
                      ))}
                      {/* Allow adding new wards */}
                      {Array.from({ length: 32 }, (_, i) => i + 1)
                        .filter(
                          (num) =>
                            !uniqueWards.some((ward) => ward.number === num),
                        )
                        .map((num) => (
                          <SelectItem key={`new-${num}`} value={num.toString()}>
                            वडा {num} (नयाँ)
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
            name="wardName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडाको नाम</FormLabel>
                <FormControl>
                  <Input placeholder="बुद्धशान्ति वडा १" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">मातृभाषा विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="languageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>मातृभाषा</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(
                          value as keyof typeof LanguageTypeEnum.Values,
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="मातृभाषा चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
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
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? "0" : e.target.value;
                        field.onChange(parseInt(value, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रतिशत (%)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="0.00%" {...field} />
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
