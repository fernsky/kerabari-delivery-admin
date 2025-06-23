"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, GraduationCap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseTrainedPopulationTable from "./_components/ward-wise-trained-population-table";
import WardWiseTrainedPopulationForm from "./_components/ward-wise-trained-population-form";
import WardWiseTrainedPopulationChart from "./_components/ward-wise-trained-population-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseTrainedPopulationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: trainedPopulationData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseTrainedPopulation.getAll.useQuery();

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
        title="वडा अनुसार तालिम प्राप्त जनसंख्या विवरण"
        subtitle="वडा अनुसार तालिम प्राप्त जनसंख्या सम्बन्धी विवरण"
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार तालिम प्राप्त जनसंख्या विवरण"
        subtitle="वडा अनुसार तालिम प्राप्त जनसंख्या सम्बन्धी विवरण"
        icon={<GraduationCap className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार तालिम प्राप्त जनसंख्या विवरण"
      subtitle="वडा अनुसार तालिम प्राप्त जनसंख्या सम्बन्धी विवरण"
      icon={<GraduationCap className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ तालिम प्राप्त जनसंख्या विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseTrainedPopulationChart data={trainedPopulationData || []} />

      <WardWiseTrainedPopulationTable
        data={trainedPopulationData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "तालिम प्राप्त जनसंख्या विवरण सम्पादन"
                : "नयाँ तालिम प्राप्त जनसंख्या विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseTrainedPopulationForm
            editId={editId}
            onClose={handleFormClose}
            existingData={trainedPopulationData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
