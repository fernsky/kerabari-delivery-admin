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
import {
  AbsenteeAgeGroupEnum,
  GenderEnum,
} from "@/server/api/routers/profile/demographics/ward-age-gender-wise-absentee.schema";

// Create a schema for the form that matches the backend schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  ageGroup: z.string().min(1, "उमेर समूह आवश्यक छ"),
  gender: z.string().min(1, "लिङ्ग आवश्यक छ"),
  population: z.coerce.number().int().nonnegative().optional(),
});

interface WardAgeGenderWiseAbsenteeFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

// Helper function to get age group display names
const getAgeGroupOptions = () => {
  const enumValues = Object.values(AbsenteeAgeGroupEnum.Values);
  return enumValues.map((value) => {
    let label;
    switch (value) {
      case "AGE_0_4":
        label = "०-४ वर्ष";
        break;
      case "AGE_5_9":
        label = "५-९ वर्ष";
        break;
      case "AGE_10_14":
        label = "१०-१४ वर्ष";
        break;
      case "AGE_15_19":
        label = "१५-१९ वर्ष";
        break;
      case "AGE_20_24":
        label = "२०-२४ वर्ष";
        break;
      case "AGE_25_29":
        label = "२५-२९ वर्ष";
        break;
      case "AGE_30_34":
        label = "३०-३४ वर्ष";
        break;
      case "AGE_35_39":
        label = "३५-३९ वर्ष";
        break;
      case "AGE_40_44":
        label = "४०-४४ वर्ष";
        break;
      case "AGE_45_49":
        label = "४५-४९ वर्ष";
        break;
      case "AGE_50_AND_ABOVE":
        label = "५० वर्ष भन्दा माथि";
        break;
      default:
        label = value;
    }
    return { value, label };
  });
};

// Helper function to get gender display names
const getGenderOptions = () => {
  const enumValues = Object.values(GenderEnum.Values);
  return enumValues.map((value) => {
    let label;
    switch (value) {
      case "MALE":
        label = "पुरुष";
        break;
      case "FEMALE":
        label = "महिला";
        break;
      case "OTHER":
        label = "अन्य";
        break;
      default:
        label = value;
    }
    return { value, label };
  });
};

export default function WardAgeGenderWiseAbsenteeForm({
  editId,
  onClose,
  existingData,
}: WardAgeGenderWiseAbsenteeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();
  const ageGroupOptions = getAgeGroupOptions();
  const genderOptions = getGenderOptions();

  // Get unique wards from existing data
  const uniqueWards = Array.from(
    new Set(
      existingData.map((item) => ({
        number: item.wardNumber || 0,
      })),
    ),
  ).sort((a, b) => a.number - b.number);

  // Get the existing record if editing
  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardAgeGenderWiseAbsentee.getAll.useQuery(
      undefined,
      {
        enabled: !!editId,
      },
    );

  const createMutation =
    api.profile.demographics.wardAgeGenderWiseAbsentee.create.useMutation({
      onSuccess: () => {
        toast.success(
          "नयाँ वडा अनुसार उमेर र लिङ्ग प्रवासी डाटा सफलतापूर्वक थपियो",
        );
        utils.profile.demographics.wardAgeGenderWiseAbsentee.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardAgeGenderWiseAbsentee.update.useMutation({
      onSuccess: () => {
        toast.success(
          "वडा अनुसार उमेर र लिङ्ग प्रवासी डाटा सफलतापूर्वक अपडेट गरियो",
        );
        utils.profile.demographics.wardAgeGenderWiseAbsentee.getAll.invalidate();
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
      ageGroup: "",
      gender: "",
      population: 0,
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
          ageGroup: recordToEdit.ageGroup,
          gender: recordToEdit.gender,
          population: recordToEdit.population || 0,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward, age group, and gender (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.ageGroup === values.ageGroup &&
          item.gender === values.gender,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} को लागि ${values.ageGroup} उमेर समूह र ${values.gender} लिङ्गको डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    // Ensure population has a default value of 0 if it's undefined
    const dataToSubmit = {
      ...values,
      population: values.population ?? 0,
      ageGroup: values.ageGroup as keyof typeof AbsenteeAgeGroupEnum.Values,
      gender: values.gender as keyof typeof GenderEnum.Values,
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
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
                      <SelectValue placeholder="वडा चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueWards.map((ward) => (
                        <SelectItem
                          key={ward.number}
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
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            उमेर, लिङ्ग र प्रवासी विवरण
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ageGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>उमेर समूह</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="उमेर समूह चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroupOptions.map((ageGroup) => (
                          <SelectItem
                            key={ageGroup.value}
                            value={ageGroup.value}
                          >
                            {ageGroup.label}
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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>लिङ्ग</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="लिङ्ग चयन गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.label}
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
                  <FormLabel>प्रवासी जनसंख्या</FormLabel>
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
