"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import FoodCropPieChart from "./charts/food-crop-pie-chart";
import FoodCropBarChart from "./charts/food-crop-bar-chart";
import { localizeNumber } from "@/lib/utils/localize-number";
import CommercializationChart from "./charts/commercialization-chart";
import ProductionSalesDistributionChart from "./charts/production-sales-distribution-chart";

interface FoodCropChartsProps {
  overallSummary: Array<{
    type: string;
    typeName: string;
    production: number;
    sales: number;
    revenue: number;
  }>;
  totalProduction: number;
  totalSales: number;
  totalRevenue: number;
  productionPieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  revenuePieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  FOOD_CROP_TYPES: Record<string, string>;
  FOOD_CROP_COLORS: Record<string, string>;
  foodCropAnalysis: {
    totalProduction: number;
    totalSales: number;
    totalRevenue: number;
    productionSalesRatio: number;
    averagePricePerKg: number;
    commercializationScore: number;
  };
  soldPercentage: string;
  selfConsumptionPercentage: string;
  commercializationScore: number;
}

export default function FoodCropCharts({
  overallSummary,
  totalProduction,
  totalSales,
  totalRevenue,
  productionPieChartData,
  revenuePieChartData,
  FOOD_CROP_TYPES,
  FOOD_CROP_COLORS,
  foodCropAnalysis,
  soldPercentage,
  selfConsumptionPercentage,
  commercializationScore,
}: FoodCropChartsProps) {
  // Create data for distribution visualization (production vs sales)
  const productionSalesData = overallSummary
    .slice(0, 5) // Take top 5 crops for better visualization
    .map((item) => ({
      name: item.typeName,
      production: item.production,
      sales: item.sales,
      selfConsumption: item.production - item.sales,
      percentageSold:
        item.production > 0 ? (item.sales / item.production) * 100 : 0,
    }));

  // Create data for year-wise trend analysis (example data)
  const trendData = [
    {
      name: "२०७५",
      paddy: totalProduction * 0.7,
      corn: totalProduction * 0.2,
      wheat: totalProduction * 0.05,
      other: totalProduction * 0.05,
    },
    {
      name: "२०७६",
      paddy: totalProduction * 0.75,
      corn: totalProduction * 0.18,
      wheat: totalProduction * 0.04,
      other: totalProduction * 0.03,
    },
    {
      name: "२०७७",
      paddy: totalProduction * 0.8,
      corn: totalProduction * 0.15,
      wheat: totalProduction * 0.03,
      other: totalProduction * 0.02,
    },
    {
      name: "२०७८",
      paddy: totalProduction * 0.85,
      corn: totalProduction * 0.11,
      wheat: totalProduction * 0.02,
      other: totalProduction * 0.02,
    },
    {
      name: "२०७९",
      paddy: totalProduction * 0.78,
      corn: totalProduction * 0.17,
      wheat: totalProduction * 0.03,
      other: totalProduction * 0.02,
    },
  ];

  // Helper function to download chart data as CSV
  const downloadProductionData = () => {
    const headers =
      "खाद्यान्न बाली,उत्पादन (मेट्रिक टन),बिक्री (मेट्रिक टन),आम्दानी (रु),प्रतिशत\n";
    const csvData = overallSummary
      .map(
        (item) =>
          `${item.typeName},` +
          `${item.production.toFixed(2)},` +
          `${item.sales.toFixed(2)},` +
          `${item.revenue.toFixed(2)},` +
          `${((item.production / totalProduction) * 100).toFixed(2)}%`,
      )
      .join("\n");
    const total = `जम्मा,${totalProduction.toFixed(2)},${totalSales.toFixed(2)},${totalRevenue.toFixed(2)},100%`;

    const csvContent = `${headers}${csvData}\n${total}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "खाद्यान्न_बाली_डाटा.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Overall food crop distribution - with pre-rendered table and client-side chart */}
      <div
        className="mb-12 mt-8 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
        id="production-and-sales"
      >
        <meta
          itemProp="name"
          content="Food Crop Types in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Food crop production and sales statistics with a total production of ${totalProduction.toFixed(
            2,
          )} tonnes`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            खाद्यान्न बालीको उत्पादन र बिक्री
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल उत्पादन: {localizeNumber(totalProduction.toFixed(2), "ne")}{" "}
            मेट्रिक टन | कुल बिक्री:{" "}
            {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              उत्पादन अनुपात चार्ट
            </h4>
            <div className="h-[600px]">
              <FoodCropPieChart
                pieChartData={productionPieChartData}
                FOOD_CROP_TYPES={FOOD_CROP_TYPES}
                FOOD_CROP_COLORS={FOOD_CROP_COLORS}
                dataType="उत्पादन"
                unit="मेट्रिक टन"
              />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              खाद्यान्न बाली तथ्याङ्क तालिका
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">खाद्यान्न बाली</th>
                    <th className="border p-2 text-right">
                      उत्पादन (मेट्रिक टन)
                    </th>
                    <th className="border p-2 text-right">
                      बिक्री (मेट्रिक टन)
                    </th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">{item.typeName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.production.toFixed(2), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.sales.toFixed(2), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.production / totalProduction) * 100).toFixed(
                            2,
                          ),
                          "ne",
                        )}
                        %
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
                      {localizeNumber(totalProduction.toFixed(2), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalSales.toFixed(2), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={downloadProductionData}
              >
                <FileDown className="h-4 w-4" />
                <span>डाउनलोड CSV</span>
              </Button>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-center">
                व्यावसायीकरण स्कोर
              </h4>
              <div className="p-4">
                <CommercializationChart
                  commercializationScore={commercializationScore}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                नोट: व्यावसायीकरण स्कोर कुल उत्पादनको तुलनामा बिक्री अनुपातमा
                आधारित छ।
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            खाद्यान्न बाली विवरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      FOOD_CROP_COLORS[
                        item.type as keyof typeof FOOD_CROP_COLORS
                      ] || "#888",
                  }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">{item.typeName}</span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.production / totalProduction) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.production / totalProduction) * 100}%`,
                        backgroundColor:
                          FOOD_CROP_COLORS[
                            item.type as keyof typeof FOOD_CROP_COLORS
                          ] || "#888",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production vs sales distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="economic-impact"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Food Crop Production vs Sales Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of production and sales of food crops in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            उत्पादन र बिक्री विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            उत्पादन, बिक्री र आन्तरिक उपभोगको अनुपात
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <ProductionSalesDistributionChart
              productionSalesData={productionSalesData}
              totalProduction={totalProduction}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">बिक्रीका लागि उत्पादन</h5>
              <p className="text-sm text-muted-foreground mb-2">
                बजारमा बिक्री भएको खाद्यान्न बाली
              </p>
              <div className="flex justify-between items-center">
                <span>
                  {localizeNumber(totalSales.toFixed(2), "ne")} मेट्रिक टन
                </span>
                <span className="font-medium">
                  {localizeNumber(soldPercentage, "ne")}%
                </span>
              </div>
              <div className="w-full bg-background h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${parseFloat(soldPercentage)}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h5 className="font-medium mb-2">आन्तरिक उपभोग</h5>
              <p className="text-sm text-muted-foreground mb-2">
                स्थानीय उपभोगमा प्रयोग भएको खाद्यान्न
              </p>
              <div className="flex justify-between items-center">
                <span>
                  {localizeNumber(
                    (totalProduction - totalSales).toFixed(2),
                    "ne",
                  )}{" "}
                  मेट्रिक टन
                </span>
                <span className="font-medium">
                  {localizeNumber(selfConsumptionPercentage, "ne")}%
                </span>
              </div>
              <div className="w-full bg-background h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{ width: `${parseFloat(selfConsumptionPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue distribution */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            खाद्यान्न बालीबाट प्राप्त आम्दानी
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न खाद्यान्न बालीको बिक्रीबाट प्राप्त आम्दानी
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="h-[400px]">
            <FoodCropPieChart
              pieChartData={revenuePieChartData}
              FOOD_CROP_TYPES={FOOD_CROP_TYPES}
              FOOD_CROP_COLORS={FOOD_CROP_COLORS}
              dataType="आम्दानी"
              unit="रुपैयाँ"
              isRevenue
            />
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4 text-center">
              आम्दानी तालिका
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">क्र.सं.</th>
                    <th className="border p-2 text-left">खाद्यान्न बाली</th>
                    <th className="border p-2 text-right">आम्दानी (रु.)</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">{item.typeName}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(item.revenue.toLocaleString(), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          ((item.revenue / totalRevenue) * 100).toFixed(2),
                          "ne",
                        )}
                        %
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
                      {localizeNumber(totalRevenue.toLocaleString(), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h5 className="font-medium mb-2">मूल्य विश्लेषण</h5>
              <ul className="space-y-1.5">
                <li className="flex justify-between">
                  <span>औसत बिक्री मूल्य (प्रति के.जी.)</span>
                  <span className="font-medium">
                    रु.{" "}
                    {localizeNumber(
                      foodCropAnalysis.averagePricePerKg.toFixed(2),
                      "ne",
                    )}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>कुल उत्पादन मूल्य (अनुमानित)</span>
                  <span className="font-medium">
                    रु.{" "}
                    {localizeNumber(
                      (
                        totalProduction *
                        1000 *
                        foodCropAnalysis.averagePricePerKg
                      ).toLocaleString(),
                      "ne",
                    )}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>वास्तविक प्राप्त आम्दानी</span>
                  <span className="font-medium">
                    रु. {localizeNumber(totalRevenue.toLocaleString(), "ne")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Food crop trends - example visualization */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">खाद्यान्न बालीको प्रवृत्ति</h3>
          <p className="text-sm text-muted-foreground">
            पछिल्लो ५ वर्षको खाद्यान्न बाली उत्पादन प्रवृत्ति (अनुमानित)
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <FoodCropBarChart data={trendData} />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            नोट: यो प्रवृत्ति विश्लेषण अनुमानित तथ्याङ्कमा आधारित छ। वास्तविक
            तथ्याङ्क फरक हुन सक्नेछ।
          </p>
        </div>
      </div>

      {/* Additional statistics section */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            खाद्यान्न बालीको समग्र तथ्याङ्क
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                कुल उत्पादन
              </h4>
              <p className="text-2xl font-bold">
                {localizeNumber(totalProduction.toFixed(2), "ne")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">मेट्रिक टन</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">कुल बिक्री</h4>
              <p className="text-2xl font-bold">
                {localizeNumber(totalSales.toFixed(2), "ne")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">मेट्रिक टन</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                कुल आम्दानी
              </h4>
              <p className="text-lg font-bold">
                रु. {localizeNumber((totalRevenue / 1000000).toFixed(2), "ne")}{" "}
                मिलियन
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                बिक्रीबाट प्राप्त राजस्व
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                व्यावसायीकरण दर
              </h4>
              <p className="text-2xl font-bold">
                {localizeNumber(commercializationScore.toString(), "ne")}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                बिक्री/उत्पादन अनुपात
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
