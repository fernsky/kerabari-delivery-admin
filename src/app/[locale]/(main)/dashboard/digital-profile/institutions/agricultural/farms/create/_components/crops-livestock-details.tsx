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

// Soil type options
const soilTypes = [
  { value: "CLAY", label: "चिम्ट्याइलो माटो" },
  { value: "SANDY", label: "बलौटे माटो" },
  { value: "LOAM", label: "दोमट माटो" },
  { value: "SILT", label: "पल्टिनेदार माटो" },
  { value: "CLAY_LOAM", label: "चिम्ट्याइलो दोमट" },
  { value: "SANDY_LOAM", label: "बलौटे दोमट" },
  { value: "SILTY_CLAY", label: "पल्टिने चिम्ट्याइलो" },
  { value: "ROCKY", label: "चट्टानी माटो" },
  { value: "PEATY", label: "प्रांगारिक माटो" },
  { value: "CHALKY", label: "चूनयुक्त माटो" },
  { value: "MIXED", label: "मिश्रित माटो" },
];

// Irrigation type options
const irrigationTypes = [
  { value: "RAINFED", label: "वर्षामा निर्भर" },
  { value: "CANAL", label: "नहर/कुलो" },
  { value: "DRIP", label: "थोपा सिंचाई" },
  { value: "SPRINKLER", label: "स्प्रिंकलर सिंचाई" },
  { value: "FLOOD", label: "बाढी सिंचाई" },
  { value: "GROUNDWATER", label: "भूमिगत पानी" },
  { value: "RAINWATER_HARVESTING", label: "वर्षाको पानी संकलन" },
  { value: "NONE", label: "सिंचाई छैन" },
  { value: "MIXED", label: "मिश्रित" },
];

// Livestock housing options
const livestockHousingOptions = [
  { value: "OPEN_SHED", label: "खुला गोठ" },
  { value: "BARN", label: "बन्द गोठ" },
  { value: "FREE_STALL", label: "स्वतन्त्र स्टल" },
  { value: "TIE_STALL", label: "बाध्ने स्टल" },
  { value: "DEEP_LITTER", label: "गहिरो लिट्टर" },
  { value: "CAGE_SYSTEM", label: "पिंजरा प्रणाली" },
  { value: "FREE_RANGE", label: "स्वतन्त्र घुम्ने" },
  { value: "MOVABLE_PEN", label: "सार्न मिल्ने खोर" },
  { value: "ZERO_GRAZING", label: "जिरो ग्रेजिङ" },
  { value: "MIXED", label: "मिश्रित" },
];

interface CropsAndLivestockDetailsProps {
  form: UseFormReturn<any>;
}

export function CropsAndLivestockDetails({
  form,
}: CropsAndLivestockDetailsProps) {
  // Generate last 10 years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-8">
      {/* Land Details Section */}
      <div className="space-y-4">
        <div className="text-lg font-medium">जमिनको विवरण</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="soilType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>माटोको प्रकार</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="माटोको प्रकार छान्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {soilTypes.map((type) => (
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
            name="irrigationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सिंचाइ प्रणाली</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="सिंचाई प्रणाली छान्नुहोस्" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {irrigationTypes.map((type) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="irrigationSourceDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सिंचाई स्रोत विवरण</FormLabel>
                <FormControl>
                  <Input placeholder="सिंचाई स्रोत विवरण" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="irrigatedAreaInHectares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सिंचित क्षेत्रफल (हेक्टर)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="सिंचित क्षेत्रफल (हेक्टर)"
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
      </div>

      {/* Crop Details Section */}
      <div className="space-y-4">
        <div className="text-lg font-medium">बाली विवरण</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="mainCrops"
            render={({ field }) => (
              <FormItem>
                <FormLabel>मुख्य बालीहरू</FormLabel>
                <FormControl>
                  <Input placeholder="मुख्य बालीहरू" {...field} />
                </FormControl>
                <FormDescription>
                  अल्पविरामले छुट्याएर लेख्नुहोस् (उदाहरण: धान, गहुँ, मकै)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secondaryCrops"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सहायक बालीहरू</FormLabel>
                <FormControl>
                  <Input placeholder="सहायक बालीहरू" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="croppingSeasons"
            render={({ field }) => (
              <FormItem>
                <FormLabel>बाली मौसम</FormLabel>
                <FormControl>
                  <Input placeholder="बाली मौसम" {...field} />
                </FormControl>
                <FormDescription>
                  उदाहरण: बर्षे, हिउँदे, बर्षै भरी
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="annualCropYieldMT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>वार्षिक बाली उत्पादन (मे.ट.)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="वार्षिक बाली उत्पादन (मेट्रिक टन)"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cropRotation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>बाली चक्र</FormLabel>
                  <FormDescription>
                    फार्ममा बाली चक्र अपनाइएको छ?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="intercropping"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>अन्तरबाली</FormLabel>
                  <FormDescription>
                    फार्ममा अन्तरबाली लगाइएको छ?
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {form.watch("cropRotation") && (
          <FormField
            control={form.control}
            name="cropRotationDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>बाली चक्र विवरण</FormLabel>
                <FormControl>
                  <Textarea placeholder="बाली चक्र विवरण" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="recordedYearCrops"
          render={({ field }) => (
            <FormItem>
              <FormLabel>बाली रेकर्ड वर्ष</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full md:w-1/4">
                    <SelectValue placeholder="बाली रेकर्ड वर्ष" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                माथिको बाली तथ्यांक कुन वर्षको हो?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Livestock Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-medium">पशुधन विवरण</div>
          <FormField
            control={form.control}
            name="hasLivestock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>पशुधन छ</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {form.watch("hasLivestock") && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="livestockTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पशुपन्छी प्रकारहरू</FormLabel>
                  <FormControl>
                    <Input placeholder="पशुपन्छी प्रकारहरू" {...field} />
                  </FormControl>
                  <FormDescription>
                    अल्पविरामले छुट्याएर लेख्नुहोस् (उदाहरण: गाई, भैंसी, बाख्रा)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cattleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>गाई संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="buffaloCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>भैंसी संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="goatCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>बाख्रा संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="sheepCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>भेडा संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="pigCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>सुँगुर संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="poultryCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>कुखुरा संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="otherLivestockCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अन्य पशुधन संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="otherLivestockDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अन्य पशुधन विवरण</FormLabel>
                    <FormControl>
                      <Input placeholder="अन्य पशुधन विवरण" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="livestockHousingType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पशुधन गृह प्रकार</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="पशुधन गृह प्रकार छान्नुहोस्" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {livestockHousingOptions.map((option) => (
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
              name="livestockManagementDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पशुधन व्यवस्थापन विवरण</FormLabel>
                  <FormControl>
                    <Textarea placeholder="पशुधन व्यवस्थापन विवरण" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="annualMilkProductionLiters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक दूध उत्पादन (लिटर)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="annualEggProduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक अण्डा उत्पादन</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
                name="annualMeatProductionKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मासु उत्पादन (के.जी.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
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
              name="recordedYearLivestock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पशुधन रेकर्ड वर्ष</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full md:w-1/4">
                        <SelectValue placeholder="पशुधन रेकर्ड वर्ष" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    माथिको पशुधन तथ्यांक कुन वर्षको हो?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
