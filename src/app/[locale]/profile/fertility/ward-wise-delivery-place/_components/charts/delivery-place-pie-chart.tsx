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

interface DeliveryPlacePieChartProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function DeliveryPlacePieChart({
  pieChartData,
  DELIVERY_PLACE_CATEGORIES,
}: DeliveryPlacePieChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-2">{name}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">संख्या:</span>
              <span className="text-sm font-medium">
                {localizeNumber(value.toLocaleString(), "ne")}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">प्रतिशत:</span>
              <span className="text-sm font-medium">
                {localizeNumber(percentage, "ne")}%
              </span>
            </div>
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
          isAnimationActive={true}
          animationDuration={800}
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend formatter={(value) => value} />
      </PieChart>
    </ResponsiveContainer>
  );
}
