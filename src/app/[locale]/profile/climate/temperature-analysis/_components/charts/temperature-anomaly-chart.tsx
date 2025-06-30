"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
  }>;
  anomalyStats: {
    totalAnomalies: number;
    warmAnomalies: number;
    coldAnomalies: number;
    extremeAnomalies: number;
    averageAnomaly: number;
  };
}

export default function TemperatureAnomalyChart({
  anomalyData,
  anomalyStats,
}: TemperatureAnomalyChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{data.date}</p>
          <p className="text-sm">
            विचलन: {data.anomaly > 0 ? '+' : ''}{localizeNumber(data.anomaly?.toFixed(1), "ne")}°C
          </p>
        </div>
      );
    }
    return null;
  };

  const getAnomalyColor = (anomaly: number) => {
    if (anomaly <= -2) return "#1e40af";
    if (anomaly <= -1) return "#3b82f6";
    if (anomaly <= 1) return "#10b981";
    if (anomaly <= 2) return "#f59e0b";
    return "#dc2626";
  };

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

  Object.values(monthlyAnomalies).forEach((month: any) => {
    month.avgAnomaly = month.anomalies.reduce((sum: number, val: number) => sum + val, 0) / month.count;
  });

  const monthlyAnomalyData = Object.values(monthlyAnomalies)
    .sort((a: any, b: any) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">तापक्रम विचलन</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyAnomalyData}>
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
                height={60}
              />
              <YAxis
                tickFormatter={(value) => localizeNumber(value.toFixed(1), "ne")}
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip content={CustomTooltip} />
              
              <Bar
                dataKey="avgAnomaly"
                radius={[2, 2, 0, 0]}
              >
                {monthlyAnomalyData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getAnomalyColor(entry.avgAnomaly)}
                  />
                ))}
              </Bar>
              
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">कुल विचलन</p>
          <p className="text-xl font-bold">{localizeNumber(anomalyStats.totalAnomalies.toString(), "ne")}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">तातो विचलन</p>
          <p className="text-xl font-bold text-red-600">{localizeNumber(anomalyStats.warmAnomalies.toString(), "ne")}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">चिसो विचलन</p>
          <p className="text-xl font-bold text-blue-600">{localizeNumber(anomalyStats.coldAnomalies.toString(), "ne")}</p>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">औसत विचलन</p>
          <p className={`text-xl font-bold ${anomalyStats.averageAnomaly > 0 ? 'text-red-500' : 'text-blue-500'}`}>
            {anomalyStats.averageAnomaly > 0 ? '+' : ''}{localizeNumber(anomalyStats.averageAnomaly.toFixed(1), "ne")}°C
          </p>
        </div>
      </div>
    </div>
  );
} 