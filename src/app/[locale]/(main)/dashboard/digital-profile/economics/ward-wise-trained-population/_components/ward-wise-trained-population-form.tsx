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

// Create a schema for the form
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  trainedPopulation: z.coerce.number().int().nonnegative(),
});

interface WardWiseTrainedPopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function WardWiseTrainedPopulationForm({
  editId,
  onClose,
  existingData,
}: WardWiseTrainedPopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get unique ward numbers from existing data
  const uniqueWardNumbers = Array.from(
    new Set(existingData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.wardWiseTrainedPopulation.getAll.useQuery(undefined, {
      enabled: !!editId,
    });

  const createMutation =
    api.profile.economics.wardWiseTrainedPopulation.create.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार तालिम प्राप्त जनसंख्या डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.economics.wardWiseTrainedPopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.economics.wardWiseTrainedPopulation.update.useMutation({
      onSuccess: () => {
        toast.success(
          "वडा अनुसार तालिम प्राप्त जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो",
        );
        utils.profile.economics.wardWiseTrainedPopulation.getAll.invalidate();
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
      trainedPopulation: 0,
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
          trainedPopulation: recordToEdit.trainedPopulation || 0,
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
        toast.error(
          `वडा ${values.wardNumber} को लागि तालिम प्राप्त जनसंख्या डाटा पहिले नै अवस्थित छ`,
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
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="wardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वडा नम्बर</FormLabel>
                <FormControl>
                  <Select
                    value={field.value?.toString()}
                    onValueChange={(value) => {
                      field.onChange(parseInt(value, 10));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="वडा नम्बर चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Allow selecting from existing ward numbers */}
                      {Array.from({ length: 32 }, (_, i) => i + 1)
                        .filter(
                          (num) =>
                            !uniqueWardNumbers.includes(num) ||
                            (editId && form.getValues().wardNumber === num),
                        )
                        .map((num) => (
                          <SelectItem
                            key={`ward-${num}`}
                            value={num.toString()}
                          >
                            वडा {num}{" "}
                            {uniqueWardNumbers.includes(num) &&
                            editId &&
                            form.getValues().wardNumber !== num
                              ? "(पहिले नै अवस्थित)"
                              : ""}
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
            तालिम प्राप्त जनसंख्या विवरण
          </h3>

          <FormField
            control={form.control}
            name="trainedPopulation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>तालिम प्राप्त जनसंख्या</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
