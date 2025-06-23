"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { AgricZoneEditForm } from "../_components/agric-zone-edit-form";
import { AgricZoneMediaSection } from "../_components/agric-zone-media-section";
import { toast } from "sonner";

export default function EditAgricZonePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch agricultural zone data by ID
  const { data: agricZone, isLoading } =
    api.profile.agriculture.agricZones.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/agric-zones",
        );
        toast.error("कृषि क्षेत्र फेला परेन");
      },
    });

  // Get agricultural zone type label
  const getAgricZoneTypeLabel = (type: string) => {
    const types = {
      PULSES: "दलहन",
      OILSEEDS: "तेलहन",
      COMMERCIAL_FLOWER: "व्यावसायिक फूल खेती",
      SEASONAL_CROPS: "मौसमी बाली",
      SUPER_ZONE: "सुपर जोन",
      POCKET_AREA: "पकेट क्षेत्र",
      MIXED: "मिश्रित",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="कृषि क्षेत्र लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!agricZone) {
    return (
      <ContentLayout title="कृषि क्षेत्र फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको कृषि क्षेत्र फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/agric-zones",
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
      title={`${agricZone.name} सम्पादन गर्नुहोस्`}
      subtitle={getAgricZoneTypeLabel(agricZone.type)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/agric-zones/${agricZone.id}`}
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
            <AgricZoneEditForm agricZone={agricZone} />
          </TabsContent>

          <TabsContent value="media">
            <AgricZoneMediaSection
              agricZoneId={agricZone.id}
              existingMedia={agricZone.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
