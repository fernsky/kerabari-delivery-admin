"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface CommercializationChartProps {
  commercializationScore: number;
}

export default function CommercializationChart({
  commercializationScore,
}: CommercializationChartProps) {
  // Determine color based on commercialization score
  const getColor = (score: number) => {
    if (score >= 80) return "#3498db"; // Blue for high commercialization
    if (score >= 60) return "#2980b9"; // Darker blue for good commercialization
    if (score >= 40) return "#f39c12"; // Orange for medium commercialization
    if (score >= 20) return "#e67e22"; // Dark orange for poor commercialization
    return "#e74c3c"; // Red for very poor commercialization
  };

  // Get commercialization level label
  const getCommercializationLevel = (score: number) => {
    if (score >= 80) return "अति उच्च";
    if (score >= 60) return "उच्च";
    if (score >= 40) return "मध्यम";
    if (score >= 20) return "न्यून";
    return "अति न्यून";
  };

  const color = getColor(commercializationScore);
  const commercializationLevel = getCommercializationLevel(
    commercializationScore,
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${commercializationScore}%`,
            backgroundColor: color,
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium z-10">
          {localizeNumber(commercializationScore.toString(), "ne")}% -{" "}
          {commercializationLevel} व्यावसायीकरण
        </div>
      </div>

      <div className="w-full max-w-md mt-4 flex justify-between text-xs text-muted-foreground">
        <span>कम व्यावसायिक</span>
        <span>अति व्यावसायिक</span>
      </div>

      <div className="mt-6 text-sm">
        <p className="text-center">
          व्यावसायीकरण स्कोर{" "}
          {localizeNumber(commercializationScore.toString(), "ne")}% (
          {commercializationLevel} व्यावसायीकरण स्तर)
        </p>
      </div>
    </div>
  );
}
