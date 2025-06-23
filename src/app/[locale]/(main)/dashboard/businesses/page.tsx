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

// Update business type to match our schema
type Business = {
  id: string;
  businessName?: string;
  operatorName?: string;
  wardNo?: number | null;
  businessNature?: string;
  businessType?: string;
  operatorPhone?: string;
  isBusinessRegistered?: string;
  businessInvestment?: number;
  status: string;
};

export default function BusinessesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [wardFilter, setWardFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  // Fix the sortBy to use the correct enum values from schema
  const [sortBy, setSortBy] = useState<
    | "business_name"
    | "ward_no"
    | "business_district"
    | "operator_name"
    | "status"
  >("business_name"); // Changed from businessName to business_name
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch businesses data with pagination
  const { data, isLoading, error } = api.business.getAll.useQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    sortBy: sortBy,
    sortOrder: sortOrder,
    filters: {
      wardNo: wardFilter,
      status: statusFilter as
        | "all"
        | "pending"
        | "approved"
        | "rejected"
        | "requested_for_edit"
        | undefined,
    },
    search: searchQuery.length > 2 ? searchQuery : undefined,
  });

  const totalPages = data?.pagination?.total
    ? Math.ceil(data.pagination.total / pageSize)
    : 0;

  // Handle sort toggle - update to use correct schema field names
  const toggleSort = (
    column:
      | "business_name"
      | "ward_no"
      | "business_district"
      | "operator_name"
      | "status",
  ) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "स्वीकृत";
      case "rejected":
        return "अस्वीकृत";
      case "requested_for_edit":
        return "संशोधन आवश्यक";
      case "pending":
      default:
        return "प्रक्रियामा";
    }
  };

  const formatStatusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "requested_for_edit":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">व्यवसाय सूची</h1>
        {/* <Button onClick={() => router.push("/dashboard/businesses/create")}>
          <Plus className="mr-2 h-4 w-4" />
          नयाँ व्यवसाय थप्नुहोस्
        </Button> */}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="व्यवसायको नाम, प्रकार वा संचालकको नाम खोज्नुहोस्"
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
            value={statusFilter || ""}
            onValueChange={(value) => {
              setStatusFilter(value || undefined);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="स्थिति" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">सबै स्थिति</SelectItem>
              <SelectItem value="approved">स्वीकृत</SelectItem>
              <SelectItem value="pending">प्रक्रियामा</SelectItem>
              <SelectItem value="rejected">अस्वीकृत</SelectItem>
              <SelectItem value="requested_for_edit">संशोधन आवश्यक</SelectItem>
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
                कुल {data?.pagination?.total || 0} व्यवसायहरु
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("business_name")}
                  >
                    <div className="flex items-center">
                      व्यवसायको नाम
                      {sortBy === "business_name" && (
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
                    onClick={() => toggleSort("operator_name")}
                  >
                    <div className="flex items-center">
                      संचालकको नाम
                      {sortBy === "operator_name" && (
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
                  <TableHead>प्रकृति</TableHead>
                  <TableHead>प्रकार</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center">
                      स्थिति
                      {sortBy === "status" && (
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
                {data?.data && data.data.length > 0 ? (
                  //@ts-ignore
                  data.data.map((business: Business) => (
                    <TableRow
                      key={String(business.id)}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        router.push(
                          `/dashboard/businesses/view/${encodeURIComponent(business.id)}`,
                        )
                      }
                    >
                      <TableCell className="font-medium">
                        {business.businessName || ""}
                      </TableCell>
                      <TableCell>{business.operatorName || ""}</TableCell>
                      <TableCell>{business.wardNo || ""}</TableCell>
                      <TableCell>{business.businessNature || ""}</TableCell>
                      <TableCell>{business.businessType || ""}</TableCell>
                      <TableCell>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${formatStatusClass(business.status)}`}
                        >
                          {formatStatusLabel(business.status)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/businesses/edit/${encodeURIComponent(business.id)}`,
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
                          कुनै व्यवसाय फेला परेन
                        </p>
                        <p className="mt-2">
                          खोज मापदण्ड परिवर्तन गर्नुहोस् वा नयाँ व्यवसाय
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
                {data?.pagination?.total || 0} व्यवसाय)
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
