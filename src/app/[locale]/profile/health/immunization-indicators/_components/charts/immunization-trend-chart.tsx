"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface ImmunizationTrendChartProps {
  trendData: Array<{
    indicator: string;
    indicatorName: string;
    values: Array<{
      year: string;
      value: number;
      yearKey: string;
    }>;
  }>;
  indicatorLabels: Record<string, string>;
}

export default function ImmunizationTrendChart({
  trendData,
  indicatorLabels,
}: ImmunizationTrendChartProps) {
  // Prepare data for the chart
  const years = trendData[0]?.values.map(item => item.year) || [];
  
  // Format data for line chart
  const chartData = years.map((year, idx) => {
    const dataPoint: any = { name: year };
    
    trendData.forEach(indicator => {
      dataPoint[indicator.indicator] = indicator.values[idx]?.value || 0;
    });
    
    return dataPoint;
  });

  // Different colors for each indicator line
  const lineColors = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium mb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              const indicatorInfo = trendData.find(item => item.indicator === entry.dataKey);
              const indicatorName = indicatorInfo?.indicatorName || entry.dataKey;
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm">{indicatorName.split(" (")[0]}:</span>
                  <span className="text-sm font-medium">
                    {localizeNumber(entry.value.toFixed(1), "ne")}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis 
          tickFormatter={(value) => `${localizeNumber(value.toString(), "ne")}%`}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value) => {
            const indicatorInfo = trendData.find(item => item.indicator === value);
            return indicatorInfo?.indicatorName?.split(" (")[0] || value;
          }}
        />
        {trendData.map((indicator, index) => (
          <Line
            key={indicator.indicator}
            type="monotone"
            dataKey={indicator.indicator}
            name={indicator.indicatorName}
            stroke={lineColors[index % lineColors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
