"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FacilityCategoryComparisonChartProps {
  categoryComparisonData: Array<{
    name: string;
    nameEn: string;
    percentage: number;
    color: string;
  }>;
}

export default function FacilityCategoryComparisonChart({
  categoryComparisonData,
}: FacilityCategoryComparisonChartProps) {
  // Sort data by percentage for better visualization
  const sortedData = [...categoryComparisonData].sort((a, b) => b.percentage - a.percentage);

  // Custom tooltip with Nepali localization
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, percentage, color } = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <p className="font-medium">{name}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span>औसत पहुँच:</span>
            <span className="font-medium">
              {localizeNumber(percentage.toFixed(2), "ne")}%
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
        layout="vertical"
        data={sortedData}
        margin={{ top: 20, right: 30, bottom: 20, left: 120 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          scale="band"
          width={110}
          tickFormatter={(value) => value}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="percentage" barSize={30} radius={[0, 4, 4, 0]}>
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
