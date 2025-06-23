"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, LineChart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseDemographicSummaryTable from "./_components/ward-wise-demographic-summary-table";
import WardWiseDemographicSummaryForm from "./_components/ward-wise-demographic-summary-form";
import WardWiseDemographicSummaryChart from "./_components/ward-wise-demographic-summary-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseDemographicSummaryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: wardDemographicData,
    isLoading,
    isError,
  } = api.profile.demographics.wardWiseDemographicSummary.getAll.useQuery();

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
        title="वडा जनसांख्यिकी विवरण"
        subtitle="वडा अनुसार जनसंख्या र घरधुरी विवरण"
        icon={<LineChart className="h-6 w-6 text-primary" />}
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
        title="वडा जनसांख्यिकी विवरण"
        subtitle="वडा अनुसार जनसंख्या र घरधुरी विवरण"
        icon={<LineChart className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा जनसांख्यिकी विवरण"
      subtitle="वडा अनुसार जनसंख्या र घरधुरी विवरण"
      icon={<LineChart className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ वडा जनसांख्यिकी थप्नुहोस्
        </Button>
      }
    >
      <WardWiseDemographicSummaryChart data={wardDemographicData || []} />

      <WardWiseDemographicSummaryTable
        data={wardDemographicData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "वडा जनसांख्यिकी विवरण सम्पादन"
                : "नयाँ वडा जनसांख्यिकी विवरण"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseDemographicSummaryForm
            editId={editId}
            onClose={handleFormClose}
            existingData={wardDemographicData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
