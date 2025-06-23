import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface IrrigatedAreaAnalysisSectionProps {
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
  mostIrrigatedWard: {
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  } | null;
  mostUnirrigatedWard: {
    wardNumber: number;
    irrigatedArea: number;
    unirrigatedArea: number;
    totalArea: number;
  } | null;
}

export default function IrrigatedAreaAnalysisSection({
  wardData,
  totalIrrigatedArea,
  totalUnirrigatedArea,
  totalArea,
  irrigatedPercentage,
  unirrigatedPercentage,
  irrigationSustainabilityScore,
  mostIrrigatedWard,
  mostUnirrigatedWard,
}: IrrigatedAreaAnalysisSectionProps) {
  // Find ward with highest irrigated proportion
  const highestIrrigatedProportionWard = [...wardData]
    .filter((ward) => ward.totalArea > 0)
    .sort(
      (a, b) => b.irrigatedArea / b.totalArea - a.irrigatedArea / a.totalArea,
    )[0];

  // Find ward with lowest irrigated proportion
  const lowestIrrigatedProportionWard = [...wardData]
    .filter((ward) => ward.totalArea > 0)
    .sort(
      (a, b) => a.irrigatedArea / a.totalArea - b.irrigatedArea / b.totalArea,
    )[0];

  // Calculate average irrigated area per ward
  const averageIrrigatedArea =
    wardData.length > 0 ? totalIrrigatedArea / wardData.length : 0;

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-area": totalArea.toString(),
    "data-irrigated-area": totalIrrigatedArea.toString(),
    "data-irrigated-percentage": irrigatedPercentage,
    "data-most-irrigated-ward": mostIrrigatedWard?.wardNumber.toString() || "",
  };

  return (
    <>
      <div
        className="mt-8 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">कुल क्षेत्रफल</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(totalArea.toFixed(2), "ne")}
          </p>
          <p className="text-sm text-muted-foreground mt-2">हेक्टर</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सिंचित क्षेत्रफल</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(irrigatedPercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ({localizeNumber(totalIrrigatedArea.toFixed(2), "ne")} हेक्टर)
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] border">
          <h4 className="text-lg font-medium mb-2">सिंचाई अन्तराल</h4>
          <p className="text-3xl font-bold">
            {localizeNumber(unirrigatedPercentage, "ne")}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ({localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")} हेक्टर)
          </p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          वडागत सिंचाई विश्लेषण
          <span className="sr-only">
            Ward-wise Irrigation Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="ward-irrigation-analysis"
          >
            <h4 className="font-medium mb-2">
              सबैभन्दा बढी सिंचित क्षेत्र भएको वडा
              <span className="sr-only">
                Ward with highest irrigated area in Khajura Rural Municipality
              </span>
            </h4>
            {mostIrrigatedWard && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-16 rounded bg-blue-500"></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा नं.{" "}
                    {localizeNumber(String(mostIrrigatedWard.wardNumber), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(
                      mostIrrigatedWard.irrigatedArea.toFixed(2),
                      "ne",
                    )}{" "}
                    हेक्टर (
                    {mostIrrigatedWard.totalArea > 0
                      ? localizeNumber(
                          (
                            (mostIrrigatedWard.irrigatedArea /
                              mostIrrigatedWard.totalArea) *
                            100
                          ).toFixed(1),
                          "ne",
                        )
                      : "0"}
                    %)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top 3 irrigated wards visualization */}
              {[...wardData]
                .sort((a, b) => b.irrigatedArea - a.irrigatedArea)
                .slice(0, 3)
                .map((ward, index) => (
                  <div key={index} className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span>
                        {localizeNumber(String(index + 1), "ne")}. वडा नं.{" "}
                        {localizeNumber(String(ward.wardNumber), "ne")}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(ward.irrigatedArea.toFixed(1), "ne")}{" "}
                        हेक्टर
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min((ward.irrigatedArea / (mostIrrigatedWard?.irrigatedArea || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">
              सिंचाई चुनौती भएको वडा
              <span className="sr-only">Ward with irrigation challenges</span>
            </h4>
            {mostUnirrigatedWard && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-16 rounded bg-red-500"></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा नं.{" "}
                    {localizeNumber(
                      String(mostUnirrigatedWard.wardNumber),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {localizeNumber(
                      mostUnirrigatedWard.unirrigatedArea.toFixed(2),
                      "ne",
                    )}{" "}
                    हेक्टर असिंचित क्षेत्र (
                    {mostUnirrigatedWard.totalArea > 0
                      ? localizeNumber(
                          (
                            (mostUnirrigatedWard.unirrigatedArea /
                              mostUnirrigatedWard.totalArea) *
                            100
                          ).toFixed(1),
                          "ne",
                        )
                      : "0"}
                    %)
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              {/* Top 3 unirrigated wards visualization */}
              {[...wardData]
                .sort((a, b) => b.unirrigatedArea - a.unirrigatedArea)
                .slice(0, 3)
                .map((ward, index) => (
                  <div key={index} className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span>
                        {localizeNumber(String(index + 1), "ne")}. वडा नं.{" "}
                        {localizeNumber(String(ward.wardNumber), "ne")}
                      </span>
                      <span className="font-medium">
                        {localizeNumber(ward.unirrigatedArea.toFixed(1), "ne")}{" "}
                        हेक्टर
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{
                          width: `${Math.min((ward.unirrigatedArea / (mostUnirrigatedWard?.unirrigatedArea || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
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
                  <strong>सिंचाई वितरण:</strong> पालिकामा औसत{" "}
                  {localizeNumber(averageIrrigatedArea.toFixed(2), "ne")} हेक्टर
                  प्रति वडा सिंचित क्षेत्रफल रहेको छ। उच्च सिंचित वडा नं.{" "}
                  {localizeNumber(
                    String(mostIrrigatedWard?.wardNumber || ""),
                    "ne",
                  )}{" "}
                  (
                  {localizeNumber(
                    mostIrrigatedWard?.irrigatedArea.toFixed(1) || "0",
                    "ne",
                  )}{" "}
                  हेक्टर) र न्यून सिंचित वडा नं.{" "}
                  {localizeNumber(
                    String(lowestIrrigatedProportionWard?.wardNumber || ""),
                    "ne",
                  )}{" "}
                  (
                  {localizeNumber(
                    lowestIrrigatedProportionWard?.irrigatedArea.toFixed(1) ||
                      "0",
                    "ne",
                  )}{" "}
                  हेक्टर) बीच ठूलो भिन्नता रहेको छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>सिंचाई अन्तराल:</strong> पालिकामा कुल क्षेत्रफलको{" "}
                  {localizeNumber(unirrigatedPercentage, "ne")}%{" "}
                  {localizeNumber(totalUnirrigatedArea.toFixed(2), "ne")} हेक्टर
                  क्षेत्रफलमा सिंचाई सुविधा पुग्न नसकेको अवस्था छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">•</span>
                <span>
                  <strong>सिंचाई दक्षता:</strong> सिंचाईको दिगोपना स्कोर{" "}
                  {localizeNumber(
                    irrigationSustainabilityScore.toString(),
                    "ne",
                  )}
                  % रहेकोले{" "}
                  {irrigationSustainabilityScore >= 60
                    ? "सन्तोषजनक"
                    : irrigationSustainabilityScore >= 40
                      ? "मध्यम"
                      : "न्यून"}{" "}
                  अवस्था देखिन्छ। यसलाई अझ सुधार गर्न विशेष कार्यक्रमहरू सञ्चालन
                  गर्नुपर्ने आवश्यकता छ।
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>सिंचाई प्राथमिकता:</strong> वडा नं.{" "}
                  {localizeNumber(
                    String(mostUnirrigatedWard?.wardNumber || ""),
                    "ne",
                  )}{" "}
                  मा सबैभन्दा बढी{" "}
                  {localizeNumber(
                    mostUnirrigatedWard?.unirrigatedArea.toFixed(1) || "0",
                    "ne",
                  )}{" "}
                  हेक्टर असिंचित क्षेत्रफल रहेकोले सिंचाई विकास योजनामा यस
                  वडालाई प्राथमिकतामा राख्नुपर्ने देखिन्छ।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">वडागत सिंचाई प्रतिशत</h4>
            <div className="space-y-3">
              {wardData
                .sort(
                  (a, b) =>
                    b.irrigatedArea / b.totalArea -
                    a.irrigatedArea / a.totalArea,
                )
                .slice(0, 5)
                .map((ward) => {
                  const irrigatedPercent =
                    ward.totalArea > 0
                      ? (ward.irrigatedArea / ward.totalArea) * 100
                      : 0;

                  return (
                    <div key={ward.wardNumber}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          वडा नं.{" "}
                          {localizeNumber(String(ward.wardNumber), "ne")}
                        </span>
                        <span className="font-medium text-sm">
                          {localizeNumber(irrigatedPercent.toFixed(1), "ne")}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${irrigatedPercent}%`,
                              backgroundColor:
                                irrigatedPercent > 80
                                  ? "#2ecc71"
                                  : irrigatedPercent > 60
                                    ? "#27ae60"
                                    : irrigatedPercent > 40
                                      ? "#f39c12"
                                      : irrigatedPercent > 20
                                        ? "#e67e22"
                                        : "#e74c3c",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h5 className="font-medium mb-3">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/profile/economics/municipality-wide-irrigation-source"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  सिंचाई स्रोतको प्रकार अनुसार क्षेत्रफल
                </Link>
                <Link
                  href="/profile/economics/agriculture-production"
                  className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  कृषि उत्पादन
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
