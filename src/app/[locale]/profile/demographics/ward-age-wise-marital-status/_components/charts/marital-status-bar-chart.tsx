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

interface MaritalStatusBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  MARITAL_STATUS_COLORS: Record<string, string>;
  MARITAL_STATUS_NAMES: Record<string, string>;
}

export default function MaritalStatusBarChart({
  wardWiseData,
  MARITAL_STATUS_COLORS,
  MARITAL_STATUS_NAMES,
}: MaritalStatusBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="wardNumber"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-3 border shadow-sm rounded-md">
                  <p className="font-medium">{localizeNumber(payload[0].payload.wardNumber, "ne")}</p>
                  <div className="space-y-1 mt-2">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span>{entry.name}: </span>
                        <span className="font-medium">
                          {localizeNumber(entry.value as string, "ne")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars based on available marital statuses in wardWiseData */}
        {Object.keys(
          wardWiseData.reduce(
            (acc, ward) => {
              Object.keys(ward).forEach((key) => {
                if (key !== "wardNumber" && key !== "wardId" && key !== "total") acc[key] = true;
              });
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        ).map((status) => {
          return (
            <Bar
              key={status}
              dataKey={status}
              name={MARITAL_STATUS_NAMES[status] || status}
              stackId="a"
              fill={
                MARITAL_STATUS_COLORS[status as keyof typeof MARITAL_STATUS_COLORS] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
