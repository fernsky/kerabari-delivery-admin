"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { api } from "@/trpc/react";
import { processWardWiseHouseBaseData, getWardWiseHouseBaseAnalysis } from "@/lib/utils/ward-wise-house-base";
import { formatNepaliNumber } from "@/lib/utils/nepali-number";
import { useTranslations } from "next-intl";

interface WardWiseHouseBaseProps {
  municipalityId: string;
}

export default function WardWiseHouseBase({ municipalityId }: WardWiseHouseBaseProps) {
  const t = useTranslations("dashboard.economics");
  
  const { data: rawData, isLoading, error } = api.economics.getWardWiseHouseBase.useQuery({
    municipalityId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("wardWiseHouseBase.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("wardWiseHouseBase.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-destructive">Error loading data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!rawData || rawData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("wardWiseHouseBase.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const processedData = processWardWiseHouseBaseData(rawData);
  const analysis = getWardWiseHouseBaseAnalysis(processedData);

  const chartData = processedData.map(ward => ({
    ward: `Ward ${ward.wardNumber}`,
    pucca: ward.pucca,
    semiPucca: ward.semiPucca,
    kachcha: ward.kachcha,
    total: ward.total,
  }));

  const colors = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("wardWiseHouseBase.title")}
          <Badge variant="secondary">{processedData.length} Wards</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Analysis Text */}
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {analysis}
          </p>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ward" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [formatNepaliNumber(value), "Households"]}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="pucca" stackId="a" fill={colors[0]} name="Pucca" />
              <Bar dataKey="semiPucca" stackId="a" fill={colors[1]} name="Semi-Pucca" />
              <Bar dataKey="kachcha" stackId="a" fill={colors[2]} name="Kachcha" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[0] }}></div>
            <span className="text-sm">Pucca</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[1] }}></div>
            <span className="text-sm">Semi-Pucca</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[2] }}></div>
            <span className="text-sm">Kachcha</span>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Pucca</TableHead>
                <TableHead className="text-right">Semi-Pucca</TableHead>
                <TableHead className="text-right">Kachcha</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Pucca %</TableHead>
                <TableHead className="text-right">Semi-Pucca %</TableHead>
                <TableHead className="text-right">Kachcha %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((ward) => (
                <TableRow key={ward.wardNumber}>
                  <TableCell className="font-medium">Ward {ward.wardNumber}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.pucca)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.semiPucca)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.kachcha)}</TableCell>
                  <TableCell className="text-right font-medium">{formatNepaliNumber(ward.total)}</TableCell>
                  <TableCell className="text-right">{ward.puccaPercentage.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{ward.semiPuccaPercentage.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{ward.kachchaPercentage.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.pucca, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Pucca</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.semiPucca, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Semi-Pucca</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.kachcha, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Kachcha</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.total, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Households</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 