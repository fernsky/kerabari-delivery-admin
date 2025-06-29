"use client";

import { localizeNumber } from "@/lib/utils/localize-number";

interface TemperatureHeatmapChartProps {
  heatmapData: Array<{
    year: number;
    month: number;
    monthName: string;
    temperature: number;
    anomaly: number;
    category: 'very_cold' | 'cold' | 'normal' | 'warm' | 'very_warm' | 'hot';
  }>;
  temperatureRange: {
    min: number;
    max: number;
    mean: number;
  };
}

export default function TemperatureHeatmapChart({
  heatmapData,
  temperatureRange,
}: TemperatureHeatmapChartProps) {
  // Define temperature categories and colors
  const temperatureCategories = {
    very_cold: { name: "धेरै चिसो", color: "#1e3a8a", min: -Infinity, max: temperatureRange.mean - 2 },
    cold: { name: "चिसो", color: "#3b82f6", min: temperatureRange.mean - 2, max: temperatureRange.mean - 1 },
    normal: { name: "सामान्य", color: "#10b981", min: temperatureRange.mean - 1, max: temperatureRange.mean + 1 },
    warm: { name: "तातो", color: "#f59e0b", min: temperatureRange.mean + 1, max: temperatureRange.mean + 2 },
    very_warm: { name: "धेरै तातो", color: "#ef4444", min: temperatureRange.mean + 2, max: temperatureRange.mean + 3 },
    hot: { name: "गर्मी", color: "#7c2d12", min: temperatureRange.mean + 3, max: Infinity },
  };

  // Get unique years and months
  const years = Array.from(new Set(heatmapData.map(d => d.year))).sort();
  const months = Array.from(new Set(heatmapData.map(d => d.month))).sort();

  // Create month names
  const monthNames = [
    "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन",
    "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"
  ];

  // Get category color
  const getCategoryColor = (category: string) => {
    return temperatureCategories[category as keyof typeof temperatureCategories]?.color || "#6b7280";
  };

  // Get category name
  const getCategoryName = (category: string) => {
    return temperatureCategories[category as keyof typeof temperatureCategories]?.name || "अज्ञात";
  };

  // Calculate statistics
  const categoryStats = Object.keys(temperatureCategories).reduce((acc, category) => {
    const count = heatmapData.filter(d => d.category === category).length;
    const percentage = (count / heatmapData.length) * 100;
    acc[category] = { count, percentage };
    return acc;
  }, {} as Record<string, { count: number; percentage: number }>);

  return (
    <div className="space-y-6">
      {/* Heatmap */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">तापक्रम हिटम्याप विश्लेषण</h3>
        
        {/* Year-Month Heatmap */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Header with month names */}
            <div className="grid grid-cols-13 gap-1 mb-2">
              <div className="w-20 h-8"></div> {/* Empty corner */}
              {monthNames.map((month, index) => (
                <div key={index} className="w-20 h-8 flex items-center justify-center text-xs font-medium text-center">
                  {month}
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            {years.map((year) => (
              <div key={year} className="grid grid-cols-13 gap-1 mb-1">
                <div className="w-20 h-8 flex items-center justify-center text-sm font-medium">
                  {year}
                </div>
                {months.map((month) => {
                  const data = heatmapData.find(d => d.year === year && d.month === month);
                  if (!data) {
                    return <div key={month} className="w-20 h-8 bg-gray-100 border border-gray-200"></div>;
                  }
                  
                  return (
                    <div
                      key={month}
                      className="w-20 h-8 border border-gray-200 flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: getCategoryColor(data.category) }}
                      title={`${year} ${monthNames[month - 1]}: ${localizeNumber(data.temperature.toFixed(1), "ne")}°C (${getCategoryName(data.category)})`}
                    >
                      {localizeNumber(data.temperature.toFixed(0), "ne")}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">तापक्रम श्रेणीहरू</h4>
          <div className="flex flex-wrap gap-4">
            {Object.entries(temperatureCategories).map(([key, category]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({localizeNumber(categoryStats[key]?.percentage.toFixed(1) || "0", "ne")}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Temperature Category Distribution */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="text-lg font-medium mb-4">तापक्रम श्रेणी वितरण</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: getCategoryColor(category) }}
                ></div>
                <h4 className="font-medium">{getCategoryName(category)}</h4>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>महिना:</span>
                  <span className="font-medium">{localizeNumber(stats.count.toString(), "ne")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>प्रतिशत:</span>
                  <span className="font-medium">{localizeNumber(stats.percentage.toFixed(1), "ne")}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${stats.percentage}%`,
                      backgroundColor: getCategoryColor(category),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature Range Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">न्यूनतम तापक्रम</h4>
          <p className="text-2xl font-bold text-blue-600">
            {localizeNumber(temperatureRange.min.toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">औसत तापक्रम</h4>
          <p className="text-2xl font-bold">
            {localizeNumber(temperatureRange.mean.toFixed(1), "ne")}°C
          </p>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <h4 className="text-sm font-medium text-muted-foreground">अधिकतम तापक्रम</h4>
          <p className="text-2xl font-bold text-red-600">
            {localizeNumber(temperatureRange.max.toFixed(1), "ne")}°C
          </p>
        </div>
      </div>
    </div>
  );
} 