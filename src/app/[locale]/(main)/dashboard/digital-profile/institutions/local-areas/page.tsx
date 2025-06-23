"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Plus, Search } from "lucide-react";
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
import { useDebounce } from "@/hooks/use-debounce";

// Import view components
import { TableView } from "./_components/table-view";
import { GridView } from "./_components/grid-view";
import { MapView } from "./_components/map-view";
import { ViewSelector } from "./_components/view-selector";
import { Pagination } from "./_components/pagination";

export default function LocalAreasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query params with defaults
  const currentView =
    (searchParams.get("view") as "table" | "grid" | "map") || "table";
  const currentPage = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");
  const currentType = searchParams.get("type") || "all";
  const currentSearch = searchParams.get("search") || "";

  // Local state
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Location types
  const locationTypes = [
    { value: "VILLAGE", label: "गाउँ" },
    { value: "SETTLEMENT", label: "बस्ती" },
    { value: "TOLE", label: "टोल" },
    { value: "WARD", label: "वडा" },
    { value: "SQUATTER_AREA", label: "सुकुम्बासी क्षेत्र" },
  ];

  // Get locations data with query params
  const {
    data: locationsData,
    isLoading,
    isError,
    refetch,
  } = api.profile.localAreas.locations.getAll.useQuery({
    name: debouncedSearchTerm || undefined,
    type: currentType !== "all" ? (currentType as any) : undefined,
    page: currentPage,
    pageSize: currentView === "map" ? 100 : pageSize, // Load more items for map view
    viewType: currentView,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Delete mutation
  const { mutate: deleteLocation, isLoading: isDeleting } =
    api.profile.localAreas.locations.delete.useMutation({
      onSuccess: () => {
        toast.success("स्थान सफलतापूर्वक हटाइयो");
        refetch();
        setIsDeleteDialogOpen(false);
        setLocationToDelete(null);
      },
      onError: (error) => {
        toast.error(`स्थान हटाउन असफल: ${error.message}`);
      },
    });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (currentView !== "table") params.set("view", currentView);
    if (currentPage > 1) params.set("page", String(currentPage));
    if (currentType !== "all") params.set("type", currentType);
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (pageSize !== 10) params.set("pageSize", String(pageSize));

    const queryString = params.toString();
    const url = queryString ? `?${queryString}` : "";

    // Replace the URL to avoid adding to history stack
    router.replace(
      `/dashboard/digital-profile/institutions/local-areas${url}`,
      {
        scroll: false,
      },
    );
  }, [
    debouncedSearchTerm,
    currentType,
    currentPage,
    pageSize,
    currentView,
    router,
  ]);

  // Handle view change
  const handleViewChange = (view: "table" | "grid" | "map") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    params.set("page", "1"); // Reset to first page on view change
    router.replace(`?${params.toString()}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
  };

  // Handle type filter change
  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", value);
    params.set("page", "1"); // Reset to first page
    router.replace(`?${params.toString()}`);
  };

  // Handle delete dialog
  const handleDeleteClick = (location: { id: string; name: string }) => {
    setLocationToDelete(location);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (locationToDelete) {
      deleteLocation(locationToDelete.id);
    }
  };

  return (
    <ContentLayout
      title="स्थानीय क्षेत्रहरू"
      actions={
        <Link href="/dashboard/digital-profile/institutions/local-areas/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> नयाँ स्थान
          </Button>
        </Link>
      }
    >
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="स्थानको नाम खोज्नुहोस्..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={currentType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै प्रकार" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै प्रकार</SelectItem>
                  {locationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ViewSelector
              currentView={currentView}
              onViewChange={handleViewChange}
            />
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

        {!isLoading && !isError && locationsData && (
          <div className="min-h-[400px]">
            {currentView === "table" && (
              <TableView
                locations={locationsData.items}
                locationTypes={locationTypes}
                pagination={locationsData.pagination}
                onPageChange={handlePageChange}
                onDelete={handleDeleteClick}
                isLoading={isLoading}
              />
            )}

            {currentView === "grid" && (
              <GridView
                locations={locationsData.items}
                locationTypes={locationTypes}
                pagination={locationsData.pagination}
                onPageChange={handlePageChange}
                onDelete={handleDeleteClick}
                isLoading={isLoading}
              />
            )}

            {currentView === "map" && (
              <MapView
                locations={locationsData.items}
                locationTypes={locationTypes}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              स्थान &quot;{locationToDelete?.name}&quot; हटाउने। यो कार्य
              पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              हटाउनुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentLayout>
  );
}
