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
import { MoreHorizontal, Edit2, Trash2, AlertTriangle } from "lucide-react";
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

type WardWiseDemographicSummaryData = {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  totalPopulation?: number | null;
  populationMale?: number | null;
  populationFemale?: number | null;
  populationOther?: number | null;
  totalHouseholds?: number | null;
  averageHouseholdSize?: string | null;
  sexRatio?: string | null;
};

interface WardWiseDemographicSummaryTableProps {
  data: WardWiseDemographicSummaryData[];
  onEdit: (id: string) => void;
}

export default function WardWiseDemographicSummaryTable({
  data,
  onEdit,
}: WardWiseDemographicSummaryTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");

  const utils = api.useContext();
  const deleteWardWiseDemographicSummary =
    api.profile.demographics.wardWiseDemographicSummary.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.demographics.wardWiseDemographicSummary.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseDemographicSummary.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Calculate unique wards for filtering
  const uniqueWards = Array.from(
    new Set(data.map((item) => item.wardNumber)),
  ).sort((a, b) => a - b);

  // Filter the data
  const filteredData = data.filter((item) => {
    return filterWard === "all" || item.wardNumber === parseInt(filterWard);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="ward-filter" className="text-sm whitespace-nowrap">
            वडा अनुसार फिल्टर:
          </label>
          <Select value={filterWard} onValueChange={setFilterWard}>
            <SelectTrigger className="w-[150px]">
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
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">वडा नं.</TableHead>
              <TableHead>वडाको नाम</TableHead>
              <TableHead className="text-right">जम्मा जनसंख्या</TableHead>
              <TableHead className="text-right">पुरुष</TableHead>
              <TableHead className="text-right">महिला</TableHead>
              <TableHead className="text-right">अन्य</TableHead>
              <TableHead className="text-right">जम्मा घरधुरी</TableHead>
              <TableHead className="text-right">औसत घरधुरी आकार</TableHead>
              <TableHead className="text-right">लिङ्ग अनुपात</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  कुनै डाटा भेटिएन
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.wardNumber}
                  </TableCell>
                  <TableCell>{item.wardName || `-`}</TableCell>
                  <TableCell className="text-right">
                    {item.totalPopulation?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.populationMale?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.populationFemale?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.populationOther?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.totalHouseholds?.toLocaleString() || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.averageHouseholdSize || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.sexRatio || "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(item.id)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          सम्पादन गर्नुहोस्
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          मेट्नुहोस्
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              वडा जनसांख्यिकी डाटा मेट्ने?
            </AlertDialogTitle>
            <AlertDialogDescription>
              यो कार्य पूर्ववत हुन सक्दैन। डाटा स्थायी रूपमा हटाइनेछ।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द गर्नुहोस्</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              मेट्नुहोस्
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
