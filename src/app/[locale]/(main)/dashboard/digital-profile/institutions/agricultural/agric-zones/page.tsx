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
import { ViewSelector } from "@/components/digital-profile";
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

// Define agricultural zone types
const agricZoneTypes = [
  { value: "PULSES", label: "दलहन" },
  { value: "OILSEEDS", label: "तेलहन" },
  { value: "COMMERCIAL_FLOWER", label: "व्यावसायिक फूल खेती" },
  { value: "SEASONAL_CROPS", label: "मौसमी बाली" },
  { value: "SUPER_ZONE", label: "सुपर जोन" },
  { value: "POCKET_AREA", label: "पकेट क्षेत्र" },
  { value: "MIXED", label: "मिश्रित" },
  { value: "OTHER", label: "अन्य" },
];

export default function AgricZonesPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoneToDelete, setZoneToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [soilQuality, setSoilQuality] = useState<string>("all");

  // Fetch agricultural zones with filters
  const { data, isLoading, isError, refetch } =
    api.profile.agriculture.agricZones.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      soilQuality: soilQuality !== "all" ? soilQuality : undefined,
      viewType: currentView,
    });

  // Delete agricultural zone mutation
  const { mutate: deleteZone, isLoading: isDeleting } =
    api.profile.agriculture.agricZones.delete.useMutation({
      onSuccess: () => {
        toast.success("कृषि क्षेत्र सफलतापूर्वक हटाइयो");
        refetch();
        setZoneToDelete(null);
      },
      onError: (error) => {
        toast.error(`कृषि क्षेत्र हटाउन असफल: ${error.message}`);
        setZoneToDelete(null);
      },
    });

  // Handle zone deletion confirmation
  const handleConfirmDelete = () => {
    if (zoneToDelete) {
      deleteZone(zoneToDelete.id);
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

  // Handle soil quality filter change
  const handleSoilQualityChange = (value: string) => {
    setSoilQuality(value);
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

  // Handle zone deletion request
  const handleDeleteZone = (zone: { id: string; name: string }) => {
    setZoneToDelete(zone);
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
      title="कृषि क्षेत्र व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/agricultural/agric-zones/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ कृषि क्षेत्र थप्नुहोस्
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
                  {agricZoneTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={soilQuality}
                onValueChange={handleSoilQualityChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="माटोको गुणस्तर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै गुणस्तरहरू</SelectItem>
                  <SelectItem value="EXCELLENT">उत्तम</SelectItem>
                  <SelectItem value="GOOD">राम्रो</SelectItem>
                  <SelectItem value="AVERAGE">औसत</SelectItem>
                  <SelectItem value="POOR">कमजोर</SelectItem>
                  <SelectItem value="VERY_POOR">धेरै कमजोर</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="कृषि क्षेत्रको नाम खोज्नुहोस्..."
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
              कुनै कृषि क्षेत्र फेला परेन। नयाँ कृषि क्षेत्र थप्न माथिको बटन
              प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            zones={data.items}
            zoneTypes={agricZoneTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteZone}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            zones={data.items}
            zoneTypes={agricZoneTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeleteZone}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            zones={data.items}
            zoneTypes={agricZoneTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!zoneToDelete}
        onOpenChange={() => setZoneToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              कृषि क्षेत्र &quot;{zoneToDelete?.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
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
