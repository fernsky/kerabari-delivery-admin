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

interface RoadFeaturesDetailsProps {
  form: UseFormReturn<any>;
}

export function RoadFeaturesDetails({ form }: RoadFeaturesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">सडकको विशेषताहरू</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasStreetLights"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>स्ट्रिट लाइट</FormLabel>
                <FormDescription>
                  सडकमा स्ट्रिट लाइट (बत्ती) छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasDivider"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>डिभाइडर</FormLabel>
                <FormDescription>
                  सडकमा बीचमा डिभाइडर छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasPedestrian"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>पैदल मार्ग</FormLabel>
                <FormDescription>
                  सडकमा पैदल यात्रुका लागि छुट्टै बाटो छ भने यो विकल्प
                  छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasBicycleLane"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>साइकल लेन</FormLabel>
                <FormDescription>
                  सडकमा साइकलका लागि छुट्टै लेन छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
