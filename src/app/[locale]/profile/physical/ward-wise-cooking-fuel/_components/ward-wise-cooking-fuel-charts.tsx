import { localizeNumber } from "@/lib/utils/localize-number";
import CookingFuelPieChart from "./charts/cooking-fuel-pie-chart";
import CookingFuelBarChart from "./charts/cooking-fuel-bar-chart";
import CookingFuelComparisonChart from "./charts/cooking-fuel-comparison-chart";
import WardCookingFuelPieCharts from "./charts/ward-cooking-fuel-pie-charts";

interface WardWiseCookingFuelChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalHouseholds: number;
  fuelTypeTotals: Record<string, number>;
  fuelMap: Record<string, string>;
  fuelTypePercentages: Record<string, number>;
  wardCleanFuelPercentages: Array<{
    wardNumber: number;
    percentage: number;
    households: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
    households: number;
  };
  COOKING_FUEL_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  cleanFuelIndex: number;
  cleanFuels: string[];
  traditionalFuels: string[];
  cleanFuelPercentage: number;
}

export default function WardWiseCookingFuelCharts({
  pieChartData,
  wardWiseData,
  totalHouseholds,
  fuelTypeTotals,
  fuelMap,
  fuelTypePercentages,
  wardCleanFuelPercentages,
  bestWard,
  worstWard,
  COOKING_FUEL_CATEGORIES,
  cleanFuelIndex,
  cleanFuels,
  traditionalFuels,
  cleanFuelPercentage,
}: WardWiseCookingFuelChartsProps) {
  // Calculate fuel categories by type for grouping in visualizations
  const categorizedFuels = {
    clean: {
      name: "स्वच्छ इन्धन",
      nameEn: "Clean Fuels",
      types: cleanFuels,
      percentage: cleanFuelPercentage,
      total: cleanFuels.reduce((sum, fuel) => sum + (fuelTypeTotals[fuel] || 0), 0),
      color: "#34A853", // Green
    },
    traditional: {
      name: "परम्परागत इन्धन",
      nameEn: "Traditional Fuels",
      types: traditionalFuels,
      percentage: traditionalFuels.reduce((sum, fuel) => sum + (fuelTypePercentages[fuel] || 0), 0),
      total: traditionalFuels.reduce((sum, fuel) => sum + (fuelTypeTotals[fuel] || 0), 0),
      color: "#A52A2A", // Brown
    },
    other: {
      name: "अन्य इन्धन",
      nameEn: "Other Fuels",
      types: ["KEROSENE", "OTHER"],
      percentage: (fuelTypePercentages.KEROSENE || 0) + (fuelTypePercentages.OTHER || 0),
      total: (fuelTypeTotals.KEROSENE || 0) + (fuelTypeTotals.OTHER || 0),
      color: "#757575", // Gray
    },
  };

  return (
    <>
      {/* Overall cooking fuel distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Cooking Fuel Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of cooking fuel types with a total of ${totalHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खाना पकाउने इन्धन अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल घरधुरी: {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <CookingFuelPieChart
                pieChartData={pieChartData}
                COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">तालिका</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">खाना पकाउने इन्धनको प्रकार</th>
                    <th className="border p-2 text-right">घरधुरी</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{localizeNumber((index + 1).toString(), "ne")}</td>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.value.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.percentage, "ne")}%
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2" colSpan={2}>
                      जम्मा
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            खाना पकाउने इन्धनको वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage, "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${parseFloat(item.percentage)}%`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-cooking-fuel-usage"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Cooking Fuel Usage in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of cooking fuel types across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार खाना पकाउने इन्धनको प्रयोग
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न प्रकारको खाना पकाउने इन्धनको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <CookingFuelBarChart
              wardWiseData={wardWiseData}
              COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Clean Cooking Fuel Usage Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of clean cooking fuel usage across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत स्वच्छ इन्धन प्रयोग
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा स्वच्छ इन्धन (एल.पी. ग्याँस, विद्युत, बायोग्यास) प्रयोग गर्ने घरधुरीको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <CookingFuelComparisonChart
              wardCleanFuelPercentages={wardCleanFuelPercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
              cleanFuelPercentage={cleanFuelPercentage}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise analysis */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Cooking Fuel Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of cooking fuel usage by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत खाना पकाउने इन्धनको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार खाना पकाउने इन्धनको प्रयोगको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा घरधुरी</th>
                  {Object.keys(COOKING_FUEL_CATEGORIES).map(key => (
                    <th key={key} className="border p-2 text-right">
                      {COOKING_FUEL_CATEGORIES[key as keyof typeof COOKING_FUEL_CATEGORIES].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">वडा {localizeNumber(item.wardNumber, "ne")}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(COOKING_FUEL_CATEGORIES).map(key => {
                        const fuelName = COOKING_FUEL_CATEGORIES[key as keyof typeof COOKING_FUEL_CATEGORIES].name;
                        const value = item[fuelName] || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
                        return (
                          <td key={key} className="border p-2 text-right">
                            {localizeNumber(value.toLocaleString(), "ne")}
                            <div className="text-xs text-muted-foreground">
                              ({localizeNumber(percentage, "ne")}%)
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">पालिका जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalHouseholds.toLocaleString(), "ne")}
                  </td>
                  {Object.keys(COOKING_FUEL_CATEGORIES).map(key => {
                    const value = fuelTypeTotals[key] || 0;
                    const percentage = fuelTypePercentages[key]?.toFixed(2) || "0.00";
                    return (
                      <td key={key} className="border p-2 text-right">
                        {localizeNumber(value.toLocaleString(), "ne")}
                        <div className="text-xs">
                          ({localizeNumber(percentage, "ne")}%)
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत खाना पकाउने इन्धनको वितरण</h4>
          <WardCookingFuelPieCharts
            wardWiseData={wardWiseData}
            COOKING_FUEL_CATEGORIES={COOKING_FUEL_CATEGORIES}
          />
        </div>
      </div>
    </>
  );
}
