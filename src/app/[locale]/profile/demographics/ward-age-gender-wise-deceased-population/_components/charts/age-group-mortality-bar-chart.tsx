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

interface AgeGroupMortalityBarChartProps {
  ageGroupChartData: Array<{
    ageGroup: string;
    ageGroupEn: string;
    ageGroupKey: string;
    [key: string]: string | number;
    total: number;
  }>;
  GENDER_COLORS: Record<string, string>;
  GENDER_NAMES: Record<string, string>;
}

export default function AgeGroupMortalityBarChart({
  ageGroupChartData,
  GENDER_COLORS,
  GENDER_NAMES,
}: AgeGroupMortalityBarChartProps) {
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
        data={ageGroupChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        barSize={30}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ageGroup"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{ 
            value: "मृत्यु संख्या", 
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
        
        {/* Generate bars for each gender */}
        <Bar
          dataKey={GENDER_NAMES.MALE}
          name={GENDER_NAMES.MALE}
          stackId="a"
          fill={GENDER_COLORS.MALE}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey={GENDER_NAMES.FEMALE}
          name={GENDER_NAMES.FEMALE}
          stackId="a"
          fill={GENDER_COLORS.FEMALE}
          radius={[4, 4, 0, 0]}
        />
        {/* Only add OTHER if there's data */}
        {ageGroupChartData.some((item) => (item[GENDER_NAMES.OTHER] as number) > 0) && (
          <Bar
            dataKey={GENDER_NAMES.OTHER}
            name={GENDER_NAMES.OTHER}
            stackId="a"
            fill={GENDER_COLORS.OTHER}
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
