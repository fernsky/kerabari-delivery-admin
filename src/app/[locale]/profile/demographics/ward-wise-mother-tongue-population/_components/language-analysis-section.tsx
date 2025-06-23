"use client";

import Link from "next/link";
import { useEffect } from "react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface LanguageAnalysisProps {
  overallSummary: Array<{
    language: string;
    languageName: string;
    population: number;
  }>;
  totalPopulation: number;
  LANGUAGE_NAMES: Record<string, string>;
}

export default function LanguageAnalysisSection({
  overallSummary,
  totalPopulation,
  LANGUAGE_NAMES,
}: LanguageAnalysisProps) {
  // Modern aesthetic color palette for languages
  const LANGUAGE_COLORS = {
    NEPALI: "#6366F1", // Indigo
    MAITHILI: "#8B5CF6", // Purple
    BHOJPURI: "#EC4899", // Pink
    THARU: "#F43F5E", // Rose
    TAMANG: "#10B981", // Emerald
    NEWARI: "#06B6D4", // Cyan
    MAGAR: "#3B82F6", // Blue
    BAJJIKA: "#F59E0B", // Amber
    URDU: "#84CC16", // Lime
    HINDI: "#9333EA", // Fuchsia
    LIMBU: "#14B8A6", // Teal
    RAI: "#EF4444", // Red
    GURUNG: "#22D3EE", // Sky
    SHERPA: "#FB923C", // Orange
    DOTELI: "#A3E635", // Lime
    AWADI: "#E879F9", // Fuchsia
    OTHER: "#94A3B8", // Slate
  };

  // Calculate top two languages ratio if both exist
  const topLanguage = overallSummary[0];
  const secondLanguage = overallSummary[1];

  const topTwoLanguageRatio =
    topLanguage && secondLanguage && secondLanguage.population > 0
      ? (topLanguage.population / secondLanguage.population).toFixed(2)
      : "N/A";

  // Add SEO-friendly data attributes to enhance crawler understanding
  useEffect(() => {
    // Create English translations for key data
    const LANGUAGE_NAMES_EN: Record<string, string> = {
      NEPALI: "Nepali",
      MAITHILI: "Maithili",
      BHOJPURI: "Bhojpuri",
      THARU: "Tharu",
      TAMANG: "Tamang",
      NEWARI: "Newari",
      MAGAR: "Magar",
      BAJJIKA: "Bajjika",
      URDU: "Urdu",
      HINDI: "Hindi",
      LIMBU: "Limbu",
      RAI: "Rai",
      GURUNG: "Gurung",
      SHERPA: "Sherpa",
      DOTELI: "Doteli",
      AWADI: "Awadhi",
      OTHER: "Other",
    };

    // Add data to document.body for SEO (will be crawled but not visible to users)
    if (document && document.body) {
      document.body.setAttribute(
        "data-municipality",
        "Khajura Rural Municipality / गढवा गाउँपालिका",
      );
      document.body.setAttribute(
        "data-total-population",
        localizeNumber(totalPopulation.toString(), "ne"),
      );

      // Add main language data
      if (topLanguage) {
        const languageNameEN =
          LANGUAGE_NAMES_EN[topLanguage.language] || topLanguage.language;
        document.body.setAttribute(
          "data-main-language",
          `${languageNameEN} / ${topLanguage.languageName}`,
        );
        document.body.setAttribute(
          "data-main-language-population",
          localizeNumber(topLanguage.population.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-main-language-percentage",
          localizeNumber(
            ((topLanguage.population / totalPopulation) * 100).toFixed(2),
            "ne",
          ),
        );
      }

      // Add second language data
      if (secondLanguage) {
        const languageNameEN =
          LANGUAGE_NAMES_EN[secondLanguage.language] || secondLanguage.language;
        document.body.setAttribute(
          "data-second-language",
          `${languageNameEN} / ${secondLanguage.languageName}`,
        );
        document.body.setAttribute(
          "data-second-language-population",
          localizeNumber(secondLanguage.population.toString(), "ne"),
        );
        document.body.setAttribute(
          "data-second-language-percentage",
          localizeNumber(
            ((secondLanguage.population / totalPopulation) * 100).toFixed(2),
            "ne",
          ),
        );
      }
    }
  }, [overallSummary, totalPopulation]);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {overallSummary.slice(0, 6).map((item, index) => {
          // Define English language name for SEO
          const languageEN =
            item.language === "NEPALI"
              ? "Nepali"
              : item.language === "MAITHILI"
                ? "Maithili"
                : item.language === "BHOJPURI"
                  ? "Bhojpuri"
                  : item.language === "THARU"
                    ? "Tharu"
                    : item.language === "TAMANG"
                      ? "Tamang"
                      : item.language === "NEWARI"
                        ? "Newari"
                        : item.language === "MAGAR"
                          ? "Magar"
                          : item.language === "BAJJIKA"
                            ? "Bajjika"
                            : item.language === "URDU"
                              ? "Urdu"
                              : item.language === "HINDI"
                                ? "Hindi"
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
              data-language={`${languageEN} / ${item.languageName}`}
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
                    LANGUAGE_COLORS[
                      item.language as keyof typeof LANGUAGE_COLORS
                    ] || "#888",
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
              <div className="relative z-10">
                <h3 className="text-lg font-medium mb-2">
                  {item.languageName}
                  {/* Hidden span for SEO with English name */}
                  <span className="sr-only">{languageEN}</span>
                </h3>
                <p className="text-2xl font-bold">
                  {localizeNumber(percentage, "ne")}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {localizeNumber(item.population.toLocaleString(), "ne")} वक्ता
                  <span className="sr-only">
                    ({item.population.toLocaleString()} speakers)
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 p-4 rounded-lg mt-8">
        <h3 className="text-xl font-medium mb-4">
          भाषिक विविधता विश्लेषण
          <span className="sr-only">
            Linguistic Diversity Analysis of Khajura
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="main-language"
            data-language-name={topLanguage?.language}
            data-language-percentage={
              topLanguage
                ? ((topLanguage.population / totalPopulation) * 100).toFixed(2)
                : "0"
            }
          >
            <h4 className="font-medium mb-2">
              प्रमुख मातृभाषा
              <span className="sr-only">
                Main Mother Tongue in Khajura Rural Municipality
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {topLanguage ? topLanguage.languageName : "-"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topLanguage
                ? `कुल जनसंख्याको ${localizeNumber(
                    ((topLanguage.population / totalPopulation) * 100).toFixed(
                      2,
                    ),
                    "ne",
                  )}% व्यक्ति`
                : ""}
              <span className="sr-only">
                {topLanguage
                  ? `${((topLanguage.population / totalPopulation) * 100).toFixed(2)}% of total population in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>

          <div
            className="bg-card p-4 rounded border"
            data-analysis-type="language-ratio"
            data-ratio={topTwoLanguageRatio}
            data-primary-language={topLanguage?.language}
            data-secondary-language={secondLanguage?.language}
          >
            <h4 className="font-medium mb-2">
              प्रमुख-दोस्रो मातृभाषा अनुपात
              <span className="sr-only">
                Primary to Secondary Language Ratio in Khajura
              </span>
            </h4>
            <p className="text-3xl font-bold">
              {localizeNumber(topTwoLanguageRatio, "ne")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {topLanguage && secondLanguage
                ? `हरेक ${localizeNumber(topTwoLanguageRatio, "ne")} ${topLanguage.languageName} वक्ताका लागि १ ${secondLanguage.languageName} वक्ता`
                : ""}
              <span className="sr-only">
                {topLanguage && secondLanguage
                  ? `For every ${topTwoLanguageRatio} ${topLanguage.language.toLowerCase()} speakers, there is 1 ${secondLanguage.language.toLowerCase()} speaker in Khajura Rural Municipality`
                  : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
