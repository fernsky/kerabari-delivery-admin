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

interface TransportFeaturesDetailsProps {
  form: UseFormReturn<any>;
}

export function TransportFeaturesDetails({
  form,
}: TransportFeaturesDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">गाडीको विशेषताहरू</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="vehicleCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>गाडीको संख्या</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="यो मार्गमा चल्ने गाडीहरूको संख्या"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seatingCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सिट क्षमता</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="प्रति गाडीको औसत सिट क्षमता"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fareAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>भाडा रकम (रू)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="न्यूनतम भाडा" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fareDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>भाडा विवरण</FormLabel>
              <FormControl>
                <Input
                  placeholder="भाडा सम्बन्धी अतिरिक्त जानकारी"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                जस्तै: "दूरी अनुसार भाडा फरक हुन्छ"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="hasAirConditioning"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>एसी (वातानुकूलित)</FormLabel>
                <FormDescription>
                  गाडीमा एयर कण्डिसनर छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasWifi"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>वाई-फाई</FormLabel>
                <FormDescription>
                  गाडीमा वाई-फाई सुविधा छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAccessible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>अपाङ्गमैत्री</FormLabel>
                <FormDescription>
                  गाडी अपाङ्गमैत्री छ भने यो विकल्प छान्नुहोस्
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
