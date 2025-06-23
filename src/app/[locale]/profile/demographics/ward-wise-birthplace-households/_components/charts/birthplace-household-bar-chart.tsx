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

interface BirthplaceHouseholdBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  BIRTH_PLACE_COLORS: Record<string, string>;
  BIRTH_PLACE_NAMES: Record<string, string>;
}

export default function BirthplaceHouseholdBarChart({
  wardWiseData,
  BIRTH_PLACE_COLORS,
  BIRTH_PLACE_NAMES,
}: BirthplaceHouseholdBarChartProps) {
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
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")} 
          label={{ 
            value: 'घरपरिवार संख्या',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
        />
        {/* Dynamically generate bars based on available birthplaces in wardWiseData */}
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
        ).map((birthplace, index) => {
          // Find the birthplace key for color mapping
          const birthplaceKey =
            Object.keys(BIRTH_PLACE_NAMES).find(
              (key) => BIRTH_PLACE_NAMES[key] === birthplace,
            ) || "SAME_MUNICIPALITY";

          return (
            <Bar
              key={birthplace}
              dataKey={birthplace}
              name={birthplace}
              stackId="a"
              fill={
                BIRTH_PLACE_COLORS[
                  birthplaceKey as keyof typeof BIRTH_PLACE_COLORS
                ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    BIRTH_PLACE_COLORS[birthplaceKey as keyof typeof BIRTH_PLACE_COLORS] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  fillOpacity={0.8 + (0.2 * index) / Object.keys(BIRTH_PLACE_NAMES).length}
                />
              ))}
            </Bar>
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
