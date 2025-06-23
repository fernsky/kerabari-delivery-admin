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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Frequency options
const frequencyOptions = [
  { value: "DAILY", label: "दैनिक" },
  { value: "WEEKDAYS_ONLY", label: "कार्य दिन (हप्ताका दिनहरू)" },
  { value: "WEEKENDS_ONLY", label: "सप्ताहन्त मात्र" },
  { value: "OCCASIONAL", label: "कहिले काहीँ" },
  { value: "SEASONAL", label: "मौसमी" },
];

interface TransportScheduleDetailsProps {
  form: UseFormReturn<any>;
}

export function TransportScheduleDetails({
  form,
}: TransportScheduleDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">समय तालिका</div>

      <FormField
        control={form.control}
        name="frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>सेवा तालिका</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="सेवाको आवृत्ति छान्नुहोस्" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>यातायात सेवा कहिले उपलब्ध हुन्छ</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सुरु समय</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormDescription>पहिलो गाडी छुट्ने समय</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अन्तिम समय</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormDescription>अन्तिम गाडी छुट्ने समय</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="intervalMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अन्तराल (मिनेट)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="गाडी छुट्ने समय अन्तराल"
                  {...field}
                />
              </FormControl>
              <FormDescription>प्रत्येक गाडी बीचको समय अन्तराल</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
