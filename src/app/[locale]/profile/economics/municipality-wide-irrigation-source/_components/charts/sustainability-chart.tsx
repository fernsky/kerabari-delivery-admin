"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface SustainabilityChartProps {
  sustainabilityScore: number;
}

export default function SustainabilityChart({
  sustainabilityScore,
}: SustainabilityChartProps) {
  // Determine color based on sustainability score
  const getColor = (score: number) => {
    if (score >= 80) return "#2ecc71"; // Green for high sustainability
    if (score >= 60) return "#27ae60"; // Darker green for good sustainability
    if (score >= 40) return "#f39c12"; // Orange for medium sustainability
    if (score >= 20) return "#e67e22"; // Dark orange for poor sustainability
    return "#e74c3c"; // Red for very poor sustainability
  };

  // Get sustainability level label
  const getSustainabilityLevel = (score: number) => {
    if (score >= 80) return "अति उच्च";
    if (score >= 60) return "उच्च";
    if (score >= 40) return "मध्यम";
    if (score >= 20) return "न्यून";
    return "अति न्यून";
  };

  const color = getColor(sustainabilityScore);
  const sustainabilityLevel = getSustainabilityLevel(sustainabilityScore);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${sustainabilityScore}%`,
            backgroundColor: color,
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium z-10">
          {localizeNumber(sustainabilityScore.toString(), "ne")}% -{" "}
          {sustainabilityLevel} दिगोपना
        </div>
      </div>

      <div className="w-full max-w-md mt-4 flex justify-between text-xs text-muted-foreground">
        <span>कम दिगो</span>
        <span>अति दिगो</span>
      </div>

      <div className="mt-6 text-sm">
        <p className="text-center">
          सिंचाई दिगोपना स्कोर{" "}
          {localizeNumber(sustainabilityScore.toString(), "ne")}% (
          {sustainabilityLevel} दिगोपना स्तर)
        </p>
      </div>
    </div>
  );
}
