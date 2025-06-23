"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  Filter,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
} from "lucide-react";
import { api } from "@/trpc/react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LanguageTypeEnum } from "@/server/api/routers/profile/demographics/ward-wise-mother-tongue-population.schema";

type WardWiseMotherTonguePopulationData = {
  id: string;
  wardId: string;
  wardNumber?: number;
  wardName?: string | null;
  languageType: string;
  languageName: string;
  population?: number | null;
  percentage?: string | null;
};

interface WardWiseMotherTonguePopulationTableProps {
  data: WardWiseMotherTonguePopulationData[];
  onEdit: (id: string) => void;
}

export default function WardWiseMotherTonguePopulationTable({
  data,
  onEdit,
}: WardWiseMotherTonguePopulationTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterLanguage, setFilterLanguage] = useState<string>("all");
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const utils = api.useContext();
  const deleteWardWiseMotherTonguePopulation =
    api.profile.demographics.wardWiseMotherTonguePopulation.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.demographics.wardWiseMotherTonguePopulation.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseMotherTonguePopulation.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Calculate unique wards and languages for filtering
  const uniqueWards = Array.from(
    new Set(data.map((item) => item.wardId)),
  ).sort();

  // Get ward numbers for display
  const wardIdToNumber = data.reduce(
    (acc, item) => {
      if (item.wardId && item.wardNumber) {
        acc[item.wardId] = item.wardNumber;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  // Calculate unique languages for filtering
  const uniqueLanguages = Array.from(
    new Set(data.map((item) => item.languageType)),
  ).sort();

  // Filter the data
  const filteredData = data.filter((item) => {
    return (
      (filterWard === "all" || item.wardId === filterWard) &&
      (filterLanguage === "all" || item.languageType === filterLanguage)
    );
  });

  // Group data by ward ID
  const groupedByWard = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.wardId]) {
        acc[item.wardId] = {
          wardId: item.wardId,
          wardNumber: item.wardNumber || Number(item.wardId),
          wardName: item.wardName,
          items: [],
        };
      }
      acc[item.wardId].items.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        wardId: string;
        wardNumber: number;
        wardName?: string | null;
        items: WardWiseMotherTonguePopulationData[];
      }
    >,
  );

  // Sort ward groups by ward number
  const sortedWardGroups = Object.values(groupedByWard).sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Toggle ward expansion
  const toggleWardExpansion = (wardId: string) => {
    setExpandedWards((prev) => ({
      ...prev,
      [wardId]: !prev[wardId],
    }));
  };

  // Initialize expanded state for all wards if not set
  if (sortedWardGroups.length > 0 && Object.keys(expandedWards).length === 0) {
    const initialExpandedState = sortedWardGroups.reduce(
      (acc, ward) => {
        acc[ward.wardId] = true; // Start with all wards expanded
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setExpandedWards(initialExpandedState);
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Filters and View Options */}
        <div className="bg-muted/40 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">फिल्टरहरू</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                सूची
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                ग्रिड
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="ward-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                वडा अनुसार फिल्टर:
              </label>
              <Select value={filterWard} onValueChange={setFilterWard}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="सबै वडाहरू" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै वडाहरू</SelectItem>
                  {uniqueWards.map((wardId) => (
                    <SelectItem key={wardId} value={wardId}>
                      वडा {wardIdToNumber[wardId] || wardId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="language-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                मातृभाषा अनुसार फिल्टर:
              </label>
              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="सबै मातृभाषाहरू" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै मातृभाषाहरू</SelectItem>
                  {uniqueLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Section - Switch between list and grid views */}
        {sortedWardGroups.length === 0 ? (
          <div className="border rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2 opacity-40" />
              <p>कुनै डाटा भेटिएन</p>
              <p className="text-sm">
                कृपया फिल्टरहरू समायोजन गर्नुहोस् वा नयाँ रेकर्ड थप्नुहोस्
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {viewMode === "list" ? (
              // Traditional list view
              sortedWardGroups.map((wardGroup) => {
                const isExpanded = expandedWards[wardGroup.wardId] ?? true;
                const totalPopulation = wardGroup.items.reduce(
                  (sum, item) => sum + (item.population || 0),
                  0,
                );

                return (
                  <div
                    key={`ward-${wardGroup.wardId}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-muted/60 p-3 font-semibold flex items-center justify-between cursor-pointer hover:bg-muted/80"
                      onClick={() => toggleWardExpansion(wardGroup.wardId)}
                    >
                      <div className="flex items-center">
                        <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                          {wardGroup.wardNumber}
                        </span>
                        <span>
                          वडा नं. {wardGroup.wardNumber}
                          {wardGroup.wardName ? ` - ${wardGroup.wardName}` : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-normal text-muted-foreground hidden md:block">
                          <span className="mr-4">
                            जनसंख्या: {totalPopulation.toLocaleString()}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                              <TableHead className="font-medium">
                                मातृभाषा
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                जनसंख्या
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                प्रतिशत (%)
                              </TableHead>
                              <TableHead className="w-10" />
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {wardGroup.items.map((item) => (
                              <TableRow
                                key={item.id}
                                className="hover:bg-muted/30"
                              >
                                <TableCell className="max-w-[240px] truncate">
                                  {item.languageType}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.population?.toLocaleString() || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.percentage || "-"}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          मेनु खोल्नुहोस्
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-[160px]"
                                    >
                                      <DropdownMenuLabel>
                                        कार्यहरू
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() => onEdit(item.id)}
                                      >
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        सम्पादन गर्नुहोस्
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => setDeleteId(item.id)}
                                        className="text-destructive focus:text-destructive"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        मेट्नुहोस्
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="bg-muted/10">
                              <TableCell className="font-medium">
                                जम्मा
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {totalPopulation.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                100%
                              </TableCell>
                              <TableCell />
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              // Grid view - Languages as columns
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10 w-24">
                        वडा
                      </TableHead>
                      {/* Generate column headers for each language */}
                      {uniqueLanguages.map((language) => (
                        <TableHead
                          key={language}
                          className="text-center min-w-[150px]"
                        >
                          {language}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">कुल जनसंख्या</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWardGroups.map((wardGroup) => {
                      const totalWardPopulation = wardGroup.items.reduce(
                        (sum, item) => sum + (item.population || 0),
                        0,
                      );

                      // Create a mapping of language to item for this ward
                      const languageMap = wardGroup.items.reduce(
                        (map, item) => {
                          map[item.languageType] = item;
                          return map;
                        },
                        {} as Record<
                          string,
                          WardWiseMotherTonguePopulationData
                        >,
                      );

                      return (
                        <TableRow key={`grid-ward-${wardGroup.wardId}`}>
                          <TableCell className="font-medium sticky left-0 bg-white z-10">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {wardGroup.wardNumber}
                              </Badge>
                              {wardGroup.wardName ||
                                `वडा ${wardGroup.wardNumber}`}
                            </div>
                          </TableCell>

                          {/* Render cells for each language */}
                          {uniqueLanguages.map((language) => {
                            const item = languageMap[language];
                            return (
                              <TableCell
                                key={`${wardGroup.wardId}-${language}`}
                                className="text-center"
                              >
                                {item ? (
                                  <div className="flex flex-col space-y-1">
                                    <span className="font-medium">
                                      {item.population?.toLocaleString() || "-"}
                                    </span>
                                    {item.percentage && (
                                      <span className="text-xs text-muted-foreground">
                                        {item.percentage}%
                                      </span>
                                    )}
                                    {item && (
                                      <div className="flex justify-center mt-1 space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => onEdit(item.id)}
                                        >
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                          onClick={() => setDeleteId(item.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            );
                          })}

                          {/* Total ward population */}
                          <TableCell className="text-right font-medium">
                            {totalWardPopulation.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {/* Summary row with totals by language */}
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell className="sticky left-0 bg-muted/20 z-10">
                        कुल जम्मा
                      </TableCell>
                      {uniqueLanguages.map((language) => {
                        const languageTotal = filteredData
                          .filter((item) => item.languageType === language)
                          .reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          );

                        return (
                          <TableCell
                            key={`total-${language}`}
                            className="text-center"
                          >
                            {languageTotal > 0
                              ? languageTotal.toLocaleString()
                              : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        {filteredData
                          .reduce(
                            (sum, item) => sum + (item.population || 0),
                            0,
                          )
                          .toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}

        {/* Results summary */}
        {filteredData.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            जम्मा वडाहरू: {sortedWardGroups.length} | जम्मा रेकर्डहरू:{" "}
            {filteredData.length}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              मातृभाषा जनसंख्या डाटा मेट्ने?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य पूर्ववत हुन सक्दैन। डाटा स्थायी रूपमा हटाइनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              मेट्नुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
