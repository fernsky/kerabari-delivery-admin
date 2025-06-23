import { localizeNumber } from "@/lib/utils/localize-number";
import FacilitiesPieChart from "./charts/facilities-pie-chart";
import FacilitiesBarChart from "./charts/facilities-bar-chart";
import DigitalAccessComparisonChart from "./charts/digital-access-comparison-chart";
import WardFacilitiesPieCharts from "./charts/ward-facilities-pie-charts";
import FacilityCategoryComparisonChart from "./charts/facility-category-comparison-chart";

interface WardWiseFacilitiesChartsProps {
  pieChartData: Array<{
    name: string;
    nameEn: string;
    value: number;
    percentage: string;
    color: string;
  }>;
  wardWiseData: Array<any>;
  approximateUniqueHouseholds: number;
  facilityTypeTotals: Record<string, number>;
  facilityMap: Record<string, string>;
  facilityTypePercentages: Record<string, number>;
  wardDigitalAccess: Array<{
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  }>;
  bestDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  worstDigitalWard: {
    wardNumber: number;
    score: number;
    internetPercentage: number;
    computerPercentage: number;
    mobilePercentage: number;
  };
  FACILITY_CATEGORIES: Record<string, {
    name: string;
    nameEn: string;
    color: string;
  }>;
  digitalAccessIndex: number;
  categoryStats: Record<string, {
    total: number;
    percentage: number;
  }>;
}

