"use client";

import { useState } from "react";
import { Loader, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PublicTransportEditForm } from "../_components/public-transport-edit-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicTransportMediaSection } from "../_components/public-transport-media-section";

export default function EditPublicTransportPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "media">("general");

  // Fetch existing public transport data
  const { data: transportData, isLoading: isTransportLoading } =
    api.profile.transportation.publicTransports.getById.useQuery(params.id, {
      enabled: !!params.id,
    });

  if (isTransportLoading) {
    return (
      <ContentLayout title="सार्वजनिक यातायात अपडेट गर्दै...">
        <div className="flex items-center justify-center h-64">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </ContentLayout>
    );
  }

  if (!transportData) {
    return (
      <ContentLayout title="सार्वजनिक यातायात फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p>माग गरिएको सार्वजनिक यातायात फेला परेन</p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/transportation/public-transports",
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
      title={`"${transportData.name}" सम्पादन गर्दै`}
      backHref="/dashboard/digital-profile/institutions/transportation/public-transports"
      actions={
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/public-transports",
            )
          }
        >
          फिर्ता जानुहोस्
        </Button>
      }
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
            <PublicTransportEditForm
              initialData={transportData}
              transportId={params.id}
            />
          </TabsContent>

          <TabsContent value="media">
            <PublicTransportMediaSection
              transportId={params.id}
              media={transportData.media || []}
            />
          </TabsContent>
        </div>
      </Tabs>
    </ContentLayout>
  );
}
