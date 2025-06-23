"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface DigitalAccessComparisonChartProps {
  wardDigitalAccess: Array<{
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  }>;
  bestDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  worstDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  digitalAccessIndex: number;
}

export default function DigitalAccessComparisonChart({
  wardDigitalAccess,
  bestDigitalWard,
  worstDigitalWard,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
}: DigitalAccessComparisonChartProps) {
  // Format data for the chart - compare digital access components by ward
  const chartData = wardDigitalAccess.map((ward) => ({
    name: `वडा ${localizeNumber(ward.wardNumber, "ne")}`,
    "Internet": ward.internetPercentage,
    "Computer": ward.computerPercentage,
    "Mobile": ward.mobilePercentage,
    "DigitalScore": ward.score
  })).sort((a, b) => 
    b["DigitalScore"] - a["DigitalScore"]
  );

  // Custom tooltip for displaying percentages with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: FACILITY_CATEGORIES.INTERNET.color }}
              ></div>
              <span>इन्टरनेट पहुँच: </span>
              <span className="font-medium">
                {payload[0] && localizeNumber(payload[0].value?.toFixed(2) || "0", "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: FACILITY_CATEGORIES.COMPUTER.color }}
              ></div>
              <span>कम्प्युटर पहुँच: </span>
              <span className="font-medium">
                {payload[1] && localizeNumber(payload[1].value?.toFixed(2) || "0", "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: FACILITY_CATEGORIES.MOBILE_PHONE.color }}
              ></div>
              <span>मोबाइल पहुँच: </span>
              <span className="font-medium">
                {payload[2] && localizeNumber(payload[2].value?.toFixed(2) || "0", "ne")}%
              </span>
            </div>
            <div className="flex items-center gap-2 pt-2 mt-1 border-t">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#212121" }}
              ></div>
              <span>डिजिटल स्कोर: </span>
              <span className="font-medium">
                {payload[3] && localizeNumber(payload[3].value?.toFixed(2) || "0", "ne")}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        barGap={0}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis
          tickFormatter={(value) => `${localizeNumber(value, "ne")}%`}
          domain={[0, 100]}
          label={{
            value: "प्रतिशत",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend 
          formatter={(value) => {
            if (value === "Internet") return "इन्टरनेट पहुँच";
            if (value === "Computer") return "कम्प्युटर पहुँच";
            if (value === "Mobile") return "मोबाइल फोन पहुँच";
            if (value === "DigitalScore") return "डिजिटल स्कोर";
            return value;
          }}
        />
        <Bar
          dataKey="Internet"
          fill={FACILITY_CATEGORIES.INTERNET.color}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Computer"
          fill={FACILITY_CATEGORIES.COMPUTER.color}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="Mobile"
          fill={FACILITY_CATEGORIES.MOBILE_PHONE.color}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="DigitalScore"
          fill="#212121"
          radius={[4, 4, 0, 0]}
          hide={true}
        />
        <ReferenceLine
          y={digitalAccessIndex}
          stroke="#212121"
          strokeDasharray="3 3"
          label={{
            value: `पालिका औसत: ${localizeNumber(digitalAccessIndex.toFixed(2), "ne")}`,
            position: "insideBottomRight",
            style: { fill: "#212121", fontSize: 12 },
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
