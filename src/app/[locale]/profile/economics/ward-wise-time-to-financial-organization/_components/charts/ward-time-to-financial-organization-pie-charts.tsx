"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardTimeToFinancialOrganizationPieChartsProps {
  wardWiseData: Array<Record<string, any>>;
  TIME_TO_FINANCIAL_ORG_STATUS: {
    UNDER_15_MIN: { name: string; nameEn: string; color: string; };
    UNDER_30_MIN: { name: string; nameEn: string; color: string; };
    UNDER_1_HOUR: { name: string; nameEn: string; color: string; };
    HOUR_OR_MORE: { name: string; nameEn: string; color: string; };
  };
}

export default function WardTimeToFinancialOrganizationPieCharts({
  wardWiseData,
  TIME_TO_FINANCIAL_ORG_STATUS,
}: WardTimeToFinancialOrganizationPieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalHouseholds }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalHouseholds) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="font-medium">{name}</p>
          <div className="flex items-center justify-between gap-4 mt-1">
            <span>घरधुरी:</span>
            <span className="font-medium">
              {localizeNumber(value.toLocaleString(), "ne")} ({localizeNumber(percentage, "ne")}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {wardWiseData.map((wardData) => {
        const total = wardData.total || 0;
        const under15Min = wardData[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name] || 0;
        const under30Min = wardData[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name] || 0;
        const under1Hour = wardData[TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name] || 0;
        const over1Hour = wardData[TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name] || 0;

        const data = [
          { name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.name, value: under15Min, color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_15_MIN.color },
          { name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.name, value: under30Min, color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_30_MIN.color },
          { name: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.name, value: under1Hour, color: TIME_TO_FINANCIAL_ORG_STATUS.UNDER_1_HOUR.color },
          { name: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.name, value: over1Hour, color: TIME_TO_FINANCIAL_ORG_STATUS.HOUR_OR_MORE.color }
        ];

        return (
          <div key={wardData.wardNumber} className="h-auto border rounded-md p-4">
            <h3 className="text-lg font-medium mb-2 text-center">
              {wardData.ward}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल घरधुरी संख्या: {localizeNumber(total.toLocaleString(), "ne")}
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalHouseholds={total} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {data.map((item, i) => {
                  const percentage = total > 0 ? (item.value / total) * 100 : 0;

                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: item.color,
                        }}
                      ></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center text-xs">
                          <span className="truncate">{item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name}</span>
                          <span className="font-medium">
                            {localizeNumber(percentage.toFixed(1), "ne")}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full mt-0.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
