"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { LocationEditForm } from "../_components/location-edit-form";

export default function EditLocalAreaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // Fetch existing location data
  const { data: locationData, isLoading: isLocationLoading } =
    api.profile.localAreas.locations.getById.useQuery(params.id, {
      enabled: !!params.id,
    });

  if (isLocationLoading) {
    return (
      <ContentLayout title="स्थान अपडेट गर्दै...">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  if (!locationData) {
    return (
      <ContentLayout title="स्थान फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p>माग गरिएको स्थान फेला परेन</p>
          <Button
            onClick={() =>
              router.push("/dashboard/digital-profile/institutions/local-areas")
            }
            variant="outline"
          >
            फिर्ता जानुहोस्
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`"${locationData.name}" सम्पादन गर्दै`}
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push("/dashboard/digital-profile/institutions/local-areas")
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <LocationEditForm initialData={locationData} locationId={params.id} />
      </div>
    </ContentLayout>
  );
}
