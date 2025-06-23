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
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AntenatalCareChartProps {
  antenatalData: any[];
  indicatorLabels: Record<string, string>;
}

export default function AntenatalCareChart({
  antenatalData,
  indicatorLabels,
}: AntenatalCareChartProps) {
  // Prepare data for chart
  const chartData = antenatalData
    .filter(item => item.value !== null && item.value !== undefined)
    .map(item => {
      // Get a simplified display name
      const shortLabel = indicatorLabels[item.indicator]
        ? indicatorLabels[item.indicator].split(" ").slice(0, 3).join(" ")
        : item.indicator.replace(/_/g, " ").split(" ").slice(0, 3).join(" ");
      
      return {
        name: shortLabel,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        value: parseFloat(item.value) || 0,
        indicator: item.indicator,
        fill: getBarColor(parseFloat(item.value) || 0),
      };
    });

  // Get color based on value
  function getBarColor(value: number): string {
    if (value >= 90) return "#ec4899"; // Pink
    if (value >= 80) return "#a855f7"; // Purple
    if (value >= 70) return "#f97316"; // Orange
    return "#ef4444"; // Red
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
        margin={{ top: 20, right: 60, left: 50, bottom: 10 }}
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
          width={120} 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="value" 
          name="गर्भवती स्वास्थ्य सेवा"
          isAnimationActive={true} 
          animationDuration={800}
        >
          <LabelList
            dataKey="value"
            position="right"
            formatter={(value: number) => `${localizeNumber(value.toFixed(1), "ne")}%`}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
