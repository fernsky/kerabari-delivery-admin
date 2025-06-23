"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { ParkingFacilityEditForm } from "../_components/parking-facility-edit-form";
import { ParkingFacilityMediaSection } from "../_components/parking-facility-media-section";
import { toast } from "sonner";

export default function EditParkingFacilityPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch parking facility data by ID
  const { data: facility, isLoading } =
    api.profile.transportation.parkingFacilities.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/transportation/parking-facilities",
        );
        toast.error("पार्किङ सुविधा फेला परेन");
      },
    });

  // Get parking facility type label
  const getParkingFacilityTypeLabel = (type: string) => {
    const types = {
      BUS_PARK: "बस पार्क",
      TAXI_PARK: "ट्याक्सी पार्क",
      TEMPO_PARK: "टेम्पो पार्क",
      AUTO_RICKSHAW_PARK: "अटो रिक्सा पार्क",
      CAR_PARK: "कार पार्क",
      BIKE_PARK: "बाइक पार्क",
      MULTIPURPOSE_PARK: "बहुउद्देश्यीय पार्क",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="पार्किङ सुविधा लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!facility) {
    return (
      <ContentLayout title="पार्किङ सुविधा फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको पार्किङ सुविधा फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/transportation/parking-facilities",
                )
              }
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              फिर्ता जानुहोस्
            </Button>
          </div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={`${facility.name} सम्पादन गर्नुहोस्`}
      subtitle={getParkingFacilityTypeLabel(facility.type)}
      backHref={`/dashboard/digital-profile/institutions/transportation/parking-facilities/${facility.id}`}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "general" | "media")}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="general" className="flex-1 sm:flex-none">
            आधारभूत जानकारी
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1 sm:flex-none">
            फोटोहरू
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <ParkingFacilityEditForm facility={facility} />
          </TabsContent>

          <TabsContent value="media">
            <ParkingFacilityMediaSection
              facilityId={facility.id}
              existingMedia={facility.media || []}
              entityType="PARKING_FACILITY"
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
