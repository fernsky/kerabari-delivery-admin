"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/trpc/react";
import { 
  processRemittanceExpenseData, 
  getRemittanceExpenseAnalysis, 
  getTopExpenseCategories,
  EXPENSE_TYPE_LABELS,
  EXPENSE_TYPE_COLORS
} from "@/lib/utils/remittance-expenses";
import { formatNepaliNumber } from "@/lib/utils/nepali-number";
import { useTranslations } from "next-intl";

interface RemittanceExpensesProps {
  municipalityId: string;
}

export default function RemittanceExpenses({ municipalityId }: RemittanceExpensesProps) {
  const t = useTranslations("dashboard.economics");
  
  const { data: rawData, isLoading, error } = api.economics.getRemittanceExpenses.useQuery({
    municipalityId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("remittanceExpenses.title")}</CardTitle>
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
          <CardTitle>{t("remittanceExpenses.title")}</CardTitle>
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
          <CardTitle>{t("remittanceExpenses.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">No data available</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const processedData = processRemittanceExpenseData(rawData);
  const analysis = getRemittanceExpenseAnalysis(processedData);
  const topCategories = getTopExpenseCategories(processedData);

  const chartData = processedData.map(ward => ({
    ward: `Ward ${ward.wardNumber}`,
    food: ward.food,
    education: ward.education,
    health: ward.health,
    clothing: ward.clothing,
    housing: ward.housing,
    entertainment: ward.entertainment,
    other: ward.other,
    total: ward.total,
  }));

  const pieData = topCategories.map(category => ({
    name: EXPENSE_TYPE_LABELS[category.category] || category.category,
    value: category.total,
    percentage: category.percentage,
  }));

  const colors = Object.values(EXPENSE_TYPE_COLORS);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t("remittanceExpenses.title")}
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
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
                <Bar dataKey="food" stackId="a" fill={EXPENSE_TYPE_COLORS.food} name="Food" />
                <Bar dataKey="education" stackId="a" fill={EXPENSE_TYPE_COLORS.education} name="Education" />
                <Bar dataKey="health" stackId="a" fill={EXPENSE_TYPE_COLORS.health} name="Health" />
                <Bar dataKey="clothing" stackId="a" fill={EXPENSE_TYPE_COLORS.clothing} name="Clothing" />
                <Bar dataKey="housing" stackId="a" fill={EXPENSE_TYPE_COLORS.housing} name="Housing" />
                <Bar dataKey="entertainment" stackId="a" fill={EXPENSE_TYPE_COLORS.entertainment} name="Entertainment" />
                <Bar dataKey="other" stackId="a" fill={EXPENSE_TYPE_COLORS.other} name="Other" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatNepaliNumber(value), "Households"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center">
          {Object.entries(EXPENSE_TYPE_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: EXPENSE_TYPE_COLORS[key] }}></div>
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ward</TableHead>
                <TableHead className="text-right">Food</TableHead>
                <TableHead className="text-right">Education</TableHead>
                <TableHead className="text-right">Health</TableHead>
                <TableHead className="text-right">Clothing</TableHead>
                <TableHead className="text-right">Housing</TableHead>
                <TableHead className="text-right">Entertainment</TableHead>
                <TableHead className="text-right">Other</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedData.map((ward) => (
                <TableRow key={ward.wardNumber}>
                  <TableCell className="font-medium">Ward {ward.wardNumber}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.food)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.education)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.health)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.clothing)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.housing)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.entertainment)}</TableCell>
                  <TableCell className="text-right">{formatNepaliNumber(ward.other)}</TableCell>
                  <TableCell className="text-right font-medium">{formatNepaliNumber(ward.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.food, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Food Expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.education, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Education Expenses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatNepaliNumber(processedData.reduce((sum, ward) => sum + ward.health, 0))}</div>
              <p className="text-xs text-muted-foreground">Total Health Expenses</p>
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