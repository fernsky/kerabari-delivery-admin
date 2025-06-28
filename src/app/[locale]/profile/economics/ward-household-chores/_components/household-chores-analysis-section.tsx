"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface HouseholdChoresAnalysisProps {
  overallSummary: Array<{
    timeSpent: string;
    timeSpentName: string;
    population: number;
  }>;
  totalPopulation: number;
  TIME_SPENT_NAMES: Record<string, string>;
  wardNumbers: number[];
  householdChoresData: Array<{
    id?: string;
    wardNumber: number;
    timeSpent: string;
    population: number;
    updatedAt?: string;
    createdAt?: string;
  }>;
}

export default function HouseholdChoresAnalysisSection({
  overallSummary,
  totalPopulation,
  TIME_SPENT_NAMES,
  wardNumbers,
  householdChoresData,
}: HouseholdChoresAnalysisProps) {
  const TIME_SPENT_COLORS = {
    LESS_THAN_1_HOUR: "#4BC0C0",
    HOURS_1_TO_3: "#36A2EB",
    HOURS_4_TO_6: "#FFCD56",
    HOURS_7_TO_9: "#FF9F40",
    HOURS_10_TO_12: "#FF6384",
    MORE_THAN_12_HOURS: "#9966FF",
  };

  // Sort to get the most common time spent category
  const mostCommonTimeSpent = [...overallSummary].sort(
    (a, b) => b.population - a.population,
  )[0];

  // Calculate percentage for the most common time spent category
  const mostCommonPercentage = mostCommonTimeSpent
    ? ((mostCommonTimeSpent.population / totalPopulation) * 100).toFixed(2)
    : "0";

  // Find the ward with the highest population spending significant time (7+ hours)
  const highTimeSpentPeopleByWard = wardNumbers.map((wardNumber) => {
    const wardData = householdChoresData.filter(
      (item) =>
        item.wardNumber === wardNumber &&
        (item.timeSpent === "HOURS_7_TO_9" ||
          item.timeSpent === "HOURS_10_TO_12" ||
          item.timeSpent === "MORE_THAN_12_HOURS"),
    );

    const highTimePopulation = wardData.reduce(
      (sum, item) => sum + (item.population || 0),
      0,
    );
    const wardTotalPopulation = householdChoresData
      .filter((item) => item.wardNumber === wardNumber)
      .reduce((sum, item) => sum + (item.population || 0), 0);

    const percentage =
      wardTotalPopulation > 0
        ? (highTimePopulation / wardTotalPopulation) * 100
        : 0;

    return {
      wardNumber,
      highTimePopulation,
      percentage,
    };
  });

  const highestHighTimeWard = highTimeSpentPeopleByWard.sort(
    (a, b) => b.percentage - a.percentage,
  )[0];

  // Calculate total people spending significant time on household chores (7+ hours)
  const highTimePopulationTotal = householdChoresData
    .filter(
      (item) =>
        item.timeSpent === "HOURS_7_TO_9" ||
        item.timeSpent === "HOURS_10_TO_12" ||
        item.timeSpent === "MORE_THAN_12_HOURS",
    )
    .reduce((sum, item) => sum + (item.population || 0), 0);

  const highTimePercentage = (
    (highTimePopulationTotal / totalPopulation) *
    100
  ).toFixed(2);

  // Add SEO-friendly data attributes
  useEffect(() => {
    // Define English translations for key data
    const TIME_SPENT_NAMES_EN: Record<string, string> = {
      LESS_THAN_1_HOUR: "Less than 1 hour",
      HOURS_1_TO_3: "1-3 hours",
      HOURS_4_TO_6: "4-6 hours",
      HOURS_7_TO_9: "7-9 hours",
      HOURS_10_TO_12: "10-12 hours",
      MORE_THAN_12_HOURS: "More than 12 hours",
    };

    // Add data to document.body for SEO
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / बुद्धशान्ति गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        totalPopulation.toString(),
      );

      if (mostCommonTimeSpent) {
        const timeSpentNameEN =
          TIME_SPENT_NAMES_EN[mostCommonTimeSpent.timeSpent] ||
          mostCommonTimeSpent.timeSpent;
        document.body.setAttribute(
          "data-most-common-time-spent",
          `${timeSpentNameEN} / ${mostCommonTimeSpent.timeSpentName}`,
        );
        document.body.setAttribute(
          "data-most-common-time-spent-population",
          mostCommonTimeSpent.population.toString(),
        );
        document.body.setAttribute(
          "data-most-common-time-spent-percentage",
          mostCommonPercentage,
        );
      }

      document.body.setAttribute(
        "data-high-time-population",
        highTimePopulationTotal.toString(),
      );
      document.body.setAttribute(
        "data-high-time-percentage",
        highTimePercentage,
      );
    }
  }, [
    mostCommonTimeSpent,
    mostCommonPercentage,
    highTimePopulationTotal,
    highTimePercentage,
    totalPopulation,
  ]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {/* Time Spent Distribution Cards */}
        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#36A2EB",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              सबैभन्दा धेरै प्रचलित समय अवधि
              <span className="sr-only">Most Common Time Spent</span>
            </h3>
            <p className="text-3xl font-bold">
              {mostCommonTimeSpent?.timeSpentName || "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {mostCommonTimeSpent?.population.toLocaleString() || "0"} व्यक्ति
              ({mostCommonPercentage}%)
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#FF6384",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              ७+ घण्टा खर्चिने जनसंख्या
              <span className="sr-only">Population Spending 7+ Hours</span>
            </h3>
            <p className="text-3xl font-bold">
              {highTimePopulationTotal.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              कुल जनसंख्याको {highTimePercentage}%
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-center min-w-[300px] relative overflow-hidden">
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "60%",
              backgroundColor: "#4BC0C0",
              opacity: 0.1,
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <h3 className="text-lg font-medium mb-2">
              उच्च समय खर्च गर्ने वडा
              <span className="sr-only">Ward with Highest Time Spent</span>
            </h3>
            <p className="text-3xl font-bold">
              वडा {highestHighTimeWard?.wardNumber || "-"}
            </p>
            <p className="text-sm text-muted-foreground">
              {highestHighTimeWard?.percentage.toFixed(2) || "0"}% जनसंख्या ७+
              घण्टा खर्चिने
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          घरायसी कामकाज विश्लेषण
          <span className="sr-only">Household Chores Analysis of Khajura</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">समय वितरण प्रवृत्ति</h4>
            <p className="text-sm mt-2">
              बुद्धशान्ति गाउँपालिकामा अधिकांश जनसंख्या ({mostCommonPercentage}
              %)
              {mostCommonTimeSpent?.timeSpentName} समय घरायसी कामकाजमा
              खर्चिन्छन्। यो तथ्याङ्कले स्थानीय समुदायमा घरायसी कामकाज बोझको
              अवस्था र समयको उपयोग सम्बन्धी महत्वपूर्ण जानकारी प्रदान गर्दछ।
            </p>
          </div>

          <div className="bg-card p-4 rounded border">
            <h4 className="font-medium mb-2">उच्च समय वितरण</h4>
            <div className="flex items-center">
              <div className="flex-1 bg-muted h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${Math.min(parseFloat(highTimePercentage), 100)}%`,
                  }}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium">
                {highTimePercentage}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              कुल जनसंख्याको {highTimePercentage}% व्यक्तिहरूले घरायसी कामकाजमा
              ७ घण्टा वा बढी समय खर्चिने गरेको देखिन्छ
            </p>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          समग्र प्रभाव र सिफारिसहरू
          <span className="sr-only">
            Overall Impact and Recommendations for Khajura
          </span>
        </h3>
        <p className="mb-3">
          बुद्धशान्ति गाउँपालिकामा घरायसी कामकाजको वितरण र त्यसको प्रभावहरू
          निम्नअनुसार छन्:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            उल्लेख्य जनसंख्या ({highTimePercentage}%) ले घरायसी कामकाजमा दैनिक ७
            घण्टा वा बढी समय खर्चिनु पर्ने अवस्था छ, जसले उनीहरूको आय आर्जन
            क्षमतामा असर पार्न सक्छ
          </li>
          <li>
            वडा {highestHighTimeWard?.wardNumber || "-"} मा सबैभन्दा बढी
            व्यक्तिहरू (वडाको{" "}
            {highestHighTimeWard?.percentage.toFixed(2) || "0"}%) ले घरायसी
            कामकाजमा धेरै समय व्यतित गर्दछन्
          </li>
          <li>
            घरायसी कामकाजको बोझ कम गर्न र समय व्यवस्थापन सुधार गर्न विशेष
            कार्यक्रमहरू लागू गर्नुपर्ने देखिन्छ
          </li>
          <li>
            घरायसी कामको आर्थिक मूल्याङ्कन गरी यस्तो अवैतनिक कामको मूल्य पहिचान
            गरिनुपर्दछ
          </li>
        </ul>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" size="sm" className="gap-1">
            थप जान्नुहोस्
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-6">
        <h3 className="text-xl font-medium mb-2">
          थप जानकारी
          <span className="sr-only">
            Additional Information about Household Chores in Khajura
          </span>
        </h3>
        <p>
          बुद्धशान्ति गाउँपालिकाको घरायसी कामकाजमा खर्चिने समय सम्बन्धी थप
          जानकारी वा विस्तृत तथ्याङ्कको लागि, कृपया{" "}
          <Link href="/contact" className="text-primary hover:underline">
            हामीलाई सम्पर्क
          </Link>{" "}
          गर्नुहोस् वा{" "}
          <Link
            href="/profile/economics"
            className="text-primary hover:underline"
          >
            आर्थिक प्रोफाइल
          </Link>{" "}
          खण्डमा हेर्नुहोस्।
        </p>
      </div>
    </>
  );
}
