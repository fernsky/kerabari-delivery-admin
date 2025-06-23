"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WaterPurificationBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  WATER_PURIFICATION_COLORS: Record<string, string>;
  methodMap: Record<string, string>;
}

export default function WaterPurificationBarChart({
  wardWiseData,
  WATER_PURIFICATION_COLORS,
  methodMap,
}: WaterPurificationBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: </span>
                <span className="font-medium">
                  {localizeNumber(entry.value?.toLocaleString() || "0", "ne")}
                </span>
              </div>
            ))}
            {payload.length >= 2 && (
              <div className="flex items-center gap-2 pt-1 mt-1 border-t">
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                <span>जम्मा: </span>
                <span className="font-medium">
                  {localizeNumber(
                    payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0).toLocaleString(),
                    "ne"
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get purification methods present in data
  const methodsInData = Array.from(
    new Set(
      wardWiseData.flatMap(ward => 
        Object.keys(ward).filter(key => 
          key !== "ward" && 
          key !== "wardNumber" && 
          key !== "total" && 
          !key.endsWith("_key")
        )
      )
    )
  );

  // Find method keys for coloring
  const methodKeysMap: Record<string, string> = {};
  wardWiseData.forEach(ward => {
    Object.keys(ward).forEach(key => {
      if (key.endsWith("_key")) {
        const purificationMethod = key.replace("_key", "");
        const methodKey = ward[key];
        if (methodMap[methodKey]) {
          methodKeysMap[methodMap[methodKey]] = methodKey;
        }
      }
    });
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value, "ne")}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars for each purification method */}
        {methodsInData.map((method, index) => {
          const methodKey = methodKeysMap[method] || Object.keys(WATER_PURIFICATION_COLORS)[index % Object.keys(WATER_PURIFICATION_COLORS).length];
          
          return (
            <Bar
              key={method}
              dataKey={method}
              name={method}
              stackId="a"
              fill={WATER_PURIFICATION_COLORS[methodKey as keyof typeof WATER_PURIFICATION_COLORS] || "#888888"}
              radius={index === methodsInData.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
