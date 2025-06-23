"use client";
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import Legend from "./legend";
import Filter from "./filter";

interface PieChartProps {
  data: Array<Record<string, string | number>>;
  groupKey: string;
  fillMap: Record<string, string>;
  title?: string;
  height?: number;
  filterKey?: string;
}

const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  groupKey,
  fillMap,
  title = "Pie Chart",
  height = 400,
  filterKey,
}) => {
  const [filter, setFilter] = useState<string>("all");

  const processData = (rawData: Array<Record<string, string | number>>) => {
    const filteredKeys = Object.keys(fillMap);
    return filteredKeys.map((key) => ({
      name: key,
      value: rawData.reduce((sum, item) => {
        const value = item[key];
        return sum + (typeof value === "number" ? value : 0);
      }, 0),
      fill: fillMap[key],
    }));
  };

  const filteredData =
    filter === "all"
      ? processData(data)
      : processData(
          data.filter((item) => String(item[filterKey || groupKey]) === filter),
        );

  const availableFilters = Array.from(
    new Set(data.map((item) => String(item[filterKey || groupKey]))),
  );

  return (
    <div className="px-[16px] py-[24px] rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-[16px]">
      <div className="flex justify-between border-b-[1px] border-b-[#E5E5EF] pb-[16px]">
        <p className="text-[#000000] tracking-[-0.2px] text-[16px] w-full font-[500]">
          {title}
        </p>
        {filterKey && (
          <Filter
            filter={filter}
            setFilter={setFilter}
            sourceData={data.map((item) =>
              Object.fromEntries(
                Object.entries(item).map(([k, v]) => [k, String(v)]),
              ),
            )}
            groupKey={filterKey}
          />
        )}
      </div>
      <div className="flex items-center px-[64px]">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={0}
              blendStroke
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  style={{ border: "black" }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div>
          <Legend
            data={filteredData.map(({ name, fill, value }) => ({
              name,
              fill,
              percentage:
                (value /
                  filteredData.reduce((acc, curr) => acc + curr.value, 0)) *
                100,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
