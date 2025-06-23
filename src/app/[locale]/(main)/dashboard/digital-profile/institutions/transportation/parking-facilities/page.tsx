"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TableView } from "./_components/table-view";
import { GridView } from "./_components/grid-view";
import { MapView } from "./_components/map-view";
import { ViewSelector } from "./_components/view-selector";
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

// Define parking facility types
const parkingFacilityTypes = [
  { value: "BUS_PARK", label: "बस पार्क" },
  { value: "TAXI_PARK", label: "ट्याक्सी पार्क" },
  { value: "TEMPO_PARK", label: "टेम्पो पार्क" },
  { value: "AUTO_RICKSHAW_PARK", label: "अटो रिक्सा पार्क" },
  { value: "CAR_PARK", label: "कार पार्क" },
  { value: "BIKE_PARK", label: "बाइक पार्क" },
  { value: "MULTIPURPOSE_PARK", label: "बहुउद्देश्यीय पार्क" },
  { value: "OTHER", label: "अन्य" },
];

// Define parking facility conditions
const parkingConditions = [
  { value: "all", label: "सबै अवस्था" },
  { value: "EXCELLENT", label: "उत्कृष्ट" },
  { value: "GOOD", label: "राम्रो" },
  { value: "FAIR", label: "ठीकै" },
  { value: "POOR", label: "खराब" },
  { value: "VERY_POOR", label: "धेरै खराब" },
  { value: "UNDER_CONSTRUCTION", label: "निर्माणाधीन" },
];

export default function ParkingFacilitiesPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [facilityToDelete, setFacilityToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [currentCondition, setCurrentCondition] = useState<string>("all");

  // Fetch parking facilities with filters
  const { data, isLoading, isError, refetch } =
    api.profile.transportation.parkingFacilities.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      condition: currentCondition !== "all" ? currentCondition : undefined,
      viewType: currentView,
    });

  // Delete parking facility mutation
  const { mutate: deleteFacility, isLoading: isDeleting } =
    api.profile.transportation.parkingFacilities.delete.useMutation({
      onSuccess: () => {
        toast.success("पार्किङ सुविधा सफलतापूर्वक हटाइयो");
        refetch();
        setFacilityToDelete(null);
      },
      onError: (error) => {
        toast.error(`पार्किङ सुविधा हटाउन असफल: ${error.message}`);
        setFacilityToDelete(null);
      },
    });

  // Handle facility deletion confirmation
  const handleConfirmDelete = () => {
    if (facilityToDelete) {
      deleteFacility(facilityToDelete.id);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    setCurrentType(value);
    setCurrentPage(1);
  };

  // Handle condition filter change
  const handleConditionChange = (value: string) => {
    setCurrentCondition(value);
    setCurrentPage(1);
  };

  // Handle view change (table/grid/map)
  const handleViewChange = (view: "table" | "grid" | "map") => {
    setCurrentView(view);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle facility deletion request
  const handleDeleteFacility = (facility: { id: string; name: string }) => {
    setFacilityToDelete(facility);
  };

  // Prepare pagination data
  const pagination = data
    ? {
        page: data.page,
        pageSize: data.pageSize,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPreviousPage: data.hasPreviousPage,
      }
    : {
        page: 1,
        pageSize: 12,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

  return (
    <ContentLayout
      title="पार्किङ सुविधाहरू"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/parking-facilities/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ पार्किङ सुविधा थप्नुहोस्
        </Button>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4 flex-col sm:flex-row">
              <Select value={currentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै प्रकार" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै प्रकार</SelectItem>
                  {parkingFacilityTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentCondition}
                onValueChange={handleConditionChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै अवस्था" />
                </SelectTrigger>
                <SelectContent>
                  {parkingConditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="पार्किङ सुविधाको नाम खोज्नुहोस्..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1"
              />
            </div>

            <div className="flex justify-end">
              <ViewSelector
                currentView={currentView}
                onViewChange={handleViewChange}
              />
            </div>
          </div>
        </Card>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Loader className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                डाटा लोड हुँदैछ...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-500">
              डाटा प्राप्त गर्न त्रुटि भयो। कृपया पुनः प्रयास गर्नुहोस्।
            </p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              पुनः प्रयास गर्नुहोस्
            </Button>
          </div>
        )}

        {!isLoading && !isError && data?.items?.length === 0 && (
          <Alert className="bg-muted">
            <AlertDescription className="text-center py-6">
              कुनै पार्किङ सुविधा फेला परेन। नयाँ पार्किङ सुविधा थप्न माथिको बटन
              प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            facilities={data.items}
            facilityTypes={parkingFacilityTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteFacility}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            facilities={data.items}
            facilityTypes={parkingFacilityTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteFacility}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            facilities={data.items}
            facilityTypes={parkingFacilityTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!facilityToDelete}
        onOpenChange={() => setFacilityToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              पार्किङ सुविधा &quot;{facilityToDelete?.name}&quot; हटाउने। यो
              कार्य पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
