import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import TrainedPopulationBarChart from "./charts/trained-population-bar-chart";
import TrainedPopulationPieChart from "./charts/trained-population-pie-chart";
import TrainedPopulationComparison from "./charts/trained-population-comparison";

interface TrainedPopulationChartsProps {
  trainedPopulationData: Array<{
    id?: string;
    wardNumber: number;
    trainedPopulation: number;
  }>;
  barChartData: Array<{
    ward: string;
    trainedPopulation: number;
  }>;
  wardNumbers: number[];
  totalTrainedPopulation: number;
}

export default function TrainedPopulationCharts({
  trainedPopulationData,
  barChartData,
  wardNumbers,
  totalTrainedPopulation,
}: TrainedPopulationChartsProps) {
  // Calculate percentage data for pie chart
  const pieChartData = trainedPopulationData.map((item) => ({
    name: `वडा ${item.wardNumber}`,
    value: item.trainedPopulation,
    percentage: (
      (item.trainedPopulation / totalTrainedPopulation) *
      100
    ).toFixed(2),
  }));

  return (
    <>
      {/* Overall trained population distribution - with pre-rendered table and client-side chart */}
      <div className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            तालिम प्राप्त जनसंख्या वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल तालिम प्राप्त जनसंख्या:{" "}
            {totalTrainedPopulation.toLocaleString()} व्यक्ति
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side bar chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">दण्ड चित्र</h4>
            <div className="h-[400px]">
              <TrainedPopulationBarChart barChartData={barChartData} />
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
                    <th className="border p-2 text-left">वडा नम्बर</th>
                    <th className="border p-2 text-right">
                      तालिम प्राप्त जनसंख्या
                    </th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {trainedPopulationData.map((item, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2">वडा {item.wardNumber}</td>
                      <td className="border p-2 text-right">
                        {item.trainedPopulation.toLocaleString()}
                      </td>
                      <td className="border p-2 text-right">
                        {(
                          (item.trainedPopulation / totalTrainedPopulation) *
                          100
                        ).toFixed(2)}
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
                      {totalTrainedPopulation.toLocaleString()}
                    </td>
                    <td className="border p-2 text-right">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Excel डाउनलोड
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ward-wise pie chart visualization */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडा अनुसार तालिम प्राप्त जनसंख्या
          </h3>
          <p className="text-sm text-muted-foreground">
            प्रत्येक वडामा तालिम प्राप्त जनसंख्याको अनुपात
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[400px]">
              <TrainedPopulationPieChart pieChartData={pieChartData} />
            </div>
          </div>

          {/* Top 3 wards comparison */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">
              शीर्ष वडाहरू
            </h4>
            <div className="h-[400px]">
              <TrainedPopulationComparison
                trainedPopulationData={trainedPopulationData}
                totalTrainedPopulation={totalTrainedPopulation}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ward performance metrics */}
      <div className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card">
        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold">
            वडागत तालिम प्राप्त जनसंख्या मेट्रिक्स
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार तालिम प्राप्त जनसंख्याको तुलनात्मक विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trainedPopulationData.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <h5 className="font-semibold mb-1 text-lg">
                  वडा {item.wardNumber}
                </h5>
                <p className="text-xl font-bold text-primary">
                  {item.trainedPopulation.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  कुल तालिम प्राप्त जनसंख्याको{" "}
                  {(
                    (item.trainedPopulation / totalTrainedPopulation) *
                    100
                  ).toFixed(1)}
                  %
                </p>
                <div className="w-full mt-2 bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(item.trainedPopulation / trainedPopulationData[0].trainedPopulation) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
