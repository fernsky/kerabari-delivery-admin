import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseFacilitiesAnalysisSectionProps {
  approximateUniqueHouseholds: number;
  facilityTypeTotals: Record<string, number>;
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
  FACILITY_CATEGORIES: Record<
    string,
    {
      name: string;
      nameEn: string;
      color: string;
    }
  >;
  digitalAccessIndex: number;
  categoryStats: Record<
    string,
    {
      total: number;
      percentage: number;
    }
  >;
}

export default function WardWiseFacilitiesAnalysisSection({
  approximateUniqueHouseholds,
  facilityTypeTotals,
  facilityTypePercentages,
  wardDigitalAccess,
  bestDigitalWard,
  worstDigitalWard,
  FACILITY_CATEGORIES,
  digitalAccessIndex,
  categoryStats,
}: WardWiseFacilitiesAnalysisSectionProps) {
  // Determine digital access level based on index score
  const digitalAccessLevel =
    digitalAccessIndex >= 75
      ? "उच्च"
      : digitalAccessIndex >= 50
        ? "राम्रो"
        : digitalAccessIndex >= 30
          ? "मध्यम"
          : "न्यून";

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
    "data-total-households": approximateUniqueHouseholds.toString(),
    "data-mobile-rate":
      facilityTypePercentages.MOBILE_PHONE?.toFixed(2) || "0.00",
    "data-internet-rate":
      facilityTypePercentages.INTERNET?.toFixed(2) || "0.00",
    "data-best-ward": bestDigitalWard?.wardNumber.toString() || "",
    "data-worst-ward": worstDigitalWard?.wardNumber.toString() || "",
    "data-digital-access-index": digitalAccessIndex.toFixed(2),
  };

  return (
    <>
      <div
        className="mt-6 flex flex-wrap gap-4 justify-center"
        {...seoAttributes}
      >
        {/* Card for key facilities */}
        {["MOBILE_PHONE", "TELEVISION", "INTERNET", "COMPUTER"].map(
          (facilityKey) => {
            const category =
              FACILITY_CATEGORIES[
                facilityKey as keyof typeof FACILITY_CATEGORIES
              ];
            const percentage = facilityTypePercentages[facilityKey] || 0;
            const total = facilityTypeTotals[facilityKey] || 0;

            return (
              <div
                key={facilityKey}
                className="bg-muted/50 rounded-lg p-4 text-center min-w-[180px] relative overflow-hidden"
              >
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: category.color,
                    opacity: 0.2,
                    zIndex: 0,
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-medium mb-2">
                    {category.name}
                    <span className="sr-only">{category.nameEn}</span>
                  </h3>
                  <p className="text-2xl font-bold">
                    {localizeNumber(percentage.toFixed(2), "ne")}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {localizeNumber(total.toLocaleString(), "ne")} घरधुरी
                    <span className="sr-only">
                      ({total.toLocaleString()} households)
                    </span>
                  </p>
                </div>
              </div>
            );
          },
        )}
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          घरायसी सुविधाको प्रयोगको विस्तृत विश्लेषण
          <span className="sr-only">
            Detailed Household Facility Usage Analysis of Khajura
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-digital-access"
            data-ward-number={bestDigitalWard?.wardNumber}
            data-percentage={bestDigitalWard?.score.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              डिजिटल पहुँचमा अग्रणी वडा
              <span className="sr-only">
                Ward with Best Digital Access in Khajura Rural Municipality
              </span>
            </h4>
            {bestDigitalWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: FACILITY_CATEGORIES.INTERNET.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      bestDigitalWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    डिजिटल पहुँच स्कोर:{" "}
                    {localizeNumber(bestDigitalWard.score.toFixed(2), "ne")}
                    <span className="sr-only">
                      {bestDigitalWard.score.toFixed(2)} digital access score
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा डिजिटल सुविधाको पहुँच उच्च छ, विशेष गरी इन्टरनेट को
                  पहुँच{" "}
                  {localizeNumber(
                    bestDigitalWard.internetPercentage.toFixed(2),
                    "ne",
                  )}
                  % र कम्प्युटरको पहुँच{" "}
                  {localizeNumber(
                    bestDigitalWard.computerPercentage.toFixed(2),
                    "ne",
                  )}
                  % रहेको छ।
                </p>
                <p className="text-sm">
                  यस वडाको डिजिटल पहुँच पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (bestDigitalWard.score - digitalAccessIndex).toFixed(2),
                    "ne",
                  )}{" "}
                  अंकले बढी छ, जसले यहाँको सूचना प्रविधिको अवस्था राम्रो रहेको
                  संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-digital-access"
            data-ward-number={worstDigitalWard?.wardNumber}
            data-percentage={worstDigitalWard?.score.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              डिजिटल पहुँचमा पछाडि परेको वडा
              <span className="sr-only">
                Ward with Lowest Digital Access in Khajura
              </span>
            </h4>
            {worstDigitalWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: FACILITY_CATEGORIES.NONE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा{" "}
                    {localizeNumber(
                      worstDigitalWard.wardNumber.toString(),
                      "ne",
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    डिजिटल पहुँच स्कोर:{" "}
                    {localizeNumber(worstDigitalWard.score.toFixed(2), "ne")}
                    <span className="sr-only">
                      {worstDigitalWard.score.toFixed(2)} digital access score
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा डिजिटल सुविधाहरूको पहुँच न्यून छ, विशेष गरी इन्टरनेट
                  को पहुँच{" "}
                  {localizeNumber(
                    worstDigitalWard.internetPercentage.toFixed(2),
                    "ne",
                  )}
                  % र कम्प्युटरको पहुँच{" "}
                  {localizeNumber(
                    worstDigitalWard.computerPercentage.toFixed(2),
                    "ne",
                  )}
                  % मात्र रहेको छ।
                </p>
                <p className="text-sm mt-2">
                  यस वडामा डिजिटल पहुँच विस्तार गर्न प्राथमिकता दिनुपर्ने
                  देखिन्छ, जसले यहाँको शिक्षा, रोजगारी र सेवा पहुँचमा सुधार
                  ल्याउन मद्दत गर्न सक्छ।
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">डिजिटल पहुँच सूचकाङ्क</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-green-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(digitalAccessIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {digitalAccessLevel} स्तर
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>सूचकाङ्क विवरण:</strong> डिजिटल पहुँच सूचकाङ्क
                  इन्टरनेट, कम्प्युटर, मोबाइल फोन र टेलिभिजन जस्ता डिजिटल
                  सुविधाहरूको पहुँचको भारित औसतमा आधारित छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong>{" "}
                  {localizeNumber(digitalAccessIndex.toFixed(1), "ne")} अंकले{" "}
                  {digitalAccessLevel} डिजिटल पहुँच दर्शाउँछ। यसमा सुधारका लागि
                  इन्टरनेट र कम्प्युटरको पहुँच बढाउनुपर्ने देखिन्छ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">सुविधा प्रयोग विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">
                अत्यावश्यक सुविधाहरूको प्रयोग
              </h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            FACILITY_CATEGORIES.MOBILE_PHONE.color,
                        }}
                      ></span>
                      {FACILITY_CATEGORIES.MOBILE_PHONE.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        facilityTypePercentages.MOBILE_PHONE?.toFixed(2) ||
                          "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${facilityTypePercentages.MOBILE_PHONE || 0}%`,
                        backgroundColor: FACILITY_CATEGORIES.MOBILE_PHONE.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: FACILITY_CATEGORIES.INTERNET.color,
                        }}
                      ></span>
                      {FACILITY_CATEGORIES.INTERNET.name}
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        facilityTypePercentages.INTERNET?.toFixed(2) || "0.00",
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${facilityTypePercentages.INTERNET || 0}%`,
                        backgroundColor: FACILITY_CATEGORIES.INTERNET.color,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#1976D2" }}
                      ></span>
                      डिजिटल सुविधाको औसत पहुँच
                    </span>
                    <span>
                      {localizeNumber(
                        categoryStats.digital.percentage.toFixed(2),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    कुल{" "}
                    {localizeNumber(
                      categoryStats.digital.total.toLocaleString(),
                      "ne",
                    )}{" "}
                    घरधुरीमा डिजिटल सुविधाको पहुँच रहेको अनुमान
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded border">
            <h5 className="text-sm font-medium mb-3">सञ्चार उपकरणको पहुँच</h5>
            <div className="text-3xl font-bold mb-2">
              {localizeNumber(
                categoryStats.communication.percentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">
              मोबाइल, टेलिभिजन, रेडियो, इन्टरनेट र पत्रिकाहरू समावेश
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h5 className="text-sm font-medium mb-3">यातायात साधनको पहुँच</h5>
            <div className="text-3xl font-bold mb-2">
              {localizeNumber(
                categoryStats.transportation.percentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">
              कार, मोटरसाइकल र साइकल समावेश
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h5 className="text-sm font-medium mb-3">घरायसी उपकरणको पहुँच</h5>
            <div className="text-3xl font-bold mb-2">
              {localizeNumber(
                categoryStats.appliances.percentage.toFixed(1),
                "ne",
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">
              रेफ्रिजेरेटर, वासिङ मेशिन, पंखा लगायत समावेश
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
