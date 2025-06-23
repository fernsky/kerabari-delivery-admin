"use client";

import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, PlusCircle, GraduationCap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import WardWiseAbsenteeEducationalLevelTable from "./_components/ward-wise-absentee-educational-level-table";
import WardWiseAbsenteeEducationalLevelForm from "./_components/ward-wise-absentee-educational-level-form";
import WardWiseAbsenteeEducationalLevelChart from "./_components/ward-wise-absentee-educational-level-chart";

export default function WardWiseAbsenteeEducationalLevelPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, error } =
    api.profile.demographics.wardWiseAbsenteeEducationalLevel.getAll.useQuery();

  const handleAddNew = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <ContentLayout
        title="वडा अनुसार अनुपस्थित शैक्षिक स्तर डाटा"
        subtitle="वडा अनुसार अनुपस्थित जनसंख्याको शैक्षिक स्तर वितरण"
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार अनुपस्थित शैक्षिक स्तर डाटा"
        subtitle="वडा अनुसार अनुपस्थित जनसंख्याको शैक्षिक स्तर वितरण"
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
      >
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>त्रुटि</AlertTitle>
          <AlertDescription>
            {error.message ||
              "वडा अनुसार अनुपस्थित शैक्षिक स्तर डाटा प्राप्त गर्न असमर्थ"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  // Process the raw data to add educational level display names and ensure wardNumber is always a number
  const processedData =
    data?.map((item) => ({
      ...item,
      educationalLevelDisplay: getEducationalLevelDisplay(
        item.educationalLevel,
      ),
      wardNumber: item.wardNumber ?? 0, // Replace null with 0 to ensure wardNumber is always a number
    })) || [];

  return (
    <ContentLayout
      title="वडा अनुसार अनुपस्थित शैक्षिक स्तर डाटा"
      subtitle="वडा अनुसार अनुपस्थित जनसंख्याको शैक्षिक स्तर वितरण व्यवस्थापन गर्नुहोस्"
      icon={<GraduationCap className="h-6 w-6 text-primary" />}
      actions={
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          नयाँ डाटा थप्नुहोस्
        </Button>
      }
    >
      <Tabs defaultValue="table" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="table">तालिका दृश्य</TabsTrigger>
          <TabsTrigger value="chart">चार्ट दृश्य</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <WardWiseAbsenteeEducationalLevelTable
            data={processedData}
            onEdit={handleEdit}
          />
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <WardWiseAbsenteeEducationalLevelChart data={processedData} />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "अनुपस्थित शैक्षिक स्तर डाटा सम्पादन"
                : "नयाँ अनुपस्थित शैक्षिक स्तर डाटा थप्नुहोस्"}
            </DialogTitle>
            <DialogDescription>
              वडा नम्बर, शैक्षिक स्तर, र अनुपस्थित जनसंख्या विवरणहरू प्रविष्ट
              गर्नुहोस्
            </DialogDescription>
          </DialogHeader>
          <WardWiseAbsenteeEducationalLevelForm
            editId={editingId}
            onClose={handleFormClose}
            existingData={data || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}

// Helper function to get display names for educational levels
const getEducationalLevelDisplay = (level: string): string => {
  const displayMap: Record<string, string> = {
    CHILD_DEVELOPMENT_CENTER: "बालविकास केन्द्र / मंटेस्वोरी",
    NURSERY: "नर्सरी/केजी",
    CLASS_1: "कक्षा १",
    CLASS_2: "कक्षा २",
    CLASS_3: "कक्षा ३",
    CLASS_4: "कक्षा ४",
    CLASS_5: "कक्षा ५",
    CLASS_6: "कक्षा ६",
    CLASS_7: "कक्षा ७",
    CLASS_8: "कक्षा ८",
    CLASS_9: "कक्षा ९",
    CLASS_10: "कक्षा १०",
    SLC_LEVEL: "एसईई/एसएलसी/सो सरह",
    CLASS_12_LEVEL: "कक्षा १२ वा PCL वा सो सरह",
    BACHELOR_LEVEL: "स्नातक वा सो सरह",
    MASTERS_LEVEL: "स्नातकोत्तर वा सो सरह",
    PHD_LEVEL: "पीएचडी वा सो सरह",
    OTHER: "अन्य शैक्षिक योग्यता",
    INFORMAL_EDUCATION: "अनौपचारिक शिक्षा",
    EDUCATED: "साक्षर",
    UNKNOWN: "थाहा नभएको",
  };

  return displayMap[level] || level;
};
