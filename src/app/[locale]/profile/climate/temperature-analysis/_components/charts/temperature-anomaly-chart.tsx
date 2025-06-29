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
  Line,
  LineChart,
  ComposedChart,
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureAnomalyChartProps {
  anomalyData: Array<{
    date: string;
    year: number;
    month: number;
    temperature: number;
    normalTemperature: number;
    anomaly: number;
    anomalyCategory: 'extreme_cold' | 'cold' | 'normal' | 'warm' | 'extreme_warm';
    cumulativeAnomaly: number;
  }>;
  anomalyStats: {
    totalAnomalies: number;
    warmAnomalies: number;
    coldAnomalies: number;
    extremeAnomalies: number;
    averageAnomaly: number;
    trendSlope: number;
  };
}

export default function TemperatureAnomalyChart({
  anomalyData,
  anomalyStats,
}: TemperatureAnomalyChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.date}</p>
          <div className="space-y-1 mt-2">
            <div className="flex justify-between gap-4">
              <span>वास्तविक तापक्रम:</span>
              <span className="font-medium">
                {localizeNumber(data.temperature.toFixed(1), "ne")}°C
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>सामान्य तापक्रम:</span>
              <span className="font-medium">
                {localizeNumber(data.normalTemperature.toFixed(1), "ne")}°C
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span>विचलन:</span>
              <span className={`font-medium ${data.anomaly > 0 ? 'text-red-500' : 'text-blue-500'}`}>
                {data.anomaly > 0 ? '+' : ''}{localizeNumber(data.anomaly.toFixed(1), "ne")}°C
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Define anomaly categories and colors
  const anomalyCategories = {
    extreme_cold: { name: "अत्यन्त चिसो", color: "#1e40af", threshold: -2 },
    cold: { name: "चिसो", color: "#3b82f6", threshold: -1 },
    normal: { name: "सामान्य", color: "#10b981", threshold: 0 },
    warm: { name: "तातो", color: "#f59e0b", threshold: 1 },
    extreme_warm: { name: "अत्यन्त तातो", color: "#dc2626", threshold: 2 },
  };

  // Get category color
  const getAnomalyColor = (anomaly: number) => {
    if (anomaly <= -2) return anomalyCategories.extreme_cold.color;
    if (anomaly <= -1) return anomalyCategories.cold.color;
    if (anomaly <= 1) return anomalyCategories.normal.color;
    if (anomaly <= 2) return anomalyCategories.warm.color;
    return anomalyCategories.extreme_warm.color;
  };

  // Calculate monthly anomaly averages
  const monthlyAnomalies = anomalyData.reduce((acc, item) => {
    const monthKey = `${item.year}-${String(item.month).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = {
        month: monthKey,
        year: item.year,
        monthName: item.month,
        anomalies: [],
        avgAnomaly: 0,
        count: 0,
      };
    }
    acc[monthKey].anomalies.push(item.anomaly);
    acc[monthKey].count++;
    return acc;
  }, {} as Record<string, any>);

  // Calculate average anomalies for each month
  Object.values(monthlyAnomalies).forEach((month: any) => {
    month.avgAnomaly = month.anomalies.reduce((sum: number, val: number) => sum + val, 0) / month.count;
  });

  const monthlyAnomalyData = Object.values(monthlyAnomalies)
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return (
    <div className="space-y-6">
      {/* Monthly Anomaly Chart */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">मासिक तापक्रम विचलन विश्लेषण</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyAnomalyData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${year}-${month}`;
                }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip content={CustomTooltip} />
              <Legend />
              
              {/* Anomaly Bars */}
              <Bar
                dataKey="avgAnomaly"
                fill="#8884d8"
                name="मासिक विचलन"
                radius={[2, 2, 0, 0]}
              >
                {monthlyAnomalyData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getAnomalyColor(entry.avgAnomaly)}
                  />
                ))}
              </Bar>
              
              {/* Reference Lines */}
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" label="सामान्य" />
              <ReferenceLine y={1} stroke="#f59e0b" strokeDasharray="3 3" label="तातो" />
              <ReferenceLine y={-1} stroke="#3b82f6" strokeDasharray="3 3" label="चिसो" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">कुल विचलनहरू</h4>
          <p className="text-2xl font-bold">
            {localizeNumber(anomalyStats.totalAnomalies.toString(), "ne")}
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">तातो विचलनहरू</h4>
          <p className="text-2xl font-bold text-red-600">
            {localizeNumber(anomalyStats.warmAnomalies.toString(), "ne")}
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">चिसो विचलनहरू</h4>
          <p className="text-2xl font-bold text-blue-600">
            {localizeNumber(anomalyStats.coldAnomalies.toString(), "ne")}
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">औसत विचलन</h4>
          <p className={`text-2xl font-bold ${anomalyStats.averageAnomaly > 0 ? 'text-red-500' : 'text-blue-500'}`}>
            {anomalyStats.averageAnomaly > 0 ? '+' : ''}{localizeNumber(anomalyStats.averageAnomaly.toFixed(2), "ne")}°C
          </p>
        </div>
      </div>
    </div>
  );
} 