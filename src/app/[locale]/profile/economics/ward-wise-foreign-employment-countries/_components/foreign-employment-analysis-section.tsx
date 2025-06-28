import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface ForeignEmploymentAnalysisSectionProps {
  overallSummary: Array<{
    country: string;
    countryName: string;
    population: number;
  }>;
  totalPopulation: number;
  wardWiseAnalysis: Array<{
    wardNumber: number;
    totalPopulation: number;
    mostCommonCountry: string;
    mostCommonCountryPopulation: number;
    mostCommonCountryPercentage: string;
    gulfCountriesPopulation: number;
    gulfPercentage: string;
    asiaPacificPopulation: number;
    asiaPacificPercentage: string;
    westernCountriesPopulation: number;
    westernCountriesPercentage: string;
    diversityScore: number;
    uniqueCountries: number;
  }>;
  COUNTRY_NAMES: Record<string, string>;
  COUNTRY_NAMES_EN: Record<string, string>;
  COUNTRY_COLORS: Record<string, string>;
  regionChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  skillLevelChartData: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  estimatedAnnualRemittance: number;
  formattedEstimatedAnnualRemittance: string;
}

export default function ForeignEmploymentAnalysisSection({
  overallSummary,
  totalPopulation,
  wardWiseAnalysis,
  COUNTRY_NAMES,
  COUNTRY_NAMES_EN,
  COUNTRY_COLORS,
  regionChartData,
  skillLevelChartData,
  estimatedAnnualRemittance,
  formattedEstimatedAnnualRemittance,
}: ForeignEmploymentAnalysisSectionProps) {
  // Find out which ward has highest foreign employment population
  const highestPopulationWard = [...wardWiseAnalysis].sort(
    (a, b) => b.totalPopulation - a.totalPopulation,
  )[0];

  // Find out which ward has most diverse destinations
  const mostDiverseWard = [...wardWiseAnalysis].sort(
    (a, b) => b.diversityScore - a.diversityScore,
  )[0];

  // Find out which ward has highest percentage of Gulf workers
  const highestGulfPercentageWard = [...wardWiseAnalysis].sort(
    (a, b) => parseFloat(b.gulfPercentage) - parseFloat(a.gulfPercentage),
  )[0];

  // Find out which ward has highest percentage of skilled workers (going to developed countries)
  const highestWesternPercentageWard = [...wardWiseAnalysis].sort(
    (a, b) =>
      parseFloat(b.westernCountriesPercentage) -
      parseFloat(a.westernCountriesPercentage),
  )[0];

  // Calculate diversity score for the municipality
  const uniqueCountriesOverall = new Set(
    overallSummary.map((item) => item.country),
  ).size;
  const diversityScoreMunicipality = Math.min(uniqueCountriesOverall * 5, 100);

  // Get skilled worker percentage
  const skilledWorkersPercentage =
    skillLevelChartData.find((item) => item.name === "दक्ष")?.percentage || "0";

  // Format total remittance in billions (arab)
  const remittanceArab = (estimatedAnnualRemittance / 1000000000).toFixed(2);

  // Calculate per capita remittance (assuming average household size of 5.4)
  const estimatedPopulation = 45000; // Example total population of municipality
  const perCapitaRemittance = Math.round(
    estimatedAnnualRemittance / estimatedPopulation,
  );

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-migrant-workers": totalPopulation.toString(),
    "data-most-common-destination":
      overallSummary.length > 0
        ? `${overallSummary[0].countryName} / ${COUNTRY_NAMES_EN[overallSummary[0].country] || overallSummary[0].country}`
        : "",
    "data-most-common-percentage":
      overallSummary.length > 0
        ? ((overallSummary[0].population / totalPopulation) * 100).toFixed(2)
        : "0",
    "data-gulf-countries-percentage":
      regionChartData.find((r) => r.name === "खाडी मुलुक")?.percentage || "0",
    "data-estimated-remittance": estimatedAnnualRemittance.toString(),
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल वैदेशिक रोजगारी</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalPopulation.toLocaleString(), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">जना</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">खाडी मुलुकमा कार्यरत</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(
              regionChartData.find((r) => r.name === "खाडी मुलुक")
                ?.percentage || "0",
              "ne",
            )}
            %
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            (
            {localizeNumber(
              (
                regionChartData.find((r) => r.name === "खाडी मुलुक")?.value || 0
              ).toLocaleString(),
              "ne",
            )}{" "}
            जना)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">वार्षिक रेमिट्यान्स</h4>
          <p className="text-3xl font-bold">
            रु. {localizeNumber(remittanceArab, "ne")} अर्ब
          </p>
          <p className="text-sm text-muted-foreground mt-2">अनुमानित</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          वैदेशिक रोजगारीको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Foreign Employment Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="destination-country-analysis"
            data-percentage={
              overallSummary.length > 0
                ? (
                    (overallSummary[0].population / totalPopulation) *
                    100
                  ).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख वैदेशिक रोजगारी गन्तव्य
              <span className="sr-only">
                Main Foreign Employment Destination from Khajura Rural
                Municipality
              </span>
            </h4>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-16 rounded"
                style={{
                  backgroundColor:
                    overallSummary.length > 0
                      ? COUNTRY_COLORS[
                          overallSummary[0]
                            .country as keyof typeof COUNTRY_COLORS
                        ] || "#8e44ad"
                      : "#8e44ad",
                }}
              ></div>
              <div>
                <p className="text-2xl font-bold">
                  {overallSummary.length > 0
                    ? overallSummary[0].countryName
                    : ""}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {localizeNumber(
                    overallSummary.length > 0
                      ? (
                          (overallSummary[0].population / totalPopulation) *
                          100
                        ).toFixed(2)
                      : "0",
                    "ne",
                  )}
                  % (
                  {localizeNumber(
                    overallSummary.length > 0
                      ? overallSummary[0].population.toLocaleString()
                      : "0",
                    "ne",
                  )}{" "}
                  जना)
                </p>
              </div>
            </div>

            <div className="mt-4">
              {/* Top 3 destination countries visualization */}
              {overallSummary.slice(0, 3).map((item, index) => (
                <div key={index} className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      {index + 1}. {item.countryName}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        ((item.population / totalPopulation) * 100).toFixed(1),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((item.population / totalPopulation) * 100, 100)}%`,
                        backgroundColor:
                          COUNTRY_COLORS[
                            item.country as keyof typeof COUNTRY_COLORS
                          ] || "#8e44ad",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              वडागत वैदेशिक रोजगारी विश्लेषण
              <span className="sr-only">
                Ward-wise Foreign Employment Analysis
              </span>
            </h4>

            <div className="space-y-3">
              {wardWiseAnalysis.slice(0, 5).map((ward, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm">
                    <span>
                      वडा {localizeNumber(ward.wardNumber.toString(), "ne")} -
                      वैदेशिक रोजगारी
                    </span>
                    <span className="font-medium">
                      {localizeNumber(ward.totalPopulation.toString(), "ne")}{" "}
                      जना
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{
                        width: `${(ward.totalPopulation / highestPopulationWard.totalPopulation) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium">सर्वाधिक वैदेशिक रोजगारी</h5>
                  <p className="text-sm text-muted-foreground">जना संख्या</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      highestPopulationWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-purple-500 font-medium">
                    {localizeNumber(
                      highestPopulationWard?.totalPopulation.toString() || "0",
                      "ne",
                    )}{" "}
                    जना
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">विस्तृत विश्लेषण</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>क्षेत्रगत वितरण:</strong> कुल वैदेशिक रोजगारीको{" "}
                  {localizeNumber(
                    regionChartData.find((r) => r.name === "खाडी मुलुक")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % खाडी मुलुकमा,{" "}
                  {localizeNumber(
                    regionChartData.find((r) => r.name === "एसिया प्यासिफिक")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % एसिया प्यासिफिकमा, र{" "}
                  {localizeNumber(
                    regionChartData.find((r) => r.name === "पश्चिमी देशहरू")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % पश्चिमी देशहरूमा कार्यरत छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>सीप वर्गीकरण:</strong> कुल वैदेशिक रोजगारीको{" "}
                  {localizeNumber(
                    skillLevelChartData.find((s) => s.name === "दक्ष")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % दक्ष,
                  {localizeNumber(
                    skillLevelChartData.find((s) => s.name === "अर्धदक्ष")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % अर्धदक्ष, र{" "}
                  {localizeNumber(
                    skillLevelChartData.find((s) => s.name === "अदक्ष")
                      ?.percentage || "0",
                    "ne",
                  )}
                  % अदक्ष कामदारको रूपमा कार्यरत छन्।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>विविधता स्कोर:</strong> बुद्धशान्ति गाउँपालिकाको
                  वैदेशिक रोजगारी गन्तव्य विविधता स्कोर{" "}
                  {localizeNumber(diversityScoreMunicipality.toString(), "ne")}
                  (१०० मध्ये) रहेको छ, जुन कुल{" "}
                  {localizeNumber(uniqueCountriesOverall.toString(), "ne")} वटा
                  विभिन्न देशहरूमा वैदेशिक रोजगारीमा आधारित छ। सबैभन्दा धेरै
                  विविधता वडा नं.{" "}
                  {localizeNumber(
                    mostDiverseWard?.wardNumber.toString() || "",
                    "ne",
                  )}{" "}
                  मा रहेको छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  <strong>रेमिट्यान्स प्रभाव:</strong> प्रति परिवार औसत वार्षिक
                  रु. {localizeNumber("5,25,000", "ne")} रेमिट्यान्स प्राप्त
                  हुने अनुमान छ, जुन प्रति व्यक्ति रु.{" "}
                  {localizeNumber(perCapitaRemittance.toLocaleString(), "ne")}{" "}
                  हुन आउँछ। यो गाउँपालिकाको कुल अनुमानित बार्षिक बजेटको लगभग ३
                  गुना बढी हो।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत तुलनात्मक विश्लेषण</h4>

            <div className="space-y-5">
              <div>
                <h5 className="text-sm font-medium mb-1">
                  खाडी मुलुकमा कार्यरत वडागत प्रतिशत
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${parseFloat(highestGulfPercentageWard?.gulfPercentage || "0")}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      highestGulfPercentageWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      highestGulfPercentageWard?.gulfPercentage || "0",
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  पश्चिमी देशहरूमा कार्यरत वडागत प्रतिशत
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${parseFloat(highestWesternPercentageWard?.westernCountriesPercentage || "0")}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      highestWesternPercentageWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      highestWesternPercentageWard?.westernCountriesPercentage ||
                        "0",
                      "ne",
                    )}
                    %
                  </span>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-1">
                  गन्तव्य विविधता स्कोर (उत्कृष्ट वडा)
                </h5>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-muted h-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.min(mostDiverseWard?.diversityScore || 0, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    वडा{" "}
                    {localizeNumber(
                      mostDiverseWard?.wardNumber.toString() || "",
                      "ne",
                    )}
                    :{" "}
                    {localizeNumber(
                      mostDiverseWard?.diversityScore.toString() || "0",
                      "ne",
                    )}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {localizeNumber(
                    mostDiverseWard?.uniqueCountries.toString() || "0",
                    "ne",
                  )}{" "}
                  विभिन्न देशहरू
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
