"use client";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GridIcon,
  Home,
  Users,
  MapPin,
  PieChart,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";
import { localizeNumber } from "@/lib/utils/localize-number";

interface WardInfoProps {
  wardData?:
    | Array<{
        id?: string;
        wardNumber: number;
        wardName?: string;
        year: number;
        totalPopulation?: number;
        totalHouseholds?: number;
        areaSqKm?: number | string;
        populationDensity?: number | string;
        sexRatio?: number | string;
      }>
    | undefined;
  isLoading: boolean;
  lng: string;
  municipalityName?: string;
}

const WardInfo: React.FC<WardInfoProps> = ({
  wardData,
  isLoading,
  lng,
  municipalityName = "बुद्धशान्ति गाउँपालिका",
}) => {
  // State to track selected ward for mobile view
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  // Process ward data for SEO and display
  const processedWards = useMemo(() => {
    if (!wardData || wardData.length === 0) {
      return [];
    }

    // Map the real data to our format
    return wardData
      .sort((a, b) => a.wardNumber - b.wardNumber)
      .map((ward) => {
        const colorMap: Record<number, string> = {
          1: "from-[#0b1f42] via-[#123772] to-[#1a4894]",
          2: "from-[#123772] via-[#1a4894] to-[#0b1f42]",
          3: "from-[#1a4894] via-[#0b1f42] to-[#123772]",
          4: "from-[#123772] via-[#0b1f42] to-[#1a4894]",
          5: "from-[#0b1f42] via-[#1a4894] to-[#123772]",
        };

        const areaSqKm =
          typeof ward.areaSqKm === "string"
            ? parseFloat(ward.areaSqKm)
            : ward.areaSqKm || 0;

        const populationDensity =
          typeof ward.populationDensity === "string"
            ? parseFloat(ward.populationDensity)
            : ward.populationDensity || 0;

        const sexRatio =
          typeof ward.sexRatio === "string"
            ? parseFloat(ward.sexRatio)
            : ward.sexRatio || 100;

        return {
          number: ward.wardNumber,
          households: ward.totalHouseholds || 0,
          population: ward.totalPopulation || 0,
          area: areaSqKm,
          density: populationDensity,
          sexRatio: sexRatio,
          color:
            colorMap[ward.wardNumber] ||
            "from-[#123772] via-[#1a4894] to-[#0b1f42]",
          year: ward.year,
        };
      });
  }, [wardData]);

  // Calculate totals for the summary row
  const wardTotals = useMemo(() => {
    if (!processedWards || processedWards.length === 0) {
      return {
        totalPopulation: 0,
        totalHouseholds: 0,
        totalArea: 0,
        avgDensity: 0,
        avgSexRatio: 0,
      };
    }

    const totalPopulation = processedWards.reduce(
      (sum, ward) => sum + ward.population,
      0,
    );
    const totalHouseholds = processedWards.reduce(
      (sum, ward) => sum + ward.households,
      0,
    );
    const totalArea = processedWards.reduce((sum, ward) => sum + ward.area, 0);

    // Calculate weighted average density and sex ratio
    const avgDensity = totalPopulation / totalArea || 0;

    // For sex ratio, take the average of all wards
    const avgSexRatio =
      processedWards.reduce((sum, ward) => sum + ward.sexRatio, 0) /
        processedWards.length || 0;

    return {
      totalPopulation,
      totalHouseholds,
      totalArea,
      avgDensity: parseFloat(avgDensity.toFixed(2)),
      avgSexRatio: parseFloat(avgSexRatio.toFixed(2)),
    };
  }, [processedWards]);

  // Create structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${municipalityName}का वडाहरू - जनसांख्यिकीय तथ्याङ्क`,
    description: `${municipalityName}का वडाहरूको जनसंख्या, घरधुरी, क्षेत्रफल र अन्य महत्वपूर्ण तथ्याङ्क`,
    url: `https://digital.buddhashantimun.gov.np/${lng}/profile/demographics`,
    keywords: [
      `${municipalityName} वडा`,
      `${municipalityName} वडा विवरण`,
      "Khajura Rural Municipality wards",
    ],
    variableMeasured: processedWards.map((ward) => ({
      "@type": "PropertyValue",
      name: `वडा ${ward.number}`,
      value: {
        जनसंख्या: ward.population,
        घरधुरी: ward.households,
        क्षेत्रफल: ward.area,
        जनघनत्व: ward.density,
        "लैङ्गिक अनुपात": ward.sexRatio,
      },
    })),
    creator: {
      "@type": "Organization",
      name: municipalityName,
    },
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      id="ward-info"
      className="relative overflow-hidden"
      itemScope
      itemType="https://schema.org/Dataset"
    >
      {/* Add structured data for SEO */}
      <Script
        id="wards-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="py-16 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-sm border-[#123772]/20 shadow-sm inline-flex items-center"
          >
            <GridIcon className="w-3 h-3 mr-1 text-[#1a4894]" />
            <span className="text-xs text-[#0b1f42] font-medium">
              प्रशासनिक विभाजन
            </span>
          </Badge>

          <h2
            className="text-2xl md:text-3xl font-bold mb-1.5 bg-gradient-to-r from-[#0b1f42] to-[#1a4894] bg-clip-text text-transparent"
            itemProp="name"
          >
            वडा जानकारी
          </h2>

          <p
            className="text-gray-600 max-w-2xl mx-auto text-xs md:text-sm"
            itemProp="description"
          >
            {municipalityName}को प्रत्येक वडाको आधारभूत जानकारी
          </p>
        </motion.div>

        {isLoading ? (
          <WardInfoSkeleton />
        ) : processedWards.length === 0 ? (
          <EmptyWardState />
        ) : (
          <>
            {/* Desktop/Tablet Layout - Compact Table View */}
            <div className="hidden md:block overflow-hidden rounded-xl shadow-sm bg-white/90 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#123772]/5 text-left">
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        वडा नं.
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>जनसंख्या</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <Home className="w-3.5 h-3.5" />
                          <span>घरधुरी</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>क्षेत्रफल (वर्ग कि.मि.)</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <PieChart className="w-3.5 h-3.5" />
                          <span>जनघनत्व</span>
                        </div>
                      </th>
                      <th className="py-3 px-4 text-sm font-medium text-[#0b1f42] border-b border-[#123772]/10">
                        <div className="flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5" />
                          <span>लैङ्गिक अनुपात</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedWards.map((ward, idx) => (
                      <motion.tr
                        key={ward.number}
                        variants={itemVariants}
                        className={`hover:bg-[#123772]/5 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-[#123772]/5"}`}
                      >
                        <td className="py-2.5 px-4 border-b border-[#123772]/5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full bg-gradient-to-r ${ward.color} flex items-center justify-center text-white font-semibold`}
                            >
                              {localizeNumber(ward.number, "ne")}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 border-b border-[#123772]/5 font-medium">
                          {localizeNumber(
                            ward.population.toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="py-2.5 px-4 border-b border-[#123772]/5 font-medium">
                          {localizeNumber(
                            ward.households.toLocaleString(),
                            "ne",
                          )}
                        </td>
                        <td className="py-2.5 px-4 border-b border-[#123772]/5 font-medium">
                          {localizeNumber(ward.area, "ne")}
                        </td>
                        <td className="py-2.5 px-4 border-b border-[#123772]/5 font-medium">
                          {localizeNumber(ward.density, "ne")}
                        </td>
                        <td className="py-2.5 px-4 border-b border-[#123772]/5 font-medium">
                          {localizeNumber(ward.sexRatio, "ne")}
                        </td>
                      </motion.tr>
                    ))}

                    {/* Totals Row */}
                    <motion.tr
                      variants={itemVariants}
                      className="bg-[#123772]/10 font-medium"
                    >
                      <td className="py-3 px-4 border-t border-[#123772]/20">
                        <div className="flex items-center gap-2">
                          <div className="text-[#0b1f42] font-semibold">
                            जम्मा
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-t border-[#123772]/20 text-[#0b1f42] font-semibold">
                        {localizeNumber(
                          wardTotals.totalPopulation.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="py-3 px-4 border-t border-[#123772]/20 text-[#0b1f42] font-semibold">
                        {localizeNumber(
                          wardTotals.totalHouseholds.toLocaleString(),
                          "ne",
                        )}
                      </td>
                      <td className="py-3 px-4 border-t border-[#123772]/20 text-[#0b1f42] font-semibold">
                        {localizeNumber(wardTotals.totalArea.toFixed(2), "ne")}
                      </td>
                      <td className="py-3 px-4 border-t border-[#123772]/20 text-[#0b1f42] font-semibold">
                        {localizeNumber(wardTotals.avgDensity.toFixed(2), "ne")}
                      </td>
                      <td className="py-3 px-4 border-t border-[#123772]/20 text-[#0b1f42] font-semibold">
                        {localizeNumber(
                          wardTotals.avgSexRatio.toFixed(2),
                          "ne",
                        )}
                      </td>
                    </motion.tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Layout - Compact Cards */}
            <div className="md:hidden">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-2.5"
              >
                {processedWards.map((ward) => (
                  <MobileWardCard
                    key={ward.number}
                    ward={ward}
                    isSelected={selectedWard === ward.number}
                    onSelect={() =>
                      setSelectedWard(
                        selectedWard === ward.number ? null : ward.number,
                      )
                    }
                    lng={lng}
                  />
                ))}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Mobile Card with Expandable Details
const MobileWardCard = ({
  ward,
  isSelected,
  onSelect,
  lng,
}: {
  ward: any;
  isSelected: boolean;
  onSelect: () => void;
  lng: string;
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 },
      }}
      className="relative"
    >
      <Card className="border-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden">
        {/* Card Header with basic info */}
        <div
          className={`bg-gradient-to-r ${ward.color} p-2.5 flex items-center justify-between relative cursor-pointer`}
          onClick={onSelect}
        >
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></div>

          <div className="flex items-center z-10 relative">
            <h3 className="font-bold text-white text-base">
              वडा {localizeNumber(ward.number, "ne")}
            </h3>

            <div className="bg-white/20 w-px h-5 mx-2"></div>

            <div className="text-white">
              <Users className="inline-block w-3 h-3 mr-1 opacity-80" />
              <span className="font-medium text-sm">
                {localizeNumber(ward.population.toLocaleString(), "ne")}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: isSelected ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="z-10 relative"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 grid grid-cols-2 gap-2 text-sm">
                {/* Households */}
                <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                  <Home className="w-3 h-3 text-[#1a4894] mr-1.5" />
                  <div>
                    <span className="text-xs text-gray-500">घरधुरी</span>
                    <p className="font-medium text-gray-900">
                      {localizeNumber(ward.households.toLocaleString(), "ne")}
                    </p>
                  </div>
                </div>

                {/* Area */}
                <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                  <MapPin className="w-3 h-3 text-[#1a4894] mr-1.5" />
                  <div>
                    <span className="text-xs text-gray-500">क्षेत्रफल</span>
                    <p className="font-medium text-gray-900">
                      {localizeNumber(ward.area, "ne")}{" "}
                      <span className="text-xs">वर्ग कि.मि.</span>
                    </p>
                  </div>
                </div>

                {/* Population Density */}
                <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                  <PieChart className="w-3 h-3 text-[#1a4894] mr-1.5" />
                  <div>
                    <span className="text-xs text-gray-500">जनघनत्व</span>
                    <p className="font-medium text-gray-900">
                      {localizeNumber(ward.density, "ne")}{" "}
                      <span className="text-xs">/कि.मि²</span>
                    </p>
                  </div>
                </div>

                {/* Sex Ratio */}
                <div className="flex items-center p-1.5 bg-[#123772]/5 rounded-md">
                  <BarChart2 className="w-3 h-3 text-[#1a4894] mr-1.5" />
                  <div>
                    <span className="text-xs text-gray-500">
                      लैङ्गिक अनुपात
                    </span>
                    <p className="font-medium text-gray-900">
                      {localizeNumber(ward.sexRatio, "ne")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Skeleton loader with a table layout - updated to blue scheme
const WardInfoSkeleton = () => (
  <div className="overflow-hidden rounded-xl shadow-sm bg-white/90">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#123772]/5">
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-16" />
            </th>
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-20" />
            </th>
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-20" />
            </th>
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-24" />
            </th>
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-20" />
            </th>
            <th className="py-3 px-4 text-left border-b border-[#123772]/10">
              <Skeleton className="h-5 w-20" />
            </th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#123772]/5"}>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </td>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <Skeleton className="h-5 w-16" />
              </td>
              <td className="py-3 px-4 border-b border-[#123772]/5">
                <Skeleton className="h-5 w-16" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Empty state with updated blue styling
const EmptyWardState = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-8 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-[#123772]/10"
  >
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="p-3 rounded-full bg-[#123772]/10 text-[#0b1f42]">
        <GridIcon className="w-5 h-5" />
      </div>
      <p className="text-gray-500 text-sm">वडा सम्बन्धी जानकारी उपलब्ध छैन</p>
    </div>
  </motion.div>
);

export default WardInfo;
