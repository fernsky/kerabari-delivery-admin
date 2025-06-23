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

interface ParkingFacilitiesDetailsProps {
  form: UseFormReturn<any>;
}

export function ParkingFacilitiesDetails({
  form,
}: ParkingFacilitiesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">पार्किङ सुविधाको विशेषताहरू</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="hasRoof"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>छाना</FormLabel>
                <FormDescription>
                  पार्किङमा छाना छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasToilet"
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
                  पार्किङमा शौचालय सुविधा छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasWaitingArea"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>प्रतीक्षालय</FormLabel>
                <FormDescription>
                  पार्किङमा प्रतीक्षालय छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasTicketCounter"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>टिकट काउन्टर</FormLabel>
                <FormDescription>
                  पार्किङमा टिकट काउन्टर छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasFoodStalls"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>खाद्य स्टलहरू</FormLabel>
                <FormDescription>
                  पार्किङमा खाद्य स्टलहरू छन् भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasSecurityPersonnel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>सुरक्षा कर्मचारी</FormLabel>
                <FormDescription>
                  पार्किङमा सुरक्षा कर्मचारी छन् भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasCCTV"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>CCTV</FormLabel>
                <FormDescription>
                  पार्किङमा CCTV क्यामेरा छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
