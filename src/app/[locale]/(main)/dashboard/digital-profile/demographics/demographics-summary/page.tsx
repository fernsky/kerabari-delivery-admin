"use client";

import { PageHeader } from "@/components/page-header";
import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, BarChart3, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DemographicSummaryForm from "./_components/demographic-summary-form";
import DemographicVisualization from "./_components/demographic-visualization";
import DemographicSummaryReport from "./_components/demographic-summary-report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function DemographicSummaryPage() {
  const { data, isLoading, error } =
    api.profile.demographics.summary.get.useQuery();

  if (isLoading) {
    return (
      <ContentLayout
        title="जनसांख्यिकीय सारांश"
        subtitle="गाउँपालिकाको महत्वपूर्ण जनसांख्यिकीय तथ्याङ्क"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      >
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-lg text-gray-500">डाटा लोड गर्दै...</span>
        </div>
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout
        title="जनसांख्यिकीय सारांश"
        subtitle="गाउँपालिकाको महत्वपूर्ण जनसांख्यिकीय तथ्याङ्क"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      >
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>त्रुटि</AlertTitle>
          <AlertDescription>
            {error.message || "जनसांख्यिकीय डाटा प्राप्त गर्न असमर्थ"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="जनसांख्यिकीय सारांश"
      subtitle="गाउँपालिकाको महत्वपूर्ण जनसांख्यिकीय तथ्याङ्क हेर्नुहोस् वा परिमार्जन गर्नुहोस्"
      icon={<BarChart3 className="h-6 w-6 text-primary" />}
    >
      <Tabs defaultValue="edit" className="mt-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="edit">सम्पादन</TabsTrigger>
          <TabsTrigger value="view">दृश्य</TabsTrigger>
          <TabsTrigger value="report">प्रतिवेदन</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium">
                जनसांख्यिकीय डाटा सम्पादन
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DemographicSummaryForm initialData={data} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="mt-6">
          <DemographicVisualization data={data} />
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                जनसांख्यिकीय प्रतिवेदन
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DemographicSummaryReport data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
