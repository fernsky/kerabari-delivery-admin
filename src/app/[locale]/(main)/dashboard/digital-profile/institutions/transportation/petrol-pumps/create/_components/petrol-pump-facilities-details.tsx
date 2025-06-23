"use client";

import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface PetrolPumpFacilitiesDetailsProps {
  form: UseFormReturn<any>;
}

export function PetrolPumpFacilitiesDetails({
  form,
}: PetrolPumpFacilitiesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">पेट्रोल पम्प सुविधाहरू</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="hasEVCharging"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>इलेक्ट्रिक वाहन चार्जिंग</FormLabel>
                <FormDescription>
                  इलेक्ट्रिक वाहन चार्जिंग स्टेशन उपलब्ध छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasCarWash"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>कार वाश</FormLabel>
                <FormDescription>गाडी धुने सुविधा उपलब्ध छ</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasConvenienceStore"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>किराना पसल</FormLabel>
                <FormDescription>
                  पेट्रोल पम्पमा किराना पसल सुविधा उपलब्ध छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasRestroom"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>शौचालय</FormLabel>
                <FormDescription>
                  पेट्रोल पम्पमा शौचालय सुविधा उपलब्ध छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasAirFilling"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>टायर हावा भर्ने सुविधा</FormLabel>
                <FormDescription>
                  टायरमा हावा भर्ने सुविधा उपलब्ध छ
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
