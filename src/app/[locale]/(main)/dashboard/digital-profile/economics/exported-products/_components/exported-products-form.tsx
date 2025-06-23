"use client";

import { useEffect, useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1, "उत्पादनको नाम आवश्यक छ"),
});

interface ExportedProductsFormProps {
  editId: string | null;
  onClose: () => void;
  existingData: any[];
}

export default function ExportedProductsForm({
  editId,
  onClose,
  existingData,
}: ExportedProductsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useContext();

  const createMutation = api.profile.economics.exportedProducts.add.useMutation(
    {
      onSuccess: () => {
        toast.success("नयाँ उत्पादन सफलतापूर्वक थपियो");
        utils.profile.economics.exportedProducts.getAll.invalidate();
        setIsSubmitting(false);
        onClose();
      },
      onError: (error) => {
        toast.error(`त्रुटि: ${error.message}`);
        setIsSubmitting(false);
      },
    },
  );

  const { data: editingData, isLoading: isLoadingEditData } =
    api.profile.economics.exportedProducts.getById.useQuery(
      { id: editId || "" },
      { enabled: !!editId },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
    },
  });

  useEffect(() => {
    if (editId && editingData && editingData.length > 0) {
      const recordToEdit = editingData[0];
      if (recordToEdit) {
        form.reset({
          id: recordToEdit.id,
          productName: recordToEdit.productName,
        });
      }
    }
  }, [editId, editingData, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // Check for duplicates when creating new product
    if (!editId) {
      const isDuplicate = existingData.some(
        (item) =>
          item.productName.toLowerCase() === values.productName.toLowerCase(),
      );

      if (isDuplicate) {
        toast.error("यस नामको उत्पादन पहिले नै अवस्थित छ");
        setIsSubmitting(false);
        return;
      }
    }

    createMutation.mutate(values);
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
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>उत्पादनको नाम</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="उत्पादनको नाम प्रविष्ट गर्नुहोस्"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={isSubmitting}
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
