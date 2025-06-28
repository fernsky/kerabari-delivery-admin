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

// Create a schema for the form
const formSchema = z
  .object({
    id: z.string().optional(),
    wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
    wardName: z.string().optional(),
    totalPopulation: z.coerce.number().int().nonnegative().optional(),
    populationMale: z.coerce.number().int().nonnegative().optional(),
    populationFemale: z.coerce.number().int().nonnegative().optional(),
    populationOther: z.coerce.number().int().nonnegative().optional(),
    totalHouseholds: z.coerce.number().int().nonnegative().optional(),
    averageHouseholdSize: z.coerce.number().nonnegative().optional(),
    sexRatio: z.coerce.number().nonnegative().optional(),
  })
  .refine(
    (data) => {
      // If any of the gender populations are provided, make sure they add up to totalPopulation
      const {
        populationMale,
        populationFemale,
        populationOther,
        totalPopulation,
      } = data;
      if (
        populationMale ||
        populationFemale ||
        populationOther ||
        totalPopulation
      ) {
        const genderSum =
          (populationMale || 0) +
          (populationFemale || 0) +
          (populationOther || 0);
        if (totalPopulation && genderSum > 0 && genderSum !== totalPopulation) {
          return false;
        }
      }
      return true;
    },
    {
      message: "लिङ्ग जनसंख्याको कुल कुल जनसंख्या बराबर हुनुपर्छ",
      path: ["totalPopulation"],
    },
  );

interface WardWiseDemographicSummaryFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function WardWiseDemographicSummaryForm({
  editId,
  onClose,
  existingData,
}: WardWiseDemographicSummaryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardWiseDemographicSummary.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardWiseDemographicSummary.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ वडा जनसांख्यिकी डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseDemographicSummary.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseDemographicSummary.update.useMutation({
      onSuccess: () => {
        toast.success("वडा जनसांख्यिकी डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseDemographicSummary.getAll.invalidate();
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
          wardName: recordToEdit.wardName || "",
          totalPopulation: recordToEdit.totalPopulation || undefined,
          populationMale: recordToEdit.populationMale || undefined,
          populationFemale: recordToEdit.populationFemale || undefined,
          populationOther: recordToEdit.populationOther || undefined,
          totalHouseholds: recordToEdit.totalHouseholds || undefined,
          averageHouseholdSize: recordToEdit.averageHouseholdSize
            ? parseFloat(recordToEdit.averageHouseholdSize.toString())
            : undefined,
          sexRatio: recordToEdit.sexRatio
            ? parseFloat(recordToEdit.sexRatio.toString())
            : undefined,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) => item.wardNumber === values.wardNumber,
      );
      if (duplicate) {
        toast.error(`वडा ${values.wardNumber} को लागि डाटा पहिले नै अवस्थित छ`);
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
                  <Input type="number" placeholder="1" {...field} />
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
          <h3 className="text-lg font-medium mb-4">जनसंख्या विवरण</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <FormField
              control={form.control}
              name="totalHouseholds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जम्मा घरधुरी</FormLabel>
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
              name="sexRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>लिङ्ग अनुपात</FormLabel>
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
