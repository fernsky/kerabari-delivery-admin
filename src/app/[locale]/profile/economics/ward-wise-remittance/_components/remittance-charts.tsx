"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import RemittancePieChart from "./charts/remittance-pie-chart";
import RemittanceBarChart from "./charts/remittance-bar-chart2";
import WardRemittanceDistributionCharts from "./charts/ward-remittance-distribution-charts2";
import { localizeNumber } from "@/lib/utils/localize-number";
import RemittanceLevelDistributionChart from "./charts/remittance-level-distribution-chart";
import RemittanceRangeBarChart from "./charts/remittance-range-bar-chart2";
import RemittanceImpactChart from "./charts/remittance-impact-chart2";

interface RemittanceChartsProps {
  overallSummary: Array<{
    amountGroup: string;
    amountGroupLabel: string;
    sendingPopulation: number;
    color: string;
  }>;
  totalSendingPopulation: number;
  pieChartData: Array<{
    name: string;
    value: number;
    percentage: string;
    amountGroup: string;
    color: string;
  }>;
  wardWiseData: Array<Record<string, any>>;
  wardNumbers: number[];
  remittanceData: Array<{
    id?: string;
    wardNumber: number;
    amountGroup: string;
    sendingPopulation: number;
  }>;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalSendingPopulation: number;
    mostCommonAmountGroup: string;
    mostCommonAmountGroupLabel: string;
    mostCommonCount: number;
    mostCommonPercentage: string;
    highRemittanceSendingPopulation: number;
    highRemittancePercentage: string;
    lowRemittanceSendingPopulation: number;
    lowRemittancePercentage: string;
    mediumRemittanceSendingPopulation: number;
    mediumRemittancePercentage: string;
    veryHighRemittanceSendingPopulation: number;
    veryHighRemittancePercentage: string;
    averageRemittance: number;
    estimatedAnnualRemittance: number;
    prosperityIndex: number;
  }>;
  remittanceLevelData: Array<{
    level: string;
    levelLabel: string;
    population: number;
    percentage: string;
    color: string;
  }>;
  remittanceRangeData: Array<{
    name: string;
    value: number;
    amountGroup: string;
    label: string;
    percentage: string;
    color: string;
  }>;
  AMOUNT_RANGE_MAP: Record<
    string,
    { min: number; max: number | null; color: string; label: string }
  >;
  remittanceAmountGroupOptions: Array<{
    value: string;
    label: string;
  }>;
  totalData: {
    totalSendingPopulation: number;
    highRemittanceSendingPopulation: number;
    highRemittancePercentage: string;
    mediumRemittanceSendingPopulation: number;
    mediumRemittancePercentage: string;
    lowRemittanceSendingPopulation: number;
    lowRemittancePercentage: string;
    veryHighRemittanceSendingPopulation: number;
    veryHighRemittancePercentage: string;
    averageRemittance: number;
    totalEstimatedRemittance: number;
    estimatedAnnualRemittanceCrores: string;
  };
}

