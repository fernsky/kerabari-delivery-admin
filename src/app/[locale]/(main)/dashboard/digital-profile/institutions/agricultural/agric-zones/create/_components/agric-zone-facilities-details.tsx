"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AgricZoneFacilitiesDetailsProps {
  form: UseFormReturn<any>;
}

export function AgricZoneFacilitiesDetails({
  form,
}: AgricZoneFacilitiesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">कृषि क्षेत्र विवरण</div>
      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="majorCrops"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मुख्य बाली</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="मुख्य बालीहरू (अल्पविराम द्वारा छुट्याउनुहोस्)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                उदाहरण: धान, गहुँ, मकै, कोदो, आलु
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seasonalAvailability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मौसमी उपलब्धता</FormLabel>
              <FormControl>
                <Input placeholder="मौसमी उपलब्धता" {...field} />
              </FormControl>
              <FormDescription>
                उदाहरण: बर्षे, हिउँदे, बर्षै भरी
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="annualProduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वार्षिक उत्पादन (मेट्रिक टनमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="मेट्रिक टनमा वार्षिक उत्पादन"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>उत्पादन वर्ष</FormLabel>
              <FormControl>
                <Input placeholder="उत्पादन वर्ष (जस्तै: २०७८)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="text-lg font-medium mt-8">थप सुविधाहरू</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="hasStorage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>भण्डारण सुविधा</FormLabel>
                <FormDescription>
                  कृषि उपजको भण्डारण सुविधा उपलब्ध छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasProcessingUnit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>प्रशोधन एकाई</FormLabel>
                <FormDescription>कृषि उपज प्रशोधन गर्ने एकाई छ</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasFarmersCooperative"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>किसान सहकारी</FormLabel>
                <FormDescription>किसान सहकारी संगठन छ</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
