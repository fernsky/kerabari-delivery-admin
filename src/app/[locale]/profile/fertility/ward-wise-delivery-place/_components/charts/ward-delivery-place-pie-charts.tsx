"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardDeliveryPlacePieChartsProps {
  wardWiseData: Array<Record<string, any>>;
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
}

export default function WardDeliveryPlacePieCharts({
  wardWiseData,
  DELIVERY_PLACE_CATEGORIES,
}: WardDeliveryPlacePieChartsProps) {
  // Custom tooltip component with Nepali numbers
  const CustomTooltip = ({ active, payload, totalDeliveries }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = ((value / totalDeliveries) * 100).toFixed(1);

      return (
        <div className="bg-background p-3 border shadow-sm rounded-md">
          <p className="text-sm font-medium mb-2">{name}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm">संख्या:</span>
              <span className="text-sm font-medium">
                {localizeNumber(value.toLocaleString(), "ne")} (
                {localizeNumber(percentage, "ne")}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wardWiseData.map((wardData) => {
        const total = wardData.total || 0;
        const deliveryCategories = Object.values(DELIVERY_PLACE_CATEGORIES)
          .map((category) => ({
            name: category.name,
            value: wardData[category.name] || 0,
            color: category.color,
          }))
          .filter((item) => item.value > 0);

        return (
          <div
            key={wardData.wardNumber}
            className="h-auto border rounded-md p-4 bg-card shadow-sm"
          >
            <h3 className="text-lg font-medium mb-2 text-center">
              {localizeNumber(wardData.ward, "ne")}
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-2">
              कुल प्रसूती: {localizeNumber(total.toLocaleString(), "ne")}
            </p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deliveryCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {deliveryCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={<CustomTooltip totalDeliveries={total} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend section with percentage bars */}
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2">
                {deliveryCategories.map((item, i) => {
                  if (item.value === 0) return null;
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
                          <span className="truncate">
                            {item.name.length > 15
                              ? item.name.substring(0, 15) + "..."
                              : item.name}
                          </span>
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
