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

interface IrrigatedUnitDistributionChartProps {
  wardData: Array<{
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  }>;
}

export default function IrrigatedUnitDistributionChart({
  wardData,
}: IrrigatedUnitDistributionChartProps) {
  // Process data to calculate irrigated percentage for each ward
  const chartData = wardData
    .map((ward) => {
      const irrigatedPercentage = 
        ward.totalArea > 0 
          ? (ward.irrigatedArea / ward.totalArea) * 100 
          : 0;
          
      return {
        name: `वडा ${ward.wardNumber}`,
        percentage: irrigatedPercentage,
        irrigatedArea: ward.irrigatedArea,
        totalArea: ward.totalArea,
      };
    })
    .sort((a, b) => b.percentage - a.percentage); // Sort by percentage from highest to lowest

  // Get color based on percentage
  const getColor = (percentage: number) => {
    if (percentage >= 80) return "#2ecc71"; // Green for high
    if (percentage >= 60) return "#27ae60"; // Darker green for good
    if (percentage >= 40) return "#f39c12"; // Orange for medium
    if (percentage >= 20) return "#e67e22"; // Dark orange for low
    return "#e74c3c"; // Red for very low
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-sm">सिंचित प्रतिशत:</span>
              <span className="font-medium">
                {localizeNumber(data.percentage.toFixed(2), "ne")}%
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">सिंचित क्षेत्रफल:</span>
              <span className="font-medium">
                {localizeNumber(data.irrigatedArea.toFixed(2), "ne")} हेक्टर
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-sm">कुल क्षेत्रफल:</span>
              <span className="font-medium">
                {localizeNumber(data.totalArea.toFixed(2), "ne")} हेक्टर
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
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
        <XAxis 
          type="number" 
          tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`}
          domain={[0, 100]}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={60} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={CustomTooltip} />
        <Bar 
          dataKey="percentage" 
          name="सिंचित प्रतिशत" 
          radius={[0, 4, 4, 0]}
          barSize={20}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
