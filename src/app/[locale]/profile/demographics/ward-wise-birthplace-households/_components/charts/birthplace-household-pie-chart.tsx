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

interface BirthplaceHouseholdPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  BIRTH_PLACE_NAMES: Record<string, string>;
  BIRTH_PLACE_COLORS: Record<string, string>;
}

export default function BirthplaceHouseholdPieChart({
  pieChartData,
  BIRTH_PLACE_NAMES,
  BIRTH_PLACE_COLORS,
}: BirthplaceHouseholdPieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">घरपरिवार:</span>
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
            // Find the original birthplace key for color mapping
            const birthPlaceKey =
              Object.keys(BIRTH_PLACE_NAMES).find(
                (key) => BIRTH_PLACE_NAMES[key] === entry.name,
              ) || "SAME_MUNICIPALITY";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  BIRTH_PLACE_COLORS[
                    birthPlaceKey as keyof typeof BIRTH_PLACE_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend formatter={(value) => value} />
      </PieChart>
    </ResponsiveContainer>
  );
}
