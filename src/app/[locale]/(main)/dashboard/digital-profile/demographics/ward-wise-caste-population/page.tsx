"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseCastePopulationTable from "./_components/ward-wise-caste-population-table";
import WardWiseCastePopulationForm from "./_components/ward-wise-caste-population-form";
import WardWiseCastePopulationChart from "./_components/ward-wise-caste-population-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseCastePopulationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: wardCasteData,
    isLoading,
    isError,
  } = api.profile.demographics.wardWiseCastePopulation.getAll.useQuery();

  const handleEdit = (id: string) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  if (isLoading) {
    return (
      <ContentLayout
        title="वडा जात/जनजाति जनसंख्या विवरण"
        subtitle="वडा अनुसार जात/जनजाति जनसंख्या विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout
        title="वडा जात/जनजाति जनसंख्या विवरण"
        subtitle="वडा अनुसार जात/जनजाति जनसंख्या विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा जात/जनजाति जनसंख्या विवरण"
      subtitle="वडा अनुसार जात/जनजाति जनसंख्या विवरण"
      icon={<UsersIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ जात/जनजाति विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseCastePopulationChart
        data={(wardCasteData || []).map((item) => ({
          ...item,
          casteName: item.casteType,
        }))}
      />

      <WardWiseCastePopulationTable
        data={(wardCasteData || []).map((item) => ({
          ...item,
          casteName: item.casteType,
        }))}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "जात/जनजाति विवरण सम्पादन"
                : "नयाँ जात/जनजाति विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseCastePopulationForm
            editId={editId}
            onClose={handleFormClose}
            existingData={wardCasteData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
