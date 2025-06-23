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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Road access type options
const roadAccessTypes = [
  { value: "PAVED", label: "पक्की सडक" },
  { value: "GRAVEL", label: "ग्राभेल सडक" },
  { value: "DIRT", label: "कच्ची सडक" },
  { value: "SEASONAL", label: "मौसमी सडक" },
  { value: "TRAIL", label: "गोरेटो बाटो" },
];

interface FarmInfrastructureDetailsProps {
  form: UseFormReturn<any>;
}

export function FarmInfrastructureDetails({
  form,
}: FarmInfrastructureDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">फार्म पूर्वाधार</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasFarmHouse"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>फार्म हाउस/घर</FormLabel>
                <FormDescription>फार्ममा निवासयोग्य घर छ?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasElectricity"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>विद्युत आपूर्ति</FormLabel>
                <FormDescription>फार्ममा बिजुलीको पहुँच छ?</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasRoadAccess"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>सडक पहुँच</FormLabel>
                <FormDescription>फार्मसम्म सडक पहुँच छ?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasRoadAccess") && (
          <FormField
            control={form.control}
            name="roadAccessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सडक प्रकार</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="सडक प्रकार छान्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roadAccessTypes.map((type) => (
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
        )}
      </div>

      <div className="text-lg font-medium pt-4">भण्डारण र उपकरण</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasStorage"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>भण्डारण सुविधा</FormLabel>
                <FormDescription>
                  उत्पादन भण्डारणका लागि सुविधा छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasStorage") && (
          <FormField
            control={form.control}
            name="storageCapacityMT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>भण्डारण क्षमता (मेट्रिक टन)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="भण्डारण क्षमता (मेट्रिक टन)"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.valueAsNumber || undefined)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasFarmEquipment"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>कृषि उपकरण</FormLabel>
                <FormDescription>फार्ममा कृषि उपकरणहरू छन्?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasFarmEquipment") && (
          <FormField
            control={form.control}
            name="equipmentDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>उपकरण विवरण</FormLabel>
                <FormControl>
                  <Textarea placeholder="उपकरणहरूको विवरण" {...field} />
                </FormControl>
                <FormDescription>
                  उदाहरण: ट्र्याक्टर, थ्रेसर, पम्प, स्प्रेयर, आदि
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={form.control}
        name="totalAreaInHectares"
        render={({ field }) => (
          <FormItem>
            <FormLabel>कुल क्षेत्रफल (हेक्टर)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="कुल क्षेत्रफल (हेक्टर)"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.valueAsNumber || undefined)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cultivatedAreaInHectares"
        render={({ field }) => (
          <FormItem>
            <FormLabel>खेती गरिएको क्षेत्रफल (हेक्टर)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                placeholder="खेती गरिएको क्षेत्रफल (हेक्टर)"
                {...field}
                onChange={(e) =>
                  field.onChange(e.target.valueAsNumber || undefined)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
