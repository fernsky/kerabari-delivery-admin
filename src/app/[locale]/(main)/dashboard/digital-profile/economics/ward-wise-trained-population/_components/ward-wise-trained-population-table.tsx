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

// Updated type to match schema
type WardWiseTrainedPopulationData = {
  id: string;
  wardNumber: number;
  trainedPopulation: number;
};

interface WardWiseTrainedPopulationTableProps {
  data: WardWiseTrainedPopulationData[];
  onEdit: (id: string) => void;
}

export default function WardWiseTrainedPopulationTable({
  data,
  onEdit,
}: WardWiseTrainedPopulationTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>(
    {},
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const utils = api.useContext();
  const deleteWardWiseTrainedPopulation =
    api.profile.economics.wardWiseTrainedPopulation.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.economics.wardWiseTrainedPopulation.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseTrainedPopulation.mutate({
        id: deleteId,
      });
      setDeleteId(null);
    }
  };

  // Calculate unique wards for filtering
  const uniqueWards = Array.from(
    new Set(data.map((item) => item.wardNumber.toString())),
  ).sort((a, b) => parseInt(a) - parseInt(b));

  // Filter the data
  const filteredData = data.filter((item) => {
    return filterWard === "all" || item.wardNumber.toString() === filterWard;
  });

  // Group data by ward number
  const groupedByWard = filteredData.reduce(
    (acc, item) => {
      const wardNumberStr = item.wardNumber.toString();
      if (!acc[wardNumberStr]) {
        acc[wardNumberStr] = {
          wardNumber: item.wardNumber,
          trainedPopulation: 0,
        };
      }
      acc[wardNumberStr].trainedPopulation = item.trainedPopulation || 0;
      return acc;
    },
    {} as Record<
      string,
      {
        wardNumber: number;
        trainedPopulation: number;
      }
    >,
  );

  // Sort ward groups by ward number
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

  // Calculate total trained population
  const totalTrainedPopulation = sortedWardGroups.reduce(
    (sum, ward) => sum + ward.trainedPopulation,
    0,
  );

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
                  {uniqueWards.map((wardNumber) => (
                    <SelectItem key={wardNumber} value={wardNumber}>
                      वडा {wardNumber}
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      <TableHead className="font-medium">वडा नम्बर</TableHead>
                      <TableHead className="text-right font-medium">
                        तालिम प्राप्त जनसंख्या
                      </TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedWardGroups.map((wardGroup) => (
                      <TableRow
                        key={wardGroup.wardNumber}
                        className="hover:bg-muted/30"
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                              {wardGroup.wardNumber}
                            </span>
                            <span>वडा नं. {wardGroup.wardNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {wardGroup.trainedPopulation?.toLocaleString() || "0"}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">मेनु खोल्नुहोस्</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  const item = data.find(
                                    (i) =>
                                      i.wardNumber === wardGroup.wardNumber,
                                  );
                                  if (item) {
                                    onEdit(item.id);
                                  }
                                }}
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                सम्पादन गर्नुहोस्
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  const item = data.find(
                                    (i) =>
                                      i.wardNumber === wardGroup.wardNumber,
                                  );
                                  if (item) {
                                    setDeleteId(item.id);
                                  }
                                }}
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
                    <TableRow className="bg-muted/10 font-medium">
                      <TableCell>जम्मा</TableCell>
                      <TableCell className="text-right">
                        {totalTrainedPopulation.toLocaleString()}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedWardGroups.map((wardGroup) => {
                  const item = data.find(
                    (i) => i.wardNumber === wardGroup.wardNumber,
                  );

                  return (
                    <Card
                      key={wardGroup.wardNumber}
                      className="p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center mr-2">
                            {wardGroup.wardNumber}
                          </span>
                          <h3 className="font-medium">
                            वडा नं. {wardGroup.wardNumber}
                          </h3>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                if (item) onEdit(item.id);
                              }}
                            >
                              <Edit2 className="mr-2 h-4 w-4" />
                              सम्पादन गर्नुहोस्
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                if (item) setDeleteId(item.id);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              मेट्नुहोस्
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          तालिम प्राप्त जनसंख्या
                        </div>
                        <div className="text-2xl font-bold mt-1">
                          {wardGroup.trainedPopulation.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {totalTrainedPopulation > 0
                            ? `${(
                                (wardGroup.trainedPopulation /
                                  totalTrainedPopulation) *
                                100
                              ).toFixed(1)}% कुल प्रतिशत`
                            : "0% कुल प्रतिशत"}
                        </div>
                      </div>
                    </Card>
                  );
                })}

                {/* Total Card */}
                <Card className="p-4 bg-muted/20">
                  <div className="text-center h-full flex flex-col justify-center">
                    <h3 className="font-medium mb-4">कुल जम्मा</h3>
                    <div className="text-3xl font-bold">
                      {totalTrainedPopulation.toLocaleString()}
                    </div>
                    <div className="text-sm mt-2 text-muted-foreground">
                      तालिम प्राप्त जनसंख्या
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Results summary */}
        {filteredData.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            जम्मा वडाहरू: {sortedWardGroups.length} | कुल तालिम प्राप्त
            जनसंख्या: {totalTrainedPopulation.toLocaleString()}
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
              वडा अनुसार तालिम प्राप्त जनसंख्या डाटा मेट्ने?
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
