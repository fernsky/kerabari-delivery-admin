"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface LandSecurityChartProps {
  securityScore: number;
}

export default function LandSecurityChart({ securityScore }: LandSecurityChartProps) {
  // Determine color based on security score
  const getColor = (score: number) => {
    if (score >= 80) return "#2ecc71"; // Green for high security
    if (score >= 60) return "#27ae60"; // Darker green for good security
    if (score >= 40) return "#f39c12"; // Orange for medium security
    if (score >= 20) return "#e67e22"; // Dark orange for poor security
    return "#e74c3c"; // Red for very poor security
  };

  // Get security level label
  const getSecurityLevel = (score: number) => {
    if (score >= 80) return "अति उच्च";
    if (score >= 60) return "उच्च";
    if (score >= 40) return "मध्यम";
    if (score >= 20) return "न्यून";
    return "अति न्यून";
  };

  const color = getColor(securityScore);
  const securityLevel = getSecurityLevel(securityScore);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{
            width: `${securityScore}%`,
            backgroundColor: color,
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-medium z-10">
          {localizeNumber(securityScore.toString(), "ne")}% - {securityLevel} सुरक्षा
        </div>
      </div>
      
      <div className="w-full max-w-md mt-4 flex justify-between text-xs text-muted-foreground">
        <span>अति न्यून सुरक्षा</span>
        <span>अति उच्च सुरक्षा</span>
      </div>
      
      <div className="mt-6 text-sm">
        <p className="text-center">
          जग्गा सुरक्षा स्कोर {localizeNumber(securityScore.toString(), "ne")}% ({securityLevel} सुरक्षा स्तर)
        </p>
      </div>
    </div>
  );
}
