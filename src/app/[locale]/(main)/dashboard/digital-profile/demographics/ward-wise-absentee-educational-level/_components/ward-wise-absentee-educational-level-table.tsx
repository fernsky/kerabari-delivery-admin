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
import { educationalLevelEnum } from "@/server/db/schema/profile/demographics/ward-wise-absentee-educational-level";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// Helper function to get display names for educational levels
const getEducationalLevelDisplay = (level: string): string => {
  const displayMap: Record<string, string> = {
    CHILD_DEVELOPMENT_CENTER: "बालविकास केन्द्र / मंटेस्वोरी",
    NURSERY: "नर्सरी/केजी",
    CLASS_1: "कक्षा १",
    CLASS_2: "कक्षा २",
    CLASS_3: "कक्षा ३",
    CLASS_4: "कक्षा ४",
    CLASS_5: "कक्षा ५",
    CLASS_6: "कक्षा ६",
    CLASS_7: "कक्षा ७",
    CLASS_8: "कक्षा ८",
    CLASS_9: "कक्षा ९",
    CLASS_10: "कक्षा १०",
    SLC_LEVEL: "एसईई/एसएलसी/सो सरह",
    CLASS_12_LEVEL: "कक्षा १२ वा PCL वा सो सरह",
    BACHELOR_LEVEL: "स्नातक वा सो सरह",
    MASTERS_LEVEL: "स्नातकोत्तर वा सो सरह",
    PHD_LEVEL: "पीएचडी वा सो सरह",
    OTHER: "अन्य",
    INFORMAL_EDUCATION: "अनौपचारिक शिक्षा",
    EDUCATED: "साक्षर",
    UNKNOWN: "थाहा नभएको",
  };

  return displayMap[level] || level;
};

type WardWiseAbsenteeEducationalLevelData = {
  id: string;
  wardNumber: number;
  educationalLevel: string;
  population: number;
};

interface WardWiseAbsenteeEducationalLevelTableProps {
  data: WardWiseAbsenteeEducationalLevelData[];
  onEdit: (id: string) => void;
}

