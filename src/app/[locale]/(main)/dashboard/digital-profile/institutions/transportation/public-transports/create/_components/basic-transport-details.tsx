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
import { Textarea } from "@/components/ui/textarea";

// Transport types data
const transportTypes = [
  { value: "BUS", label: "बस" },
  { value: "MINIBUS", label: "मिनी बस" },
  { value: "MICROBUS", label: "माइक्रो बस" },
  { value: "TEMPO", label: "टेम्पो" },
  { value: "AUTO_RICKSHAW", label: "अटो रिक्सा" },
  { value: "TAXI", label: "ट्याक्सी" },
  { value: "E_RICKSHAW", label: "इ-रिक्सा" },
  { value: "OTHER", label: "अन्य" },
];

// Vehicle condition data
const vehicleConditions = [
  { value: "EXCELLENT", label: "उत्कृष्ट" },
  { value: "GOOD", label: "राम्रो" },
  { value: "FAIR", label: "ठीकै" },
  { value: "POOR", label: "खराब" },
  { value: "VERY_POOR", label: "धेरै खराब" },
  { value: "UNDER_MAINTENANCE", label: "मर्मत अधीन" },
];

interface BasicTransportDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicTransportDetails({ form }: BasicTransportDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">आधारभूत जानकारी</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सेवाको नाम</FormLabel>
              <FormControl>
                <Input
                  placeholder="सार्वजनिक यातायातको नाम लेख्नुहोस्"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>यातायातको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="यातायातको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {transportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>विवरण</FormLabel>
            <FormControl>
              <Textarea
                placeholder="सार्वजनिक यातायातको विवरण लेख्नुहोस्"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-lg font-medium mt-8">संचालक विवरण</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="operatorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>संचालक/कम्पनीको नाम</FormLabel>
              <FormControl>
                <Input placeholder="संचालकको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operatorContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सम्पर्क नम्बर</FormLabel>
              <FormControl>
                <Input placeholder="फोन नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operatorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>इमेल ठेगाना</FormLabel>
              <FormControl>
                <Input type="email" placeholder="इमेल" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operatorWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वेबसाइट</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>गाडीको अवस्था</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="गाडीको अवस्था छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
