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
import { DatePicker } from "@/components/ui/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISTRICTS } from "@/constants/districts";

const FormFieldDebug = ({ name }: { name: string }) => {
  const { getValues } = useFormContext();
  const value = getValues(name);

  return (
    <div className="text-xs text-gray-500 mt-1">
      Field value: {value ? JSON.stringify(value) : "empty"}
    </div>
  );
};

export default function BasicInformationStep() {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>स्थानीय जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रदेश</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="प्रदेश छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="province1">प्रदेश १</SelectItem>
                        <SelectItem value="madhesh">मधेश प्रदेश</SelectItem>
                        <SelectItem value="bagmati">बागमती प्रदेश</SelectItem>
                        <SelectItem value="gandaki">गण्डकी प्रदेश</SelectItem>
                        <SelectItem value="lumbini">लुम्बिनी प्रदेश</SelectItem>
                        <SelectItem value="karnali">कर्णाली प्रदेश</SelectItem>
                        <SelectItem value="sudurpaschim">
                          सुदूरपश्चिम प्रदेश
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जिल्ला</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="जिल्ला छनौट गर्नुहोस्" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                        {/* Add more districts as needed */}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="localLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>स्थानीय तह</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="स्थानीय तह प्रविष्ट गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="wardNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>वडा नं.</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || undefined)
                      }
                      placeholder="वडा नं. प्रविष्ट गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="houseSymbolNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>घर संकेत नं.</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="घर संकेत नं. प्रविष्ट गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="familySymbolNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>परिवार संकेत नं.</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="परिवार संकेत नं. प्रविष्ट गर्नुहोस्"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>थप स्थानीय जानकारी</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>टोल/बस्ती</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="टोल/बस्ती प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="developmentOrganization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>विकास संस्था</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="विकास संस्था प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="dateOfInterview"
            render={({ field }) => (
              <FormItem>
                <FormLabel>अन्तरवार्ता मिति</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    placeholder="अन्तरवार्ता मिति छनौट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Replace with non-rerendering debug info */}
      <div className="mb-4 p-2 bg-gray-50 rounded border">
        <details>
          <summary className="text-sm font-medium cursor-pointer">
            Form Data Debug
          </summary>
          <button
            type="button"
            onClick={() => {
              const formContext = useFormContext();
              console.log({
                province: formContext.getValues("province"),
                district: formContext.getValues("district"),
                localLevel: formContext.getValues("localLevel"),
                wardNo: formContext.getValues("wardNo"),
              });
            }}
            className="text-xs text-blue-500"
          >
            Log field values
          </button>
        </details>
      </div>
    </div>
  );
}
