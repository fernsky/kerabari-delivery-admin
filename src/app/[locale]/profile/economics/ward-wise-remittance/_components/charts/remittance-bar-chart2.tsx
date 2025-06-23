"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface RemittanceBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  remittanceAmountGroupOptions: Array<{
    value: string;
    label: string;
  }>;
  AMOUNT_RANGE_MAP: Record<
    string,
    { min: number; max: number | null; color: string; label: string }
  >;
}

export default function RemittanceBarChart({
  wardWiseData,
  remittanceAmountGroupOptions,
  AMOUNT_RANGE_MAP,
}: RemittanceBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}{" "}
                  जना
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate common remittance groups across all wards for consistent stacking order
  const commonGroups = remittanceAmountGroupOptions.map(
    (option) => option.label,
  );

  // Calculate total for each remittance group for sorting
  const groupTotals = commonGroups.reduce(
    (acc, group) => {
      acc[group] = wardWiseData.reduce((sum, ward) => {
        return sum + (ward[group] || 0);
      }, 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort groups by their order in the AMOUNT_RANGE_MAP
  const sortedGroups = commonGroups.sort(
    (a, b) => groupTotals[b] - groupTotals[a],
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {sortedGroups.map((group, index) => {
          // Generate a random color or use a predefined color palette
          const colors = [
            "#8884d8",
            "#82ca9d",
            "#ffc658",
            "#ff7300",
            "#0088fe",
            "#00C49F",
            "#FFBB28",
            "#FF8042",
            "#a4de6c",
            "#d0ed57",
          ];
          // Use modulo to cycle through colors if there are more groups than colors
          const color = colors[index % colors.length];

          return (
            <Bar
              key={index}
              dataKey={group}
              name={group}
              stackId="a"
              fill={color}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
