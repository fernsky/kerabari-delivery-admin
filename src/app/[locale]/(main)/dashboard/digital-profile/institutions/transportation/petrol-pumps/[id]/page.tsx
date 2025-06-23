"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Loader, ChevronLeft, Edit, Trash2 } from "lucide-react";
import { PetrolPumpDetails } from "./_components/petrol-pump-details";
import { PetrolPumpMedia } from "./_components/petrol-pump-media";
import { PetrolPumpMap } from "./_components/petrol-pump-map";
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

export default function ViewPetrolPumpPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  // Delete mutation
  const { mutate: deletePetrolPump, isLoading: isDeleting } =
    api.profile.transportation.petrolPumps.delete.useMutation({
      onSuccess: () => {
        toast.success("पेट्रोल पम्प सफलतापूर्वक हटाइयो");
        router.push(
          "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
        );
      },
      onError: (error) => {
        toast.error(`पेट्रोल पम्प हटाउन असफल: ${error.message}`);
        setIsDeleteDialogOpen(false);
      },
    });

  // Handle delete confirmation
  const handleDelete = () => {
    if (petrolPump?.id) {
      deletePetrolPump(petrolPump.id);
    }
  };

  // Get petrol pump type label
  const getPetrolPumpTypeLabel = (type: string) => {
    const types = {
      PETROL: "पेट्रोल",
      DIESEL: "डिजल",
      PETROL_DIESEL: "पेट्रोल र डिजल",
      CNG: "सीएनजी",
      EV_CHARGING: "इलेक्ट्रिक चार्जिंग",
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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">
            माग गरिएको पेट्रोल पम्प फेला परेन
          </p>
          <Button
            onClick={() =>
              router.push(
                "/dashboard/digital-profile/institutions/transportation/petrol-pumps",
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
      title={petrolPump.name}
      subtitle={getPetrolPumpTypeLabel(petrolPump.type)}
      backHref="/dashboard/digital-profile/institutions/transportation/petrol-pumps"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/dashboard/digital-profile/institutions/transportation/petrol-pumps/edit/${petrolPump.id}`,
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
            <PetrolPumpDetails petrolPump={petrolPump} />
          </TabsContent>

          <TabsContent value="map">
            <PetrolPumpMap petrolPump={petrolPump} />
          </TabsContent>

          <TabsContent value="media">
            <PetrolPumpMedia
              petrolPumpId={petrolPump.id}
              media={petrolPump.media || []}
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
              पेट्रोल पम्प &quot;{petrolPump.name}&quot; हटाउने। यो कार्य
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
