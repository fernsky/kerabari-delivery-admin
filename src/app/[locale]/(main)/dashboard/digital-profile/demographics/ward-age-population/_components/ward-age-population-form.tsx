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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  ageGroupEnum,
  genderEnum,
} from "@/server/api/routers/profile/demographics/ward-age-wise-population.schema";

type AgeGroup = z.infer<typeof ageGroupEnum>;
type Gender = z.infer<typeof genderEnum>;

// Create form schema
const formSchema = z.object({
  id: z.string().optional(),
  wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
  ageGroup: ageGroupEnum,
  gender: genderEnum,
  population: z.coerce
    .number()
    .int()
    .nonnegative("जनसंख्या शून्य वा त्यो भन्दा बढी हुनुपर्छ"),
});

interface WardAgeWisePopulationFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function WardAgeWisePopulationForm({
  editId,
  onClose,
  existingData,
}: WardAgeWisePopulationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  // Get the existing record if editing
  const { data: allData, isLoading: isLoadingEditData } =
    api.profile.demographics.wardAgeWisePopulation.getAll.useQuery();

  const createMutation =
    api.profile.demographics.wardAgeWisePopulation.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ उमेर अनुसार जनसंख्या डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardAgeWisePopulation.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardAgeWisePopulation.update.useMutation({
      onSuccess: () => {
        toast.success("उमेर अनुसार जनसंख्या डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardAgeWisePopulation.getAll.invalidate();
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
      ageGroup: undefined as unknown as AgeGroup,
      gender: undefined as unknown as Gender,
      population: 0,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId && allData) {
      const recordToEdit = allData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          ageGroup: recordToEdit.ageGroup,
          gender: recordToEdit.gender,
          population: recordToEdit.population,
        });
      }
    }
  }, [editId, allData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check for duplicates only when creating new record
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.ageGroup === values.ageGroup &&
          item.gender === values.gender,
      );

      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} को लागि उमेर समूह ${getAgeGroupLabel(values.ageGroup)} र लिङ्ग ${getGenderLabel(values.gender)} को डाटा पहिले नै अवस्थित छ`,
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

  const getAgeGroupLabel = (ageGroup: AgeGroup): string => {
    switch (ageGroup) {
      case "AGE_0_4":
        return "०-४ वर्ष";
      case "AGE_5_9":
        return "५-९ वर्ष";
      case "AGE_10_14":
        return "१०-१४ वर्ष";
      case "AGE_15_19":
        return "१५-१९ वर्ष";
      case "AGE_20_24":
        return "२०-२४ वर्ष";
      case "AGE_25_29":
        return "२५-२९ वर्ष";
      case "AGE_30_34":
        return "३०-३४ वर्ष";
      case "AGE_35_39":
        return "३५-३९ वर्ष";
      case "AGE_40_44":
        return "४०-४४ वर्ष";
      case "AGE_45_49":
        return "४५-४९ वर्ष";
      case "AGE_50_54":
        return "५०-५४ वर्ष";
      case "AGE_55_59":
        return "५५-५९ वर्ष";
      case "AGE_60_64":
        return "६०-६४ वर्ष";
      case "AGE_65_69":
        return "६५-६९ वर्ष";
      case "AGE_70_74":
        return "७०-७४ वर्ष";
      case "AGE_75_AND_ABOVE":
        return "७५+ वर्ष";
    }
  };

  const getGenderLabel = (gender: Gender): string => {
    switch (gender) {
      case "MALE":
        return "पुरुष";
      case "FEMALE":
        return "महिला";
      case "OTHER":
        return "अन्य";
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
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>लिङ्ग</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="लिङ्ग छान्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">पुरुष</SelectItem>
                    <SelectItem value="FEMALE">महिला</SelectItem>
                    <SelectItem value="OTHER">अन्य</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>उमेर समूह</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="उमेर समूह छान्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AGE_0_4">०-४ वर्ष</SelectItem>
                    <SelectItem value="AGE_5_9">५-९ वर्ष</SelectItem>
                    <SelectItem value="AGE_10_14">१०-१४ वर्ष</SelectItem>
                    <SelectItem value="AGE_15_19">१५-१९ वर्ष</SelectItem>
                    <SelectItem value="AGE_20_24">२०-२४ वर्ष</SelectItem>
                    <SelectItem value="AGE_25_29">२५-२९ वर्ष</SelectItem>
                    <SelectItem value="AGE_30_34">३०-३४ वर्ष</SelectItem>
                    <SelectItem value="AGE_35_39">३५-३९ वर्ष</SelectItem>
                    <SelectItem value="AGE_40_44">४०-४४ वर्ष</SelectItem>
                    <SelectItem value="AGE_45_49">४५-४९ वर्ष</SelectItem>
                    <SelectItem value="AGE_50_54">५०-५४ वर्ष</SelectItem>
                    <SelectItem value="AGE_55_59">५५-५९ वर्ष</SelectItem>
                    <SelectItem value="AGE_60_64">६०-६४ वर्ष</SelectItem>
                    <SelectItem value="AGE_65_69">६५-६९ वर्ष</SelectItem>
                    <SelectItem value="AGE_70_74">७०-७४ वर्ष</SelectItem>
                    <SelectItem value="AGE_75_AND_ABOVE">७५+ वर्ष</SelectItem>
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
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
