import { localizeNumber } from "@/lib/utils/localize-number";
import DeliveryPlacePieChart from "./charts/delivery-place-pie-chart";
import DeliveryPlaceBarChart from "./charts/delivery-place-bar-chart";
import DeliveryPlaceComparisonChart from "./charts/delivery-place-comparison-chart";
import WardDeliveryPlacePieCharts from "./charts/ward-delivery-place-pie-charts";

interface WardWiseDeliveryPlaceChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  totalDeliveries: number;
  deliveryCategoryTotals: Record<string, number>;
  placeMap: Record<string, string>;
  deliveryCategoryPercentages: Record<string, number>;
  wardInstitutionalPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestWard: {
    wardNumber: number;
    percentage: number;
  };
  worstWard: {
    wardNumber: number;
    percentage: number;
  };
  DELIVERY_PLACE_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  institutionalDeliveryIndex: number;
}

export default function WardWiseDeliveryPlaceCharts({
  pieChartData,
  wardWiseData,
  totalDeliveries,
  deliveryCategoryTotals,
  placeMap,
  deliveryCategoryPercentages,
  wardInstitutionalPercentages,
  bestWard,
  worstWard,
  DELIVERY_PLACE_CATEGORIES,
  institutionalDeliveryIndex,
}: WardWiseDeliveryPlaceChartsProps) {
  return (
    <>
      {/* Overall delivery place distribution */}
      <div
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Delivery Place Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of childbirth places with a total of ${totalDeliveries} deliveries`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            प्रसूती स्थान अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल प्रसूती:{" "}
            {localizeNumber(totalDeliveries.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">पाई चार्ट</h4>
            <div className="h-[420px]">
              <DeliveryPlacePieChart
                pieChartData={pieChartData}
                DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
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
                    <th className="border p-2 text-left">प्रसूती स्थान</th>
                    <th className="border p-2 text-right">संख्या</th>
                    <th className="border p-2 text-right">प्रतिशत</th>
                  </tr>
                </thead>
                <tbody>
                  {pieChartData.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-muted/40" : ""}
                    >
                      <td className="border p-2">
                        {localizeNumber((index + 1).toString(), "ne")}
                      </td>
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
                      {localizeNumber(totalDeliveries.toLocaleString(), "ne")}
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

        <div className="p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            प्रसूती स्थान विवरण
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
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">
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
        id="ward-wise-delivery-places"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Delivery Places in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of childbirth locations across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार प्रसूती स्थान
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार प्रसूती स्थानको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <DeliveryPlaceBarChart
              wardWiseData={wardWiseData}
              DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
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
          content="Institutional Delivery Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of institutional delivery rates across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत संस्थागत प्रसूती दर
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा संस्थागत प्रसूती दरको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <DeliveryPlaceComparisonChart
              wardInstitutionalPercentages={wardInstitutionalPercentages}
              bestWard={bestWard}
              worstWard={worstWard}
              DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
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
          content="Ward-wise Delivery Place Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of childbirth locations by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत प्रसूती स्थान विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार प्रसूती स्थानको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">जम्मा प्रसूती</th>
                  {Object.keys(DELIVERY_PLACE_CATEGORIES).map((key) => (
                    <th key={key} className="border p-2 text-right">
                      {
                        DELIVERY_PLACE_CATEGORIES[
                          key as keyof typeof DELIVERY_PLACE_CATEGORIES
                        ].name
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {wardWiseData.map((item, i) => {
                  const total = item.total;
                  return (
                    <tr key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="border p-2">
                        वडा {localizeNumber(item.wardNumber, "ne")}
                      </td>
                      <td className="border p-2 text-right">
                        {localizeNumber(total.toLocaleString(), "ne")}
                      </td>
                      {Object.keys(DELIVERY_PLACE_CATEGORIES).map((key) => {
                        const placeName =
                          DELIVERY_PLACE_CATEGORIES[
                            key as keyof typeof DELIVERY_PLACE_CATEGORIES
                          ].name;
                        const value = item[placeName] || 0;
                        const percentage =
                          total > 0
                            ? ((value / total) * 100).toFixed(2)
                            : "0.00";
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
                    {localizeNumber(totalDeliveries.toLocaleString(), "ne")}
                  </td>
                  {Object.keys(DELIVERY_PLACE_CATEGORIES).map((key) => {
                    const value = deliveryCategoryTotals[key];
                    const percentage =
                      deliveryCategoryPercentages[key].toFixed(2);
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
          <h4 className="text-lg font-medium mt-8 mb-4">
            वडागत प्रसूती स्थानको वितरण
          </h4>
          <WardDeliveryPlacePieCharts
            wardWiseData={wardWiseData}
            DELIVERY_PLACE_CATEGORIES={DELIVERY_PLACE_CATEGORIES}
          />
        </div>
      </div>
    </>
  );
}
