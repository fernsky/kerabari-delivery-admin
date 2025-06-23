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
import { Checkbox } from "@/components/ui/checkbox";

// Agricultural zone types data
const agricZoneTypes = [
  { value: "PULSES", label: "दलहन" },
  { value: "OILSEEDS", label: "तेलहन" },
  { value: "COMMERCIAL_FLOWER", label: "व्यावसायिक फूल खेती" },
  { value: "SEASONAL_CROPS", label: "मौसमी बाली" },
  { value: "SUPER_ZONE", label: "सुपर जोन" },
  { value: "POCKET_AREA", label: "पकेट क्षेत्र" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

// Soil quality options
const soilQualityOptions = [
  { value: "EXCELLENT", label: "उत्तम" },
  { value: "GOOD", label: "राम्रो" },
  { value: "AVERAGE", label: "औसत" },
  { value: "POOR", label: "कमजोर" },
  { value: "VERY_POOR", label: "धेरै कमजोर" },
];

// Irrigation system options
const irrigationSystemOptions = [
  { value: "CANAL", label: "नहर/कुलो" },
  { value: "SPRINKLER", label: "स्प्रिंकलर सिंचाई" },
  { value: "DRIP", label: "थोपा सिंचाई" },
  { value: "GROUNDWATER", label: "भूमिगत पानी" },
  { value: "RAINWATER_HARVESTING", label: "वर्षाको पानी संकलन" },
  { value: "SEASONAL_RIVER", label: "मौसमी खोला/नदी" },
  { value: "NONE", label: "सिंचाई छैन" },
  { value: "MIXED", label: "मिश्रित" },
];

interface BasicAgricZoneDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicAgricZoneDetails({ form }: BasicAgricZoneDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>कृषि क्षेत्रको नाम</FormLabel>
              <FormControl>
                <Input placeholder="कृषि क्षेत्रको नाम लेख्नुहोस्" {...field} />
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
              <FormLabel>कृषि क्षेत्रको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="कृषि क्षेत्रको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {agricZoneTypes.map((type) => (
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
                placeholder="कृषि क्षेत्रको विवरण लेख्नुहोस्"
                {...field}
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="wardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वडा नं</FormLabel>
              <FormControl>
                <Input type="number" placeholder="वडा नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ठाउँ/टोल</FormLabel>
              <FormControl>
                <Input placeholder="ठाउँ/टोलको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ठेगाना</FormLabel>
              <FormControl>
                <Input placeholder="पूर्ण ठेगाना" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="areaInHectares"
          render={({ field }) => (
            <FormItem>
              <FormLabel>क्षेत्रफल (हेक्टरमा)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="हेक्टरमा क्षेत्रफल"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="soilQuality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>माटोको गुणस्तर</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="माटोको गुणस्तर छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {soilQualityOptions.map((option) => (
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

      <FormField
        control={form.control}
        name="irrigationSystem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>सिंचाई प्रणाली</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="सिंचाई प्रणाली छान्नुहोस्" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {irrigationSystemOptions.map((option) => (
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

      <FormField
        control={form.control}
        name="isGovernmentOwned"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>सरकारी स्वामित्व</FormLabel>
              <FormDescription>
                यो क्षेत्र सरकारी स्वामित्वमा छ?
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <div className="text-lg font-medium mt-8">स्वामित्व/सम्पर्क विवरण</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मालिकको नाम</FormLabel>
              <FormControl>
                <Input placeholder="मालिकको नाम" {...field} />
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
              <FormLabel>मालिकको सम्पर्क नम्बर</FormLabel>
              <FormControl>
                <Input placeholder="मालिकको सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="caretakerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>हेरचाहकर्ताको नाम</FormLabel>
              <FormControl>
                <Input placeholder="हेरचाहकर्ताको नाम" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caretakerContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>हेरचाहकर्ताको सम्पर्क</FormLabel>
              <FormControl>
                <Input placeholder="हेरचाहकर्ताको सम्पर्क नम्बर" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
