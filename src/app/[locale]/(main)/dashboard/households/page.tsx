"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, Edit } from "lucide-react";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

// Define types for the household data structure
type Household = {
  id: string;
  familyHeadName?: string;
  familyHeadPhoneNo?: string;
  wardNo?: number | null;
  totalMembers?: number | null;
  locality?: string;
  houseSymbolNo?: string;
  dateOfInterview?: Date | null;
};

export default function HouseholdsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [wardFilter, setWardFilter] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<
    | "family_head_name"
    | "ward_no"
    | "locality"
    | "house_symbol_no"
    | "date_of_interview"
  >("family_head_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch households data with pagination
  const { data, isLoading, error, refetch } =
    api.households.getHouseholds.useQuery({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
      filters: {
        wardNo: wardFilter,
      },
      search: searchQuery.length > 2 ? searchQuery : undefined, // Only search if query has at least 3 characters
    });

  const totalPages = data?.meta ? Math.ceil(data.meta.total / pageSize) : 0;

  // Handle sort toggle
  const toggleSort = (
    column:
      | "family_head_name"
      | "ward_no"
      | "locality"
      | "house_symbol_no"
      | "date_of_interview",
  ) => {
    if (sortBy === column) {
      // Toggle sort order if already sorting by this column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Otherwise switch to the new column with ascending order
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Function to safely format UUID for navigation
  const formatUuidForNav = (id: string): string => {
    return id.replace(/^uuid:/, "");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">घरधुरी सूची</h1>
        <Button onClick={() => router.push("/dashboard/households/create")}>
          <Plus className="mr-2 h-4 w-4" />
          नयाँ घरधुरी थप्नुहोस्
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="परिवार मूलीको नाम, फोन नम्बर, वा स्थान द्वारा खोज्नुहोस्"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={wardFilter?.toString() || ""}
            onValueChange={(value) => {
              setWardFilter(value ? parseInt(value) : undefined);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="वडा नं." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">सबै वडा</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((ward) => (
                <SelectItem key={ward} value={ward.toString()}>
                  वडा {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(parseInt(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-24">
              <SelectValue placeholder="परिणाम" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 वटा</SelectItem>
              <SelectItem value="25">25 वटा</SelectItem>
              <SelectItem value="50">50 वटा</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-500">
            डाटा प्राप्त गर्न त्रुटि भयो
          </h2>
          <p className="mt-2">कृपया पछि फेरि प्रयास गर्नुहोस्</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                कुल {data?.meta?.total || 0} परिवारहरु
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("family_head_name")}
                  >
                    <div className="flex items-center">
                      परिवार मूलीको नाम
                      {sortBy === "family_head_name" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortOrder === "asc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("ward_no")}
                  >
                    <div className="flex items-center">
                      वडा नं.
                      {sortBy === "ward_no" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortOrder === "asc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>स्थान</TableHead>
                  <TableHead>फोन नम्बर</TableHead>
                  <TableHead>सदस्य संख्या</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("date_of_interview")}
                  >
                    <div className="flex items-center">
                      अन्तरवार्ता मिति
                      {sortBy === "date_of_interview" && (
                        <ArrowUpDown
                          className={`ml-2 h-4 w-4 ${
                            sortOrder === "asc" ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">कार्य</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.households && data.households.length > 0 ? (
                  data.households.map((household) => (
                    <TableRow
                      key={String(household.id)}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(
                          `/dashboard/households/view/${formatUuidForNav(household.id as string)}`,
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {(household.familyHeadName as string) || ""}
                      </TableCell>
                      <TableCell>{household.wardNo || ""}</TableCell>
                      <TableCell>
                        {(household.locality as string) || ""}
                      </TableCell>
                      <TableCell>
                        {(household.familyHeadPhoneNo as string) || ""}
                      </TableCell>
                      <TableCell>{household.totalMembers || ""}</TableCell>
                      <TableCell>
                        {household.dateOfInterview
                          ? formatDate(household.dateOfInterview.toString())
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/households/edit/${formatUuidForNav(household.id as string)}`,
                            );
                          }}
                          title="विवरण सम्पादन"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      <div>
                        <p className="text-xl font-semibold text-muted-foreground">
                          कुनै घरधुरी फेला परेन
                        </p>
                        <p className="mt-2">
                          खोज मापदण्ड परिवर्तन गर्नुहोस् वा नयाँ घरधुरी
                          थप्नुहोस्
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                पृष्ठ {currentPage} / {totalPages} (जम्मा{" "}
                {data?.meta?.total || 0} घरधुरी)
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* Show limited page numbers with ellipsis for many pages */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1),
                    )
                    .map((page, index, array) => (
                      <PaginationItem key={page}>
                        {/* Add ellipsis when pages are skipped */}
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              aria-disabled={true}
                              className="pointer-events-none opacity-50"
                            >
                              ...
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        <PaginationLink
                          href={`?page=${page}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
