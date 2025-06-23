"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, CoinsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardWiseRemittanceExpenseTable from "./_components/ward-wise-remittance-expense-table";
import WardWiseRemittanceExpenseForm from "./_components/ward-wise-remittance-expense-form";
import WardWiseRemittanceExpenseChart from "./_components/ward-wise-remittance-expense-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseRemittanceExpenseTypePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: remittanceExpenseData,
    isLoading,
    isError,
  } = api.profile.economics.wardWiseRemittanceExpenses.getAll.useQuery();

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
        title="वडा अनुसार रेमिट्यान्स खर्च प्रकार विवरण"
        subtitle="वडा अनुसार रेमिट्यान्स खर्च प्रकार सम्बन्धी विवरण"
        icon={<CoinsIcon className="h-6 w-6 text-primary" />}
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
        title="वडा अनुसार रेमिट्यान्स खर्च प्रकार विवरण"
        subtitle="वडा अनुसार रेमिट्यान्स खर्च प्रकार सम्बन्धी विवरण"
        icon={<CoinsIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार रेमिट्यान्स खर्च प्रकार विवरण"
      subtitle="वडा अनुसार रेमिट्यान्स खर्च प्रकार सम्बन्धी विवरण"
      icon={<CoinsIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ रेमिट्यान्स खर्च प्रकार विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardWiseRemittanceExpenseChart data={remittanceExpenseData || []} />

      <WardWiseRemittanceExpenseTable
        data={remittanceExpenseData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "रेमिट्यान्स खर्च प्रकार विवरण सम्पादन"
                : "नयाँ रेमिट्यान्स खर्च प्रकार विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseRemittanceExpenseForm
            editId={editId}
            onClose={handleFormClose}
            existingData={remittanceExpenseData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
