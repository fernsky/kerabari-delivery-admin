"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface LandPossessionBarChartProps {
  wardWiseData: Array<{
    ward: string;
    households: number;
    wardNumber: number;
    percentage: string;
  }>;
  LAND_COLORS: Record<string, string>;
}

export default function LandPossessionBarChart({
  wardWiseData,
  LAND_COLORS,
}: LandPossessionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={50}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          label={{
            value: "जग्गाधनी घरपरिवार संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-background p-3 border shadow-sm rounded-md">
                  <p className="font-medium">{payload[0].payload.ward}</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2"
                        style={{ backgroundColor: LAND_COLORS.primary }}
                      ></div>
                      <span>जग्गाधनी घरपरिवार: </span>
                      <span className="font-medium">
                        {payload[0].value?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>कुल जग्गाधनीको: </span>
                      <span className="font-medium">
                        {payload[0].payload.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="households"
          name="जग्गाधनी घरपरिवार"
          fill={LAND_COLORS.primary}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
