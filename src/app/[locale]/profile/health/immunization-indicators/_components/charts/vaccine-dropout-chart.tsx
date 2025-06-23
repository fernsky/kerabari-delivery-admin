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

interface VaccineDropoutChartProps {
  dropoutData: any[];
  indicatorLabels: Record<string, string>;
}

export default function VaccineDropoutChart({
  dropoutData,
  indicatorLabels,
}: VaccineDropoutChartProps) {
  // Prepare data for chart
  const chartData = dropoutData
    .filter(item => item.value !== null && item.value !== undefined)
    .map(item => {
      // Format label for better display
      let shortLabel = item.indicator
        .replace(/_DROPOUT/g, "")
        .replace(/_/g, " ");
        
      return {
        name: shortLabel,
        value: item.value,
        fullName: indicatorLabels[item.indicator] || item.indicator,
        fill: getBarColor(item.value),
      };
    });

  // Get color based on dropout value
  function getBarColor(value: number): string {
    if (value <= 5) return "#4CAF50"; // Green - excellent
    if (value <= 10) return "#FFC107"; // Amber - acceptable
    return "#F44336"; // Red - high dropout
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const severity = 
        data.value <= 5 ? "उत्कृष्ट (Excellent)" :
        data.value <= 10 ? "स्वीकार्य (Acceptable)" : 
        "उच्च (High)";
      
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <div className="flex justify-between gap-4">
            <span>ड्रपआउट दर:</span>
            <span className="font-medium">
              {localizeNumber(data.value.toFixed(1), "ne")}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>वर्गीकरण:</span>
            <span className={`font-medium ${
              data.value <= 5 ? "text-green-600" :
              data.value <= 10 ? "text-amber-600" : 
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
        <Legend formatter={(value) => "ड्रपआउट दर (%)"} />
        <ReferenceLine y={5} stroke="#4CAF50" strokeDasharray="3 3" />
        <ReferenceLine y={10} stroke="#FF9800" strokeDasharray="3 3" />
        <Bar 
          dataKey="value" 
          name="ड्रपआउट दर" 
          isAnimationActive={true} 
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
