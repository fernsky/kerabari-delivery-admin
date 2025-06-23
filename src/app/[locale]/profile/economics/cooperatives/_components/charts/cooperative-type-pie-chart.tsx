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

interface CooperativeTypePieChartProps {
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  COOPERATIVE_TYPES: Record<string, string>;
  COOPERATIVE_COLORS: Record<string, string>;
}

export default function CooperativeTypePieChart({
  pieChartData,
  COOPERATIVE_TYPES,
  COOPERATIVE_COLORS,
}: CooperativeTypePieChartProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value, payload: originalPayload } = payload[0];
      const percentage = originalPayload.percentage;

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span>संख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>प्रतिशत:</span>
            <span className="font-medium">
              {localizeNumber(percentage, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index,
    name,
    value
  }: any) => {
    // Only show labels for segments with enough space (larger than 8%)
    if (percent < 0.08) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${localizeNumber(value, "ne")}`}
      </text>
    );
  };

  // Get colors for each pie segment
  const getCooperativeColor = (index: number) => {
    // Map cooperative types to colors from the props
    const type = Object.keys(COOPERATIVE_TYPES)[index % Object.keys(COOPERATIVE_TYPES).length];
    return COOPERATIVE_COLORS[type] || "#95a5a6"; // Default to gray if no color defined
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieChartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={140}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={getCooperativeColor(index)} 
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => value} 
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
