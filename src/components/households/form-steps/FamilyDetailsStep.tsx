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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FamilyDetailsStep() {
  const { control, formState } = useFormContext();
  const { errors } = formState;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>परिवार विवरण</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="familyHeadName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>परिवार मूलिको नाम</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="परिवार मूलिको नाम प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="familyHeadPhoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>परिवार मूलिको फोन नम्बर</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="परिवार मूलिको फोन नम्बर प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="totalMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>घरमा बस्ने कुल सदस्य संख्या</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || undefined)
                    }
                    placeholder="कुल सदस्य संख्या प्रविष्ट गर्नुहोस्"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="areMembersElsewhere"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value === "yes"}
                    onCheckedChange={(checked) => {
                      field.onChange(checked ? "yes" : "no");
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    के परिवारका कोही सदस्य अन्यत्र बसोबास गर्छन्?
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="totalElsewhereMembers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>अन्यत्र बसोबास गर्ने सदस्य संख्या</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || undefined)
                    }
                    placeholder="अन्यत्र बसोबास गर्ने सदस्य संख्या प्रविष्ट गर्नुहोस्"
                  />
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
