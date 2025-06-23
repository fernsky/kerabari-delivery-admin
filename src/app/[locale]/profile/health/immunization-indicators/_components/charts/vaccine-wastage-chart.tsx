"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface VaccineWastageChartProps {
  wastageData: any[];
  indicatorLabels: Record<string, string>;
}

export default function VaccineWastageChart({
  wastageData,
  indicatorLabels,
}: VaccineWastageChartProps) {
  // Prepare data for chart
  const chartData = wastageData
    .filter(item => item.value !== null && item.value !== undefined)
    .map(item => {
      // Format label for better display
      let vaccineName = item.indicator
        .replace('VACCINE_WASTAGE_', '')
        .replace(/_/g, ' ');
        
      return {
        name: vaccineName,
        value: item.value,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        fill: getBarColor(item.value),
      };
    })
    .sort((a, b) => b.value - a.value); // Sort by wastage rate descending

  // Get color based on wastage value
  function getBarColor(value: number): string {
    if (value <= 10) return "#4CAF50"; // Green - excellent
    if (value <= 20) return "#FFC107"; // Amber - acceptable
    return "#F44336"; // Red - high wastage
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const severity = 
        data.value <= 10 ? "कम (Low)" :
        data.value <= 20 ? "मध्यम (Medium)" : 
        "उच्च (High)";
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-2">{data.fullName}</p>
          <div className="flex justify-between gap-4">
            <span>खेर जाने दर:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>वर्गीकरण:</span>
            <span className={`font-medium ${
              data.value <= 10 ? "text-green-600" :
              data.value <= 20 ? "text-amber-600" : 
              "text-red-600"
            }`}>
              {severity}
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => "खेर जाने दर (%)"} />
        <ReferenceLine y={10} stroke="#4CAF50" strokeDasharray="3 3" />
        <ReferenceLine y={20} stroke="#FF9800" strokeDasharray="3 3" />
        <Bar 
          dataKey="value" 
          name="खेर जाने दर" 
          isAnimationActive={true} 
          animationDuration={800}
          fill="#8884d8"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
