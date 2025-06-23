"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, UsersIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardAgeGenderWiseAbsenteeTable from "./_components/ward-age-gender-wise-absentee-table";
import WardAgeGenderWiseAbsenteeForm from "./_components/ward-age-gender-wise-absentee-form";
import WardAgeGenderWiseAbsenteeChart from "./_components/ward-age-gender-wise-absentee-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardAgeGenderWiseAbsenteePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: wardAgeGenderData,
    isLoading,
    isError,
  } = api.profile.demographics.wardAgeGenderWiseAbsentee.getAll.useQuery();

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
        title="वडा उमेर, लिङ्ग र प्रवासी विवरण"
        subtitle="वडा अनुसार उमेर र लिङ्ग अनुसारको प्रवासी जनसंख्या विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
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
        title="वडा उमेर, लिङ्ग र प्रवासी विवरण"
        subtitle="वडा अनुसार उमेर र लिङ्ग अनुसारको प्रवासी जनसंख्या विवरण"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा उमेर, लिङ्ग र प्रवासी विवरण"
      subtitle="वडा अनुसार उमेर र लिङ्ग अनुसारको प्रवासी जनसंख्या विवरण"
      icon={<UsersIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ प्रवासी विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardAgeGenderWiseAbsenteeChart data={wardAgeGenderData || []} />

      <WardAgeGenderWiseAbsenteeTable
        data={wardAgeGenderData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "प्रवासी विवरण सम्पादन"
                : "नयाँ प्रवासी विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardAgeGenderWiseAbsenteeForm
            editId={editId}
            onClose={handleFormClose}
            existingData={wardAgeGenderData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
