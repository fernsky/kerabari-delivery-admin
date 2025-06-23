"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { AgricZoneDetails } from "./_components/agric-zone-details";
import { AgricZoneMedia } from "./_components/agric-zone-media";
import { AgricZoneMap } from "./_components/agric-zone-map";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ViewAgricZonePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deleteAgricZone, isLoading: isDeleting } =
    api.profile.agriculture.agricZones.delete.useMutation({
      onSuccess: () => {
        toast.success("कृषि क्षेत्र सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/agric-zones",
        );
      },
      onError: (error) => {
        toast.error(`कृषि क्षेत्र हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (agricZone?.id) {
      deleteAgricZone(agricZone.id);
    }
  };

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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको कृषि क्षेत्र फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/agric-zones",
              )
            }
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            सूचीमा फर्कनुहोस्
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title={agricZone.name}
      subtitle={getAgricZoneTypeLabel(agricZone.type)}
      backHref="/dashboard/digital-profile/institutions/agricultural/agric-zones"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/agric-zones/edit/${agricZone.id}`,
              )
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            सम्पादन
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            हटाउनुहोस्
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <Tabs defaultValue="details">
          <TabsList className="mb-6">
            <TabsTrigger value="details">विवरण</TabsTrigger>
            <TabsTrigger value="map">नक्सा</TabsTrigger>
            <TabsTrigger value="media">फोटोहरू</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <AgricZoneDetails agricZone={agricZone} />
          </TabsContent>

          <TabsContent value="map">
            <AgricZoneMap agricZone={agricZone} />
          </TabsContent>

          <TabsContent value="media">
            <AgricZoneMedia
              agricZoneId={agricZone.id}
              media={agricZone.media || []}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              कृषि क्षेत्र &quot;{agricZone.name}&quot; हटाउने। यो कार्य पूर्ववत
              हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
