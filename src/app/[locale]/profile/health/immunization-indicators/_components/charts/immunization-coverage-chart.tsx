"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface ImmunizationCoverageChartProps {
  coverageData: any[];
  indicatorLabels: Record<string, string>;
}

export default function ImmunizationCoverageChart({
  coverageData,
  indicatorLabels,
}: ImmunizationCoverageChartProps) {
  // Prepare data for chart
  const chartData = coverageData
    .filter(item => item.value !== null && item.value !== undefined)
    .map(item => {
      const shortLabel = indicatorLabels[item.indicator]
        ? indicatorLabels[item.indicator].split(" ")[0] // Get first word only
        : item.indicator.replace(/_/g, " ").split(" ")[0];
        
      return {
        name: shortLabel,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        value: item.value,
        indicator: item.indicator,
        fill: getBarColor(item.value),
      };
    });

  // Get color based on coverage value
  function getBarColor(value: number): string {
    if (value >= 90) return "#4CAF50"; // Green
    if (value >= 80) return "#2196F3"; // Blue
    if (value >= 70) return "#FFC107"; // Amber
    return "#F44336"; // Red
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-2">{data.fullName}</p>
          <div className="flex justify-between gap-4">
            <span>कभरेज:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}%
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
        margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          domain={[0, 100]} 
          tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={50} 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => "कभरेज (%)"} />
        <Bar dataKey="value" name="कभरेज" isAnimationActive={true} animationDuration={800}>
          {chartData.map((entry, index) => (
            <LabelList
              key={index}
              dataKey="value"
              position="right"
              formatter={(value: number) => `${localizeNumber(value.toFixed(1), "ne")}%`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
