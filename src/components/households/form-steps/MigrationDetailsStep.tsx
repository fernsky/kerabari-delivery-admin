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
import { Input } from "@/components/ui/input";

export default function MigrationDetailsStep() {
  const { control } = useFormContext<Household>();

  const residenceReasons = [
    { value: "ancestral", label: "पुर्ख्यौली बसोबास" },
    { value: "marriage", label: "विवाह पछि" },
    { value: "education", label: "शिक्षा" },
    { value: "employment", label: "रोजगारी" },
    { value: "business", label: "व्यापार / व्यवसाय" },
    { value: "natural_disaster", label: "प्राकृतिक प्रकोप" },
    { value: "conflict", label: "द्वन्द्व" },
    { value: "other", label: "अन्य" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>जन्मस्थान विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="birth_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जन्म प्रदेश</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="foreign">विदेश</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="birth_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जन्म जिल्ला</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="जन्म जिल्ला" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="birth_place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जन्म स्थान</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="स्थानीय तह / गाउँ / टोल" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="birth_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>जन्म देश</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="जन्म देश"
                      defaultValue="नेपाल"
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
          <CardTitle>बसाइँसराई विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="prior_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अघिल्लो बसोबास प्रदेश</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
                        <SelectItem value="foreign">विदेश</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="prior_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अघिल्लो बसोबास जिल्ला</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="अघिल्लो बसोबास जिल्ला" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="prior_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अघिल्लो बसोबास स्थान</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="स्थानीय तह / गाउँ / टोल" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="prior_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>अघिल्लो बसोबास देश</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="अघिल्लो बसोबास देश"
                      defaultValue="नेपाल"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="residence_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>यहाँ बसोबास गर्नुको कारण</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="कारण छनौट गर्नुहोस्" />
                    </SelectTrigger>
                    <SelectContent>
                      {residenceReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
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
          <CardTitle>व्यवसाय विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="has_business"
            render={({ field }) => (
              <FormItem>
                <FormLabel>व्यवसाय/उद्योग सञ्चालन गर्नुभएको छ?</FormLabel>
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
            name="have_remittance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>विप्रेषण आम्दानी छ?</FormLabel>
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
        </CardContent>
      </Card>
    </div>
  );
}
