import { useFormContext } from "react-hook-form";
import { Household } from "@/types/household";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HouseDetailsStep() {
  const { control, watch } = useFormContext<Household>();

  const houseOwnership = watch("house_ownership") as string;
  const houseBase = watch("house_base") as string;
  const houseOuterWall = watch("house_outer_wall") as string;
  const houseRoof = watch("house_roof") as string;
  const houseFloor = watch("house_floor") as string;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>घरको स्वामित्व</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="house_ownership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>घरको स्वामित्व</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="स्वामित्व प्रकार छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">आफ्नै</SelectItem>
                      <SelectItem value="rent">भाडा</SelectItem>
                      <SelectItem value="relative">आफन्तको</SelectItem>
                      <SelectItem value="other">अन्य</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {houseOwnership === "other" && (
            <FormField
              control={control}
              name="house_ownership_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अन्य स्वामित्व (कृपया उल्लेख गर्नुहोस्)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="कृपया स्वामित्व प्रकार उल्लेख गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={control}
            name="land_ownership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>जग्गाको स्वामित्व</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="जग्गाको स्वामित्व छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="own">आफ्नै</SelectItem>
                      <SelectItem value="rent">भाडा</SelectItem>
                      <SelectItem value="government">सरकारी</SelectItem>
                      <SelectItem value="other">अन्य</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>घरको संरचना</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="house_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरको जग</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="घरको जग छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">कंक्रिट</SelectItem>
                        <SelectItem value="stone">ढुंगा</SelectItem>
                        <SelectItem value="mud">माटो</SelectItem>
                        <SelectItem value="other">अन्य</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {houseBase === "other" && (
              <FormField
                control={control}
                name="house_base_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अन्य जग (कृपया उल्लेख गर्नुहोस्)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="कृपया घरको जग उल्लेख गर्नुहोस्"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="house_outer_wall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरको बाहिरी भित्ता</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="भित्ताको प्रकार छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brick">इँटा</SelectItem>
                        <SelectItem value="concrete">कंक्रिट</SelectItem>
                        <SelectItem value="wood">काठ</SelectItem>
                        <SelectItem value="bamboo">बाँस</SelectItem>
                        <SelectItem value="other">अन्य</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {houseOuterWall === "other" && (
              <FormField
                control={control}
                name="house_outer_wall_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      अन्य भित्ता प्रकार (कृपया उल्लेख गर्नुहोस्)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="कृपया भित्ताको प्रकार उल्लेख गर्नुहोस्"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="house_roof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरको छाना</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="छानाको प्रकार छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rcc">आर.सी.सी</SelectItem>
                        <SelectItem value="tin">जस्ता</SelectItem>
                        <SelectItem value="tile">टायल</SelectItem>
                        <SelectItem value="straw">फुस</SelectItem>
                        <SelectItem value="other">अन्य</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {houseRoof === "other" && (
              <FormField
                control={control}
                name="house_roof_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      अन्य छाना प्रकार (कृपया उल्लेख गर्नुहोस्)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="कृपया छानाको प्रकार उल्लेख गर्नुहोस्"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="house_floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरको भुइँ</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="भुइँको प्रकार छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">कंक्रिट</SelectItem>
                        <SelectItem value="tile">टायल</SelectItem>
                        <SelectItem value="mud">माटो</SelectItem>
                        <SelectItem value="wood">काठ</SelectItem>
                        <SelectItem value="other">अन्य</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {houseFloor === "other" && (
              <FormField
                control={control}
                name="house_floor_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      अन्य भुइँ प्रकार (कृपया उल्लेख गर्नुहोस्)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="कृपया भुइँको प्रकार उल्लेख गर्नुहोस्"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>सुरक्षा जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="is_house_passed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>घरले भवन मापदण्ड पास गरेको छ?</FormLabel>
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
                      <SelectItem value="unknown">थाहा छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_earthquake_resistant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>घर भूकम्प प्रतिरोधी छ?</FormLabel>
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
                      <SelectItem value="unknown">थाहा छैन</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="disaster_risk_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>प्राकृतिक विपद जोखिम स्थिति</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="जोखिम स्थिति छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe">सुरक्षित</SelectItem>
                      <SelectItem value="flood_risk">बाढी जोखिम</SelectItem>
                      <SelectItem value="landslide_risk">
                        पहिरो जोखिम
                      </SelectItem>
                      <SelectItem value="fire_risk">आगलागी जोखिम</SelectItem>
                      <SelectItem value="other">अन्य जोखिम</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>घरको आकार र कोठाहरू</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="house_floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घरको तल्ला संख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="तल्ला संख्या उल्लेख गर्नुहोस्"
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="room_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>कोठा संख्या</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="कोठा संख्या उल्लेख गर्नुहोस्"
                      onChange={(e) => {
                        const value = e.target.value
                          ? parseInt(e.target.value, 10)
                          : undefined;
                        field.onChange(value);
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
