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

interface VegetableFruitDiseasePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  VEGETABLE_FRUIT_TYPES: Record<string, string>;
  VEGETABLE_FRUIT_COLORS: Record<string, string>;
  dataType: string;
}

export default function VegetableFruitDiseasePieChart({
  pieChartData,
  VEGETABLE_FRUIT_TYPES,
  VEGETABLE_FRUIT_COLORS,
  dataType,
}: VegetableFruitDiseasePieChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">{dataType} संख्या:</span>
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

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the vegetable/fruit type key for color mapping
            const cropKey =
              Object.entries(VEGETABLE_FRUIT_TYPES).find(
                ([key, value]) => value === entry.name,
              )?.[0] || "";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  VEGETABLE_FRUIT_COLORS[cropKey as keyof typeof VEGETABLE_FRUIT_COLORS] ||
                  `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            const maxLength = 15;
            return value.length > maxLength
              ? value.substring(0, maxLength) + "..."
              : value;
          }}
          wrapperStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
