"use client";
import React from "react";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChangeLanguageProps {
  lng: string;
}

const ChangeLanguage: React.FC<ChangeLanguageProps> = ({ lng }) => {
  const router = useRouter();

  const changeLanguage = (newLng: string) => {
    const path = window.location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0 && ["en", "ne"].includes(segments[0])) {
      segments[0] = newLng;
    } else {
      segments.unshift(newLng);
    }
    const newPath = `/${segments.join("/")}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg border border-green-500/20">
        <Languages className="w-4 h-4 text-green-600" />
      </div>
      <div className="flex items-center gap-1 p-1 rounded-lg border border-green-100">
        {[
          { code: "en", label: "EN" },
          { code: "ne", label: "नेपाली" },
        ].map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
              lng === lang.code
                ? "bg-green-600 text-white shadow-sm"
                : "text-gray-600 hover:text-green-600 hover:bg-green-50",
            )}
          >
            {lang.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ChangeLanguage;