export default function RemittanceCharts({
  overallSummary,
  totalSendingPopulation,
  pieChartData,
  wardWiseData,
  wardNumbers,
  remittanceData,
  wardWiseAnalysis,
  remittanceLevelData,
  remittanceRangeData,
  AMOUNT_RANGE_MAP,
  remittanceAmountGroupOptions,
  totalData,
}: RemittanceChartsProps) {
  const downloadCSV = () => {
    // Create CSV header
    const header = [
      "वडा नम्बर",
      ...remittanceAmountGroupOptions.map((option) => option.label),
      "कुल",
    ];

    // Create CSV rows
    const rows = wardWiseAnalysis.map((ward) => {
      const row = [ward.wardNumber];

      // Add data for each amount group
      remittanceAmountGroupOptions.forEach((option) => {
        const item = remittanceData.find(
          (d) =>
            d.wardNumber === ward.wardNumber && d.amountGroup === option.value,
        );
        row.push(item ? item.sendingPopulation : 0);
      });

      // Add total for this ward
      row.push(ward.totalSendingPopulation);

      return row;
    });

    // Add a summary row
    const summaryRow = ["जम्मा"];
    remittanceAmountGroupOptions.forEach((option) => {
      const sum = remittanceData
        .filter((d) => d.amountGroup === option.value)
        .reduce((acc, curr) => acc + curr.sendingPopulation, 0);
      summaryRow.push(sum.toString());
    });
    summaryRow.push(totalSendingPopulation.toString());

    rows.push(summaryRow as unknown as number[]);

    // Convert to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((row) => row.join(",")).join("\n");

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "वडा_अनुसार_रेमिट्यान्स_वितरण.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Overall remittance distribution - with pre-rendered table and client-side chart */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Remittance Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Remittance distribution data with a total of ${totalSendingPopulation} people sending remittance`}
        />

        <div className="border-b px-4 py-3">
          <div className="flex flex-wrap justify-between items-center">
            <h3
              className="text-xl font-semibold"
              itemProp="headline"
              id="remittance-categorization"
            >
              रेमिट्यान्स रकम अनुसार वितरण
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="hidden md:flex items-center gap-1"
              onClick={downloadCSV}
            >
              <FileDown className="h-4 w-4" />
              <span>डाउनलोड CSV</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            कुल रेमिट्यान्स पठाउने जनसंख्या:{" "}
            {localizeNumber(totalSendingPopulation.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[580px]">
              <RemittancePieChart
                pieChartData={pieChartData}
                AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
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
                    <th className="border p-2 text-left">
                      रेमिट्यान्स रकम समूह
                    </th>
                    <th className="border p-2 text-right">जनसंख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {overallSummary.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">
                        {localizeNumber(i + 1, "ne")}
                      </td>
                      <td className="border p-2">{item.amountGroupLabel}</td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          item.sendingPopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(
                          (
                            (item.sendingPopulation / totalSendingPopulation) *
                            100
                          ).toFixed(2),
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
                      {localizeNumber(
                        totalSendingPopulation.toLocaleString(),
                        "ne",
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {localizeNumber("100.00", "ne")}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="md:hidden mt-4">
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={downloadCSV}
              >
                <FileDown className="h-4 w-4 mr-2" />
                <span>डाउनलोड CSV</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            रेमिट्यान्स रकम समूह अनुसार वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overallSummary.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="text-sm truncate">
                      {item.amountGroupLabel.length > 15
                        ? `${item.amountGroupLabel.substring(0, 15)}...`
                        : item.amountGroupLabel}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        (
                          (item.sendingPopulation / totalSendingPopulation) *
                          100
                        ).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.sendingPopulation / totalSendingPopulation) * 100}%`,
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

      {/* Remittance Range Bar Chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" id="ward-wise-remittance">
            रेमिट्यान्स रकम श्रेणी अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न रकम श्रेणीमा रेमिट्यान्स पठाउने जनसंख्याको वितरण
          </p>
        </div>

        <div className="p-4">
          <div className="h-[400px]">
            <RemittanceRangeBarChart
              remittanceRangeData={remittanceRangeData}
            />
          </div>
        </div>
      </div>

      {/* Remittance Level Distribution Chart */}
      {/* <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            रेमिट्यान्स स्तर अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            न्यून, मध्यम, उच्च र अत्यधिक रेमिट्यान्स स्तरमा वितरण
          </p>
        </div>

        <div className="p-4">
          <div className="h-[400px]">
            <RemittanceLevelDistributionChart
              remittanceLevelData={remittanceLevelData}
            />
          </div>
        </div>
      </div> */}

      {/* Ward-wise distribution - pre-rendered table with client-side chart */}
      {/* <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार रेमिट्यान्स वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा र रेमिट्यान्स रकम समूह अनुसार वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <RemittanceBarChart
              wardWiseData={wardWiseData}
              remittanceAmountGroupOptions={remittanceAmountGroupOptions}
              AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
            />
          </div>
        </div>
      </div> */}

      {/* Remittance Impact Chart */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडागत अनुमानित रेमिट्यान्स प्रवाह
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडामा पठाइने वार्षिक अनुमानित रेमिट्यान्स रकम
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <RemittanceImpactChart
              wardWiseAnalysis={wardWiseAnalysis}
              totalSendingPopulation={totalSendingPopulation}
              totalEstimatedRemittance={totalData.totalEstimatedRemittance}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise pie charts */}
      {/* <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">वडागत रेमिट्यान्स विश्लेषण</h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडाको रेमिट्यान्स वितरणको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <WardRemittanceDistributionCharts
            wardNumbers={wardNumbers}
            remittanceData={remittanceData}
            AMOUNT_RANGE_MAP={AMOUNT_RANGE_MAP}
            remittanceAmountGroupOptions={remittanceAmountGroupOptions}
          />
        </div>
      </div> */}
    </>
  );
}
