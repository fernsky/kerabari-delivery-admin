"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface LandOwnershipStatusPieChartProps {
  landOwnershipStatusData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  LAND_COLORS: Record<string, string>;
}

export default function LandOwnershipStatusPieChart({
  landOwnershipStatusData,
  LAND_COLORS,
}: LandOwnershipStatusPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={landOwnershipStatusData}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          <Cell key="cell-0" fill={LAND_COLORS.primary} />
          <Cell key="cell-1" fill={LAND_COLORS.secondary} />
        </Pie>
        <Tooltip
          formatter={(value) => Math.round(Number(value)).toLocaleString()}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
