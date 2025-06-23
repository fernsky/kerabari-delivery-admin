"use client";
import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className = "",
}) => {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={`relative w-5 h-5 rounded-md flex items-center justify-center 
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20
        ${
          checked
            ? "bg-gradient-to-br from-green-500 to-emerald-600 border-transparent"
            : "border-2 border-gray-300 hover:border-green-500"
        } ${className}`}
      role="checkbox"
      aria-checked={checked}
    >
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
      </motion.div>
    </button>
  );
};

export default Checkbox;
