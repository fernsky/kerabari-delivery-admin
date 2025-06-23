import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function WaterSanitationStep() {
  const { control, watch } = useFormContext<Household>();

  const waterPurificationMethods = [
    { id: "boiling", label: "उमाल्ने" },
    { id: "filter", label: "फिल्टर" },
    { id: "chlorination", label: "क्लोरिनेशन" },
    { id: "none", label: "कुनै पनि होइन" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>पानी स्रोत र उपचार</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="water_source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>पानीको मुख्य स्रोत</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="पानीको स्रोत चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tap">धारा</SelectItem>
                      <SelectItem value="well">इनार</SelectItem>
                      <SelectItem value="tubewell">ट्युबवेल</SelectItem>
                      <SelectItem value="river">नदी</SelectItem>
                      <SelectItem value="rain">वर्षाको पानी</SelectItem>
                      <SelectItem value="jar">जारको पानी</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="water_purification_methods"
            render={() => (
              <FormItem>
                <FormLabel>पानी शुद्धिकरणका विधिहरू</FormLabel>
                {waterPurificationMethods.map((method) => (
                  <FormField
                    key={method.id}
                    control={control}
                    name="water_purification_methods"
                    render={({ field }) => {
                      const isChecked =
                        field.value?.includes(method.id) || false;

                      return (
                        <FormItem
                          key={method.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];

                                if (checked) {
                                  field.onChange([...currentValues, method.id]);
                                } else {
                                  field.onChange(
                                    currentValues.filter(
                                      (value) => value !== method.id,
                                    ),
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {method.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>शौचालय र फोहोर व्यवस्थापन</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="toilet_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>शौचालयको प्रकार</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="शौचालयको प्रकार चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flush_sewage">
                        फ्लश (ढल प्रणालीमा जोडिएको)
                      </SelectItem>
                      <SelectItem value="flush_septic">
                        फ्लश (सेप्टिक ट्यांकमा जोडिएको)
                      </SelectItem>
                      <SelectItem value="pit_permanent">
                        स्थायी खाल्डे शौचालय
                      </SelectItem>
                      <SelectItem value="pit_temporary">
                        अस्थायी खाल्डे शौचालय
                      </SelectItem>
                      <SelectItem value="none">शौचालय छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="solid_waste_management"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ठोस फोहोर व्यवस्थापन</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="फोहोर व्यवस्थापन विधि चयन गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="municipal">
                        नगरपालिकाको गाडी
                      </SelectItem>
                      <SelectItem value="private">निजी संस्था</SelectItem>
                      <SelectItem value="composting">कम्पोस्ट</SelectItem>
                      <SelectItem value="burning">जलाउने</SelectItem>
                      <SelectItem value="burying">गाड्ने</SelectItem>
                      <SelectItem value="throwing">
                        खोला वा सार्वजनिक ठाउँमा फाल्ने
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
