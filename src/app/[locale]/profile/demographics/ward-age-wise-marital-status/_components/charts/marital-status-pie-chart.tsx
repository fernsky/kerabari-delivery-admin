"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface MaritalStatusPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  MARITAL_STATUS_NAMES: Record<string, string>;
  MARITAL_STATUS_COLORS: Record<string, string>;
}

export default function MaritalStatusPieChart({
  pieChartData,
  MARITAL_STATUS_NAMES,
  MARITAL_STATUS_COLORS,
}: MaritalStatusPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original status key for color mapping
            const statusKey =
              Object.keys(MARITAL_STATUS_NAMES).find(
                (key) => MARITAL_STATUS_NAMES[key] === entry.name,
              ) || "NOT_STATED";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  MARITAL_STATUS_COLORS[
                    statusKey as keyof typeof MARITAL_STATUS_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip formatter={(value) => localizeNumber(Number(value).toLocaleString(), "ne")} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
