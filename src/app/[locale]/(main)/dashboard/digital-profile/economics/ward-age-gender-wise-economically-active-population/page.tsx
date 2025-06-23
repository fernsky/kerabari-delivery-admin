"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ActivityIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import WardAgeGenderWiseEconomicallyActivePopulationTable from "./_components/ward-age-gender-wise-economically-active-population-table";
import WardAgeGenderWiseEconomicallyActivePopulationForm from "./_components/ward-age-gender-wise-economically-active-population-form";
import WardAgeGenderWiseEconomicallyActivePopulationChart from "./_components/ward-age-gender-wise-economically-active-population-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardAgeGenderWiseEconomicallyActivePopulationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const {
    data: economicallyActiveData,
    isLoading,
    isError,
  } = api.profile.economics.wardAgeGenderWiseEconomicallyActivePopulation.getAll.useQuery();

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
        title="वडा उमेर, लिङ्ग अनुसार आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
        subtitle="वडा अनुसार उमेर, लिङ्गको आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
        icon={<ActivityIcon className="h-6 w-6 text-primary" />}
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
        title="वडा उमेर, लिङ्ग अनुसार आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
        subtitle="वडा अनुसार उमेर, लिङ्गको आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
        icon={<ActivityIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          डाटा लोड गर्न समस्या भयो। कृपया पछि फेरि प्रयास गर्नुहोस्।
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा उमेर, लिङ्ग अनुसार आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
      subtitle="वडा अनुसार उमेर, लिङ्गको आर्थिक रुपमा सक्रिय जनसंख्या विवरण"
      icon={<ActivityIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          नयाँ आर्थिक रुपमा सक्रिय जनसंख्या विवरण थप्नुहोस्
        </Button>
      }
    >
      <WardAgeGenderWiseEconomicallyActivePopulationChart
        data={economicallyActiveData || []}
      />

      <WardAgeGenderWiseEconomicallyActivePopulationTable
        data={economicallyActiveData || []}
        onEdit={handleEdit}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "आर्थिक रुपमा सक्रिय जनसंख्या विवरण सम्पादन"
                : "नयाँ आर्थिक रुपमा सक्रिय जनसंख्या विवरण थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardAgeGenderWiseEconomicallyActivePopulationForm
            editId={editId}
            onClose={handleFormClose}
            existingData={economicallyActiveData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
