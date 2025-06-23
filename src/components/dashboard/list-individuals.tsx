//@ts-nocheck
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
import { Search, ArrowUpDown, User } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { ContentLayout } from "../admin-panel/content-layout";
import { User as AuthUser } from "@/server/db/schema/basic";

// Function to format UUID for navigation
function formatUuidForNav(uuid: string): string {
  return uuid.replace(/^uuid:/, "");
}

export default function ListIndividuals({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [wardFilter, setWardFilter] = useState<number | undefined>(undefined);
  const [genderFilter, setGenderFilter] = useState<string | undefined>(
    undefined,
  );
  const [educationFilter, setEducationFilter] = useState<string | undefined>(
    undefined,
  );
  const [presentFilter, setPresentFilter] = useState<string | undefined>(
    undefined,
  );
  const [sortBy, setSortBy] = useState<
    "name" | "age" | "gender" | "familyRole"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch individuals data with pagination
  const { data, isLoading, error } = api.individuals.getIndividuals.useQuery({
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    sortBy: sortBy,
    sortOrder: sortOrder,
    filters: {
      wardNo: wardFilter,
      gender: genderFilter,
      educationalLevel: educationFilter,
      isPresent: presentFilter,
    },
    search: searchQuery.length > 2 ? searchQuery : undefined, // Only search if query has at least 3 characters
  });

  const totalPages = data?.meta?.total
    ? Math.ceil(data.meta.total / pageSize)
    : 0;

  // Handle sort toggle
  const toggleSort = (column: "name" | "age" | "gender" | "familyRole") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Helper functions for translating values to Nepali
  const translateGender = (gender: string | null | undefined) => {
    if (!gender) return "";
    if (gender === "Male") return "पुरुष";
    if (gender === "Female") return "महिला";
    if (gender === "Other") return "अन्य";
    return gender;
  };

  const translateFamilyRole = (role: string | null | undefined) => {
    if (!role) return "";
    if (role.toLowerCase() === "head") return "मुखिया";
    return role;
  };

  const translateEducation = (level: string | null | undefined) => {
    if (!level) return "";

    const educationMap: Record<string, string> = {
      none: "निरक्षर",
      primary: "प्राथमिक",
      secondary: "माध्यमिक",
      higher_secondary: "उच्च माध्यमिक",
      bachelor: "स्नातक",
      masters: "स्नातकोत्तर",
      phd: "विद्यावारिधि",
      other: "अन्य",
    };

    return educationMap[level.toLowerCase()] || level;
  };

  return (
    <ContentLayout title="व्यक्तिगत सूची">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="नाम, परिवारको भूमिका वा अन्य विवरणद्वारा खोज्नुहोस्"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
              value={genderFilter || ""}
              onValueChange={(value) => {
                setGenderFilter(value || undefined);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="लिङ्ग" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सबै लिङ्ग</SelectItem>
                <SelectItem value="Male">पुरुष</SelectItem>
                <SelectItem value="Female">महिला</SelectItem>
                <SelectItem value="Other">अन्य</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={educationFilter || ""}
              onValueChange={(value) => {
                setEducationFilter(value || undefined);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="शिक्षा" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सबै शिक्षा</SelectItem>
                <SelectItem value="none">निरक्षर</SelectItem>
                <SelectItem value="primary">प्राथमिक</SelectItem>
                <SelectItem value="secondary">माध्यमिक</SelectItem>
                <SelectItem value="higher_secondary">उच्च माध्यमिक</SelectItem>
                <SelectItem value="bachelor">स्नातक</SelectItem>
                <SelectItem value="masters">स्नातकोत्तर</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={presentFilter || ""}
              onValueChange={(value) => {
                setPresentFilter(value || undefined);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="उपस्थिति" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सबै</SelectItem>
                <SelectItem value="Yes">उपस्थित</SelectItem>
                <SelectItem value="No">अनुपस्थित</SelectItem>
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
                  कुल {data?.meta?.total || 0} व्यक्तिहरु
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => toggleSort("name")}
                    >
                      <div className="flex items-center">
                        नाम
                        {sortBy === "name" && (
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
                      onClick={() => toggleSort("gender")}
                    >
                      <div className="flex items-center">
                        लिङ्ग
                        {sortBy === "gender" && (
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
                      onClick={() => toggleSort("age")}
                    >
                      <div className="flex items-center">
                        उमेर
                        {sortBy === "age" && (
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
                      onClick={() => toggleSort("familyRole")}
                    >
                      <div className="flex items-center">
                        परिवारमा भूमिका
                        {sortBy === "familyRole" && (
                          <ArrowUpDown
                            className={`ml-2 h-4 w-4 ${
                              sortOrder === "asc" ? "transform rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>वडा नं.</TableHead>
                    <TableHead>उपस्थिति</TableHead>
                    <TableHead>शैक्षिक स्तर</TableHead>
                    <TableHead className="text-right">कार्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.individuals && data.individuals.length > 0 ? (
                    data.individuals.map((individual) => {
                      // Format the individual ID correctly for navigation
                      const individualIdForLink = formatUuidForNav(
                        individual.id,
                      );

                      return (
                        <TableRow
                          key={individual.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            router.push(
                              `/dashboard/individuals/${encodeURIComponent(individualIdForLink)}`,
                            )
                          }
                        >
                          <TableCell className="font-medium">
                            {individual.name || ""}
                          </TableCell>
                          <TableCell>
                            {translateGender(individual.gender)}
                          </TableCell>
                          <TableCell>{individual.age || ""}</TableCell>
                          <TableCell>
                            {individual.familyRole?.toLowerCase() === "head" ? (
                              <Badge variant="default">मुखिया</Badge>
                            ) : (
                              translateFamilyRole(individual.familyRole)
                            )}
                          </TableCell>
                          <TableCell>{individual.wardNo || ""}</TableCell>
                          <TableCell>
                            {individual.isPresent?.toLowerCase() === "no" ? (
                              <Badge variant="destructive">अनुपस्थित</Badge>
                            ) : (
                              <Badge variant="outline">उपस्थित</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {translateEducation(individual.educationalLevel)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(
                                  `/dashboard/individuals/${encodeURIComponent(individualIdForLink)}`,
                                );
                              }}
                              title="विवरण हेर्नुहोस्"
                            >
                              <User className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center h-24">
                        <div>
                          <p className="text-xl font-semibold text-muted-foreground">
                            कुनै व्यक्ति फेला परेन
                          </p>
                          <p className="mt-2">खोज मापदण्ड परिवर्तन गर्नुहोस्</p>
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
                  {data?.meta?.total || 0} व्यक्ति)
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
                        href={`?page=${
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        }`}
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
    </ContentLayout>
  );
}
