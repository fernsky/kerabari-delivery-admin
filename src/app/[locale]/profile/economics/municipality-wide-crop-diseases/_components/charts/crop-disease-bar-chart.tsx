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

interface CropDiseaseBarChartProps {
  data: Array<{
    name: string;
    diseases: number;
    pests: number;
    total: number;
  }>;
  CROP_COLORS: Record<string, string>;
  cropSummary: Array<{
    crop: string;
    cropName: string;
    pestsCount: number;
    diseasesCount: number;
    totalIssues: number;
    majorPests: string[];
    majorDiseases: string[];
  }>;
}

export default function CropDiseaseBarChart({
  data,
  CROP_COLORS,
  cropSummary,
}: CropDiseaseBarChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const cropData = cropSummary.find((c) => c.cropName === label);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md max-w-xs">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 mt-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm">
                  {entry.name === "diseases" ? "रोग" : "कीट"}:{" "}
                  {localizeNumber(entry.value.toString(), "ne")}
                </span>
              </div>
            ))}
          </div>
          {cropData && (
            <div className="mt-3 pt-2 border-t text-xs">
              <p className="font-medium">प्रमुख समस्याहरू:</p>
              <p>रोग: {cropData.majorDiseases.slice(0, 2).join(", ")}</p>
              <p>कीट: {cropData.majorPests.slice(0, 2).join(", ")}</p>
            </div>
          )}
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
            value: "संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend
          formatter={(value) => {
            return value === "diseases" ? "रोग" : "कीट";
          }}
        />
        <Bar dataKey="diseases" name="diseases" fill="#E74C3C" />
        <Bar dataKey="pests" name="pests" fill="#2ECC71" />
      </BarChart>
    </ResponsiveContainer>
  );
}
