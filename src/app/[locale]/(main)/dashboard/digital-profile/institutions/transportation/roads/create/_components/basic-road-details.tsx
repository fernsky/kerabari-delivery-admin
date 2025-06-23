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

// Road types data
const roadTypes = [
  { value: "HIGHWAY", label: "हाइवे" },
  { value: "URBAN", label: "सहरी सडक" },
  { value: "RURAL", label: "ग्रामीण सडक" },
  { value: "GRAVEL", label: "ग्राभेल सडक" },
  { value: "EARTHEN", label: "कच्ची सडक" },
  { value: "AGRICULTURAL", label: "कृषि सडक" },
  { value: "ALLEY", label: "गल्ली" },
  { value: "BRIDGE", label: "पुल" },
];

// Road condition data
const roadConditions = [
  { value: "EXCELLENT", label: "उत्कृष्ट" },
  { value: "GOOD", label: "राम्रो" },
  { value: "FAIR", label: "ठीकै" },
  { value: "POOR", label: "खराब" },
  { value: "VERY_POOR", label: "धेरै खराब" },
  { value: "UNDER_CONSTRUCTION", label: "निर्माणाधीन" },
];

// Drainage system data
const drainageSystems = [
  { value: "PROPER", label: "उचित" },
  { value: "PARTIAL", label: "आंशिक" },
  { value: "NONE", label: "नभएको" },
  { value: "BLOCKED", label: "अवरुद्ध" },
];

interface BasicRoadDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicRoadDetails({ form }: BasicRoadDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सडकको नाम</FormLabel>
              <FormControl>
                <Input placeholder="सडकको नाम लेख्नुहोस्" {...field} />
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
              <FormLabel>सडकको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="सडकको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roadTypes.map((type) => (
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
                placeholder="सडकको विवरण लेख्नुहोस्"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="widthInMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>चौडाई (मिटरमा)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="सडकको चौडाई" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>लम्बाई (मिटरमा)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="सडकको लम्बाई" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सडकको अवस्था</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="सडकको अवस्था छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roadConditions.map((condition) => (
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

        <FormField
          control={form.control}
          name="drainageSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>नाली प्रणाली</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="नाली प्रणाली छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {drainageSystems.map((system) => (
                    <SelectItem key={system.value} value={system.value}>
                      {system.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="maintenanceYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मर्मत सम्भार वर्ष</FormLabel>
              <FormControl>
                <Input type="text" placeholder="मर्मत सम्भार वर्ष" {...field} />
              </FormControl>
              <FormDescription>
                अन्तिम मर्मत वा पुनर्निर्माण वर्ष
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startPoint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सुरुवात बिन्दु</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="सडकको सुरु हुने स्थान"
                  {...field}
                />
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
                <Input
                  type="text"
                  placeholder="सडकको अन्त्य हुने स्थान"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
