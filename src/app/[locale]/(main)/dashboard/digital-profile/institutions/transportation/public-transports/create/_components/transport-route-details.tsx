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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TransportRouteDetailsProps {
  form: UseFormReturn<any>;
}

export function TransportRouteDetails({ form }: TransportRouteDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">यातायातको मार्ग विवरण</div>

      <FormField
        control={form.control}
        name="routeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>मार्गको नाम</FormLabel>
            <FormControl>
              <Input placeholder="मार्गको नाम लेख्नुहोस्" {...field} />
            </FormControl>
            <FormDescription>
              उदाहरण: "काठमाण्डौ-पोखरा रुट", "रिङ्ग रोड सर्कल"
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सुरुवात बिन्दु</FormLabel>
              <FormControl>
                <Input placeholder="सुरुवात स्थान" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अन्तिम बिन्दु</FormLabel>
              <FormControl>
                <Input placeholder="अन्तिम स्थान" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अनुमानित यात्रा अवधि (मिनेट)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="कुल दूरी तय गर्न लाग्ने समय"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="viaPoints"
        render={({ field }) => (
          <FormItem>
            <FormLabel>हुँदै जाने स्थानहरू</FormLabel>
            <FormControl>
              <Textarea
                placeholder="प्रमुख बिसौनी/रोक्ने स्थानहरूको नाम"
                {...field}
                rows={3}
              />
            </FormControl>
            <FormDescription>
              रुट (मार्ग) मा पर्ने प्रमुख स्थानहरू अल्पविराम (,) ले छुट्याएर
              लेख्नुहोस्
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
