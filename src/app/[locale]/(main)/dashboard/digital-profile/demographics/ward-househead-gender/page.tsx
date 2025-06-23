"use client";

import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, PlusCircle, Users } from "lucide-react";
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
import WardWiseHouseHeadGenderTable from "./_components/ward-househead-gender-table";
import WardWiseHouseHeadGenderForm from "./_components/ward-househead-gender-form";
import WardWiseHouseHeadGenderChart from "./_components/ward-househead-gender-chart";

export default function WardWiseHouseHeadGenderPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, error } =
    api.profile.demographics.wardWiseHouseHeadGender.getAll.useQuery();

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
        title="वडा अनुसार घरमूली लिङ्ग डाटा"
        subtitle="वडा अनुसार घरमूली लिङ्ग वितरण"
        icon={<Users className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार घरमूली लिङ्ग डाटा"
        subtitle="वडा अनुसार घरमूली लिङ्ग वितरण"
        icon={<Users className="h-6 w-6 text-primary" />}
      >
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>त्रुटि</AlertTitle>
          <AlertDescription>
            {error.message ||
              "वडा अनुसार घरमूली लिङ्ग डाटा प्राप्त गर्न असमर्थ"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार घरमूली लिङ्ग डाटा"
      subtitle="वडा अनुसार घरमूली लिङ्ग वितरण व्यवस्थापन गर्नुहोस्"
      icon={<Users className="h-6 w-6 text-primary" />}
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
          <WardWiseHouseHeadGenderTable data={data || []} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <WardWiseHouseHeadGenderChart data={data || []} />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "घरमूली लिङ्ग डाटा सम्पादन"
                : "नयाँ घरमूली लिङ्ग डाटा थप्नुहोस्"}
            </DialogTitle>
            <DialogDescription>
              वडा नम्बर, लिङ्ग, र जनसंख्या विवरणहरू प्रविष्ट गर्नुहोस्
            </DialogDescription>
          </DialogHeader>
          <WardWiseHouseHeadGenderForm
            editId={editingId}
            onClose={handleFormClose}
            existingData={data || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
