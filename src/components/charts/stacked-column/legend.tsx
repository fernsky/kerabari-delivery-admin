import React from "react";

interface LegendProps {
  fillMap: Record<string, string>;
}

const Legend: React.FC<LegendProps> = ({ fillMap }) => {
  return (
    <ul className="flex justify-end gap-[20px] text-[13px] w-full">
      {Object.keys(fillMap).map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-[6px]">
          <div
            key={`marigin-x-[20px] font-[500] `}
            className="w-[10px] h-[10px] rounded-full"
            style={{ backgroundColor: fillMap[entry] }}
          />
          <li key={`marigin-x-[20px] font-[500]`}>{entry}</li>
        </div>
      ))}
    </ul>
  );
};

export default Legend;
