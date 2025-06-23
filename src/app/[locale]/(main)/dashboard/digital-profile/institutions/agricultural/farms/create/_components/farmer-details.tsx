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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const farmerTypes = [
  { value: "COMMERCIAL", label: "व्यावसायिक किसान" },
  { value: "SUBSISTENCE", label: "निर्वाहमुखी किसान" },
  { value: "PART_TIME", label: "अंशकालिक किसान" },
  { value: "CONTRACT", label: "करार किसान" },
  { value: "COOPERATIVE_MEMBER", label: "सहकारी सदस्य" },
  { value: "OTHER", label: "अन्य" },
];

const educationLevels = [
  { value: "NONE", label: "औपचारिक शिक्षा छैन" },
  { value: "PRIMARY", label: "प्राथमिक" },
  { value: "SECONDARY", label: "माध्यमिक" },
  { value: "HIGHER_SECONDARY", label: "उच्च माध्यमिक" },
  { value: "BACHELOR", label: "स्नातक" },
  { value: "MASTER", label: "स्नातकोत्तर वा माथि" },
  { value: "VOCATIONAL", label: "व्यावसायिक तालिम" },
];

interface FarmerDetailsProps {
  form: UseFormReturn<any>;
}

export function FarmerDetails({ form }: FarmerDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">किसान विवरण</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मालिक/किसानको नाम</FormLabel>
              <FormControl>
                <Input placeholder="मालिक/किसानको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सम्पर्क नम्बर</FormLabel>
              <FormControl>
                <Input placeholder="सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="farmerType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>किसानको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="किसानको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {farmerTypes.map((type) => (
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

        <FormField
          control={form.control}
          name="farmerEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>शैक्षिक योग्यता</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="शैक्षिक योग्यता छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="farmerExperienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>अनुभव (वर्षमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="कृषि क्षेत्रमा अनुभव वर्ष"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hasCooperativeMembership"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>सहकारी सदस्यता</FormLabel>
              <FormDescription>
                किसानले कुनै सहकारीको सदस्यता लिएको छ?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      {form.watch("hasCooperativeMembership") && (
        <FormField
          control={form.control}
          name="cooperativeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सहकारी संस्थाको नाम</FormLabel>
              <FormControl>
                <Input placeholder="सहकारी संस्थाको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
