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

interface AnimalProductPieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    measurementUnit?: string;
  }>;
  ANIMAL_PRODUCT_TYPES: Record<string, string>;
  ANIMAL_PRODUCT_COLORS: Record<string, string>;
  dataType: string;
  unit: string;
  isRevenue?: boolean;
}

export default function AnimalProductPieChart({
  pieChartData,
  ANIMAL_PRODUCT_TYPES,
  ANIMAL_PRODUCT_COLORS,
  dataType,
  unit,
  isRevenue = false,
}: AnimalProductPieChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;
      const measurementUnit = originalPayload.measurementUnit;

      // Format the unit display based on measurement unit
      let displayUnit = unit;
      if (!isRevenue && measurementUnit) {
        switch (measurementUnit) {
          case "COUNT":
            displayUnit = "संख्या";
            break;
          case "LITER":
            displayUnit = "लिटर";
            break;
          case "KG":
            displayUnit = "किलोग्राम";
            break;
          default:
            displayUnit = "मे.ट.";
        }
      }

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">
              {dataType} {displayUnit && `(${displayUnit})`}:
            </span>
            <span className="font-medium">
              {isRevenue
                ? `रु. ${localizeNumber(value.toLocaleString(), "ne")}`
                : localizeNumber(value.toFixed(2), "ne")}
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
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => {
            // Find the original animal product type key for color mapping
            const productKey =
              Object.entries(ANIMAL_PRODUCT_TYPES).find(
                ([key, value]) => value === entry.name,
              )?.[0] || "";

            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  ANIMAL_PRODUCT_COLORS[
                    productKey as keyof typeof ANIMAL_PRODUCT_COLORS
                  ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
                }
              />
            );
          })}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            // Truncate long names in the legend for better display
            const maxLength = 25;
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
