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

interface WardGenderBarChartProps {
  wardWiseGenderData: Array<Record<string, any>>;
  GENDER_COLORS: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function WardGenderBarChart({
  wardWiseGenderData,
  GENDER_COLORS,
  GENDER_NAMES,
}: WardGenderBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseGenderData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-3 border shadow-sm rounded-md">
                  <p className="font-medium">{payload[0].payload.ward}</p>
                  <div className="space-y-1 mt-2">
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2"
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span>{entry.name}: </span>
                        <span className="font-medium">
                          {entry.value?.toLocaleString()}
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
        {/* Dynamically generate bars based on available genders in wardWiseGenderData */}
        {Object.keys(
          wardWiseGenderData.reduce(
            (acc, ward) => {
              Object.keys(ward).forEach((key) => {
                if (key !== "ward") acc[key] = true;
              });
              return acc;
            },
            {} as Record<string, boolean>,
          ),
        ).map((genderName) => {
          // Find the gender key for color mapping
          const genderKey =
            Object.keys(GENDER_NAMES).find(
              (key) => GENDER_NAMES[key] === genderName,
            ) || "OTHER";

          return (
            <Bar
              key={genderName}
              dataKey={genderName}
              fill={
                GENDER_COLORS[genderKey as keyof typeof GENDER_COLORS] ||
                `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
