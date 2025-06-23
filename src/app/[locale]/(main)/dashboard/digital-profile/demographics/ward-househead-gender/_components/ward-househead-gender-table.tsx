"use client";

import { useState, useMemo } from "react";
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
  XCircle,
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Gender = "MALE" | "FEMALE" | "OTHER";

type WardWiseHouseHeadGenderData = {
  id: string;
  wardNumber: number;
  wardName?: string | null;
  gender: Gender;
  population: number;
};

interface WardWiseHouseHeadGenderTableProps {
  data: WardWiseHouseHeadGenderData[];
  onEdit: (id: string) => void;
}

export default function WardWiseHouseHeadGenderTable({
  data,
  onEdit,
}: WardWiseHouseHeadGenderTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterWard, setFilterWard] = useState<string>("all");

  const utils = api.useContext();

  const deleteWardWiseHouseHeadGender =
    api.profile.demographics.wardWiseHouseHeadGender.delete.useMutation({
      onSuccess: () => {
        toast.success("डाटा सफलतापूर्वक मेटियो");
        utils.profile.demographics.wardWiseHouseHeadGender.getAll.invalidate();
      },
      onError: (err) => {
        toast.error(`त्रुटि: ${err.message}`);
      },
    });

  const handleDelete = () => {
    if (deleteId) {
      deleteWardWiseHouseHeadGender.mutate({ id: deleteId });
      setDeleteId(null);
    }
  };

  // Calculate unique wards for filtering
  const uniqueWards = useMemo(() => {
    return Array.from(new Set(data.map((item) => item.wardNumber))).sort(
      (a, b) => a - b,
    );
  }, [data]);

  // Filter the data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        filterWard === "all" || item.wardNumber === parseInt(filterWard),
    );
  }, [data, filterWard]);

  // Process data for the new table layout
  const processedData = useMemo(() => {
    // Group data by ward number
    const byWard = filteredData.reduce<
      Record<number, Record<Gender, { id: string; population: number }>>
    >((acc, item) => {
      if (!acc[item.wardNumber]) {
        acc[item.wardNumber] = {
          MALE: { id: "", population: 0 },
          FEMALE: { id: "", population: 0 },
          OTHER: { id: "", population: 0 },
        };
      }
      acc[item.wardNumber][item.gender] = {
        id: item.id,
        population: item.population,
      };
      return acc;
    }, {});

    // Get ward names
    const wardNames = filteredData.reduce<Record<number, string>>(
      (acc, item) => {
        if (item.wardName && !acc[item.wardNumber]) {
          acc[item.wardNumber] = item.wardName;
        }
        return acc;
      },
      {},
    );

    return { byWard, wardNames };
  }, [filteredData]);

  // Calculate totals
  const totals = useMemo(() => {
    const result = {
      MALE: 0,
      FEMALE: 0,
      OTHER: 0,
      total: 0,
    };

    filteredData.forEach((item) => {
      result[item.gender] += item.population;
      result.total += item.population;
    });

    return result;
  }, [filteredData]);

  // Calculate percentages
  const percentages = useMemo(() => {
    const total = totals.total;
    return {
      MALE: total > 0 ? ((totals.MALE / total) * 100).toFixed(1) : "0",
      FEMALE: total > 0 ? ((totals.FEMALE / total) * 100).toFixed(1) : "0",
      OTHER: total > 0 ? ((totals.OTHER / total) * 100).toFixed(1) : "0",
    };
  }, [totals]);

  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "पुरुष";
      case "FEMALE":
        return "महिला";
      case "OTHER":
        return "अन्य";
      default:
        return gender;
    }
  };

  const getGenderBadgeColor = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800";
      case "FEMALE":
        return "bg-pink-100 text-pink-800";
      case "OTHER":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderBgColor = (gender: Gender) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-50";
      case "FEMALE":
        return "bg-pink-50";
      case "OTHER":
        return "bg-purple-50";
      default:
        return "";
    }
  };

  const handleAction = (gender: Gender, wardNumber: number, id: string) => {
    if (!id) return;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>कार्यहरू</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onEdit(id)}>
            <Edit2 className="mr-2 h-4 w-4" />
            सम्पादन गर्नुहोस्
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteId(id)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            मेट्नुहोस्
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const wardNumbers = Object.keys(processedData.byWard)
    .map(Number)
    .sort((a, b) => a - b);

  // Summary cards at the top
  const summaryCards = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-blue-50 border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            पुरुष घरमूली
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">
            {totals.MALE.toLocaleString()}
          </div>
          <p className="text-sm text-blue-600">
            {percentages.MALE}% कुल घरधुरीको
          </p>
        </CardContent>
      </Card>

      <Card className="bg-pink-50 border-pink-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-pink-700">
            महिला घरमूली
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-800">
            {totals.FEMALE.toLocaleString()}
          </div>
          <p className="text-sm text-pink-600">
            {percentages.FEMALE}% कुल घरधुरीको
          </p>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            कुल घरधुरी
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">
            {totals.total.toLocaleString()}
          </div>
          <p className="text-sm text-green-600">सबै घरधुरीहरूको कुल</p>
        </CardContent>
      </Card>
    </div>
  );

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

      {summaryCards}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 font-medium">वडा नं.</TableHead>
              <TableHead className={`text-center ${getGenderBgColor("MALE")}`}>
                <div className="flex items-center justify-center">
                  <Badge className={getGenderBadgeColor("MALE")}>
                    {getGenderLabel("MALE")}
                  </Badge>
                </div>
              </TableHead>
              <TableHead
                className={`text-center ${getGenderBgColor("FEMALE")}`}
              >
                <div className="flex items-center justify-center">
                  <Badge className={getGenderBadgeColor("FEMALE")}>
                    {getGenderLabel("FEMALE")}
                  </Badge>
                </div>
              </TableHead>
              <TableHead className={`text-center ${getGenderBgColor("OTHER")}`}>
                <div className="flex items-center justify-center">
                  <Badge className={getGenderBadgeColor("OTHER")}>
                    {getGenderLabel("OTHER")}
                  </Badge>
                </div>
              </TableHead>
              <TableHead className="text-right font-medium">जम्मा</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wardNumbers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <XCircle className="w-8 h-8 mb-2 opacity-50" />
                    कुनै डाटा भेटिएन
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {wardNumbers.map((wardNumber) => {
                  const wardData = processedData.byWard[wardNumber];
                  const wardTotal =
                    (wardData.MALE.population || 0) +
                    (wardData.FEMALE.population || 0) +
                    (wardData.OTHER.population || 0);

                  return (
                    <TableRow key={wardNumber}>
                      <TableCell className="font-medium">
                        वडा {wardNumber}
                      </TableCell>
                      <TableCell
                        className={`text-center ${getGenderBgColor("MALE")}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {wardData.MALE.population.toLocaleString() || "-"}
                          </span>
                          {wardData.MALE.id && (
                            <div>
                              {handleAction(
                                "MALE",
                                wardNumber,
                                wardData.MALE.id,
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-center ${getGenderBgColor("FEMALE")}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {wardData.FEMALE.population.toLocaleString() || "-"}
                          </span>
                          {wardData.FEMALE.id && (
                            <div>
                              {handleAction(
                                "FEMALE",
                                wardNumber,
                                wardData.FEMALE.id,
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-center ${getGenderBgColor("OTHER")}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>
                            {wardData.OTHER.population.toLocaleString() || "-"}
                          </span>
                          {wardData.OTHER.id && (
                            <div>
                              {handleAction(
                                "OTHER",
                                wardNumber,
                                wardData.OTHER.id,
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {wardTotal.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Add totals row */}
                <TableRow className="bg-gray-100 font-bold">
                  <TableCell className="text-right">जम्मा</TableCell>
                  <TableCell
                    className={`text-center ${getGenderBgColor("MALE")}`}
                  >
                    {totals.MALE.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getGenderBgColor("FEMALE")}`}
                  >
                    {totals.FEMALE.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className={`text-center ${getGenderBgColor("OTHER")}`}
                  >
                    {totals.OTHER.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {totals.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              </>
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
              घरमूली लिङ्ग डाटा मेट्ने?
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
