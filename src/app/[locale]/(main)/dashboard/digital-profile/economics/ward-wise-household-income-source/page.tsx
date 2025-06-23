"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, HomeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseHouseholdIncomeSourceTable from "./_components/ward-wise-household-income-source-table";
import WardWiseHouseholdIncomeSourceForm from "./_components/ward-wise-household-income-source-form";
import WardWiseHouseholdIncomeSourceChart from "./_components/ward-wise-household-income-source-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseHouseholdIncomeSourcePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: householdIncomeSourceData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseHouseholdIncomeSource.getAll.useQuery();

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
        title="वडा अनुसार घरधुरी आय स्रोत विवरण"
        subtitle="वडा अनुसार घरधुरीको आय स्रोत सम्बन्धी जानकारी"
        icon={<HomeIcon className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार घरधुरी आय स्रोत विवरण"
        subtitle="वडा अनुसार घरधुरीको आय स्रोत सम्बन्धी जानकारी"
        icon={<HomeIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार घरधुरी आय स्रोत विवरण"
      subtitle="वडा अनुसार घरधुरीको आय स्रोत सम्बन्धी जानकारी"
      icon={<HomeIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ घरधुरी आय स्रोत विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseHouseholdIncomeSourceChart
        data={householdIncomeSourceData || []}
      />

      <WardWiseHouseholdIncomeSourceTable
        data={householdIncomeSourceData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "घरधुरी आय स्रोत विवरण सम्पादन"
                : "नयाँ घरधुरी आय स्रोत विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseHouseholdIncomeSourceForm
            editId={editId}
            onClose={handleFormClose}
            existingData={householdIncomeSourceData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
