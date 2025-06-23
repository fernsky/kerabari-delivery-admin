"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  Legend,
} from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface BirthCertificateComparisonProps {
  wardWiseAnalysis: Array<{
    wardNumber: number;
    withCertificate: number;
    withoutCertificate: number;
    total: number;
    percentageWithCertificate: string;
    percentageOfTotal: string;
    coverageRate: string;
  }>;
  CHART_COLORS: {
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
  highestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  lowestWard: {
    wardNumber: number;
    withCertificate: number;
    percentageWithCertificate: string;
    coverageRate: string;
  };
  highestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
  lowestCoverageWard: {
    wardNumber: number;
    coverageRate: string;
  };
  totalWithCertificate: number;
  totalPopulation: number;
}

export default function BirthCertificateComparison({
  wardWiseAnalysis,
  CHART_COLORS,
  highestWard,
  lowestWard,
  highestCoverageWard,
  lowestCoverageWard,
  totalWithCertificate,
  totalPopulation,
}: BirthCertificateComparisonProps) {
  // Calculate average coverage rate
  const overallCoverageRate = totalPopulation > 0
    ? (totalWithCertificate / totalPopulation) * 100
    : 0;

  // Prepare data for comparison chart
  const comparisonData = wardWiseAnalysis.sort((a, b) => a.wardNumber - b.wardNumber).map(ward => ({
    ward: `वडा ${ward.wardNumber}`,
    withCertificate: ward.withCertificate,
    withoutCertificate: ward.withoutCertificate,
    total: ward.total,
    coverageRate: parseFloat(ward.coverageRate),
    averageCoverageRate: overallCoverageRate,
  }));

  // Custom tooltip for better presentation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const { withCertificate, withoutCertificate, total, coverageRate } = payload[0].payload;
      
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
            <span className="text-sm">कुल जनसंख्या:</span>
            <span className="font-medium">
              {localizeNumber(total.toLocaleString(), "ne")}
            </span>
          </div>
          <div className="flex justify-between gap-4 mt-1">
            <span className="text-sm">कभरेज दर:</span>
            <span className="font-medium">
              {localizeNumber(coverageRate.toFixed(2), "ne")}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">औसत कभरेज दर:</span>
            <span className="font-medium">
              {localizeNumber(overallCoverageRate.toFixed(2), "ne")}%
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-sm">अन्तर:</span>
            <span className="font-medium">
              {localizeNumber((coverageRate - overallCoverageRate).toFixed(2), "ne")}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={comparisonData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
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
          yAxisId="left"
          orientation="left"
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          label={{ 
            value: 'संख्या',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle' }
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tickFormatter={(value) => localizeNumber(value.toString() + '%', "ne")}
          label={{ 
            value: 'कभरेज दर',
            angle: 90,
            position: 'insideRight',
            style: { textAnchor: 'middle' }
          }}
        />
        <Tooltip content={CustomTooltip} />
        
        {/* Average reference line */}
        <ReferenceLine 
          y={overallCoverageRate} 
          yAxisId="right"
          stroke={CHART_COLORS.accent}
          strokeDasharray="3 3"
          label={{ 
            value: `औसत: ${localizeNumber(overallCoverageRate.toFixed(1), "ne")}%`,
            position: 'insideBottomLeft',
            fill: CHART_COLORS.accent,
            fontSize: 12
          }}
        />
        
        {/* Stacked bar chart for population */}
        <Bar
          dataKey="withCertificate"
          name="जन्मदर्ता भएका"
          stackId="a"
          fill={CHART_COLORS.primary}
          yAxisId="left"
        />
        <Bar
          dataKey="withoutCertificate"
          name="जन्मदर्ता नभएका"
          stackId="a"
          fill={CHART_COLORS.secondary}
          yAxisId="left"
        />
        
        {/* Line for coverage rate */}
        <Line
          type="monotone"
          dataKey="coverageRate"
          stroke={CHART_COLORS.accent}
          strokeWidth={2}
          yAxisId="right"
          name="कभरेज दर"
          dot={{ r: 4, fill: CHART_COLORS.accent }}
          activeDot={{ r: 6 }}
        />

        <Legend 
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => {
            if (value === "जन्मदर्ता भएका") return "जन्मदर्ता भएका";
            if (value === "जन्मदर्ता नभएका") return "जन्मदर्ता नभएका";
            if (value === "कभरेज दर") return "कभरेज दर (%)";
            return value;
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
