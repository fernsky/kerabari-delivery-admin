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
import {
  MonthsSustainedEnum,
  monthsSustainedLabels,
} from "@/server/api/routers/profile/economics/ward-wise-annual-income-sustenance.schema";

type WardAnnualIncomeSustenanceData = {
  id: string;
  wardNumber: number;
  monthsSustained: string;
  households: number;
};

interface WardAnnualIncomeSustenanceTableProps {
  data: WardAnnualIncomeSustenanceData[];
  onEdit: (id: string) => void;
}

export default function WardAnnualIncomeSustenanceTable({
  data,
  onEdit,
}: WardAnnualIncomeSustenanceTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [filterMonthsSustained, setFilterMonthsSustained] =
    useState<string>("all");
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const utils = api.useContext();
  const deleteWardAnnualIncomeSustenance =
    api.profile.economics.wardWiseAnnualIncomeSustenance.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.economics.wardWiseAnnualIncomeSustenance.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      const itemToDelete = data.find((item) => item.id === deleteId);
      if (itemToDelete) {
        deleteWardAnnualIncomeSustenance.mutate({
          wardNumber: itemToDelete.wardNumber,
        });
      }
      setDeleteId(null);
    }
  };

  // Calculate unique wards for filtering
  const uniqueWards = Array.from(
    new Set(data.map((item) => item.wardNumber.toString())),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // Calculate unique months sustained categories for filtering
  const uniqueMonthsSustained = Array.from(
    new Set(data.map((item) => item.monthsSustained)),
  ).sort();

  // Filter the data
  const filteredData = data.filter((item) => {
    return (
      (filterWard === "all" || item.wardNumber.toString() === filterWard) &&
      (filterMonthsSustained === "all" ||
        item.monthsSustained === filterMonthsSustained)
    );
  });

  // Group data by ward number
  const groupedByWard = filteredData.reduce(
    (acc, item) => {
      const wardKey = item.wardNumber.toString();
      if (!acc[wardKey]) {
        acc[wardKey] = {
          wardNumber: item.wardNumber,
          items: [],
        };
      }
      acc[wardKey].items.push(item);
      return acc;
    },
    {} as Record<
      string,
      {
        wardNumber: number;
        items: WardAnnualIncomeSustenanceData[];
      }
    >,
  );

  // Sort ward groups by ward number
  const sortedWardGroups = Object.values(groupedByWard).sort(
    (a, b) => a.wardNumber - b.wardNumber,
  );

  // Toggle ward expansion
  const toggleWardExpansion = (wardNumber: string) => {
    setExpandedWards((prev) => ({
      ...prev,
      [wardNumber]: !prev[wardNumber],
    }));
  };

  // Initialize expanded state for all wards if not set
  if (sortedWardGroups.length > 0 && Object.keys(expandedWards).length === 0) {
    const initialExpandedState = sortedWardGroups.reduce(
      (acc, ward) => {
        acc[ward.wardNumber.toString()] = true; // Start with all wards expanded
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setExpandedWards(initialExpandedState);
  }

  // Helper function to get months sustained display names
  const getMonthsSustainedDisplayName = (monthsSustained: string): string => {
    return (
      monthsSustainedLabels[
        monthsSustained as keyof typeof monthsSustainedLabels
      ] || monthsSustained
    );
  };

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
                    <SelectItem key={ward} value={ward}>
                      वडा {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
              <label
                htmlFor="months-sustained-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                महिनाको अवधि अनुसार फिल्टर:
              </label>
              <Select
                value={filterMonthsSustained}
                onValueChange={setFilterMonthsSustained}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="सबै महिनाको अवधि श्रेणीहरू" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    सबै महिनाको अवधि श्रेणीहरू
                  </SelectItem>
                  {uniqueMonthsSustained.map((monthsSustained) => (
                    <SelectItem key={monthsSustained} value={monthsSustained}>
                      {getMonthsSustainedDisplayName(monthsSustained)}
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
                const isExpanded =
                  expandedWards[wardGroup.wardNumber.toString()] ?? true;
                const totalHouseholds = wardGroup.items.reduce(
                  (sum, item) => sum + (item.households || 0),
                  0,
                );

                return (
                  <div
                    key={`ward-${wardGroup.wardNumber}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-muted/60 p-3 font-semibold flex items-center justify-between cursor-pointer hover:bg-muted/80"
                      onClick={() =>
                        toggleWardExpansion(wardGroup.wardNumber.toString())
                      }
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
                            घरपरिवार संख्या: {totalHouseholds.toLocaleString()}
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
                                महिनाको अवधि
                              </TableHead>
                              <TableHead className="text-right font-medium">
                                घरपरिवार संख्या
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
                                  {getMonthsSustainedDisplayName(
                                    item.monthsSustained,
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {item.households?.toLocaleString() || "-"}
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
                                {totalHouseholds.toLocaleString()}
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
              // Grid view - Months sustained categories as columns
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-white z-10 w-24">
                        वडा / महिनाको अवधि श्रेणी
                      </TableHead>
                      {/* Generate column headers for each months sustained category */}
                      {uniqueMonthsSustained.map((monthsSustained) => (
                        <TableHead
                          key={monthsSustained}
                          className="text-center min-w-[150px]"
                        >
                          {getMonthsSustainedDisplayName(monthsSustained)}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">
                        कुल घरपरिवार संख्या
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWardGroups.map((wardGroup) => {
                      // Create a mapping of months sustained to item for this ward
                      const monthsSustainedMap = wardGroup.items.reduce(
                        (map, item) => {
                          map[item.monthsSustained] = item;
                          return map;
                        },
                        {} as Record<string, WardAnnualIncomeSustenanceData>,
                      );

                      const totalWardHouseholds = wardGroup.items.reduce(
                        (sum, item) => sum + (item.households || 0),
                        0,
                      );

                      return (
                        <TableRow key={`grid-${wardGroup.wardNumber}`}>
                          <TableCell className="font-medium sticky left-0 bg-white z-10">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {wardGroup.wardNumber}
                              </Badge>
                              वडा {wardGroup.wardNumber}
                            </div>
                          </TableCell>

                          {/* Render cells for each months sustained category */}
                          {uniqueMonthsSustained.map((monthsSustained) => {
                            const item = monthsSustainedMap[monthsSustained];
                            return (
                              <TableCell
                                key={`${wardGroup.wardNumber}-${monthsSustained}`}
                                className="text-center"
                              >
                                {item ? (
                                  <div className="flex flex-col space-y-1">
                                    <span className="font-medium">
                                      {item.households?.toLocaleString() || "-"}
                                    </span>
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

                          {/* Total ward households */}
                          <TableCell className="text-right font-medium">
                            {totalWardHouseholds > 0
                              ? totalWardHouseholds.toLocaleString()
                              : "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {/* Summary row with totals by months sustained */}
                    <TableRow className="bg-muted/20 font-medium">
                      <TableCell className="sticky left-0 bg-muted/20 z-10">
                        कुल जम्मा
                      </TableCell>
                      {uniqueMonthsSustained.map((monthsSustained) => {
                        const monthsSustainedTotal = filteredData
                          .filter(
                            (item) => item.monthsSustained === monthsSustained,
                          )
                          .reduce(
                            (sum, item) => sum + (item.households || 0),
                            0,
                          );

                        return (
                          <TableCell
                            key={`total-${monthsSustained}`}
                            className="text-center"
                          >
                            {monthsSustainedTotal > 0
                              ? monthsSustainedTotal.toLocaleString()
                              : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        {filteredData
                          .reduce(
                            (sum, item) => sum + (item.households || 0),
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
              वडा अनुसार वार्षिक आम्दानी हुने महिनाको विवरण मेट्ने?
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
