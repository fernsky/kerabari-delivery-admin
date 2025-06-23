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

export default function EconomicDetailsStep() {
  const { control, watch } = useFormContext<Household>();

  const incomeSources = [
    { id: "agriculture", label: "कृषि" },
    { id: "business", label: "व्यापार / व्यवसाय" },
    { id: "service", label: "जागिर / सेवा" },
    { id: "daily_wage", label: "ज्याला मजदुरी" },
    { id: "pension", label: "पेन्सन" },
    { id: "remittance", label: "विप्रेषण" },
    { id: "rent", label: "घरभाडा" },
  ];

  const organizations = [
    { id: "bank", label: "बैंक" },
    { id: "cooperative", label: "सहकारी" },
    { id: "microfinance", label: "लघुवित्त" },
    { id: "informal", label: "साहु / साथीभाई" },
  ];

  const loanUses = [
    { id: "agriculture", label: "कृषि" },
    { id: "business", label: "व्यापार / व्यवसाय" },
    { id: "education", label: "शिक्षा" },
    { id: "foreign_employment", label: "वैदेशिक रोजगारी" },
    { id: "health", label: "स्वास्थ्य उपचार" },
    { id: "home_construction", label: "घर निर्माण" },
  ];

  const financialAccounts = [
    { id: "bank", label: "बैंक खाता" },
    { id: "cooperative", label: "सहकारी खाता" },
    { id: "mobile_banking", label: "मोबाइल बैंकिङ्ग" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>आय स्रोत र सम्पत्ति</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="income_sources"
            render={() => (
              <FormItem>
                <FormLabel>आम्दानीका स्रोतहरू</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {incomeSources.map((source) => (
                    <FormField
                      key={source.id}
                      control={control}
                      name="income_sources"
                      render={({ field }) => {
                        const isChecked =
                          field.value?.includes(source.id) || false;

                        return (
                          <FormItem
                            key={source.id}
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
                                      source.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== source.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {source.label}
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
            name="has_properties_elsewhere"
            render={({ field }) => (
              <FormItem>
                <FormLabel>अन्य ठाउँमा जग्गा/सम्पत्ति छ?</FormLabel>
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
            name="has_female_named_properties"
            render={({ field }) => (
              <FormItem>
                <FormLabel>महिलाको नाममा सम्पत्ति छ?</FormLabel>
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

      <Card>
        <CardHeader>
          <CardTitle>वित्तीय सेवाहरू</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={control}
            name="organizations_loaned_from"
            render={() => (
              <FormItem>
                <FormLabel>ऋण लिएका संस्थाहरू</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {organizations.map((org) => (
                    <FormField
                      key={org.id}
                      control={control}
                      name="organizations_loaned_from"
                      render={({ field }) => {
                        const isChecked =
                          field.value?.includes(org.id) || false;

                        return (
                          <FormItem
                            key={org.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];

                                  if (checked) {
                                    field.onChange([...currentValues, org.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== org.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {org.label}
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
            name="loan_uses"
            render={() => (
              <FormItem>
                <FormLabel>ऋणको उपयोग</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {loanUses.map((use) => (
                    <FormField
                      key={use.id}
                      control={control}
                      name="loan_uses"
                      render={({ field }) => {
                        const isChecked =
                          field.value?.includes(use.id) || false;

                        return (
                          <FormItem
                            key={use.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || [];

                                  if (checked) {
                                    field.onChange([...currentValues, use.id]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== use.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {use.label}
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
            name="financial_accounts"
            render={() => (
              <FormItem>
                <FormLabel>वित्तीय खाताहरू</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {financialAccounts.map((account) => (
                    <FormField
                      key={account.id}
                      control={control}
                      name="financial_accounts"
                      render={({ field }) => {
                        const isChecked =
                          field.value?.includes(account.id) || false;

                        return (
                          <FormItem
                            key={account.id}
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
                                      account.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== account.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {account.label}
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
            name="have_health_insurance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>स्वास्थ्य बीमा छ?</FormLabel>
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
