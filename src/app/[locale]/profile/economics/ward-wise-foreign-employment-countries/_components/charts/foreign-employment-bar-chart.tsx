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

interface ForeignEmploymentBarChartProps {
  wardWiseData: Array<Record<string, any>>;
  COUNTRY_COLORS: Record<string, string>;
  COUNTRY_NAMES: Record<string, string>;
}

export default function ForeignEmploymentBarChart({
  wardWiseData,
  COUNTRY_COLORS,
  COUNTRY_NAMES,
}: ForeignEmploymentBarChartProps) {
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

  // Get common countries across all wards for consistent stacking order
  const commonCountries = Object.keys(
    wardWiseData.reduce(
      (acc, ward) => {
        Object.keys(ward).forEach((key) => {
          if (key !== "ward") acc[key] = true;
        });
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // Sort countries by most common to least common overall
  const countryTotals = commonCountries.reduce((acc, country) => {
    acc[country] = wardWiseData.reduce((sum, ward) => {
      return sum + (ward[country] || 0);
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  const sortedCountries = commonCountries.sort((a, b) => 
    countryTotals[b] - countryTotals[a]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={wardWiseData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="ward"
          scale="point"
          padding={{ left: 10, right: 10 }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => localizeNumber(value.toString(), "ne")}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tickFormatter={(value) => localizeNumber(value.toString(), "ne")} />
        <Tooltip content={CustomTooltip} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          formatter={(value) => {
            // Truncate long names for better display in legend
            const maxLength = 20;
            return value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
          }}
        />
        {/* Use top 6 countries for better visualization */}
        {sortedCountries.slice(0, 6).map((country, index) => {
          // Find the country key for color mapping
          const countryKey = Object.keys(COUNTRY_NAMES).find(
            (key) => COUNTRY_NAMES[key] === country,
          ) || country;

          return (
            <Bar
              key={country}
              dataKey={country}
              name={country}
              stackId="a"
              fill={
                COUNTRY_COLORS[
                  countryKey as keyof typeof COUNTRY_COLORS
                ] || `#${Math.floor(Math.random() * 16777215).toString(16)}`
              }
            >
              {wardWiseData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fill={
                    COUNTRY_COLORS[countryKey as keyof typeof COUNTRY_COLORS] ||
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`
                  }
                  fillOpacity={0.8 + (0.2 * index) / sortedCountries.length}
                />
              ))}
            </Bar>
          );
        })}
        
        {/* Add "Other" category for remaining countries */}
        {sortedCountries.length > 6 && (
          <Bar
            key="others"
            name="अन्य देशहरू"
            stackId="a"
            fill="#95a5a6"
            dataKey={(data) => {
              const otherSum = sortedCountries
                .slice(6)
                .reduce((sum, country) => sum + (data[country] || 0), 0);
              return otherSum;
            }}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
