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
  AgeGroupEnum,
  MaritalStatusEnum,
  getAgeGroupDisplayName,
  getMaritalStatusDisplayName,
} from "@/server/api/routers/profile/demographics/ward-age-wise-marital-status.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Create a schema for the form
const formSchema = z
  .object({
    id: z.string().optional(),
    wardNumber: z.coerce.number().int().min(1, "वडा नम्बर आवश्यक छ"),
    ageGroup: z.string({
      required_error: "उमेर समूह चयन गर्नुहोस्",
    }),
    maritalStatus: z.string({
      required_error: "वैवाहिक स्थिति चयन गर्नुहोस्",
    }),
    population: z.coerce
      .number()
      .int()
      .nonnegative("जनसंख्या 0 वा सकारात्मक हुनुपर्छ")
      .optional(),
    malePopulation: z.coerce
      .number()
      .int()
      .nonnegative("पुरुष जनसंख्या 0 वा सकारात्मक हुनुपर्छ"),
    femalePopulation: z.coerce
      .number()
      .int()
      .nonnegative("महिला जनसंख्या 0 वा सकारात्मक हुनुपर्छ"),
    otherPopulation: z.coerce
      .number()
      .int()
      .nonnegative("अन्य जनसंख्या 0 वा सकारात्मक हुनुपर्छ")
      .default(0),
  })
  .refine(
    (data) => {
      // If direct population is provided, it's valid
      if (data.population !== undefined && data.population !== null)
        return true;

      // Otherwise ensure at least one gender population is provided
      const total =
        (data.malePopulation || 0) +
        (data.femalePopulation || 0) +
        (data.otherPopulation || 0);
      return total > 0;
    },
    {
      message: "कम्तिमा एउटा जनसंख्या दर्ता गर्नुहोस्",
      path: ["population"],
    },
  );

interface AgeWiseMaritalStatusData {
  id: string;
  wardNumber: number;
  ageGroup: string;
  maritalStatus: string;
  population?: number | null;
  malePopulation?: number | null;
  femalePopulation?: number | null;
  otherPopulation?: number | null;
}

interface AgeWiseMaritalStatusFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: AgeWiseMaritalStatusData[];
}

