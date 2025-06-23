"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PopularBusinessByWardChartProps {
  data: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
  BUSINESS_COLORS: Record<string, string>;
}

export default function PopularBusinessByWardChart({
  data,
  BUSINESS_COLORS,
}: PopularBusinessByWardChartProps) {
  // Transform data for the chart
  const chartData = data
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: `वडा ${localizeNumber(item.wardNumber.toString(), "ne")}`,
      value: item.count,
      typeName: item.mostCommonTypeName,
      type: item.mostCommonType,
      icon: item.icon,
    }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataItem = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex items-center gap-2 my-2">
            <span className="text-lg">{dataItem.icon}</span>
            <span className="font-medium">{dataItem.typeName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">संख्या:</span>
            <span className="font-medium">
              {localizeNumber(dataItem.value.toString(), "ne")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} opacity={0.2} />
        <XAxis
          type="number"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="value" name="प्रमुख व्यवसाय" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={BUSINESS_COLORS[entry.type] || "#95a5a6"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
