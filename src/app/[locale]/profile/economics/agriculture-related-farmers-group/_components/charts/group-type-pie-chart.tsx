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

interface GroupTypePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    icon: string;
  }>;
}

export default function GroupTypePieChart({
  pieChartData,
}: GroupTypePieChartProps) {
  // Define colors for different group types
  const COLORS = [
    "#3498db", // Blue
    "#2ecc71", // Green
    "#9b59b6", // Purple
    "#e74c3c", // Red
    "#f1c40f", // Yellow
    "#d35400", // Orange
    "#16a085", // Teal
    "#8e44ad", // Deep purple
  ];

  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      const icon = originalPayload.icon;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium flex items-center gap-2">
            <span>{icon}</span>
            <span>{name}</span>
          </p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">समूह संख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend with icons
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col items-start mt-4 text-xs gap-1">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-item-${index}`} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.payload.icon} {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
