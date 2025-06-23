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

// Farm types data
const farmTypes = [
  { value: "CROP_FARM", label: "बाली फार्म" },
  { value: "LIVESTOCK_FARM", label: "पशुपन्छी फार्म" },
  { value: "MIXED_FARM", label: "मिश्रित फार्म" },
  { value: "POULTRY_FARM", label: "कुखुरा फार्म" },
  { value: "DAIRY_FARM", label: "डेरी फार्म" },
  { value: "AQUACULTURE_FARM", label: "मत्स्य पालन फार्म" },
  { value: "HORTICULTURE_FARM", label: "बागवानी फार्म" },
  { value: "APICULTURE_FARM", label: "मौरीपालन फार्म" },
  { value: "SERICULTURE_FARM", label: "रेशम खेती फार्म" },
  { value: "ORGANIC_FARM", label: "जैविक फार्म" },
  { value: "COMMERCIAL_FARM", label: "व्यावसायिक फार्म" },
  { value: "SUBSISTENCE_FARM", label: "निर्वाहमुखी फार्म" },
  { value: "AGROFORESTRY", label: "कृषिवन फार्म" },
  { value: "OTHER", label: "अन्य" },
];

// Farming system options
const farmingSystemOptions = [
  { value: "CONVENTIONAL", label: "परम्परागत" },
  { value: "ORGANIC", label: "जैविक" },
  { value: "INTEGRATED", label: "एकीकृत" },
  { value: "CONSERVATION", label: "संरक्षण" },
  { value: "HYDROPONIC", label: "हाइड्रोपोनिक" },
  { value: "PERMACULTURE", label: "परमाकल्चर" },
  { value: "BIODYNAMIC", label: "जैवगतिशील" },
  { value: "TRADITIONAL", label: "पारम्परिक" },
  { value: "MIXED", label: "मिश्रित" },
];

interface BasicFarmDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicFarmDetails({ form }: BasicFarmDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>फार्मको नाम</FormLabel>
              <FormControl>
                <Input placeholder="फार्मको नाम लेख्नुहोस्" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="farmType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>फार्मको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="फार्मको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {farmTypes.map((type) => (
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
                placeholder="फार्मको विवरण लेख्नुहोस्"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="farmingSystem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>कृषि प्रणाली</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="कृषि प्रणाली छान्नुहोस्" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {farmingSystemOptions.map((option) => (
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
  );
}
