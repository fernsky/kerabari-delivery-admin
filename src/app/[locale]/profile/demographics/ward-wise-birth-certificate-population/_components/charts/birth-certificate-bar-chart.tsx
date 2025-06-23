"use client";

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateBarChartProps {
  barChartData: Array<{
    ward: string;
    withCertificate: number;
    withoutCertificate: number;
    total: number;
    coverageRate: string;
  }>;
  CHART_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

export default function BirthCertificateBarChart({
  barChartData,
  CHART_COLORS,
}: BirthCertificateBarChartProps) {
  // Custom tooltip component for better presentation with Nepali numbers
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const withCertificate = payload[0].value;
      const withoutCertificate = payload[1]?.value || 0;
      const total = withCertificate + withoutCertificate;
      const coverageRate = ((withCertificate / total) * 100).toFixed(2);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{localizeNumber(label, "ne")}</p>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">जन्मदर्ता भएका:</span>
            <span className="font-medium">
              {localizeNumber(withCertificate.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">जन्मदर्ता नभएका:</span>
            <span className="font-medium">
              {localizeNumber(withoutCertificate.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">जम्मा जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(total.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">कभरेज दर:</span>
            <span className="font-medium">
              {localizeNumber(coverageRate, "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex justify-center items-center gap-8 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: entry.color }} />
            <span className="text-xs">
              {entry.value === "withCertificate"
                ? "जन्मदर्ता भएका"
                : "जन्मदर्ता नभएका"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={barChartData}
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
            value: "संख्या",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <Tooltip content={CustomTooltip} />
        <Legend content={renderCustomizedLegend} />
        <Bar
          dataKey="withCertificate"
          name="withCertificate"
          stackId="a"
          fill={CHART_COLORS.primary}
        />
        <Bar
          dataKey="withoutCertificate"
          name="withoutCertificate"
          stackId="a"
          fill={CHART_COLORS.secondary}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
