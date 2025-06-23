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

interface ManagementPracticesProps {
  form: UseFormReturn<any>;
}

export function ManagementPractices({ form }: ManagementPracticesProps) {
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium">कृषि उत्पादन प्रक्रिया</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="usesChemicalFertilizer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>रासायनिक मल</FormLabel>
                <FormDescription>रासायनिक मलको प्रयोग गरिन्छ?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usesPesticides"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>विषादीहरू</FormLabel>
                <FormDescription>
                  किटनाशक विषादीहरूको प्रयोग गरिन्छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="usesOrganicMethods"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>अर्गानिक विधि</FormLabel>
                <FormDescription>
                  प्राङ्गारिक खेती विधिहरू प्रयोग गरिन्छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="composting"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>कम्पोस्टिङ</FormLabel>
                <FormDescription>
                  जैविक पदार्थबाट कम्पोस्ट मल बनाइन्छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="soilConservationPractices"
        render={({ field }) => (
          <FormItem>
            <FormLabel>माटो संरक्षण अभ्यासहरू</FormLabel>
            <FormControl>
              <Textarea
                placeholder="माटो संरक्षणका लागि गरिने कार्यहरू"
                {...field}
              />
            </FormControl>
            <FormDescription>
              उदाहरण: स्थानान्तरण खेती, छापो, मल्चिंग, गह्रा निर्माण, आदि
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="rainwaterHarvesting"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>वर्षाको पानी संकलन</FormLabel>
                <FormDescription>वर्षाको पानी संकलन गरिन्छ?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manureManagement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>मलमूत्र व्यवस्थापन</FormLabel>
              <FormControl>
                <Input placeholder="मलमूत्र व्यवस्थापन विधिहरू" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="hasCertifications"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>प्रमाणपत्र/प्रमाणीकरण</FormLabel>
                <FormDescription>
                  कुनै कृषि प्रमाणपत्र वा प्रमाणीकरण छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("hasCertifications") && (
          <FormField
            control={form.control}
            name="certificationDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>प्रमाणीकरण विवरण</FormLabel>
                <FormControl>
                  <Input
                    placeholder="प्रमाणपत्र वा प्रमाणीकरण विवरण"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="text-lg font-medium pt-4">प्राविधिक सहयोग र तालिम</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="receivesExtensionServices"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>प्राविधिक सेवा</FormLabel>
                <FormDescription>
                  कृषि प्राविधिक सेवा प्राप्त गर्छ?
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {form.watch("receivesExtensionServices") && (
          <FormField
            control={form.control}
            name="extensionServiceProvider"
            render={({ field }) => (
              <FormItem>
                <FormLabel>सेवा प्रदायक</FormLabel>
                <FormControl>
                  <Input placeholder="कृषि प्राविधिक सेवा प्रदायक" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        control={form.control}
        name="trainingReceived"
        render={({ field }) => (
          <FormItem>
            <FormLabel>प्राप्त तालिमहरू</FormLabel>
            <FormControl>
              <Textarea placeholder="प्राप्त तालिमहरूको विवरण" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="technicalSupportNeeds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>प्राविधिक सहयोग आवश्यकता</FormLabel>
            <FormControl>
              <Textarea placeholder="आवश्यक प्राविधिक सहयोग" {...field} />
            </FormControl>
            <FormDescription>
              फार्मको लागि कस्तो प्राविधिक सहयोग आवश्यक छ?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="text-lg font-medium pt-4">समस्या र अवसरहरू</div>

      <FormField
        control={form.control}
        name="majorChallenges"
        render={({ field }) => (
          <FormItem>
            <FormLabel>प्रमुख समस्याहरू</FormLabel>
            <FormControl>
              <Textarea placeholder="फार्मको प्रमुख समस्याहरू" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="disasterVulnerabilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>प्राकृतिक प्रकोप जोखिमहरू</FormLabel>
            <FormControl>
              <Textarea placeholder="प्राकृतिक प्रकोप जोखिमहरू" {...field} />
            </FormControl>
            <FormDescription>
              बाढी, पहिरो, सुख्खा, आगलागी जस्ता जोखिमहरू
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="growthOpportunities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>विकासका अवसरहरू</FormLabel>
            <FormControl>
              <Textarea placeholder="विकासका अवसरहरू" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="futureExpansionPlans"
        render={({ field }) => (
          <FormItem>
            <FormLabel>भविष्यको विस्तार योजनाहरू</FormLabel>
            <FormControl>
              <Textarea placeholder="भविष्यको विस्तार योजनाहरू" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