export default function WardWiseFacilitiesCharts({
  pieChartData,
  wardWiseData,
  approximateUniqueHouseholds,
  facilityTypeTotals,
  facilityMap,
  facilityTypePercentages,
  wardDigitalAccess,
  bestDigitalWard,
  worstDigitalWard,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
  categoryStats,
}: WardWiseFacilitiesChartsProps) {
  // Prepare facility categories for grouped analysis
  const facilityCategoriesGrouped = {
    communication: {
      name: "सञ्चार उपकरणहरू",
      nameEn: "Communication Devices",
      types: ["MOBILE_PHONE", "RADIO", "TELEVISION", "INTERNET", "DAILY_NATIONAL_NEWSPAPER_ACCESS"],
      percentage: categoryStats.communication.percentage,
      total: categoryStats.communication.total,
      color: "#1E88E5", // Blue
    },
    transportation: {
      name: "यातायात साधनहरू",
      nameEn: "Transportation Means",
      types: ["BICYCLE", "MOTORCYCLE", "CAR_JEEP"],
      percentage: categoryStats.transportation.percentage,
      total: categoryStats.transportation.total,
      color: "#F44336", // Red
    },
    appliances: {
      name: "घरायसी उपकरणहरू",
      nameEn: "Household Appliances",
      types: ["REFRIGERATOR", "WASHING_MACHINE", "AIR_CONDITIONER", "ELECTRICAL_FAN", "MICROWAVE_OVEN"],
      percentage: categoryStats.appliances.percentage,
      total: categoryStats.appliances.total,
      color: "#43A047", // Green
    },
    digital: {
      name: "डिजिटल उपकरणहरू",
      nameEn: "Digital Devices",
      types: ["COMPUTER", "INTERNET", "MOBILE_PHONE"],
      percentage: categoryStats.digital.percentage,
      total: categoryStats.digital.total,
      color: "#FFA000", // Amber
    }
  };

  // Generate data for category comparison chart
  const categoryComparisonData = [
    {
      name: facilityCategoriesGrouped.communication.name,
      nameEn: facilityCategoriesGrouped.communication.nameEn,
      percentage: facilityCategoriesGrouped.communication.percentage,
      color: facilityCategoriesGrouped.communication.color
    },
    {
      name: facilityCategoriesGrouped.digital.name,
      nameEn: facilityCategoriesGrouped.digital.nameEn,
      percentage: facilityCategoriesGrouped.digital.percentage,
      color: facilityCategoriesGrouped.digital.color
    },
    {
      name: facilityCategoriesGrouped.transportation.name,
      nameEn: facilityCategoriesGrouped.transportation.nameEn,
      percentage: facilityCategoriesGrouped.transportation.percentage,
      color: facilityCategoriesGrouped.transportation.color
    },
    {
      name: facilityCategoriesGrouped.appliances.name,
      nameEn: facilityCategoriesGrouped.appliances.nameEn,
      percentage: facilityCategoriesGrouped.appliances.percentage,
      color: facilityCategoriesGrouped.appliances.color
    }
  ].sort((a, b) => b.percentage - a.percentage);

  return (
    <>
      {/* Overall facilities distribution */}
      <div 
        className="mb-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Household Facilities Distribution in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content={`Distribution of household facility types with approximately ${approximateUniqueHouseholds} households`}
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            घरायसी सुविधा अनुसार वितरण
          </h3>
          <p className="text-sm text-muted-foreground">
            कुल अनुमानित घरधुरी: {localizeNumber(approximateUniqueHouseholds.toLocaleString(), "ne")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
          {/* Client-side pie chart */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-medium mb-4 text-center">शीर्ष १० सुविधाहरू - पाई चार्ट</h4>
            <div className="h-[420px]">
              <FacilitiesPieChart
                pieChartData={pieChartData}
                FACILITY_CATEGORIES={FACILITY_CATEGORIES}
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
                    <th className="border p-2 text-left">सुविधा</th>
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
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-4 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            घरायसी सुविधाको वितरण
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryComparisonData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="font-medium">
                      {localizeNumber(item.percentage.toFixed(2), "ne")}%
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.percentage}%`,
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

      {/* Facility Category Comparison */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Facility Category Comparison in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of different facility categories in households of Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            सुविधा वर्ग अनुसार तुलना
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न प्रकारका घरायसी सुविधाहरूको औसत प्रयोगको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <FacilityCategoryComparisonChart
              categoryComparisonData={categoryComparisonData}
            />
          </div>
        </div>
      </div>

      {/* Ward-wise distribution */}
      <div 
        className="mt-12 border rounded-lg shadow-sm overflow-hidden bg-card"
        id="ward-wise-facilities-usage"
        itemScope
        itemType="https://schema.org/Dataset"
      >
        <meta
          itemProp="name"
          content="Ward-wise Facilities Usage in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Distribution of household facilities types across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडा अनुसार घरायसी सुविधाको प्रयोग
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार विभिन्न प्रकारका घरायसी सुविधाहरूको वितरण
          </p>
        </div>

        <div className="p-6">
          <div className="h-[500px]">
            <FacilitiesBarChart
              wardWiseData={wardWiseData}
              FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              facilityCategoriesGrouped={facilityCategoriesGrouped}
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
          content="Digital Access Comparison Across Wards in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Comparison of digital access across wards in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत डिजिटल पहुँच
          </h3>
          <p className="text-sm text-muted-foreground">
            विभिन्न वडाहरूमा डिजिटल सुविधा (इन्टरनेट, कम्प्युटर, मोबाइल फोन) पहुँचको तुलना
          </p>
        </div>

        <div className="p-6">
          <div className="h-[400px]">
            <DigitalAccessComparisonChart
              wardDigitalAccess={wardDigitalAccess}
              bestDigitalWard={bestDigitalWard}
              worstDigitalWard={worstDigitalWard}
              FACILITY_CATEGORIES={FACILITY_CATEGORIES}
              digitalAccessIndex={digitalAccessIndex}
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
          content="Ward-wise Facilities Analysis in Khajura Rural Municipality"
        />
        <meta
          itemProp="description"
          content="Detailed analysis of facilities usage by ward in Khajura"
        />

        <div className="border-b px-4 py-3">
          <h3 className="text-xl font-semibold" itemProp="headline">
            वडागत घरायसी सुविधाको विश्लेषण
          </h3>
          <p className="text-sm text-muted-foreground">
            वडा अनुसार घरायसी सुविधाको प्रयोगको विस्तृत विश्लेषण
          </p>
        </div>

        <div className="p-6">
          <div className="overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted">
                  <th className="border p-2">वडा नं.</th>
                  <th className="border p-2 text-right">अनुमानित घरधुरी</th>
                  <th className="border p-2 text-right">मोबाइल फोन</th>
                  <th className="border p-2 text-right">टेलिभिजन</th>
                  <th className="border p-2 text-right">इन्टरनेट</th>
                  <th className="border p-2 text-right">कम्प्युटर</th>
                  <th className="border p-2 text-right">मोटरसाइकल</th>
                  <th className="border p-2 text-right">रेफ्रिजेरेटर</th>
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
                      {["मोबाइल फोन", "टेलिभिजन", "इन्टरनेट सुविधा", "कम्प्युटर/ल्यापटप", "मोटरसाइकल/स्कुटर", "रेफ्रिजेरेटर/फ्रिज"].map((facilityName, index) => {
                        const value = item[facilityName] || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : "0.00";
                        return (
                          <td key={index} className="border p-2 text-right">
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
            </table>
          </div>

          {/* Ward pie charts (client component) */}
          <h4 className="text-lg font-medium mt-8 mb-4">वडागत घरायसी सुविधाको वितरण</h4>
          <WardFacilitiesPieCharts
            wardWiseData={wardWiseData}
            FACILITY_CATEGORIES={FACILITY_CATEGORIES}
          />
        </div>
      </div>
    </>
  );
}
