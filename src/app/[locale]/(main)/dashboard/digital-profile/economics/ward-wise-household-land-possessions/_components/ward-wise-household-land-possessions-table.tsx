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
import { Badge } from "@/components/ui/badge";

type WardWiseHouseholdLandPossessionsData = {
  id: string;
  wardNumber: number;
  households: number;
};

interface WardWiseHouseholdLandPossessionsTableProps {
  data: WardWiseHouseholdLandPossessionsData[];
  onEdit: (id: string) => void;
}

export default function WardWiseHouseholdLandPossessionsTable({
  data,
  onEdit,
}: WardWiseHouseholdLandPossessionsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [expandedWards, setExpandedWards] = useState<Record<string, boolean>>(
    {},
  );

  const utils = api.useContext();
  const deleteWardWiseHouseholdLandPossessions =
    api.profile.economics.wardWiseHouseholdLandPossessions.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.economics.wardWiseHouseholdLandPossessions.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseHouseholdLandPossessions.mutate({
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

  // Sort data by ward number
  const sortedData = [...filteredData].sort(
    (a, b) => a.wardNumber - b.wardNumber,
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
                  {uniqueWards.map((ward) => (
                    <SelectItem key={ward} value={ward}>
                      वडा {ward}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {sortedData.length === 0 ? (
          <div className="border rounded-lg p-8">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2 opacity-40" />
              <p>कुनै डाटा भेटिएन</p>
              <p className="text-sm">
                कृपया फिल्टरहरू समायोजन गर्नुहोस् वा नयाँ रेकर्ड थप्नुहोस्
              </p>
            </div>
          </div>
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>वडा नम्बर</TableHead>
                  <TableHead className="text-right">
                    जग्गा भएका घरधुरी संख्या
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.wardNumber}</Badge>
                        <span>वडा नं. {item.wardNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.households.toLocaleString()}
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
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onEdit(item.id)}>
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
                  <TableCell className="font-medium">जम्मा</TableCell>
                  <TableCell className="text-right font-medium">
                    {sortedData
                      .reduce((sum, item) => sum + item.households, 0)
                      .toLocaleString()}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : (
          // Grid view
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sortedData.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="px-2 py-1">
                    वडा {item.wardNumber}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">मेनु खोल्नुहोस्</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(item.id)}>
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
                </div>
                <div className="font-bold text-2xl text-center my-4">
                  {item.households.toLocaleString()}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  जग्गा भएका घरधुरी संख्या
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results summary */}
        {filteredData.length > 0 && (
          <div className="text-sm text-muted-foreground text-right">
            जम्मा वडाहरू: {filteredData.length} | कुल जग्गा भएका घरधुरी:{" "}
            {filteredData
              .reduce((sum, item) => sum + (item.households || 0), 0)
              .toLocaleString()}
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
              वडा अनुसार घरधुरी जग्गा स्वामित्व डाटा मेट्ने?
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
