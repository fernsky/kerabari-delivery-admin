"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface IncomeSustenancePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  MONTHS_SUSTAINED_NAMES: Record<string, string>;
  MONTHS_SUSTAINED_COLORS: Record<string, string>;
}

export default function IncomeSustenancePieChart({
  pieChartData,
  MONTHS_SUSTAINED_NAMES,
  MONTHS_SUSTAINED_COLORS,
}: IncomeSustenancePieChartProps) {
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
            // Find the original months sustained key for color mapping
            const monthsKey =
              Object.keys(MONTHS_SUSTAINED_NAMES).find(
                (key) => MONTHS_SUSTAINED_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  MONTHS_SUSTAINED_COLORS[
                    monthsKey as keyof typeof MONTHS_SUSTAINED_COLORS
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
