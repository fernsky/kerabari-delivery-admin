"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, PackageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import ImportedProductsTable from "./_components/imported-products-table";
import ImportedProductsForm from "./_components/imported-products-form";
import ImportedProductsChart from "./_components/imported-products-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function ImportedProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: importedProductsData,
    isLoading,
    isError,
  } = api.profile.economics.importedProducts.getAll.useQuery();

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
        title="आयातित उत्पादनहरू"
        subtitle="स्थानीय क्षेत्रमा आयात गरिएका उत्पादनहरूको विवरण"
        icon={<PackageIcon className="h-6 w-6 text-primary" />}
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
        title="आयातित उत्पादनहरू"
        subtitle="स्थानीय क्षेत्रमा आयात गरिएका उत्पादनहरूको विवरण"
        icon={<PackageIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="आयातित उत्पादनहरू"
      subtitle="स्थानीय क्षेत्रमा आयात गरिएका उत्पादनहरूको विवरण"
      icon={<PackageIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ आयातित उत्पादन थप्नुहोस्
        </Button>
      }
    >
      <ImportedProductsChart data={importedProductsData || []} />

      <ImportedProductsTable
        data={importedProductsData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "आयातित उत्पादन सम्पादन"
                : "नयाँ आयातित उत्पादन थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <ImportedProductsForm
            editId={editId}
            onClose={handleFormClose}
            existingData={importedProductsData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
