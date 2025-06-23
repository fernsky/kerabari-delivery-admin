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

// Parking facility types data
const parkingTypes = [
  { value: "BUS_PARK", label: "बस पार्क" },
  { value: "TAXI_PARK", label: "ट्याक्सी पार्क" },
  { value: "TEMPO_PARK", label: "टेम्पो पार्क" },
  { value: "AUTO_RICKSHAW_PARK", label: "अटो रिक्सा पार्क" },
  { value: "CAR_PARK", label: "कार पार्क" },
  { value: "BIKE_PARK", label: "बाइक पार्क" },
  { value: "MULTIPURPOSE_PARK", label: "बहुउद्देश्यीय पार्क" },
  { value: "OTHER", label: "अन्य" },
];

// Parking facility condition data
const parkingConditions = [
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

interface BasicParkingDetailsProps {
  form: UseFormReturn<any>;
}

export function BasicParkingDetails({ form }: BasicParkingDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पार्किङ सुविधाको नाम</FormLabel>
              <FormControl>
                <Input
                  placeholder="पार्किङ सुविधाको नाम लेख्नुहोस्"
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
              <FormLabel>पार्किङ सुविधाको प्रकार</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="पार्किङ सुविधाको प्रकार छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parkingTypes.map((type) => (
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
                placeholder="पार्किङ सुविधाको विवरण लेख्नुहोस्"
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
              <FormLabel>ठाउँ/टोल/क्षेत्र</FormLabel>
              <FormControl>
                <Input placeholder="ठाउँ/टोल/क्षेत्रको नाम" {...field} />
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
          name="areaInSquareMeters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>क्षेत्रफल (वर्ग मिटर)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="क्षेत्रफल" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सवारी साधन क्षमता</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="सवारी साधन क्षमता"
                  {...field}
                />
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
              <FormLabel>पार्किङ सुविधाको अवस्था</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="पार्किङ सुविधाको अवस्था छान्नुहोस्" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {parkingConditions.map((condition) => (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>संचालक</FormLabel>
              <FormControl>
                <Input
                  placeholder="संचालक व्यक्ति वा संस्थाको नाम"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                पार्किङ सुविधा संचालन गर्ने व्यक्ति/संस्था
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>सम्पर्क जानकारी</FormLabel>
              <FormControl>
                <Input placeholder="फोन नम्बर वा इमेल" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="establishedYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>स्थापना वर्ष</FormLabel>
              <FormControl>
                <Input placeholder="स्थापना वर्ष" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </div>
  );
}
