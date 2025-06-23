"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseHouseholdsOnLoanTable from "./_components/ward-wise-households-on-loan-table";
import WardWiseHouseholdsOnLoanForm from "./_components/ward-wise-households-on-loan-form";
import WardWiseHouseholdsOnLoanChart from "./_components/ward-wise-households-on-loan-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseHouseholdsOnLoanPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: householdsOnLoanData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseHouseholdsOnLoan.getAll.useQuery();

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
        title="वडा अनुसार ऋण लिएका घरधुरी विवरण"
        subtitle="वडा अनुसार ऋण लिएका घरधुरीहरूको जानकारी"
        icon={<CreditCard className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार ऋण लिएका घरधुरी विवरण"
        subtitle="वडा अनुसार ऋण लिएका घरधुरीहरूको जानकारी"
        icon={<CreditCard className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार ऋण लिएका घरधुरी विवरण"
      subtitle="वडा अनुसार ऋण लिएका घरधुरीहरूको जानकारी"
      icon={<CreditCard className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ ऋण लिएका घरधुरी विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseHouseholdsOnLoanChart data={householdsOnLoanData || []} />

      <WardWiseHouseholdsOnLoanTable
        data={householdsOnLoanData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "ऋण लिएका घरधुरी विवरण सम्पादन"
                : "नयाँ ऋण लिएका घरधुरी विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseHouseholdsOnLoanForm
            editId={editId}
            onClose={handleFormClose}
            existingData={householdsOnLoanData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
