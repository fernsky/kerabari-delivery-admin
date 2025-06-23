"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface AgeGroupPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  AGE_GROUP_NAMES: Record<string, string>;
  AGE_GROUP_COLORS: Record<string, string>;
}

export default function AgeGroupPieChart({
  pieChartData,
  AGE_GROUP_NAMES,
  AGE_GROUP_COLORS,
}: AgeGroupPieChartProps) {
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
            // Find the original age group key for color mapping
            const ageGroupKey =
              Object.keys(AGE_GROUP_NAMES).find(
                (key) => AGE_GROUP_NAMES[key] === entry.name,
              ) || "AGE_0_TO_14";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  AGE_GROUP_COLORS[
                    ageGroupKey as keyof typeof AGE_GROUP_COLORS
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
