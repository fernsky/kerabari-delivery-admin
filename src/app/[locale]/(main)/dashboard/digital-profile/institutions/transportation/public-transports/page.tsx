"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { PlusCircle, Search, Filter, Loader } from "lucide-react";
import { ViewSelector } from "./_components/view-selector";
import { TableView } from "./_components/table-view";
import { GridView } from "./_components/grid-view";
import { MapView } from "./_components/map-view";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define transport types
const transportTypes = [
  { value: "BUS", label: "बस" },
  { value: "MINIBUS", label: "मिनी बस" },
  { value: "MICROBUS", label: "माइक्रो बस" },
  { value: "TEMPO", label: "टेम्पो" },
  { value: "AUTO_RICKSHAW", label: "अटो रिक्सा" },
  { value: "TAXI", label: "ट्याक्सी" },
  { value: "E_RICKSHAW", label: "इ-रिक्सा" },
  { value: "OTHER", label: "अन्य" },
];

export default function PublicTransportsPage() {
  const router = useRouter();
  const [view, setView] = useState<"table" | "grid" | "map">("table");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [toDeleteTransport, setToDeleteTransport] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Query for public transports with pagination and filters
  const { data, isLoading, refetch } =
    api.profile.transportation.publicTransports.getAll.useQuery(
      {
        page,
        pageSize: view === "table" ? 10 : 12,
        viewType: view,
        searchTerm: searchTerm,
        sortBy: "name",
        sortOrder: "asc",
      },
      {
        keepPreviousData: true,
      },
    );

  // Delete mutation
  const { mutate: deletePublicTransport, isLoading: isDeleting } =
    api.profile.transportation.publicTransports.delete.useMutation({
      onSuccess: () => {
        toast.success("सार्वजनिक यातायात सफलतापूर्वक हटाइयो");
        refetch();
        setToDeleteTransport(null);
      },
      onError: (error) => {
        toast.error(`सार्वजनिक यातायात हटाउन असफल: ${error.message}`);
        setToDeleteTransport(null);
      },
    });

  // Handle search
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);
    setSearchTerm(searchInput);
    setPage(1);
    setIsSearching(false);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (toDeleteTransport) {
      deletePublicTransport(toDeleteTransport.id);
    }
  };

  return (
    <ContentLayout
      title="सार्वजनिक यातायात व्यवस्थापन"
      subtitle="सम्पूर्ण सार्वजनिक यातायातहरूको सूची"
      actions={
        <Button
          onClick={() =>
            router.push(
              "/dashboard/digital-profile/institutions/transportation/public-transports/create",
            )
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          नयाँ थप्नुहोस्
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">कुल यातायात</CardTitle>
              <CardDescription>सम्पूर्ण सार्वजनिक यातायातहरू</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  data?.totalItems || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">बस सेवाहरू</CardTitle>
              <CardDescription>बस यातायात सेवाहरूको संख्या</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  data?.items.filter((item) => item.type === "BUS").length || 0
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">अन्य सेवाहरू</CardTitle>
              <CardDescription>अन्य सार्वजनिक यातायात सेवाहरू</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? (
                  <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                  data?.items.filter((item) => item.type !== "BUS").length || 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="खोज्नुहोस्... (नाम, मार्ग, बिन्दु, संचालक)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary" disabled={isSearching}>
              {isSearching ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              खोज्नुहोस्
            </Button>
          </form>
          <div className="flex gap-2">
            {searchTerm && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setSearchInput("");
                  setPage(1);
                }}
              >
                खोजी हटाउनुहोस् ✕
              </Button>
            )}
            <ViewSelector currentView={view} onViewChange={setView} />
          </div>
        </div>

        {/* Main content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : view === "table" ? (
          <TableView
            transports={data?.items || []}
            transportTypes={transportTypes}
            pagination={
              data || {
                page: 1,
                pageSize: 10,
                totalItems: 0,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
              }
            }
            onPageChange={setPage}
            onDelete={setToDeleteTransport}
            isLoading={isLoading}
          />
        ) : view === "grid" ? (
          <GridView
            transports={data?.items || []}
            transportTypes={transportTypes}
            pagination={
              data || {
                page: 1,
                pageSize: 12,
                totalItems: 0,
                totalPages: 1,
                hasNextPage: false,
                hasPreviousPage: false,
              }
            }
            onPageChange={setPage}
            onDelete={setToDeleteTransport}
            isLoading={isLoading}
          />
        ) : (
          <MapView
            transports={data?.items || []}
            transportTypes={transportTypes}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!toDeleteTransport}
        onOpenChange={(open) => !open && setToDeleteTransport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>के तपाईं निश्चित हुनुहुन्छ?</AlertDialogTitle>
            <AlertDialogDescription>
              सार्वजनिक यातायात &quot;{toDeleteTransport?.name}&quot; हटाउने। यो
              कार्य पूर्ववत हुन सक्दैन।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
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
