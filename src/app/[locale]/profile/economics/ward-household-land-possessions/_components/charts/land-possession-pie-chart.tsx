"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LandPossessionPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  LAND_COLORS: Record<string, string>;
}

export default function LandPossessionPieChart({
  pieChartData,
  LAND_COLORS,
}: LandPossessionPieChartProps) {
  // Generate a color palette for each ward
  const getWardColor = (index: number) => {
    // Use different shades of the primary color for each ward
    const hueOffset = (index * 5) % 40; // Small hue variations
    return `hsl(${120 + hueOffset}, 50%, ${40 + (index % 5) * 10}%)`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(1)}%`
          }
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getWardColor(index)} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => Number(value).toLocaleString()} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
