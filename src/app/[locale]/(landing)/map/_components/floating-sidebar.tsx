"use client";
import React from "react";
import { Layers } from "lucide-react";
import useStore from "../../_store/app-store";
// Removed useTranslation import
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

interface FloatingSidebarProps {
  lng: string;
}

const FloatingSidebar: React.FC<FloatingSidebarProps> = ({ lng }) => {
  // Removed useTranslation hook
  const setMapSidebarOpen = useStore((state) => state.setMapSidebarOpen);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setMapSidebarOpen(true)}
        data-tooltip-id="layers-tooltip"
        className="bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 px-4 py-2.5 rounded-xl shadow-lg hover:shadow-xl
        hover:bg-gradient-to-br hover:from-green-50/80 hover:to-emerald-50/80 transition-all duration-300
        flex items-center gap-3 border border-gray-200 group"
      >
        <div
          className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white
        group-hover:scale-110 transition-transform shadow-lg shadow-green-500/20"
        >
          <Layers className="w-3.5 h-3.5" />
        </div>
        <span
          className="text-[13px] font-semibold tracking-wide bg-gradient-to-br from-gray-900 to-gray-600 
        bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-800"
        >
          तहहरू
        </span>
      </button>
      <Tooltip
        id="layers-tooltip"
        place="left"
        className="!bg-black/75 backdrop-blur-sm !font-medium !px-2.5 !py-1.5 !rounded-lg !text-xs"
      >
        तहहरू प्रबन्धन खुलाउनुहोस्
      </Tooltip>
    </motion.div>
  );
};

export default FloatingSidebar;
