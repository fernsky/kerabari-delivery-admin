"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureTrendChartProps {
  temperatureData: Array<{
    date: string;
    temperatureCelsius: number;
    year: number;
    month: number;
  }>;
  averageTemperature: number;
  trendSlope: number;
}

export default function TemperatureTrendChart({
  temperatureData,
  averageTemperature,
  trendSlope,
}: TemperatureTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm">
            तापक्रम: {localizeNumber(data.temperatureCelsius.toFixed(1), "ne")}°C
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">तापक्रम प्रवृत्ति</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={CustomTooltip} />
            
            <Area
              type="monotone"
              dataKey="temperatureCelsius"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
            />
            
            <ReferenceLine
              y={averageTemperature}
              stroke="#666"
              strokeDasharray="3 3"
              label={`औसत: ${localizeNumber(averageTemperature.toFixed(1), "ne")}°C`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        वार्षिक वृद्धि: {localizeNumber((trendSlope * 12).toFixed(2), "ne")}°C/वर्ष
      </div>
    </div>
  );
} 