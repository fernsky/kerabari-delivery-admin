"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { PlusCircle, CoinsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentLayout } from "@/components/admin-panel/content-layout";

import WardWiseHouseholdsLoanUseTable from "./_components/ward-wise-households-loan-use-table";
import WardWiseHouseholdsLoanUseForm from "./_components/ward-wise-households-loan-use-form";
import WardWiseHouseholdsLoanUseChart from "./_components/ward-wise-households-loan-use-chart";

export default function WardWiseHouseholdsLoanUsePage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch data
  const { data, isLoading, isError, error } =
    api.profile.economics.wardWiseHouseholdsLoanUse.getAll.useQuery();

  // Handle edit action
  const handleEdit = (id: string) => {
    setEditId(id);
    setShowForm(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
  };

  if (isLoading) {
    return (
      <ContentLayout
        title="वडा अनुसार घरधुरीको ऋणको उपयोग"
        subtitle="वडा अनुसार घरधुरीको ऋणको उपयोग तथ्याङ्क व्यवस्थापन"
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
        title="वडा अनुसार घरधुरीको ऋणको उपयोग"
        subtitle="वडा अनुसार घरधुरीको ऋणको उपयोग तथ्याङ्क व्यवस्थापन"
        icon={<CoinsIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          {error?.message ||
            "डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।"}
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार घरधुरीको ऋणको उपयोग"
      subtitle="वडा अनुसार घरधुरीको ऋणको उपयोग तथ्याङ्क व्यवस्थापन"
      icon={<CoinsIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ थप्नुहोस्
        </Button>
      }
    >
      <WardWiseHouseholdsLoanUseChart data={data || []} />

      <WardWiseHouseholdsLoanUseTable data={data || []} onEdit={handleEdit} />

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "वडा अनुसार घरधुरीको ऋणको उपयोग सम्पादन गर्नुहोस्"
                : "नयाँ वडा अनुसार घरधुरीको ऋणको उपयोग थप्नुहोस्"}
            </DialogTitle>
            <DialogDescription>
              तल दिइएको फारम भरेर वडा अनुसार घरधुरीको ऋणको उपयोग डाटा
              {editId ? " अपडेट " : " थप "}
              गर्नुहोस्।
            </DialogDescription>
          </DialogHeader>

          {showForm && (
            <WardWiseHouseholdsLoanUseForm
              editId={editId}
              onClose={handleCloseForm}
              existingData={data || []}
            />
          )}
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
