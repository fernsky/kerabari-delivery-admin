"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { ParkingFacilityDetails } from "./_components/parking-facility-details";
import { ParkingFacilityMedia } from "./_components/parking-facility-media";
import { ParkingFacilityMap } from "./_components/parking-facility-map";
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

export default function ViewParkingFacilityPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deleteFacility, isLoading: isDeleting } =
    api.profile.transportation.parkingFacilities.delete.useMutation({
      onSuccess: () => {
        toast.success("पार्किङ सुविधा सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/transportation/parking-facilities",
        );
      },
      onError: (error) => {
        toast.error(`पार्किङ सुविधा हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (facility?.id) {
      deleteFacility(facility.id);
    }
  };

  // Get parking facility type label
  const getFacilityTypeLabel = (type: string) => {
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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको पार्किङ सुविधा फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/transportation/parking-facilities",
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
      title={facility.name}
      subtitle={getFacilityTypeLabel(facility.type)}
      backHref="/dashboard/digital-profile/institutions/transportation/parking-facilities"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/transportation/parking-facilities/edit/${facility.id}`,
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
            <ParkingFacilityDetails facility={facility} />
          </TabsContent>

          <TabsContent value="map">
            <ParkingFacilityMap facility={facility} />
          </TabsContent>

          <TabsContent value="media">
            <ParkingFacilityMedia
              facilityId={facility.id}
              media={facility.media || []}
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
              पार्किङ सुविधा &quot;{facility.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
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
