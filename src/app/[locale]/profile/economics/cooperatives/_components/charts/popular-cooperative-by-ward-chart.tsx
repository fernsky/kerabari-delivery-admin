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
  LabelList,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface PopularCooperativeByWardChartProps {
  data: Array<{
    wardNumber: number;
    mostCommonType: string;
    mostCommonTypeName: string;
    count: number;
    icon: string;
  }>;
  COOPERATIVE_COLORS: Record<string, string>;
}

export default function PopularCooperativeByWardChart({
  data,
  COOPERATIVE_COLORS,
}: PopularCooperativeByWardChartProps) {
  // Transform data for the chart
  const chartData = data
    .sort((a, b) => a.wardNumber - b.wardNumber)
    .map((item) => ({
      name: `वडा ${localizeNumber(item.wardNumber.toString(), "ne")}`,
      value: item.count,
      type: item.mostCommonType,
      typeName: item.mostCommonTypeName,
      icon: item.icon,
      color: COOPERATIVE_COLORS[item.mostCommonType] || "#95a5a6",
    }));

  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { value, payload: originalPayload } = payload[0];
      const { typeName, icon } = originalPayload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span>प्रमुख सहकारी प्रकार:</span>
            <span className="font-medium">
              {icon} {typeName}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>संख्या:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const item = chartData[index];
    
    return (
      <g>
        <text
          x={x + width / 2}
          y={y - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs"
          fill="#555555"
        >
          {item.icon}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium"
          fill="#ffffff"
        >
          {localizeNumber(value.toString(), "ne")}
        </text>
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
        />
        <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar 
          dataKey="value" 
          radius={[4, 4, 0, 0]}
          barSize={40}
          animationDuration={1500}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
          <LabelList dataKey="value" content={renderCustomizedLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
