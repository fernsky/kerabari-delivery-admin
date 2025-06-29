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
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart,
  BarChart,
  Bar,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureTrendChartProps {
  temperatureData: Array<{
    date: string;
    temperature: number;
    temperatureCelsius: number;
    year: number;
    month: number;
    season: string;
    anomaly?: number;
    trend?: number;
  }>;
  averageTemperature: number;
  trendSlope: number;
  temperatureRange: {
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  };
  seasonalData: Array<{
    season: string;
    avgTemp: number;
    minTemp: number;
    maxTemp: number;
  }>;
}

export default function TemperatureTrendChart({
  temperatureData,
  averageTemperature,
  trendSlope,
  temperatureRange,
  seasonalData,
}: TemperatureTrendChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.date}</p>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span>तापक्रम:</span>
              <span className="font-medium">
                {localizeNumber(data.temperatureCelsius.toFixed(1), "ne")}°C
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>मौसम:</span>
              <span className="font-medium">{data.season}</span>
            </div>
            {data.anomaly && (
              <div className="flex justify-between gap-4">
                <span>विचलन:</span>
                <span className={`font-medium ${data.anomaly > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                  {data.anomaly > 0 ? '+' : ''}{localizeNumber(data.anomaly.toFixed(1), "ne")}°C
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate trend line data
  const trendData = temperatureData.map((item, index) => ({
    ...item,
    trend: averageTemperature + (trendSlope * index),
  }));

  // Create seasonal trend data
  const seasonalTrendData = seasonalData.map((season) => ({
    name: season.season,
    avgTemp: season.avgTemp,
    minTemp: season.minTemp,
    maxTemp: season.maxTemp,
  }));

  return (
    <div className="space-y-6">
      {/* Main Temperature Trend Chart */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">तापक्रम प्रवृत्ति विश्लेषण</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData}>
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
                height={80}
              />
              <YAxis
                tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={CustomTooltip} />
              <Legend />
              
              {/* Temperature Area */}
              <Area
                type="monotone"
                dataKey="temperatureCelsius"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                name="तापक्रम (°C)"
              />
              
              {/* Trend Line */}
              <Line
                type="monotone"
                dataKey="trend"
                stroke="#ff7300"
                strokeWidth={2}
                dot={false}
                name="प्रवृत्ति रेखा"
              />
              
              {/* Reference Lines */}
              <ReferenceLine
                y={averageTemperature}
                stroke="#666"
                strokeDasharray="3 3"
                label={`औसत: ${localizeNumber(averageTemperature.toFixed(1), "ne")}°C`}
              />
              <ReferenceLine
                y={temperatureRange.max}
                stroke="#ff4444"
                strokeDasharray="3 3"
                label={`अधिकतम: ${localizeNumber(temperatureRange.max.toFixed(1), "ne")}°C`}
              />
              <ReferenceLine
                y={temperatureRange.min}
                stroke="#4444ff"
                strokeDasharray="3 3"
                label={`न्यूनतम: ${localizeNumber(temperatureRange.min.toFixed(1), "ne")}°C`}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal Temperature Analysis */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">मौसमगत तापक्रम विश्लेषण</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalTrendData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")} />
              <Tooltip
                formatter={(value: number) => [localizeNumber(value.toFixed(1), "ne") + "°C", ""]}
              />
              <Legend />
              <Bar dataKey="avgTemp" fill="#8884d8" name="औसत तापक्रम" />
              <Bar dataKey="maxTemp" fill="#ff4444" name="अधिकतम तापक्रम" />
              <Bar dataKey="minTemp" fill="#4444ff" name="न्यूनतम तापक्रम" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temperature Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">औसत तापक्रम</h4>
          <p className="text-2xl font-bold">
            {localizeNumber(averageTemperature.toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">तापक्रम परिवर्तन</h4>
          <p className={`text-2xl font-bold ${trendSlope > 0 ? 'text-red-500' : 'text-blue-500'}`}>
            {trendSlope > 0 ? '+' : ''}{localizeNumber(trendSlope.toFixed(3), "ne")}°C/महिना
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">तापक्रम विस्तार</h4>
          <p className="text-2xl font-bold">
            {localizeNumber((temperatureRange.max - temperatureRange.min).toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">मानक विचलन</h4>
          <p className="text-2xl font-bold">
            {localizeNumber(temperatureRange.stdDev.toFixed(1), "ne")}°C
          </p>
        </div>
      </div>
    </div>
  );
} 