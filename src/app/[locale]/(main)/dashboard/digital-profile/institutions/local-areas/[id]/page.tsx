"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { LocalAreaDetails } from "./_components/local-area-details";
import { LocalAreaMedia } from "./_components/local-area-media";
import { LocalAreaMap } from "./_components/local-area-map";
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

export default function ViewLocalAreaPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Fetch location data by ID - using getById directly
  const { data: location, isLoading } =
    api.profile.localAreas.locations.getById.useQuery(params.id, {
      retry: false,
      enabled: !!params.id,
      onError: () => {
        router.push("/dashboard/digital-profile/institutions/local-areas");
        toast.error("स्थान फेला परेन");
      },
    });

  // Delete mutation
  const { mutate: deleteLocation, isLoading: isDeleting } =
    api.profile.localAreas.locations.delete.useMutation({
      onSuccess: () => {
        toast.success("स्थान सफलतापूर्वक हटाइयो");
        router.push("/dashboard/digital-profile/institutions/local-areas");
      },
      onError: (error) => {
        toast.error(`स्थान हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (location?.id) {
      deleteLocation(location.id);
    }
  };

  // Get location type label
  const getLocationTypeLabel = (type: string) => {
    const types = {
      VILLAGE: "गाउँ",
      SETTLEMENT: "बस्ती",
      TOLE: "टोल",
      WARD: "वडा",
      SQUATTER_AREA: "सुकुम्बासी क्षेत्र",
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <ContentLayout title="स्थान लोड गर्दै...">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (!location) {
    return (
      <ContentLayout title="स्थान फेला परेन">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">माग गरिएको स्थान फेला परेन</p>
          <Button
            onClick={() =>
              router.push("/dashboard/digital-profile/institutions/local-areas")
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
      title={location.name}
      subtitle={getLocationTypeLabel(location.type)}
      backHref="/dashboard/digital-profile/institutions/local-areas"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/local-areas/edit/${location.id}`,
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
            <LocalAreaDetails location={location} />
          </TabsContent>

          <TabsContent value="map">
            <LocalAreaMap location={location} />
          </TabsContent>

          <TabsContent value="media">
            <LocalAreaMedia
              locationId={location.id}
              media={location.media || []}
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
              स्थान &quot;{location.name}&quot; हटाउने। यो कार्य पूर्ववत हुन
              सक्दैन।
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
