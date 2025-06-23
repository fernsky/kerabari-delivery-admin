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

// Petrol pump types data
const petrolPumpTypes = [
  { value: "PETROL", label: "पेट्रोल" },
  { value: "DIESEL", label: "डिजल" },
  { value: "PETROL_DIESEL", label: "पेट्रोल र डिजल" },
  { value: "CNG", label: "सीएनजी" },
  { value: "EV_CHARGING", label: "इलेक्ट्रिक वाहन चार्जिंग" },
  { value: "MULTIPURPOSE", label: "बहुउद्देश्यीय" },
];

interface BasicPetrolPumpDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicPetrolPumpDetails({ form }: BasicPetrolPumpDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पेट्रोल पम्पको नाम</FormLabel>
              <FormControl>
                <Input placeholder="पेट्रोल पम्पको नाम लेख्नुहोस्" {...field} />
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
              <FormLabel>पेट्रोल पम्पको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="पेट्रोल पम्पको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {petrolPumpTypes.map((type) => (
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
                placeholder="पेट्रोल पम्पको विवरण लेख्नुहोस्"
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
          name="locality"
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

      <div className="text-lg font-medium mt-8">मालिकको विवरण</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मालिक/संचालकको नाम</FormLabel>
              <FormControl>
                <Input placeholder="मालिक/संचालकको नाम" {...field} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="ownerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>इमेल</FormLabel>
              <FormControl>
                <Input placeholder="इमेल ठेगाना" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerWebsite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वेबसाइट</FormLabel>
              <FormControl>
                <Input placeholder="वेबसाइट ठेगाना" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="operatingHours"
        render={({ field }) => (
          <FormItem>
            <FormLabel>संचालन समय</FormLabel>
            <FormControl>
              <Input
                placeholder="उदाहरण: बिहान ६ बजे देखि बेलुका ८ बजे सम्म"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
