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
  wardName: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "लिङ्ग चयन गर्नुहोस्",
  }),
  population: z.coerce
    .number()
    .int()
    .nonnegative("जनसंख्या 0 वा सकारात्मक हुनुपर्छ"),
});

type Gender = "MALE" | "FEMALE" | "OTHER";

interface WardWiseHouseHeadGenderData {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  gender: Gender;
  population: number;
}

interface WardWiseHouseHeadGenderFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: WardWiseHouseHeadGenderData[];
}

export default function WardWiseHouseHeadGenderForm({
  editId,
  onClose,
  existingData,
}: WardWiseHouseHeadGenderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  const createMutation =
    api.profile.demographics.wardWiseHouseHeadGender.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ घरमूली लिङ्ग डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardWiseHouseHeadGender.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardWiseHouseHeadGender.update.useMutation({
      onSuccess: () => {
        toast.success("घरमूली लिङ्ग डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardWiseHouseHeadGender.getAll.invalidate();
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
      gender: undefined,
      population: 0,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId) {
      const recordToEdit = existingData.find((record) => record.id === editId);
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          wardName: recordToEdit.wardName || "",
          gender: recordToEdit.gender,
          population: recordToEdit.population,
        });
      }
    } else {
      form.reset({
        wardNumber: undefined,
        wardName: "",
        gender: undefined,
        population: 0,
      });
    }
  }, [editId, existingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check if a record already exists with this ward and gender (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.gender === values.gender,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber} र लिङ्ग ${values.gender} को डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    if (editId) {
      updateMutation.mutate({ ...values, id: editId });
    } else {
      createMutation.mutate(values);
    }
  };

  const genderOptions = [
    { value: "MALE", label: "पुरुष" },
    { value: "FEMALE", label: "महिला" },
    { value: "OTHER", label: "अन्य" },
  ];

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
                <FormLabel>घरधुरी संख्या</FormLabel>
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