export default function AgeWiseMaritalStatusForm({
  editId,
  onClose,
  existingData,
}: AgeWiseMaritalStatusFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputMethod, setInputMethod] = useState<"total" | "byGender">(
    "byGender",
  );
  const utils = api.useContext();

  const createMutation =
    api.profile.demographics.wardAgeWiseMaritalStatus.create.useMutation({
      onSuccess: () => {
        toast.success("नयाँ वैवाहिक स्थिति डाटा सफलतापूर्वक थपियो");
        utils.profile.demographics.wardAgeWiseMaritalStatus.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    });

  const updateMutation =
    api.profile.demographics.wardAgeWiseMaritalStatus.update.useMutation({
      onSuccess: () => {
        toast.success("वैवाहिक स्थिति डाटा सफलतापूर्वक अपडेट गरियो");
        utils.profile.demographics.wardAgeWiseMaritalStatus.getAll.invalidate();
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
      ageGroup: undefined,
      maritalStatus: undefined,
      population: undefined,
      malePopulation: 0,
      femalePopulation: 0,
      otherPopulation: 0,
    },
  });

  // Populate the form when editing
  useEffect(() => {
    if (editId) {
      const recordToEdit = existingData.find((record) => record.id === editId);
      if (recordToEdit) {
        const hasGenderData =
          recordToEdit.malePopulation !== null ||
          recordToEdit.femalePopulation !== null ||
          recordToEdit.otherPopulation !== null;

        setInputMethod(hasGenderData ? "byGender" : "total");

        form.reset({
          id: recordToEdit.id,
          wardNumber: recordToEdit.wardNumber,
          ageGroup: recordToEdit.ageGroup,
          maritalStatus: recordToEdit.maritalStatus,
          population: recordToEdit.population || undefined,
          malePopulation: recordToEdit.malePopulation || 0,
          femalePopulation: recordToEdit.femalePopulation || 0,
          otherPopulation: recordToEdit.otherPopulation || 0,
        });
      }
    } else {
      form.reset({
        wardNumber: undefined,
        ageGroup: undefined,
        maritalStatus: undefined,
        population: undefined,
        malePopulation: 0,
        femalePopulation: 0,
        otherPopulation: 0,
      });
    }
  }, [editId, existingData, form]);

  // Calculate total population when gender populations change
  useEffect(() => {
    if (inputMethod === "byGender") {
      const malePopulation = form.watch("malePopulation") || 0;
      const femalePopulation = form.watch("femalePopulation") || 0;
      const otherPopulation = form.watch("otherPopulation") || 0;

      const total = malePopulation + femalePopulation + otherPopulation;
      form.setValue("population", total);
    }
  }, [
    form.watch("malePopulation"),
    form.watch("femalePopulation"),
    form.watch("otherPopulation"),
    inputMethod,
    form,
  ]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Calculate total population if using gender breakdown
    if (inputMethod === "byGender") {
      values.population =
        (values.malePopulation || 0) +
        (values.femalePopulation || 0) +
        (values.otherPopulation || 0);
    } else {
      // If using total input method, clear gender breakdown
      values.malePopulation = 0;
      values.femalePopulation = 0;
      values.otherPopulation = 0;
    }

    // Check if a record already exists with this ward, age group and marital status (for new records)
    if (!editId) {
      const duplicate = existingData.find(
        (item) =>
          item.wardNumber === values.wardNumber &&
          item.ageGroup === values.ageGroup &&
          item.maritalStatus === values.maritalStatus,
      );
      if (duplicate) {
        toast.error(
          `वडा ${values.wardNumber}, उमेर समूह "${getAgeGroupDisplayName(values.ageGroup as any)}" र वैवाहिक स्थिति "${getMaritalStatusDisplayName(values.maritalStatus as any)}" को डाटा पहिले नै अवस्थित छ`,
        );
        setIsSubmitting(false);
        return;
      }
    }

    if (editId) {
      //@ts-ignore
      updateMutation.mutate({ ...values, id: editId });
    } else {
      //@ts-ignore
      createMutation.mutate(values);
    }
  };

  // Get age group options
  const ageGroupOptions = Object.values(AgeGroupEnum._def.values).map(
    (value) => ({
      value,
      label: getAgeGroupDisplayName(value as any),
    }),
  );

  // Get marital status options
  const maritalStatusOptions = Object.values(MaritalStatusEnum._def.values).map(
    (value) => ({
      value,
      label: getMaritalStatusDisplayName(value as any),
    }),
  );

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
            name="ageGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>उमेर समूह</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वैवाहिक स्थिति</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="वैवाहिक स्थिति चयन गर्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {maritalStatusOptions.map((option) => (
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
        </div>

        {/* Population input methods */}
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">
              जनसंख्या विवरण दर्ता गर्ने विधि:
            </p>
            <Tabs
              value={inputMethod}
              onValueChange={(value) =>
                setInputMethod(value as "total" | "byGender")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="total">कुल जनसंख्या</TabsTrigger>
                <TabsTrigger value="byGender">
                  लिङ्ग अनुसार जनसंख्या
                </TabsTrigger>
              </TabsList>

              <TabsContent value="total">
                <div className="pt-4">
                  <FormField
                    control={form.control}
                    name="population"
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
                </div>
              </TabsContent>

              <TabsContent value="byGender">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="malePopulation"
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
                    name="femalePopulation"
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
                    name="otherPopulation"
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
                </div>

                {inputMethod === "byGender" && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      कुल जनसंख्या:{" "}
                      <strong>{form.watch("population") || 0}</strong>
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-4 pt-2">
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
