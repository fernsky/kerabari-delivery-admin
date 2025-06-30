import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseHealthInsuredHouseholdsAnalysisSectionProps {
  totalHouseholds: number;
  totalInsuredHouseholds: number;
  totalNonInsuredHouseholds: number;
  insuredPercentage: number;
  nonInsuredPercentage: number;
  wardInsuredPercentages: Array<{
    wardNumber: number;
    percentage: number;
  }>;
  bestInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  worstInsuranceWard: {
    wardNumber: number;
    percentage: number;
  };
  insuranceCoverageIndex: number;
}

export default function WardWiseHealthInsuredHouseholdsAnalysisSection({
  totalHouseholds,
  totalInsuredHouseholds,
  totalNonInsuredHouseholds,
  insuredPercentage,
  nonInsuredPercentage,
  wardInsuredPercentages,
  bestInsuranceWard,
  worstInsuranceWard,
  insuranceCoverageIndex,
}: WardWiseHealthInsuredHouseholdsAnalysisSectionProps) {
  // Determine coverage level based on index score
  const coverageLevel =
    insuranceCoverageIndex >= 75
      ? "उत्तम"
      : insuranceCoverageIndex >= 50
        ? "राम्रो"
        : insuranceCoverageIndex >= 25
          ? "मध्यम"
          : "निम्न";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / केराबारी गाउँपालिका",
    "data-total-households": totalHouseholds.toString(),
    "data-insured-rate": insuredPercentage.toFixed(2),
    "data-best-ward": bestInsuranceWard?.wardNumber.toString() || "",
    "data-worst-ward": worstInsuranceWard?.wardNumber.toString() || "",
    "data-insurance-index": insuranceCoverageIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${insuredPercentage}%`,
              backgroundColor: "#4285F4", // Blue
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              बीमा गरेका
              <span className="sr-only">Health Insured Households</span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(insuredPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(totalInsuredHouseholds.toLocaleString(), "ne")}{" "}
              घरधुरी
              <span className="sr-only">
                ({totalInsuredHouseholds.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${nonInsuredPercentage}%`,
              backgroundColor: "#EA4335", // Red
              opacity: 0.2,
              zIndex: 0,
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              बीमा नगरेका
              <span className="sr-only">Non-insured Households</span>
            </h3>
            <p className="text-2xl font-bold">
              {localizeNumber(nonInsuredPercentage.toFixed(2), "ne")}%
            </p>
            <p className="text-sm text-muted-foreground">
              {localizeNumber(totalNonInsuredHouseholds.toLocaleString(), "ne")}{" "}
              घरधुरी
              <span className="sr-only">
                ({totalNonInsuredHouseholds.toLocaleString()} households)
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          स्वास्थ्य बीमाको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Health Insurance Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-health-insurance"
            data-ward-number={bestInsuranceWard?.wardNumber}
            data-percentage={bestInsuranceWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              उच्च स्वास्थ्य बीमा दर भएको वडा
              <span className="sr-only">
                Ward with Highest Health Insurance Rate in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestInsuranceWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: "#4285F4", // Blue
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestInsuranceWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    बीमा दर:{" "}
                    {localizeNumber(
                      bestInsuranceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {bestInsuranceWard.percentage.toFixed(2)}% insurance rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा स्वास्थ्य बीमाको दर पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (bestInsuranceWard.percentage - insuredPercentage).toFixed(
                      2,
                    ),
                    "ne",
                  )}
                  % ले उच्च छ, जसले यहाँका नागरिकहरूमा स्वास्थ्य बीमाको
                  महत्वबारे चेतना उच्च रहेको देखाउँछ।
                </p>
                <p className="text-sm">
                  यस वडाको अनुभव र रणनीति अन्य वडाहरूमा स्वास्थ्य बीमा
                  प्रवर्द्धनका लागि उपयोगी हुन सक्छ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-health-insurance"
            data-ward-number={worstInsuranceWard?.wardNumber}
            data-percentage={worstInsuranceWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              न्यून स्वास्थ्य बीमा दर भएको वडा
              <span className="sr-only">
                Ward with Lowest Health Insurance Rate in Khajura
              </span>
            </h4>
            {worstInsuranceWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: "#EA4335", // Red
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstInsuranceWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    बीमा दर:{" "}
                    {localizeNumber(
                      worstInsuranceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %
                    <span className="sr-only">
                      {worstInsuranceWard.percentage.toFixed(2)}% insurance rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा स्वास्थ्य बीमाको दर निकै न्यून रहेको देखिन्छ। यहाँका
                  नागरिकहरूलाई स्वास्थ्य बीमा सम्बन्धी जानकारी र यसका
                  फाइदाहरूबारे विशेष जागरण कार्यक्रम सञ्चालन गर्न आवश्यक छ।
                  साथै, बीमा प्रक्रियालाई सरल र पहुँचयोग्य बनाउन जोड दिनुपर्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">स्वास्थ्य बीमा कभरेज सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(insuranceCoverageIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{coverageLevel} स्तर</p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> स्वास्थ्य बीमा कभरेज सूचकाङ्क
                  पालिकामा बीमित घरधुरीको प्रतिशतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(insuranceCoverageIndex.toFixed(1), "ne")}{" "}
                  अंकले {coverageLevel} स्वास्थ्य बीमा कभरेज दर्शाउँछ। स्वास्थ्य
                  बीमा कार्यक्रमको प्रभावकारिता र पहुँच बढाउन थप रणनीति आवश्यक
                  छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">बीमा विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">चुनौती र अवसरहरू</h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#4285F4" }}
                      ></span>
                      बीमा दरमा वडागत असमानता
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    उच्च (
                    {localizeNumber(
                      bestInsuranceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %) र न्यून (
                    {localizeNumber(
                      worstInsuranceWard.percentage.toFixed(2),
                      "ne",
                    )}
                    %) बीमा दर भएका वडाहरूबीच{" "}
                    {localizeNumber(
                      (
                        bestInsuranceWard.percentage -
                        worstInsuranceWard.percentage
                      ).toFixed(2),
                      "ne",
                    )}
                    % को फरक छ।
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mt-3">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#34A853" }}
                      ></span>
                      जागरुकता र पहुँच अभिवृद्धि
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    पालिकाका{" "}
                    {localizeNumber(nonInsuredPercentage.toFixed(2), "ne")}%
                    घरधुरीहरू अझै बीमाको दायराभन्दा बाहिर रहेका छन्। जागरुकता र
                    पहुँच अभिवृद्धि गर्न आवश्यक छ।
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t">
              <h5 className="font-medium mb-2">सम्बन्धित डेटा</h5>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/profile/health/ward-wise-time-to-health-organization"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  स्वास्थ्य संस्था पहुँच
                </Link>
                <Link
                  href="/profile/health/ward-wise-health-facilities"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  स्वास्थ्य संस्थाहरू
                </Link>
                <Link
                  href="/profile/health/ward-wise-common-illnesses"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  सामान्य रोगहरू
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
