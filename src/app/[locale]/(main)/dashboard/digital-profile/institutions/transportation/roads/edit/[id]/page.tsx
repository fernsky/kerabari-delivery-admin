"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { RoadEditForm } from "../_components/road-edit-form";

export default function EditRoadPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Fetch existing road data
  const { data: roadData, isLoading: isRoadLoading } =
    api.profile.transportation.roads.getById.useQuery(params.id, {
      enabled: !!params.id,
    });

  if (isRoadLoading) {
    return (
      <ContentLayout title="सडक अपडेट गर्दै...">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  if (!roadData) {
    return (
      <ContentLayout title="सडक फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p>माग गरिएको सडक फेला परेन</p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/transportation/roads",
              )
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
      title={`"${roadData.name}" सम्पादन गर्दै`}
      backHref="/dashboard/digital-profile/institutions/transportation/roads"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/roads",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
    >
      <div className="grid gap-8">
        <RoadEditForm initialData={roadData} roadId={params.id} />
      </div>
    </ContentLayout>
  );
}
