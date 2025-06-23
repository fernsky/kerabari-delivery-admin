import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickAway } from "react-use";

interface FilterProps {
  filter: string;
  setFilter: (filter: string) => void;
  sourceData: Array<Record<string, string>>;
  groupKey: string;
}

const Filter: React.FC<FilterProps> = ({
  filter,
  setFilter,
  sourceData,
  groupKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickAway(dropdownRef, () => {
    setIsOpen(false);
  });

  const handleSelect = (value: string) => {
    setFilter(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        className="flex w-[100px] gap-[4px] px-[24px] py-[8px] items-center justify-between drop-shadow-[0_0px_1px_rgba(0,0,0,0.1)] bg-[#F8F8FF]  h-fit rounded-[16px] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xs text-[#616161]">
          {filter === "all" ? "All" : filter}
        </span>
        <ChevronDown className="w-[16px] h-[16px] text-[#575757]" />
      </div>
      {isOpen && (
        <ul className="absolute top-[40px] text-[#616070] left-[0.05rem] rounded-[8px] border-[0.05rem] border-[#F5F5F5] w-[100px] bg-[#FFFFFF]">
          <li
            className="rounded-t-[8px] text-xs hover:bg-[#F6F6F6] px-[8px] py-[4px] cursor-pointer w-full border-b-[1px] border-b-[#D3D3D3]"
            onClick={() => handleSelect("all")}
          >
            All
          </li>
          {sourceData.map((item) => (
            <li
              key={item[groupKey]}
              className="text-xs text-[#615E83] hover:bg-[#F6F6F6] px-[8px] py-[4px] cursor-pointer w-full"
              onClick={() => handleSelect(item[groupKey])}
            >
              {item[groupKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Filter;
