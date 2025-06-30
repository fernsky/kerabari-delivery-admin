"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";
import IrrigatedAreaPieChart from "./charts/irrigated-area-pie-chart";
import IrrigatedAreaBarChart from "./charts/irrigated-area-bar-chart";
import SustainabilityChart from "./charts/sustainability-chart";
import IrrigatedUnitDistributionChart from "./charts/irrigated-unit-distribution-chart";

interface IrrigatedAreaChartsProps {
  wardData: Array<{
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  }>;
  totalIrrigatedArea: number;
  totalUnirrigatedArea: number;
  totalArea: number;
  irrigatedPercentage: string;
  unirrigatedPercentage: string;
  irrigationSustainabilityScore: number;
}

export default function IrrigatedAreaCharts({
  wardData,
  totalIrrigatedArea,
  totalUnirrigatedArea,
  totalArea,
  irrigatedPercentage,
  unirrigatedPercentage,
  irrigationSustainabilityScore,
}: IrrigatedAreaChartsProps) {
  // Create data for pie chart
  const pieChartData = [
    {
      name: "सिंचित क्षेत्रफल",
      value: totalIrrigatedArea,
      percentage: irrigatedPercentage,
      color: "#3498db",
    },
    {
      name: "असिंचित क्षेत्रफल",
      value: totalUnirrigatedArea,
      percentage: unirrigatedPercentage,
      color: "#e74c3c",
    },
  ];

  // Create data for distribution visualization
  const distributionChartData = wardData.map((ward) => {
    return {
      name: `वडा ${ward.wardNumber}`,
      irrigated: ward.irrigatedArea,
      unirrigated: ward.unirrigatedArea,
    };
  });

  // Helper function to download chart data as CSV
  const downloadChartData = () => {
    const headers =
      "वडा नं.,सिंचित क्षेत्रफल (हेक्टर),असिंचित क्षेत्रफल (हेक्टर),कुल क्षेत्रफल (हेक्टर),सिंचित प्रतिशत\n";
    const csvData = wardData
      .map((ward) => {
        const irrigatedPercent =
          ward.totalArea > 0
            ? ((ward.irrigatedArea / ward.totalArea) * 100).toFixed(2)
            : "0";
        return `${ward.wardNumber},${ward.irrigatedArea.toFixed(2)},${ward.unirrigatedArea.toFixed(2)},${ward.totalArea.toFixed(2)},${irrigatedPercent}%`;
      })
      .join("\n");
    const total = `जम्मा,${totalIrrigatedArea.toFixed(2)},${totalUnirrigatedArea.toFixed(2)},${totalArea.toFixed(2)},${irrigatedPercentage}%`;

    const csvContent = `${headers}${csvData}\n${total}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "वडागत_सिंचित_क्षेत्रफल_डाटा.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Overall irrigated area distribution */}
      <div
        className="mb-12 mt-8 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Irrigated Area in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Ward-wise irrigated and unirrigated area in Khajura with a total area of ${totalArea.toFixed(2)} hectares`}
        />

        <div className="border-b px-4 py-3">
          <h3
            className="text-xl font-semibold"
            itemProp="headline"
            id="irrigation-coverage-analysis"
          >
            सिंचाई क्षेत्रफल विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल क्षेत्रफल: {localizeNumber(totalArea.toFixed(2), "ne")} हेक्टर
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              समग्र सिंचित र असिंचित क्षेत्रफल
            </h4>
            <div className="h-[350px]">
              <IrrigatedAreaPieChart pieChartData={pieChartData} />
            </div>
          </div>

          {/* Server-side pre-rendered table for SEO */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              समग्र सिंचाई अवस्था
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted sticky top-0">
                    <th className="border p-2 text-left">विवरण</th>
                    <th className="border p-2 text-right">
                      क्षेत्रफल (हेक्टर)
                    </th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">सिंचित क्षेत्रफल</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalIrrigatedArea.toFixed(2), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(irrigatedPercentage, "ne")}%
                    </td>
                  </tr>
                  <tr className="bg-muted/40">
                    <td className="border p-2">असिंचित क्षेत्रफल</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber(unirrigatedPercentage, "ne")}%
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-semibold bg-muted/70">
                    <td className="border p-2">जम्मा क्षेत्रफल</td>
                    <td className="border p-2 text-right">
                      {localizeNumber(totalArea.toFixed(2), "ne")}
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
                onClick={downloadChartData}
              >
                <FileDown className="h-4 w-4" />
                <span>डाउनलोड CSV</span>
              </Button>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium mb-4 text-center">
                सिंचाई प्रगति स्कोर
              </h4>
              <div className="p-4">
                <SustainabilityChart
                  sustainabilityScore={irrigationSustainabilityScore}
                  label="सिंचित क्षेत्रफल प्रतिशत"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                नोट: सिंचाई प्रगति स्कोर कुल क्षेत्रफलमा सिंचित क्षेत्रफलको
                अनुपातमा आधारित छ।
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            समग्र सिंचाई विश्लेषण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#3498db" }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate">सिंचित क्षेत्रफल</span>
                  <span className="font-medium">
                    {localizeNumber(irrigatedPercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${parseFloat(irrigatedPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#e74c3c" }}
              ></div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-sm truncate">असिंचित क्षेत्रफल</span>
                  <span className="font-medium">
                    {localizeNumber(unirrigatedPercentage, "ne")}%
                  </span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-red-500"
                    style={{ width: `${parseFloat(unirrigatedPercentage)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise Irrigated Area Distribution */}
      <div
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Irrigated and Unirrigated Area Distribution in Khajura"
        />
        <meta
          itemProp="description"
          content="Distribution of irrigated and unirrigated area across wards in Khajura Rural Municipality"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत सिंचित र असिंचित क्षेत्रफल विवरण
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडामा सिंचित र असिंचित क्षेत्रफलको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[450px]">
            <IrrigatedAreaBarChart data={distributionChartData} />
          </div>

          <div className="overflow-x-auto mt-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted sticky top-0">
                  <th className="border p-2 text-left">वडा नं.</th>
                  <th className="border p-2 text-right">
                    सिंचित क्षेत्रफल (हेक्टर)
                  </th>
                  <th className="border p-2 text-right">
                    असिंचित क्षेत्रफल (हेक्टर)
                  </th>
                  <th className="border p-2 text-right">
                    कुल क्षेत्रफल (हेक्टर)
                  </th>
                  <th className="border p-2 text-right">सिंचित क्षेत्रफल %</th>
                </tr>
              </thead>
              <tbody>
                {wardData.map((ward, index) => {
                  const irrigatedPercent =
                    ward.totalArea > 0
                      ? ((ward.irrigatedArea / ward.totalArea) * 100).toFixed(2)
                      : "0";

                  return (
                    <tr
                      key={ward.wardNumber}
                      className={index % 2 === 0 ? "bg-muted/40" : ""}
                    >
                      <td className="border p-2">
                        {localizeNumber(String(ward.wardNumber), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.irrigatedArea.toFixed(2), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.unirrigatedArea.toFixed(2), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(ward.totalArea.toFixed(2), "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(irrigatedPercent, "ne")}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-semibold bg-muted/70">
                  <td className="border p-2">जम्मा</td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalIrrigatedArea.toFixed(2), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(totalArea.toFixed(2), "ne")}
                  </td>
                  <td className="border p-2 text-right">
                    {localizeNumber(irrigatedPercentage, "ne")}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Ward-wise irrigated unit distribution */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत सिंचित एकाई वितरण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडामा सिंचित एकाई वितरणको अवस्था
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <IrrigatedUnitDistributionChart wardData={wardData} />
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            नोट: सिंचित एकाई भनेको कुल क्षेत्रफलको अनुपातमा सिंचित क्षेत्रफलको
            प्रतिशत हो।
          </p>
        </div>
      </div>

      {/* Additional statistics section */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडागत सिंचाईको समग्र तथ्याङ्क
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                कुल सिंचित क्षेत्रफल
              </h4>
              <p className="text-2xl font-bold">
                {localizeNumber(totalIrrigatedArea.toFixed(2), "ne")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">हेक्टर</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                सिंचित क्षेत्रफल प्रतिशत
              </h4>
              <p className="text-2xl font-bold">
                {localizeNumber(irrigatedPercentage, "ne")}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                कुल क्षेत्रफलको
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                सबैभन्दा बढी सिंचित वडा
              </h4>
              {wardData.length > 0 && (
                <>
                  <p className="text-2xl font-bold">
                    {localizeNumber(
                      String(
                        [...wardData].sort(
                          (a, b) => b.irrigatedArea - a.irrigatedArea,
                        )[0]?.wardNumber || 0,
                      ),
                      "ne",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {localizeNumber(
                      [...wardData]
                        .sort((a, b) => b.irrigatedArea - a.irrigatedArea)[0]
                        ?.irrigatedArea.toFixed(2) || "0.00",
                      "ne",
                    )}{" "}
                    हेक्टर
                  </p>
                </>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-center">
              <h4 className="text-sm text-muted-foreground mb-1">
                सबैभन्दा कम सिंचित वडा
              </h4>
              {wardData.length > 0 && (
                <>
                  <p className="text-2xl font-bold">
                    {localizeNumber(
                      String(
                        [...wardData].sort(
                          (a, b) => a.irrigatedArea - b.irrigatedArea,
                        )[0]?.wardNumber || 0,
                      ),
                      "ne",
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {localizeNumber(
                      [...wardData]
                        .sort((a, b) => a.irrigatedArea - b.irrigatedArea)[0]
                        ?.irrigatedArea.toFixed(2) || "0.00",
                      "ne",
                    )}{" "}
                    हेक्टर
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 px-4 py-3 bg-muted/30 rounded-lg text-sm">
            <h5 className="font-medium mb-2">तथ्याङ्क विश्लेषण सारांश</h5>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                केराबारी गाउँपालिकामा कुल क्षेत्रफलको{" "}
                {localizeNumber(irrigatedPercentage, "ne")}% सिंचित र{" "}
                {localizeNumber(unirrigatedPercentage, "ne")}% असिंचित रहेको
                अवस्था छ।
              </li>
              <li>
                वडागत विश्लेषण गर्दा सिंचित क्षेत्रफलको वितरण असमान रहेको छ,
                केही वडाहरूमा अधिक र केहीमा न्यून सिंचाई सुविधा उपलब्ध छ।
              </li>
              <li>
                वडा नं.{" "}
                {wardData.length > 0
                  ? localizeNumber(
                      String(
                        [...wardData].sort(
                          (a, b) => b.irrigatedArea - a.irrigatedArea,
                        )[0]?.wardNumber || 0,
                      ),
                      "ne",
                    )
                  : "0"}{" "}
                मा सबैभन्दा बढी सिंचित क्षेत्रफल र वडा नं.{" "}
                {wardData.length > 0
                  ? localizeNumber(
                      String(
                        [...wardData].sort(
                          (a, b) => a.irrigatedArea - b.irrigatedArea,
                        )[0]?.wardNumber || 0,
                      ),
                      "ne",
                    )
                  : "0"}{" "}
                मा सबैभन्दा कम सिंचित क्षेत्रफल रहेको छ।
              </li>
              <li>
                पालिकाले असिंचित क्षेत्रमा सिंचाई सुविधा विस्तार गर्न विशेष
                योजना तयार गर्नुपर्ने देखिन्छ।
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
