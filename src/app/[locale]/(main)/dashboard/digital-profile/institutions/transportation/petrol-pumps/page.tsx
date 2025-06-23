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

// Define petrol pump types
const petrolPumpTypes = [
  { value: "PETROL", label: "पेट्रोल" },
  { value: "DIESEL", label: "डिजल" },
  { value: "PETROL_DIESEL", label: "पेट्रोल र डिजल" },
  { value: "CNG", label: "सीएनजी" },
  { value: "EV_CHARGING", label: "इलेक्ट्रिक चार्जिंग" },
  { value: "MULTIPURPOSE", label: "बहुउद्देश्यीय" },
];

export default function PetrolPumpsPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<"table" | "grid" | "map">(
    "table",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pumpToDelete, setPumpToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [currentType, setCurrentType] = useState<string>("all");
  const [hasEVCharging, setHasEVCharging] = useState<boolean | undefined>(
    undefined,
  );

  // Fetch petrol pumps with filters
  const { data, isLoading, isError, refetch } =
    api.profile.transportation.petrolPumps.getAll.useQuery({
      page: currentPage,
      pageSize: 12,
      searchTerm: searchTerm,
      type: currentType !== "all" ? currentType : undefined,
      hasEVCharging: hasEVCharging,
      viewType: currentView,
    });

  // Delete petrol pump mutation
  const { mutate: deletePump, isLoading: isDeleting } =
    api.profile.transportation.petrolPumps.delete.useMutation({
      onSuccess: () => {
        toast.success("पेट्रोल पम्प सफलतापूर्वक हटाइयो");
        refetch();
        setPumpToDelete(null);
      },
      onError: (error) => {
        toast.error(`पेट्रोल पम्प हटाउन असफल: ${error.message}`);
        setPumpToDelete(null);
      },
    });

  // Handle pump deletion confirmation
  const handleConfirmDelete = () => {
    if (pumpToDelete) {
      deletePump(pumpToDelete.id);
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

  // Handle EV charging filter change
  const handleEVChargingChange = (value: string) => {
    if (value === "all") {
      setHasEVCharging(undefined);
    } else if (value === "yes") {
      setHasEVCharging(true);
    } else if (value === "no") {
      setHasEVCharging(false);
    }
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

  // Handle pump deletion request
  const handleDeletePump = (pump: { id: string; name: string }) => {
    setPumpToDelete(pump);
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
      title="पेट्रोल पम्प व्यवस्थापन"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/petrol-pumps/create",
            )
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          नयाँ पेट्रोल पम्प थप्नुहोस्
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
                  {petrolPumpTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={
                  hasEVCharging === undefined
                    ? "all"
                    : hasEVCharging
                      ? "yes"
                      : "no"
                }
                onValueChange={handleEVChargingChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="इलेक्ट्रिक चार्जिंग" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै</SelectItem>
                  <SelectItem value="yes">चार्जिंग सहित</SelectItem>
                  <SelectItem value="no">चार्जिंग बिना</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="पेट्रोल पम्पको नाम खोज्नुहोस्..."
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
              कुनै पेट्रोल पम्प फेला परेन। नयाँ पेट्रोल पम्प थप्न माथिको बटन
              प्रयोग गर्नुहोस्।
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !isError && data?.items && currentView === "table" && (
          <TableView
            pumps={data.items}
            pumpTypes={petrolPumpTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeletePump}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "grid" && (
          <GridView
            pumps={data.items}
            pumpTypes={petrolPumpTypes}
            pagination={pagination}
            onPageChange={handlePageChange}
            onDelete={handleDeletePump}
            isLoading={isLoading}
          />
        )}

        {!isLoading && !isError && data?.items && currentView === "map" && (
          <MapView
            pumps={data.items}
            pumpTypes={petrolPumpTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      <AlertDialog
        open={!!pumpToDelete}
        onOpenChange={() => setPumpToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              पेट्रोल पम्प &quot;{pumpToDelete?.name}&quot; हटाउने। यो कार्य
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
