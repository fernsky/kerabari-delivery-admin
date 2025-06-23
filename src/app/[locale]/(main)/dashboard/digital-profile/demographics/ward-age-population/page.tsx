"use client";

import { api } from "@/trpc/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, PlusCircle, UsersRound } from "lucide-react";
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
import WardAgeWisePopulationTable from "./_components/ward-age-population-table";
import WardAgeWisePopulationForm from "./_components/ward-age-population-form";
import WardAgeWisePopulationChart from "./_components/ward-age-population-chart";

export default function WardAgePopulationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isLoading, error } =
    api.profile.demographics.wardAgeWisePopulation.getAll.useQuery();

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
        title="उमेर अनुसार जनसंख्या"
        subtitle="विभिन्न उमेर समूह अनुसार वडा जनसंख्या डाटा"
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
        title="उमेर अनुसार जनसंख्या"
        subtitle="विभिन्न उमेर समूह अनुसार वडा जनसंख्या डाटा"
      >
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>त्रुटि</AlertTitle>
          <AlertDescription>
            {error.message || "उमेर अनुसार जनसंख्या डाटा प्राप्त गर्न असमर्थ"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="उमेर अनुसार जनसंख्या"
      subtitle="विभिन्न उमेर समूह अनुसार वडा जनसंख्या डाटा व्यवस्थापन गर्नुहोस्"
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
          <WardAgeWisePopulationTable data={data || []} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <WardAgeWisePopulationChart data={data || []} />
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "उमेर अनुसार जनसंख्या डाटा सम्पादन"
                : "नयाँ उमेर अनुसार जनसंख्या डाटा थप्नुहोस्"}
            </DialogTitle>
            <DialogDescription>
              वडा नम्बर, उमेर समूह, लिङ्ग, र जनसंख्या विवरणहरू प्रविष्ट
              गर्नुहोस्
            </DialogDescription>
          </DialogHeader>
          <WardAgeWisePopulationForm
            editId={editingId}
            onClose={handleFormClose}
            existingData={data || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
