"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface IncomeSourcesPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  INCOME_SOURCE_NAMES: Record<string, string>;
  INCOME_SOURCE_COLORS: Record<string, string>;
}

export default function IncomeSourcesPieChart({
  pieChartData,
  INCOME_SOURCE_NAMES,
  INCOME_SOURCE_COLORS,
}: IncomeSourcesPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original income source key for color mapping
            const incomeSourceKey =
              Object.keys(INCOME_SOURCE_NAMES).find(
                (key) => INCOME_SOURCE_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  INCOME_SOURCE_COLORS[
                    incomeSourceKey as keyof typeof INCOME_SOURCE_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
