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
import WardWiseHouseholdLandPossessionsTable from "./_components/ward-wise-household-land-possessions-table";
import WardWiseHouseholdLandPossessionsForm from "./_components/ward-wise-household-land-possessions-form";
import WardWiseHouseholdLandPossessionsChart from "./_components/ward-wise-household-land-possessions-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseHouseholdLandPossessionsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: householdLandPossessionsData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseHouseholdLandPossessions.getAll.useQuery();

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
        title="वडा अनुसार घरधुरी जग्गा स्वामित्व विवरण"
        subtitle="वडा अनुसार जग्गाको स्वामित्व भएका घरधुरीहरूको जानकारी"
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
        title="वडा अनुसार घरधुरी जग्गा स्वामित्व विवरण"
        subtitle="वडा अनुसार जग्गाको स्वामित्व भएका घरधुरीहरूको जानकारी"
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
      title="वडा अनुसार घरधुरी जग्गा स्वामित्व विवरण"
      subtitle="वडा अनुसार जग्गाको स्वामित्व भएका घरधुरीहरूको जानकारी"
      icon={<HomeIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ घरधुरी जग्गा स्वामित्व विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseHouseholdLandPossessionsChart
        data={householdLandPossessionsData || []}
      />

      <WardWiseHouseholdLandPossessionsTable
        data={householdLandPossessionsData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "घरधुरी जग्गा स्वामित्व विवरण सम्पादन"
                : "नयाँ घरधुरी जग्गा स्वामित्व विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseHouseholdLandPossessionsForm
            editId={editId}
            onClose={handleFormClose}
            existingData={householdLandPossessionsData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
