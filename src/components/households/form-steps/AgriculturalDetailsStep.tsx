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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function AgriculturalDetailsStep() {
  const { control, watch } = useFormContext<Household>();

  const haveAgriculturalLand = watch("have_agricultural_land");
  const areInvolvedInAgriculture = watch("are_involved_in_agriculture");
  const areInvolvedInHusbandry = watch("are_involved_in_husbandry");
  const haveAquaculture = watch("have_aquaculture");
  const haveApiary = watch("have_apiary");

  const foodCrops = [
    { id: "chaite_paddy", label: "चैते धान" },
    { id: "barse_paddy", label: "बर्षे धान" },
    { id: "corn", label: "मकै" },
    { id: "wheat", label: "गहुँ" },
    { id: "millet", label: "कोदो" },
    { id: "barley", label: "जौ" },
    { id: "phapar", label: "फापर" },
    { id: "junelo", label: "जुनेलो" },
    { id: "kaguno", label: "कागुनो" },
    { id: "other", label: "अन्य खद्यान्नबाली" },
    { id: "none", label: "कुनै अन्नबाली उत्पदान गर्दिन" },
  ];

  const vegetables = [
    { id: "potato", label: "आलु" },
    { id: "cauliflower", label: "काउली" },
    { id: "cabbage", label: "बन्दा" },
    { id: "tomato", label: "गोलभेडा / टमाटर" },
    { id: "radish", label: "मुला" },
    { id: "carrot", label: "गाँजर" },
    { id: "turnip", label: "सलगम" },
    { id: "capsicum", label: "भेडे खुर्सानी" },
    { id: "okra", label: "भिण्डी /रामतोरिया" },
    { id: "brinjal", label: "भण्टा/भ्यान्टा" },
    { id: "onion", label: "प्याज" },
    { id: "string_bean", label: "घिउ सिमी" },
    { id: "red_kidney_bean", label: "राज्मा सिमी" },
    { id: "cucumber", label: "काक्रो" },
    { id: "pumpkin", label: "फर्सी" },
    { id: "bitter_gourd", label: "करेला" },
    { id: "luffa", label: "घिरौला" },
    { id: "snake_gourd", label: "चिचिन्ना" },
    { id: "calabash", label: "लौका" },
    { id: "balsam_apple", label: "बरेला" },
    { id: "mushroom", label: "च्याउ" },
    { id: "squice", label: "स्कुस" },
    { id: "mustard_greens", label: "रायोको साग" },
    { id: "garden_cress", label: "चम्सुरको साग" },
    { id: "spinach", label: "पालुङ्गो साग" },
    { id: "colocasia", label: "पिडालु" },
    { id: "yam", label: "तरुल" },
    { id: "other", label: "अन्य तरकारी बाली" },
    { id: "none", label: "कुनै तरकारी बाली उत्पदान गर्दिन" },
  ];

  const animals = [
    { id: "hybird_cow", label: "ऊन्नत गाई" },
    { id: "local_cow", label: "लोकल गाई" },
    { id: "buffalo", label: "भैंसी/राँगा" },
    { id: "goat", label: "भेडा/बाख्रा/च्याङ्ग्र" },
    { id: "pig", label: "बंगुर/सुंगुर" },
    { id: "horse", label: "घोडा/खच्चर/गधा" },
    { id: "other_animal", label: "अन्य पशु" },
    { id: "broiler_hen", label: "ब्रोईलर कुखुरा" },
    { id: "layers_hen", label: "लेयर्स कुखूरा" },
    { id: "local_hen", label: "लोकल कुखुरा" },
    { id: "duck", label: "हाँस" },
    { id: "kalij", label: "कालिज" },
    { id: "turkey", label: "टर्की" },
    { id: "other_bird", label: "अन्य पन्छी" },
  ];

  const animalProducts = [
    { id: "milk", label: "दुध" },
    { id: "milk_product", label: "दुधजन्य वस्तु (ध्यू, चिज, मखन आदि)" },
    { id: "egg", label: "अण्डा" },
    { id: "meat", label: "मासु" },
    { id: "other", label: "अन्य" },
  ];

  const agriculturalMachines = [
    { id: "iron_plough", label: "फलामे हलो" },
    { id: "power_tiller_mini_tiller", label: "पावर ट्रिलर/मिनि ट्रिलर" },
    { id: "tractor", label: "ट्रयाक्टर" },
    { id: "shallow_deep_tubewell", label: "स्यालो/डिप ट्युबवेल " },
    { id: "roar_dhiki_pump", label: "रोअर/ढिकी पम्प" },
    { id: "pump_set", label: "पम्प सेट" },
    { id: "sprayer", label: "स्प्रेयर" },
    { id: "combined_harvester", label: "कम्बाइन हाव्रेस्टर" },
    { id: "chaff_cutter", label: "चाफ कटर" },
    { id: "milking_machine", label: "दुध दुहुने मेसिन" },
    { id: "thresher", label: "थ्रेसर" },
    { id: "corn_harvester", label: "मकै छोडाउने मेसिन" },
    { id: "rice_maize_weeding_machine", label: "धान तथा मकै गोड्ने मेशिन" },
    { id: "hand_wheelbarrow", label: "हाते गाडा" },
    { id: "other_equipment", label: "अन्य औजार" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>कृषि जग्गा र बालीनाली</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="have_agricultural_land"
            render={({ field }) => (
              <FormItem>
                <FormLabel>खेतीयोग्य जग्गा छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="are_involved_in_agriculture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>कृषि कार्यमा संलग्न हुनुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {areInvolvedInAgriculture === "yes" && (
            <>
              <FormField
                control={control}
                name="food_crops"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने अन्नबाली</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {foodCrops.map((crop) => (
                        <FormField
                          key={crop.id}
                          control={control}
                          name="food_crops"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(crop.id) || false;

                            return (
                              <FormItem
                                key={crop.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          crop.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== crop.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {crop.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="vegetables"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने तरकारी</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {vegetables.map((vegetable) => (
                        <FormField
                          key={vegetable.id}
                          control={control}
                          name="vegetables"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(vegetable.id) || false;

                            return (
                              <FormItem
                                key={vegetable.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          vegetable.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== vegetable.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {vegetable.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="agricultural_machines"
                render={() => (
                  <FormItem>
                    <FormLabel>कृषि औजार/मेशिनहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {agriculturalMachines.map((machine) => (
                        <FormField
                          key={machine.id}
                          control={control}
                          name="agricultural_machines"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(machine.id) || false;

                            return (
                              <FormItem
                                key={machine.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          machine.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== machine.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {machine.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>पशुपालन र माछापालन</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="are_involved_in_husbandry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>पशुपालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {areInvolvedInHusbandry === "yes" && (
            <>
              <FormField
                control={control}
                name="animals"
                render={() => (
                  <FormItem>
                    <FormLabel>पालिएका पशुहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {animals.map((animal) => (
                        <FormField
                          key={animal.id}
                          control={control}
                          name="animals"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(animal.id) || false;

                            return (
                              <FormItem
                                key={animal.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          animal.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== animal.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {animal.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="animal_products"
                render={() => (
                  <FormItem>
                    <FormLabel>उत्पादन हुने पशुजन्य पदार्थहरू</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {animalProducts.map((product) => (
                        <FormField
                          key={product.id}
                          control={control}
                          name="animal_products"
                          render={({ field }) => {
                            const isChecked =
                              field.value?.includes(product.id) || false;

                            return (
                              <FormItem
                                key={product.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          product.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== product.id,
                                          ),
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {product.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={control}
            name="have_aquaculture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>माछापालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {haveAquaculture === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="pond_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पोखरीको संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                        placeholder="पोखरीको संख्या"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="pond_area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पोखरीको क्षेत्रफल (वर्ग मिटर)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="पोखरीको क्षेत्रफल"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="fish_production"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक माछा उत्पादन (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक माछा उत्पादन"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={control}
            name="have_apiary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>मौरीपालन गर्नुहुन्छ?</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">छ</SelectItem>
                      <SelectItem value="no">छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {haveApiary === "yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="hive_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>मौरीघारको संख्या</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                        placeholder="मौरीघारको संख्या"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_production"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह उत्पादन (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक मह उत्पादन"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_sales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह बिक्री (के.जी)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक मह बिक्री"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="honey_revenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>वार्षिक मह बिक्रीबाट आम्दानी (रु)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            parseFloat(e.target.value) || undefined,
                          )
                        }
                        placeholder="वार्षिक आम्दानी"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
