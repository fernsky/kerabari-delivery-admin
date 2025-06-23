"use client";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import CustomizedLegend from "./legend";

// Color palette for random color generation
const COLOR_PALETTE = ["#962DFF", "#C893FD", "#E0C6FD", "#7B2AD6", "#DDB8FF"];

interface StackedColumnProps {
  data: Array<Record<string, string>>;
  xAxisKey: string;
  fillMap?: Record<string, string>;
  title?: string;
  height?: number;
}

const generateFillMap = (keys: string[]): Record<string, string> => {
  return keys.reduce(
    (acc, key, index) => ({
      ...acc,
      [key]: COLOR_PALETTE[index % COLOR_PALETTE.length],
    }),
    {},
  );
};

const getRoundedPath = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  const radius = 10; // Adjust the radius as needed
  return `M${x},${y + height} 
                                        h${width} 
                                        v-${height - radius} 
                                        a${radius},${radius} 0 0 0 -${radius},-${radius} 
                                        h-${width - 2 * radius} 
                                        a${radius},${radius} 0 0 0 -${radius},${radius} 
                                        v${height - radius} 
                                        Z`;
};

interface RoundedBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const RoundedBar: React.FC<RoundedBarProps> = ({
  fill,
  x,
  y,
  width,
  height,
}) => {
  return (
    <path d={getRoundedPath(x, y, width, height)} stroke="none" fill={fill} />
  );
};

const StackedColumnChart: React.FC<StackedColumnProps> = ({
  data,
  xAxisKey,
  fillMap: providedFillMap,
  title = "Stacked Column Chart",
  height = 400,
}) => {
  // Get all keys except xAxisKey for stacking
  const stackKeys = Object.keys(data[0] || {}).filter(
    (key) => key !== xAxisKey,
  );

  // Generate fillMap if not provided
  const fillMap = providedFillMap || generateFillMap(stackKeys);

  return (
    <div className="p-[28px] py-[32px] rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-[16px]">
      <div className="flex justify-between">
        <p className="text-[#000000] tracking-[-0.2px] text-[16px] w-full font-[500]">
          {title}
        </p>
        <CustomizedLegend fillMap={fillMap} />
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: "#615E83" }}
            padding={{ left: 0, right: 0 }}
            axisLine={{ stroke: "#9291A5" }}
            tickSize={0}
            tickMargin={10}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#615E83" }}
            orientation="left"
            padding={{ top: 0, bottom: 0 }}
            domain={[0, "auto"]}
            axisLine={{ stroke: "#9291A5" }}
            tickSize={0}
            tickMargin={16}
            yAxisId={0}
          />

          {stackKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={fillMap[key]}
              barSize={72}
              shape={
                index === stackKeys.length - 1 ? (
                  //@ts-expect-error: Custom shape prop is passed with props automatically
                  <RoundedBar />
                ) : undefined
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedColumnChart;
