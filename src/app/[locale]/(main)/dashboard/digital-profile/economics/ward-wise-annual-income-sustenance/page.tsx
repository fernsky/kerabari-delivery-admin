"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardAnnualIncomeSustenanceTable from "./_components/ward-annual-income-sustenance-table";
import WardAnnualIncomeSustenanceForm from "./_components/ward-annual-income-sustenance-form";
import WardAnnualIncomeSustenanceChart from "./_components/ward-annual-income-sustenance-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseAnnualIncomeSustenancePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: annualIncomeSustenanceData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseAnnualIncomeSustenance.getAll.useQuery();

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
        title="वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण"
        subtitle="वडा अनुसार वार्षिक आम्दानी हुने महिनाको सम्बन्धी जानकारी"
        icon={<CalendarIcon className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण"
        subtitle="वडा अनुसार वार्षिक आम्दानी हुने महिनाको सम्बन्धी जानकारी"
        icon={<CalendarIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण"
      subtitle="वडा अनुसार वार्षिक आम्दानी हुने महिनाको सम्बन्धी जानकारी"
      icon={<CalendarIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ वार्षिक आम्दानी हुने महिनाको विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardAnnualIncomeSustenanceChart
        data={annualIncomeSustenanceData || []}
      />

      <WardAnnualIncomeSustenanceTable
        data={annualIncomeSustenanceData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "वार्षिक आम्दानी हुने महिनाको विवरण सम्पादन"
                : "नयाँ वार्षिक आम्दानी हुने महिनाको विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardAnnualIncomeSustenanceForm
            editId={editId}
            onClose={handleFormClose}
            existingData={annualIncomeSustenanceData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
