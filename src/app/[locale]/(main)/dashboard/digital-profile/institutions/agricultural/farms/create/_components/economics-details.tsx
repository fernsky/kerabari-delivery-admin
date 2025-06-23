"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EconomicsDetailsProps {
  form: UseFormReturn<any>;
}

export function EconomicsDetails({ form }: EconomicsDetailsProps) {
  const [selectedAgricZones, setSelectedAgricZones] = useState<string[]>([]);
  const [selectedProcessingCenters, setSelectedProcessingCenters] = useState<
    string[]
  >([]);
  const [selectedGrazingAreas, setSelectedGrazingAreas] = useState<string[]>(
    [],
  );
  const [selectedGrasslands, setSelectedGrasslands] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">श्रम र अर्थव्यवस्था</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="familyLaborCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>पारिवारिक श्रम संख्या</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="परिवारका कामदार संख्या"
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
          name="hiredLaborCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ज्यालादारी श्रम संख्या</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ज्यालादारी कामदार संख्या"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="annualInvestmentNPR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वार्षिक लगानी (रु.)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="वार्षिक लगानी (रुपैयाँमा)"
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
          name="annualIncomeNPR"
          render={({ field }) => (
            <FormItem>
              <FormLabel>वार्षिक आम्दानी (रु.)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="वार्षिक आम्दानी (रुपैयाँमा)"
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

      <FormField
        control={form.control}
        name="profitableOperation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>मुनाफायुक्त व्यवसाय</FormLabel>
              <FormDescription>फार्म मुनाफायुक्त छ?</FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="marketAccessDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>बजार पहुँच विवरण</FormLabel>
            <FormControl>
              <Textarea placeholder="बजार पहुँच विवरण लेख्नुहोस्" {...field} />
            </FormControl>
            <FormDescription>
              उत्पादनहरू कहाँ र कसरी बेच्नुहुन्छ?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="majorBuyerTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>प्रमुख खरिदकर्ता</FormLabel>
            <FormControl>
              <Input placeholder="प्रमुख खरिदकर्ता प्रकार" {...field} />
            </FormControl>
            <FormDescription>
              उदाहरण: स्थानीय उपभोक्ताहरू, होलसेलर्स, निर्यातकर्ता, आदि
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Additional linked entities section can be implemented here */}
      {/* For simplicity, we're leaving out linked entities implementation in this example */}

      <div className="text-lg font-medium mt-4 border-t pt-4">
        सम्बन्धित संस्थाहरू
      </div>
      <FormDescription>
        यो फार्मसँग सम्बन्धित अन्य संस्थाहरू राख्नका लागि कृषि क्षेत्र
        व्यवस्थापन पूरा गरेपछि उपलब्ध हुनेछ।
      </FormDescription>
    </div>
  );
}