export default function WardWiseAbsenteeEducationalLevelTable({
  data,
  onEdit,
}: WardWiseAbsenteeEducationalLevelTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterEducationLevel, setFilterEducationLevel] =
    useState<string>("all");
  const [expandedWards, setExpandedWards] = useState<Record<number, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const utils = api.useContext();
  const deleteWardWiseAbsenteeEducationalLevel =
    api.profile.demographics.wardWiseAbsenteeEducationalLevel.delete.useMutation(
      {
        onSuccess: () => {
          toast.success("डाटा सफलतापूर्वक मेटियो");
          utils.profile.demographics.wardWiseAbsenteeEducationalLevel.getAll.invalidate();
        },
        onError: (err) => {
          toast.error(`त्रुटि: ${err.message}`);
        },
      },
    );

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseAbsenteeEducationalLevel.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Add display names to the data
  const enhancedData = data.map((item) => ({
    ...item,
    educationalLevelDisplay: getEducationalLevelDisplay(item.educationalLevel),
  }));

  // Calculate unique wards and educational levels for filtering
  const uniqueWards = Array.from(
    new Set(enhancedData.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Get all available educational level values from enum
  const allEducationalLevels = educationalLevelEnum.enumValues;

  // Filter the data
  const filteredData = enhancedData.filter((item) => {
    return (
      (filterWard === "all" || item.wardNumber === parseInt(filterWard)) &&
      (filterEducationLevel === "all" ||
        item.educationalLevel === filterEducationLevel)
    );
  });

  // Group data by ward number
  const groupedByWard = filteredData.reduce(
    (acc, item) => {
      if (!acc[item.wardNumber]) {
        acc[item.wardNumber] = {
          wardNumber: item.wardNumber,
          items: [],
        };
      }
      acc[item.wardNumber].items.push(item);
      return acc;
    },
    {} as Record<
      number,
      {
        wardNumber: number;
        items: (WardWiseAbsenteeEducationalLevelData & {
          educationalLevelDisplay: string;
        })[];
      }
    >,
  );

  // Sort ward groups
  const sortedWardGroups = Object.values(groupedByWard).sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Toggle ward expansion
  const toggleWardExpansion = (wardNumber: number) => {
    setExpandedWards((prev) => ({
      ...prev,
      [wardNumber]: !prev[wardNumber],
    }));
  };

  // Initialize expanded state for all wards if not set
  if (sortedWardGroups.length > 0 && Object.keys(expandedWards).length === 0) {
    const initialExpandedState = sortedWardGroups.reduce(
      (acc, ward) => {
        acc[ward.wardNumber] = true; // Start with all wards expanded
        return acc;
      },
      {} as Record<number, boolean>,
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
                  {uniqueWards.map((ward) => (
                    <SelectItem key={ward} value={ward.toString()}>
                      वडा {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="education-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                शैक्षिक स्तर अनुसार फिल्टर:
              </label>
              <Select
                value={filterEducationLevel}
                onValueChange={setFilterEducationLevel}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="सबै शैक्षिक स्तर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सबै शैक्षिक स्तर</SelectItem>
                  {allEducationalLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {getEducationalLevelDisplay(level)}
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
                const isExpanded = expandedWards[wardGroup.wardNumber] ?? true;
                const totalPopulation = wardGroup.items.reduce(
                  (sum, item) => sum + item.population,
                  0,
                );

                return (
                  <div
                    key={`ward-${wardGroup.wardNumber}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-muted/60 p-3 font-semibold flex items-center justify-between cursor-pointer hover:bg-muted/80"
                      onClick={() => toggleWardExpansion(wardGroup.wardNumber)}
                    >
                      <div className="flex items-center">
                        <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                          {wardGroup.wardNumber}
                        </span>
                        <span>वडा नं. {wardGroup.wardNumber}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-normal text-muted-foreground hidden md:block">
                          <span className="mr-4">
                            कुल अनुपस्थित जनसंख्या:{" "}
                            {totalPopulation.toLocaleString()}
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
                                शैक्षिक स्तर
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
                                  {item.educationalLevelDisplay}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.population.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  {totalPopulation > 0
                                    ? (
                                        (item.population / totalPopulation) *
                                        100
                                      ).toFixed(2) + "%"
                                    : "-"}
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
              // Grid view - Educational levels as columns
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10 w-24">
                        वडा
                      </TableHead>
                      {/* Generate column headers for relevant educational levels */}
                      {allEducationalLevels.map((level) => (
                        <TableHead
                          key={level}
                          className="text-center min-w-[150px]"
                        >
                          {getEducationalLevelDisplay(level)}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">कुल जनसंख्या</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWardGroups.map((wardGroup) => {
                      const totalWardPopulation = wardGroup.items.reduce(
                        (sum, item) => sum + item.population,
                        0,
                      );

                      // Create a mapping of educational level to item for this ward
                      const levelMap = wardGroup.items.reduce(
                        (map, item) => {
                          map[item.educationalLevel] = item;
                          return map;
                        },
                        {} as Record<
                          string,
                          WardWiseAbsenteeEducationalLevelData & {
                            educationalLevelDisplay: string;
                          }
                        >,
                      );

                      return (
                        <TableRow key={`grid-ward-${wardGroup.wardNumber}`}>
                          <TableCell className="font-medium sticky left-0 bg-white z-10">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {wardGroup.wardNumber}
                              </Badge>
                              वडा {wardGroup.wardNumber}
                            </div>
                          </TableCell>

                          {/* Render cells for each educational level */}
                          {allEducationalLevels.map((level) => {
                            const item = levelMap[level];
                            return (
                              <TableCell
                                key={`${wardGroup.wardNumber}-${level}`}
                                className="text-center"
                              >
                                {item ? (
                                  <div className="flex flex-col space-y-1">
                                    <span className="font-medium">
                                      {item.population.toLocaleString()}
                                    </span>
                                    {totalWardPopulation > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {(
                                          (item.population /
                                            totalWardPopulation) *
                                          100
                                        ).toFixed(1)}
                                        %
                                      </span>
                                    )}
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

                    {/* Summary row with totals by educational level */}
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell className="sticky left-0 bg-muted/20 z-10">
                        कुल जम्मा
                      </TableCell>
                      {allEducationalLevels.map((level) => {
                        const levelTotal = filteredData
                          .filter((item) => item.educationalLevel === level)
                          .reduce((sum, item) => sum + item.population, 0);

                        return (
                          <TableCell
                            key={`total-${level}`}
                            className="text-center"
                          >
                            {levelTotal > 0 ? levelTotal.toLocaleString() : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        {filteredData
                          .reduce((sum, item) => sum + item.population, 0)
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
              अनुपस्थित शैक्षिक स्तर डाटा मेट्ने?
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
