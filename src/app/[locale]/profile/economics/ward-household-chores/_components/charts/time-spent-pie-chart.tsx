"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface TimeSpentPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  TIME_SPENT_NAMES: Record<string, string>;
  TIME_SPENT_COLORS: Record<string, string>;
}

export default function TimeSpentPieChart({
  pieChartData,
  TIME_SPENT_NAMES,
  TIME_SPENT_COLORS,
}: TimeSpentPieChartProps) {
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
            // Find the original time spent key for color mapping
            const timeSpentKey =
              Object.keys(TIME_SPENT_NAMES).find(
                (key) => TIME_SPENT_NAMES[key] === entry.name,
              ) || "OTHER";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  TIME_SPENT_COLORS[
                    timeSpentKey as keyof typeof TIME_SPENT_COLORS
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
