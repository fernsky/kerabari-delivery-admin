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
  Cell,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface AgeGroupBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  AGE_GROUP_COLORS: Record<string, string>;
  AGE_GROUP_NAMES: Record<string, string>;
}

export default function AgeGroupBarChart({
  wardWiseData,
  AGE_GROUP_COLORS,
  AGE_GROUP_NAMES,
}: AgeGroupBarChartProps) {
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
          </div>
        </div>
      );
    }
    return null;
  };

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
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars based on available age groups in wardWiseData */}
        {Object.keys(
          wardWiseData.reduce(
            (acc, ward) => {
              Object.keys(ward).forEach((key) => {
                if (key !== "ward") acc[key] = true;
              });
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        ).map((ageGroup, index) => {
          // Find the age group key for color mapping
          const ageGroupKey =
            Object.keys(AGE_GROUP_NAMES).find(
              (key) => AGE_GROUP_NAMES[key] === ageGroup,
            ) || "AGE_15_TO_59";

          return (
            <Bar
              key={ageGroup}
              dataKey={ageGroup}
              name={ageGroup}
              stackId="a"
              fill={
                AGE_GROUP_COLORS[
                  ageGroupKey as keyof typeof AGE_GROUP_COLORS
                ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    AGE_GROUP_COLORS[ageGroupKey as keyof typeof AGE_GROUP_COLORS] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  fillOpacity={0.8 + (0.2 * index) / Object.keys(AGE_GROUP_NAMES).length}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
