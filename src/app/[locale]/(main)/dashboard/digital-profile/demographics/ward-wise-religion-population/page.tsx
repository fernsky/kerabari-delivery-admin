"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import WardWiseReligionPopulationTable from "./_components/ward-wise-religion-population-table";
import WardWiseReligionPopulationForm from "./_components/ward-wise-religion-population-form";
import WardWiseReligionPopulationChart from "./_components/ward-wise-religion-population-chart";
import { PlusCircle, UsersIcon } from "lucide-react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function WardWiseReligionPopulationPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch ward-wise religion population data
  const {
    data: wardWiseReligionData,
    isLoading,
    isError,
  } = api.profile.demographics.wardWiseReligionPopulation.getAll.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <ContentLayout
        title="Ward-wise Religion Population"
        subtitle="Ward-wise religion population details"
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
        title="Ward-wise Religion Population"
        subtitle="Ward-wise religion population details"
        icon={<UsersIcon className="h-6 w-6 text-primary" />}
      >
        <div className="text-center text-red-500 py-10">
          Error loading data. Please try again later.
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="वडा अनुसार धर्म जनसंख्या"
      subtitle="वडा अनुसार धर्म जनसंख्याको विवरण"
      icon={<UsersIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          धर्म जनसंख्या थप्नुहोस्
        </Button>
      }
    >
      {wardWiseReligionData && wardWiseReligionData.length > 0 ? (
        <>
          <WardWiseReligionPopulationChart data={wardWiseReligionData} />
          <WardWiseReligionPopulationTable
            data={wardWiseReligionData}
            onEdit={handleEdit}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            कुनै डाटा उपलब्ध छैन। कृपया वडा अनुसार धर्म जनसंख्या थप्नुहोस्।
          </p>
          <Button onClick={() => setIsFormOpen(true)} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            धर्म जनसंख्या डाटा थप्नुहोस्
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[725px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "धर्म जनसंख्या डाटा सम्पादन गर्नुहोस्"
                : "धर्म जनसंख्या डाटा थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseReligionPopulationForm
            editId={editingId}
            onClose={handleFormClose}
            existingData={wardWiseReligionData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
