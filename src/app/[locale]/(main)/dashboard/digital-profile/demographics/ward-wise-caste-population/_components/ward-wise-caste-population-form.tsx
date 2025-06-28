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
import { casteOptions } from "@/server/api/routers/profile/demographics/ward-wise-caste-population.schema";
import { CasteTypes } from "@/server/db/schema/common/enums";

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  wardName: z.string().optional(),
  casteType: z.string().min(1, "जात/जनजाति नाम आवश्यक छ"),
  population: z.coerce.number().int().nonnegative().optional(),
  households: z.coerce.number().int().nonnegative().optional(),
  percentage: z.coerce.number().nonnegative().max(100).optional(),
});

interface WardWiseCastePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function WardWiseCastePopulationForm({
  editId,
  onClose,
  existingData,
}: WardWiseCastePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get unique wards from existing data
  const uniqueWards = Array.from(
    new Set(existingData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseCastePopulation.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseCastePopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ जात/जनजाति जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseCastePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseCastePopulation.update.useMutation({
      onSuccess: () => {
        toast.success("जात/जनजाति जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseCastePopulation.getAll.invalidate();
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
      wardName: "",
      casteType: "",
      population: undefined,
      households: undefined,
      percentage: undefined,
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
          casteType: recordToEdit.casteType,
          population: recordToEdit.population || undefined,
          households: undefined,
          percentage: undefined,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and caste (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.casteType === values.casteType,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} को लागि ${values.casteType} जात/जनजातिको डाटा पहिले नै अवस्थित छ`,
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
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="वडा नम्बर चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueWards.map((ward) => (
                        <SelectItem key={ward} value={ward.toString()}>
                          वडा {ward}
                        </SelectItem>
                      ))}
                      {/* Allow adding new wards */}
                      {Array.from({ length: 32 }, (_, i) => i + 1)
                        .filter((ward) => !uniqueWards.includes(ward))
                        .map((ward) => (
                          <SelectItem
                            key={`new-${ward}`}
                            value={ward.toString()}
                          >
                            वडा {ward}
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
          <h3 className="text-lg font-medium mb-4">जात/जनजाति विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="casteType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जात/जनजाति</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="जात/जनजाति चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {casteOptions.map((caste) => (
                          <SelectItem key={caste.value} value={caste.value}>
                            {caste.label}
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

            <FormField
              control={form.control}
              name="households"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरधुरी</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
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
