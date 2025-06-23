"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { FarmDetails } from "./_components/farm-details";
import { FarmMedia } from "./_components/farm-media";
import { FarmMap } from "./_components/farm-map";
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

export default function ViewFarmPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deleteFarm, isLoading: isDeleting } =
    api.profile.agriculture.farms.delete.useMutation({
      onSuccess: () => {
        toast.success("फार्म सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/agricultural/farms",
        );
      },
      onError: (error) => {
        toast.error(`फार्म हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (farm?.id) {
      deleteFarm(farm.id);
    }
  };

  // Get farm type label
  const getFarmTypeLabel = (type: string) => {
    const types = {
      CROP_FARM: "बाली फार्म",
      LIVESTOCK_FARM: "पशुपालन फार्म",
      MIXED_FARM: "मिश्रित फार्म",
      POULTRY_FARM: "पंक्षी फार्म",
      DAIRY_FARM: "डेरी फार्म",
      AQUACULTURE_FARM: "जलकृषि फार्म",
      HORTICULTURE_FARM: "बागवानी फार्म",
      APICULTURE_FARM: "मौरी पालन",
      SERICULTURE_FARM: "रेशम खेती",
      ORGANIC_FARM: "जैविक फार्म",
      COMMERCIAL_FARM: "व्यावसायिक फार्म",
      SUBSISTENCE_FARM: "जीविकोपार्जन फार्म",
      AGROFORESTRY: "कृषि वन",
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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">माग गरिएको फार्म फेला परेन</p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/agricultural/farms",
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
      title={farm.name}
      subtitle={getFarmTypeLabel(farm.farmType)}
      backHref="/dashboard/digital-profile/institutions/agricultural/farms"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/agricultural/farms/edit/${farm.id}`,
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
            <FarmDetails farm={farm} />
          </TabsContent>

          <TabsContent value="map">
            <FarmMap farm={farm} />
          </TabsContent>

          <TabsContent value="media">
            <FarmMedia farmId={farm.id} media={farm.media || []} />
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
              फार्म &quot;{farm.name}&quot; हटाउने। यो कार्य पूर्ववत हुन सक्दैन।
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
