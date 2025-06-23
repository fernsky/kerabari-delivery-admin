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

interface DisabilityCausePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    disabilityCause?: string; // Optional, might be present for direct disabilityCause reference
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_COLORS: Record<string, string>;
}

export default function DisabilityCausePieChart({
  pieChartData,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_COLORS,
}: DisabilityCausePieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
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

  // Helper function to get consistent color for a disability cause
  const getDisabilityCauseColor = (disabilityCauseName: string): string => {
    // First try to find by looking up in reverse disabilityCause
    const disabilityCauseKey = Object.keys(DISABILITY_CAUSE_NAMES).find(
      (key) => DISABILITY_CAUSE_NAMES[key] === disabilityCauseName,
    );

    if (disabilityCauseKey && DISABILITY_CAUSE_COLORS[disabilityCauseKey]) {
      return DISABILITY_CAUSE_COLORS[disabilityCauseKey];
    }

    // If the entry already has a disabilityCause, use it directly
    const entry = pieChartData.find(
      (item) => item.name === disabilityCauseName,
    );
    if (
      entry?.disabilityCause &&
      DISABILITY_CAUSE_COLORS[entry.disabilityCause]
    ) {
      return DISABILITY_CAUSE_COLORS[entry.disabilityCause];
    }

    // Fallback to OTHER or random color
    return DISABILITY_CAUSE_COLORS.OTHER || "#64748B";
  };

  // Enhance pieChartData with colors
  const enhancedPieData = pieChartData.map((item) => ({
    ...item,
    color: getDisabilityCauseColor(item.name),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={enhancedPieData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {enhancedPieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => value}
          payload={enhancedPieData.map((item) => ({
            value: item.name,
            type: "circle",
            color: item.color,
          }))}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
