"use client";

import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface GenderAnalysisProps {
  overallSummary: Array<{
    gender: string;
    genderName: string;
    population: number;
  }>;
  totalPopulation: number;
  GENDER_NAMES: Record<string, string>;
  wardNumbers: number[];
  genderData: Array<{
    id?: string;
    wardNumber: number;
    gender: string;
    population: number;
    updatedAt?: Date;
    createdAt?: Date;
  }>;
}

export default function GenderAnalysisSection({
  overallSummary,
  totalPopulation,
  GENDER_NAMES,
  wardNumbers,
  genderData,
}: GenderAnalysisProps) {
  // Modern aesthetic color scheme for gender representation
  const GENDER_COLORS = {
    MALE: "#4F46E5", // Indigo
    FEMALE: "#EC4899", // Pink
    OTHER: "#06B6D4", // Cyan
  };

  // Calculate male-female ratio
  const maleHouseheads =
    overallSummary.find((item) => item.gender === "MALE")?.population || 0;
  const femaleHouseheads =
    overallSummary.find((item) => item.gender === "FEMALE")?.population || 0;

  const maleFemaleRatio =
    femaleHouseheads > 0
      ? (maleHouseheads / femaleHouseheads).toFixed(2)
      : "N/A";

  // Find ward with highest female household head percentage
  const wardGenderData = wardNumbers.map((wardNumber) => {
    const wardItems = genderData.filter(
      (item) => item.wardNumber === wardNumber,
    );
    const wardTotal = wardItems.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );

    const femaleItem = wardItems.find((item) => item.gender === "FEMALE");
    const femalePopulation = femaleItem?.population || 0;
    const femalePercentage =
      wardTotal > 0 ? (femalePopulation / wardTotal) * 100 : 0;

    return {
      wardNumber,
      femalePercentage,
      femalePopulation,
      totalHouseheads: wardTotal,
    };
  });

  const highestFemaleWard = [...wardGenderData].sort(
    (a, b) => b.femalePercentage - a.femalePercentage,
  )[0];
  const lowestFemaleWard = [...wardGenderData].sort(
    (a, b) => a.femalePercentage - b.femalePercentage,
  )[0];

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const GENDER_NAMES_EN: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-househeads",
        localizeNumber(totalPopulation.toString(), "ne"),
      );

      // Add gender proportions
      overallSummary.forEach((item) => {
        const genderNameEN = GENDER_NAMES_EN[item.gender] || item.gender;
        document.body.setAttribute(
          `data-${genderNameEN.toLowerCase()}-househeads`,
          localizeNumber(item.population.toString(), "ne"),
        );
        document.body.setAttribute(
          `data-${genderNameEN.toLowerCase()}-percentage`,
          localizeNumber(
            ((item.population / totalPopulation) * 100).toFixed(2),
            "ne",
          ),
        );
      });

      // Add male-female ratio
      document.body.setAttribute(
        "data-male-female-ratio",
        localizeNumber(maleFemaleRatio, "ne"),
      );

      // Add highest female representation ward
      if (highestFemaleWard) {
        document.body.setAttribute(
          "data-highest-female-ward",
          localizeNumber(highestFemaleWard.wardNumber.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-highest-female-percentage",
          localizeNumber(highestFemaleWard.femalePercentage.toFixed(2), "ne"),
        );
      }
    }
  }, [overallSummary, totalPopulation, maleFemaleRatio, highestFemaleWard]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.map((item, index) => {
          // Define English gender name for SEO
          const genderEN =
            item.gender === "MALE"
              ? "Male"
              : item.gender === "FEMALE"
                ? "Female"
                : "Other";

          // Calculate percentage
          const percentage = (
            (item.population / totalPopulation) *
            100
          ).toFixed(2);

          return (
            <div
              key={index}
              className="bg-muted/50 rounded-lg p-4 text-center min-w-[200px] relative overflow-hidden"
              // Add data attributes for SEO crawlers
              data-gender={`${genderEN} / ${item.genderName}`}
              data-population={item.population}
              data-percentage={percentage}
            >
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: `${Math.min(
                    (item.population / overallSummary[0].population) * 100,
                    100,
                  )}%`,
                  backgroundColor:
                    GENDER_COLORS[item.gender as keyof typeof GENDER_COLORS] ||
                    "#94a3b8",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.genderName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{genderEN}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")}{" "}
                  व्यक्ति
                  <span className="sr-only">
                    ({item.population.toLocaleString()} people)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          <strong>बुद्धशान्ति गाउँपालिका</strong>को घरमूली लिङ्ग विश्लेषण
          <span className="sr-only">
            Household Head Gender Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="gender-ratio"
            data-ratio={maleFemaleRatio}
          >
            <h4 className="font-medium mb-2">
              पुरुष-महिला घरमूली अनुपात
              <span className="sr-only">
                Male-Female Household Head Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(maleFemaleRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              हरेक {localizeNumber(maleFemaleRatio, "ne")} पुरुष घरमूलीका लागि १
              महिला घरमूली
              <span className="sr-only">
                For every {maleFemaleRatio} male household heads, there is 1
                female household head in Khajura Rural Municipality
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="female-representation"
            data-highest-ward={highestFemaleWard?.wardNumber}
            data-highest-percentage={highestFemaleWard?.femalePercentage.toFixed(
              2,
            )}
          >
            <h4 className="font-medium mb-2">
              महिला घरमूली प्रतिनिधित्व
              <span className="sr-only">
                Female Household Head Representation in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              वडा{" "}
              {localizeNumber(highestFemaleWard.wardNumber.toString(), "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              सबैभन्दा बढी महिला घरमूली प्रतिशत (
              {localizeNumber(
                highestFemaleWard.femalePercentage.toFixed(2),
                "ne",
              )}
              %) भएको वडा
              <span className="sr-only">
                Ward with highest female household head percentage (
                {highestFemaleWard.femalePercentage.toFixed(2)}%) in Khajura
                Rural Municipality
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          <strong>बुद्धशान्ति गाउँपालिका</strong>को वडागत घरमूली लिङ्ग विविधता
          <span className="sr-only">
            Ward-wise Household Head Gender Diversity in Khajura
          </span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>बुद्धशान्ति गाउँपालिका</strong>को वडागत घरमूली लिङ्ग
            विश्लेषणबाट निम्न निष्कर्षहरू निकाल्न सकिन्छ:
          </p>

          <ul itemScope itemType="https://schema.org/ItemList">
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="1" />
              <div itemProp="item">
                <strong>पुरुष घरमूली:</strong>{" "}
                <strong>बुद्धशान्ति गाउँपालिका</strong>
                मा कुल घरमूलीको{" "}
                {localizeNumber(
                  ((maleHouseheads / totalPopulation) * 100).toFixed(2),
                  "ne",
                )}
                % पुरुष घरमूली रहेका छन्, जुन नेपालको राष्ट्रिय औसत भन्दा{" "}
                {(maleHouseheads / totalPopulation) * 100 > 80 ? "बढी" : "कम"}{" "}
                हो।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="2" />
              <div itemProp="item">
                <strong>महिला घरमूली:</strong>{" "}
                <strong>बुद्धशान्ति गाउँपालिका</strong>
                मा{" "}
                {localizeNumber(
                  ((femaleHouseheads / totalPopulation) * 100).toFixed(2),
                  "ne",
                )}
                % महिला घरमूली रहेका छन्। वडा{" "}
                {localizeNumber(highestFemaleWard.wardNumber.toString(), "ne")}{" "}
                मा सबैभन्दा बढी महिला घरमूली प्रतिशत (
                {localizeNumber(
                  highestFemaleWard.femalePercentage.toFixed(2),
                  "ne",
                )}
                %) रहेको छ, भने वडा{" "}
                {localizeNumber(lowestFemaleWard.wardNumber.toString(), "ne")}{" "}
                मा सबैभन्दा कम महिला घरमूली प्रतिशत (
                {localizeNumber(
                  lowestFemaleWard.femalePercentage.toFixed(2),
                  "ne",
                )}
                %) रहेको छ।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="3" />
              <div itemProp="item">
                <strong>वडागत भिन्नता:</strong>{" "}
                <strong>बुद्धशान्ति गाउँपालिका</strong>का विभिन्न वडाहरूमा महिला
                घरमूलीको प्रतिशत{" "}
                {localizeNumber(
                  lowestFemaleWard.femalePercentage.toFixed(2),
                  "ne",
                )}
                % देखि{" "}
                {localizeNumber(
                  highestFemaleWard.femalePercentage.toFixed(2),
                  "ne",
                )}
                % सम्म भिन्नता देखिन्छ, जसले वडाहरू बीच सामाजिक-सांस्कृतिक
                भिन्नता रहेको संकेत गर्दछ।
              </div>
            </li>
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content="4" />
              <div itemProp="item">
                <strong>समग्र अवस्था:</strong>{" "}
                <strong>बुद्धशान्ति गाउँपालिका</strong>
                मा हरेक {localizeNumber(maleFemaleRatio, "ne")} पुरुष घरमूलीका
                लागि १ महिला घरमूली रहेको अवस्थाले महिला नेतृत्वमा सुधार गर्ने
                आवश्यकता देखाउँछ।
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          नीतिगत सुझाव
          <span className="sr-only">Policy Recommendations for Khajura</span>
        </h3>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            <strong>बुद्धशान्ति गाउँपालिका</strong>को घरमूली लिङ्ग विश्लेषणका
            आधारमा निम्न नीतिगत सुझावहरू प्रस्तुत गरिएका छन्:
          </p>

          <ul>
            <li>
              <strong>महिला सशक्तिकरण:</strong>{" "}
              <strong>बुद्धशान्ति गाउँपालिका</strong>मा महिला घरमूली प्रतिशत
              बढाउन विशेष आर्थिक सशक्तिकरण र नेतृत्व विकास कार्यक्रमहरू संचालन
              गर्ने।
            </li>
            <li>
              <strong>लैङ्गिक बजेट:</strong>{" "}
              <strong>बुद्धशान्ति गाउँपालिका</strong>को न्यून महिला घरमूली
              प्रतिशत भएका वडाहरूमा (विशेष गरी वडा{" "}
              {localizeNumber(lowestFemaleWard.wardNumber.toString(), "ne")})
              लैङ्गिक समानताका लागि लक्षित बजेट विनियोजन गर्ने।
            </li>
            <li>
              <strong>प्रोत्साहन प्रणाली:</strong>{" "}
              <strong>बुद्धशान्ति गाउँपालिका</strong>मा महिला नेतृत्वका
              परिवारहरूलाई विशेष प्रोत्साहन, सहुलियत र अवसरहरू प्रदान गर्ने नीति
              लागू गर्ने।
            </li>
            <li>
              <strong>सफल अभ्यास प्रसार:</strong> वडा{" "}
              {localizeNumber(highestFemaleWard.wardNumber.toString(), "ne")} मा
              महिला घरमूली प्रतिशत बढी हुनुका कारणहरू अध्ययन गरी अन्य वडाहरूमा
              त्यस्ता सफल अभ्यासहरू प्रसार गर्ने।
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
