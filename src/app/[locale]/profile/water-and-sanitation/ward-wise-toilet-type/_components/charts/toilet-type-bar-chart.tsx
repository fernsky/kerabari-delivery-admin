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

interface ToiletTypeBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  TOILET_TYPE_COLORS: Record<string, string>;
  typeMap: Record<string, string>;
}

export default function ToiletTypeBarChart({
  wardWiseData,
  TOILET_TYPE_COLORS,
  typeMap,
}: ToiletTypeBarChartProps) {
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

  // Get toilet types present in data
  const typesInData = Array.from(
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

  // Find type keys for coloring
  const typeKeysMap: Record<string, string> = {};
  wardWiseData.forEach(ward => {
    Object.keys(ward).forEach(key => {
      if (key.endsWith("_key")) {
        const toiletType = key.replace("_key", "");
        const typeKey = ward[key];
        if (typeMap[typeKey]) {
          typeKeysMap[typeMap[typeKey]] = typeKey;
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
        {/* Dynamically generate bars for each toilet type */}
        {typesInData.map((type, index) => {
          const typeKey = typeKeysMap[type] || Object.keys(TOILET_TYPE_COLORS)[index % Object.keys(TOILET_TYPE_COLORS).length];
          
          return (
            <Bar
              key={type}
              dataKey={type}
              name={type}
              stackId="a"
              fill={TOILET_TYPE_COLORS[typeKey as keyof typeof TOILET_TYPE_COLORS] || "#888888"}
              radius={index === typesInData.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
