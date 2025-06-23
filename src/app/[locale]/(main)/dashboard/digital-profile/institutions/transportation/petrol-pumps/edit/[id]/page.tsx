"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft } from "lucide-react";
import { PetrolPumpEditForm } from "../_components/petrol-pump-edit-form";
import { PetrolPumpMediaSection } from "../_components/petrol-pump-media-section";
import { toast } from "sonner";

export default function EditPetrolPumpPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch petrol pump data by ID
  const { data: petrolPump, isLoading } =
    api.profile.transportation.petrolPumps.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push(
          "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
        );
        toast.error("पेट्रोल पम्प फेला परेन");
      },
    });

  // Get petrol pump type label
  const getPetrolPumpTypeLabel = (type: string) => {
    const types = {
      PETROL: "पेट्रोल",
      DIESEL: "डिजल",
      PETROL_DIESEL: "पेट्रोल र डिजल",
      CNG: "सीएनजी",
      EV_CHARGING: "इलेक्ट्रिक वाहन चार्जिंग",
      MULTIPURPOSE: "बहुउद्देश्यीय",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="पेट्रोल पम्प लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!petrolPump) {
    return (
      <ContentLayout title="पेट्रोल पम्प फेला परेन">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <p>माग गरिएको पेट्रोल पम्प फेला परेन</p>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
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
      title={`${petrolPump.name} सम्पादन गर्नुहोस्`}
      subtitle={getPetrolPumpTypeLabel(petrolPump.type)}
      backHref={`/dashboard/digital-profile/institutions/transportation/petrol-pumps/${petrolPump.id}`}
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
            <PetrolPumpEditForm petrolPump={petrolPump} />
          </TabsContent>

          <TabsContent value="media">
            <PetrolPumpMediaSection
              petrolPumpId={petrolPump.id}
              existingMedia={petrolPump.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
