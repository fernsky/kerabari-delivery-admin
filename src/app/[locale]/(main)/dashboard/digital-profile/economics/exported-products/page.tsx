"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLinkIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import ExportedProductsTable from "./_components/exported-products-table";
import ExportedProductsForm from "./_components/exported-products-form";
import ExportedProductsChart from "./_components/exported-products-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function ExportedProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: exportedProductsData,
    isLoading,
    isError,
  } = api.profile.economics.exportedProducts.getAll.useQuery();

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
        title="निर्यातित उत्पादनहरू"
        subtitle="स्थानीय क्षेत्रबाट निर्यात गरिएका उत्पादनहरूको विवरण"
        icon={<ExternalLinkIcon className="h-6 w-6 text-primary" />}
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
        title="निर्यातित उत्पादनहरू"
        subtitle="स्थानीय क्षेत्रबाट निर्यात गरिएका उत्पादनहरूको विवरण"
        icon={<ExternalLinkIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="निर्यातित उत्पादनहरू"
      subtitle="स्थानीय क्षेत्रबाट निर्यात गरिएका उत्पादनहरूको विवरण"
      icon={<ExternalLinkIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ निर्यातित उत्पादन थप्नुहोस्
        </Button>
      }
    >
      <ExportedProductsChart data={exportedProductsData || []} />

      <ExportedProductsTable
        data={exportedProductsData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "निर्यातित उत्पादन सम्पादन"
                : "नयाँ निर्यातित उत्पादन थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <ExportedProductsForm
            editId={editId}
            onClose={handleFormClose}
            existingData={exportedProductsData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
