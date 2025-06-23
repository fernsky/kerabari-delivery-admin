"use client";

import { useMemo } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WardDisabilityCausePieChartsProps {
  wardNumbers: number[];
  disabilityData: Array<{
    id?: string;
    wardNumber: number;
    disabilityCause: string;
    population: number;
  }>;
  DISABILITY_CAUSE_NAMES: Record<string, string>;
  DISABILITY_CAUSE_COLORS: Record<string, string>;
}

export default function WardDisabilityCausePieCharts({
  wardNumbers,
  disabilityData,
  DISABILITY_CAUSE_NAMES,
  DISABILITY_CAUSE_COLORS,
}: WardDisabilityCausePieChartsProps) {
  // Process data for each ward
  const wardData = useMemo(() => {
    return wardNumbers.map((wardNumber) => {
      // Get data for this ward
      const wardItems = disabilityData.filter(
        (item) => item.wardNumber === wardNumber,
      );

      // Calculate total population for this ward
      const wardTotal = wardItems.reduce(
        (sum, item) => sum + (item.population || 0),
        0,
      );

      // Create pie chart data
      const pieData = wardItems.map((item) => {
        const percentage =
          wardTotal > 0
            ? ((item.population / wardTotal) * 100).toFixed(2)
            : "0";

        return {
          name:
            DISABILITY_CAUSE_NAMES[
              item.disabilityCause as keyof typeof DISABILITY_CAUSE_NAMES
            ] || item.disabilityCause,
          value: item.population,
          percentage,
          disabilityCause: item.disabilityCause,
        };
      });

      return {
        wardNumber,
        total: wardTotal,
        data: pieData,
      };
    });
  }, [wardNumbers, disabilityData, DISABILITY_CAUSE_NAMES]);

  // Custom tooltip to show values in Nepali
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>
            <span className="font-medium">
              {localizeNumber(data.value.toLocaleString(), "ne")}
            </span>{" "}
            व्यक्ति
          </p>
          <p>
            <span className="font-medium">
              {localizeNumber(data.percentage, "ne")}%
            </span>{" "}
            प्रतिशत
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend for better styling
  const renderCustomizedLegend = (props: any) => {
    const { payload } = props;

    return (
      <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
        {payload.map((entry: any, index: number) => {
          return (
            <div key={`item-${index}`} className="flex items-center gap-1">
              <div
                style={{ backgroundColor: entry.color }}
                className="w-2 h-2 rounded-full"
              />
              <span>{entry.value}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardData.map((ward) => (
        <div
          key={ward.wardNumber}
          className="border rounded-lg p-4 bg-card/50"
          data-ward-number={ward.wardNumber}
          data-total-population={ward.total}
        >
          <h5 className="font-medium text-center mb-4">
            वडा {localizeNumber(ward.wardNumber.toString(), "ne")}
            <span className="block text-sm text-muted-foreground">
              कुल: {localizeNumber(ward.total.toLocaleString(), "ne")} व्यक्ति
            </span>
          </h5>

          <div className="h-[180px]">
            {ward.data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ward.data}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {ward.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          DISABILITY_CAUSE_COLORS[
                            entry.disabilityCause.toUpperCase() as keyof typeof DISABILITY_CAUSE_COLORS
                          ] || "#888"
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderCustomizedLegend} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                कुनै डाटा उपलब्ध छैन
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
