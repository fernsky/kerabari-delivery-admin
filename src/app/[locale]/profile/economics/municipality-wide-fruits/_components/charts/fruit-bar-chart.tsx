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

interface FruitBarChartProps {
  data: Array<{
    name: string;
    mango: number;
    jackfruit: number;
    litchi: number;
    other: number;
  }>;
}

export default function FruitBarChart({ data }: FruitBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")} साल</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>
                  {entry.name === "mango"
                    ? "आँप"
                    : entry.name === "jackfruit"
                      ? "रुखकटहर"
                      : entry.name === "litchi"
                        ? "लिची"
                        : "अन्य"}
                  :{" "}
                </span>
                <span className="font-medium">
                  {localizeNumber(entry.value.toFixed(2), "ne")} मे.ट.
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{
            value: "मेट्रिक टन",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            return value === "mango"
              ? "आँप"
              : value === "jackfruit"
                ? "रुखकटहर"
                : value === "litchi"
                  ? "लिची"
                  : "अन्य";
          }}
        />
        <Bar dataKey="mango" name="mango" fill="#e67e22" stackId="a" />
        <Bar dataKey="jackfruit" name="jackfruit" fill="#27ae60" stackId="a" />
        <Bar dataKey="litchi" name="litchi" fill="#8e44ad" stackId="a" />
        <Bar dataKey="other" name="other" fill="#7f8c8d" stackId="a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
