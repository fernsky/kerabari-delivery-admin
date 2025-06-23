"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { FarmEditForm } from "../_components/farm-edit-form";
import { FarmMediaSection } from "../_components/farm-media-section";
import { toast } from "sonner";

export default function EditFarmPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch farm data by ID
  const { data: farm, isLoading } =
    api.profile.agriculture.farms.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/farms",
        );
        toast.error("फार्म फेला परेन");
      },
    });

  // Get farm type label in Nepali
  const getFarmTypeLabel = (type: string) => {
    const types = {
      CROP_FARM: "बाली फार्म",
      LIVESTOCK_FARM: "पशुपन्छी फार्म",
      MIXED_FARM: "मिश्रित फार्म",
      POULTRY_FARM: "कुखुरा फार्म",
      DAIRY_FARM: "डेरी फार्म",
      AQUACULTURE_FARM: "मत्स्य पालन फार्म",
      HORTICULTURE_FARM: "बागवानी फार्म",
      APICULTURE_FARM: "मौरीपालन फार्म",
      SERICULTURE_FARM: "रेशम खेती फार्म",
      ORGANIC_FARM: "जैविक फार्म",
      COMMERCIAL_FARM: "व्यावसायिक फार्म",
      SUBSISTENCE_FARM: "निर्वाहमुखी फार्म",
      AGROFORESTRY: "कृषिवन फार्म",
      OTHER: "अन्य",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="फार्म लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!farm) {
    return (
      <ContentLayout title="फार्म फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको फार्म फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/agricultural/farms",
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
      title={`${farm.name} सम्पादन गर्नुहोस्`}
      subtitle={getFarmTypeLabel(farm.farmType)}
      backHref={`/dashboard/digital-profile/institutions/agricultural/farms/${farm.id}`}
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
            <FarmEditForm farm={farm} />
          </TabsContent>

          <TabsContent value="media">
            <FarmMediaSection
              farmId={farm.id}
              existingMedia={farm.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
