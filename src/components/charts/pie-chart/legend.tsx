import React from "react";

interface LegendProps {
  data: { name: string; percentage: number; fill: string }[];
}

const Legend: React.FC<LegendProps> = ({ data }) => {
  return (
    <ul className="flex flex-col gap-[10px] text-[13px] w-full">
      {data.map((entry, index) => (
        <li
          key={`item-${index}`}
          className="flex items-center gap-[6px] w-[200px] justify-between"
        >
          <div className="flex items-center gap-[8px]">
            <div
              className="w-[10px] h-[10px] rounded-full"
              style={{ backgroundColor: entry.fill }}
            />

            <span className="font-[500]">{entry.name}</span>
          </div>
          <span className="text-gray-500">
            {Number(entry.percentage) ? entry.percentage.toFixed(2) : 0}%
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Legend;
