import Link from "next/link";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardWiseDeliveryPlaceAnalysisSectionProps {
  totalDeliveries: number;
  deliveryCategoryTotals: Record<string, number>;
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

export default function WardWiseDeliveryPlaceAnalysisSection({
  totalDeliveries,
  deliveryCategoryTotals,
  deliveryCategoryPercentages,
  wardInstitutionalPercentages,
  bestWard,
  worstWard,
  DELIVERY_PLACE_CATEGORIES,
  institutionalDeliveryIndex,
}: WardWiseDeliveryPlaceAnalysisSectionProps) {
  // Determine institutional delivery level based on index score
  const institutionalLevel =
    institutionalDeliveryIndex >= 80
      ? "उत्तम"
      : institutionalDeliveryIndex >= 60
        ? "राम्रो"
        : institutionalDeliveryIndex >= 40
          ? "मध्यम"
          : "निम्न";

  // Calculate institutional delivery total and percentage
  const institutionalTotal =
    deliveryCategoryTotals.GOVERNMENTAL_HEALTH_INSTITUTION +
    deliveryCategoryTotals.PRIVATE_HEALTH_INSTITUTION;
  const institutionalPercentage = (
    (institutionalTotal / totalDeliveries) *
    100
  ).toFixed(2);

  // Calculate home delivery total and percentage
  const homeTotal = deliveryCategoryTotals.HOUSE;
  const homePercentage = ((homeTotal / totalDeliveries) * 100).toFixed(2);

  // SEO attributes to include directly in JSX
  const seoAttributes = {
    "data-municipality": "Khajura Rural Municipality / गढवा गाउँपालिका",
    "data-total-deliveries": totalDeliveries.toString(),
    "data-institutional-rate": institutionalPercentage,
    "data-best-ward": bestWard?.wardNumber.toString() || "",
    "data-worst-ward": worstWard?.wardNumber.toString() || "",
    "data-institutional-index": institutionalDeliveryIndex.toFixed(2),
  };

  return (
    <>
      <div className="pl-6 space-y-4">
        <div className="flex">
          <span className="font-bold mr-2">१.</span>
          <div>
            <strong>संस्थागत प्रसूती प्रवर्धन:</strong>
            {institutionalDeliveryIndex < 80 ? (
              <span>
                {" "}
                वर्तमान {localizeNumber(institutionalPercentage, "ne")}%
                संस्थागत प्रसूती दरलाई बढाउनका लागि घरमा हुने सुत्केरीका कारणहरू
                पहिचान गरी समाधान गर्ने र स्वास्थ्य संस्थाहरूमा प्रसूती सेवाको
                गुणस्तर बढाउने।
              </span>
            ) : (
              <span>
                {" "}
                गुणस्तरीय प्रसूती सेवालाई निरन्तरता दिने र थप सुधार गर्न
                सम्बन्धित स्वास्थ्यकर्मीहरूको क्षमता विकास गर्ने।
              </span>
            )}
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">२.</span>
          <div>
            <strong>वडागत सेवा विस्तार:</strong> वडा नं.{" "}
            {localizeNumber(worstWard?.wardNumber.toString(), "ne")} मा संस्थागत
            प्रसूती दर कम रहेकोले त्यहाँ थप प्रसूती सेवा विस्तार र स्वास्थ्य
            संस्था सुदृढीकरण गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">३.</span>
          <div>
            <strong>यातायात सेवा:</strong> टाढाका वडाहरूमा गर्भवती महिलाहरूलाई
            प्रसूती सेवाका लागि यातायात सेवा प्रदान गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">४.</span>
          <div>
            <strong>प्रोत्साहन कार्यक्रम:</strong> संस्थागत प्रसूतीका लागि
            प्रोत्साहन स्वरूप नगद सहायता वा अन्य सुविधाहरू प्रदान गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">५.</span>
          <div>
            <strong>प्रसूती सेवा विकेन्द्रीकरण:</strong> दुर्गम क्षेत्रमा बर्थिङ
            सेन्टरहरू स्थापना गरी गर्भवती महिलाहरूलाई नजिकैबाट सेवा उपलब्ध
            गराउने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">६.</span>
          <div>
            <strong>जनचेतना अभिवृद्धि:</strong> घरमा प्रसूती गर्दा हुनसक्ने
            जोखिमहरू बारे जनचेतना अभिवृद्धि गर्ने तथा संस्थागत प्रसूतीका
            फाइदाहरू बारे प्रचार प्रसार गर्ने।
          </div>
        </div>

        <div className="flex">
          <span className="font-bold mr-2">७.</span>
          <div>
            <strong>सामुदायिक सहभागिता:</strong> सुरक्षित मातृत्व सेवाको पहुँच र
            उपयोगिता बढाउन स्थानीय नेतृत्व, आमा समूह र महिला स्वास्थ्य
            स्वयंसेविकाहरूको परिचालन गरी सामुदायिक स्वामित्व बढाउने।
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg mt-8 border">
        <h3 className="text-xl font-medium mb-6">
          प्रसूती स्थानको समष्टिगत विश्लेषण
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">संस्थागत प्रसूती दर</h4>
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-50 border-4 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {localizeNumber(institutionalDeliveryIndex.toFixed(1), "ne")}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">
                {institutionalLevel} स्तर
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>संस्थागत प्रसूती दर:</strong> पालिकामा कुल प्रसूतीको{" "}
                  {localizeNumber(institutionalPercentage, "ne")}% संस्थागत
                  रूपमा (सरकारी वा निजी स्वास्थ्य संस्थामा) हुने गरेको छ।
                </span>
              </p>
              <p className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>व्याख्या:</strong> {institutionalLevel} स्तरको
                  संस्थागत प्रसूती दरले पालिकामा मातृ स्वास्थ्य सेवाको पहुँच{" "}
                  {institutionalDeliveryIndex >= 60 ? "राम्रो" : "मध्यम"} रहेको
                  देखाउँछ।
                </span>
              </p>
            </div>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-4">प्रसूती स्थान विश्लेषण</h4>

            <div>
              <h5 className="text-sm font-medium">प्रसूती स्थान वितरण</h5>
              <div className="mt-2 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            DELIVERY_PLACE_CATEGORIES
                              .GOVERNMENTAL_HEALTH_INSTITUTION.color,
                        }}
                      ></span>
                      {
                        DELIVERY_PLACE_CATEGORIES
                          .GOVERNMENTAL_HEALTH_INSTITUTION.name
                      }
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        deliveryCategoryPercentages.GOVERNMENTAL_HEALTH_INSTITUTION.toFixed(
                          2,
                        ),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${deliveryCategoryPercentages.GOVERNMENTAL_HEALTH_INSTITUTION}%`,
                        backgroundColor:
                          DELIVERY_PLACE_CATEGORIES
                            .GOVERNMENTAL_HEALTH_INSTITUTION.color,
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
                          backgroundColor:
                            DELIVERY_PLACE_CATEGORIES.PRIVATE_HEALTH_INSTITUTION
                              .color,
                        }}
                      ></span>
                      {
                        DELIVERY_PLACE_CATEGORIES.PRIVATE_HEALTH_INSTITUTION
                          .name
                      }
                    </span>
                    <span className="font-medium">
                      {localizeNumber(
                        deliveryCategoryPercentages.PRIVATE_HEALTH_INSTITUTION.toFixed(
                          2,
                        ),
                        "ne",
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${deliveryCategoryPercentages.PRIVATE_HEALTH_INSTITUTION}%`,
                        backgroundColor:
                          DELIVERY_PLACE_CATEGORIES.PRIVATE_HEALTH_INSTITUTION
                            .color,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: "#34A853" }}
                      ></span>
                      संस्थागत प्रसूती (जम्मा)
                    </span>
                    <span>
                      {localizeNumber(institutionalPercentage, "ne")}%
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-muted-foreground">
                    कुल{" "}
                    {localizeNumber(institutionalTotal.toLocaleString(), "ne")}{" "}
                    प्रसूती संस्थागत रूपमा भएका छन्
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
                  स्वास्थ्य संस्थासम्म पुग्न लाग्ने समय
                </Link>
                <Link
                  href="/profile/health/ward-wise-health-facilities"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  स्वास्थ्य संस्थाहरू
                </Link>
                <Link
                  href="/profile/population/ward-wise-maternal-health"
                  className="text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80"
                >
                  मातृ स्वास्थ्य
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="best-institutional-delivery"
            data-ward-number={bestWard?.wardNumber}
            data-percentage={bestWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              उत्तम संस्थागत प्रसूती दर भएको वडा
              <span className="sr-only">
                Ward with Best Institutional Delivery Rate in Khajura Rural
                Municipality
              </span>
            </h4>
            {bestWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor:
                      DELIVERY_PLACE_CATEGORIES.GOVERNMENTAL_HEALTH_INSTITUTION
                        .color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(bestWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    संस्थागत प्रसूती दर:{" "}
                    {localizeNumber(bestWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {bestWard.percentage.toFixed(2)}% institutional delivery
                      rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">विशेषताहरू</h5>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  यस वडामा अधिकांश प्रसूती संस्थागत रूपमा हुने गरेको छ, जुन
                  पालिकाको औसतभन्दा{" "}
                  {localizeNumber(
                    (
                      bestWard.percentage - parseFloat(institutionalPercentage)
                    ).toFixed(2),
                    "ne",
                  )}
                  % ले उच्च छ।
                </p>
                <p className="text-sm">
                  यसले यस वडामा स्वास्थ्य चेतना, प्रसूती सेवाको पहुँच र सुविधाको
                  उपलब्धता राम्रो रहेको संकेत गर्दछ।
                </p>
              </div>
            </div>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="worst-institutional-delivery"
            data-ward-number={worstWard?.wardNumber}
            data-percentage={worstWard?.percentage.toFixed(2)}
          >
            <h4 className="font-medium mb-2">
              कम संस्थागत प्रसूती दर भएको वडा
              <span className="sr-only">
                Ward with Low Institutional Delivery Rate in Khajura
              </span>
            </h4>
            {worstWard && (
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-16 rounded"
                  style={{
                    backgroundColor: DELIVERY_PLACE_CATEGORIES.HOUSE.color,
                  }}
                ></div>
                <div>
                  <p className="text-2xl font-bold">
                    वडा {localizeNumber(worstWard.wardNumber.toString(), "ne")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    संस्थागत प्रसूती दर:{" "}
                    {localizeNumber(worstWard.percentage.toFixed(2), "ne")}%
                    <span className="sr-only">
                      {worstWard.percentage.toFixed(2)}% institutional delivery
                      rate
                    </span>
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium">सुधार आवश्यक</h5>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm">
                  यस वडामा संस्थागत प्रसूती दर कम रहेको देखिन्छ। अधिकांश प्रसूती
                  घरमै हुने गरेको देखिन्छ, जसले मातृ तथा शिशु स्वास्थ्यमा जोखिम
                  बढाउँछ। यस वडामा स्वास्थ्य चेतना अभिवृद्धि, प्रसूती सेवाको
                  विस्तार र गर्भवती महिलाहरूका लागि यातायात सुविधा बढाउनु आवश्यक
                  छ।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
