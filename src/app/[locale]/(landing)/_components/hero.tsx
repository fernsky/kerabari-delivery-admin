"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Mountain,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Users,
  Home,
  TreePalm,
} from "lucide-react";
import Head from "next/head";
import { localizeNumber } from "@/lib/utils/localize-number";
import Image from "next/image";

interface HeroProps {
  lng: string;
  municipalityName: string;
  municipalityNameEn: string;
  demographicData?: {
    totalPopulation?: number | null;
    totalHouseholds?: number | null;
    areaSqKm?: string | null;
    populationDensity?: string | null;
    id?: string;
  } | null;
}

const Hero: React.FC<HeroProps> = ({
  lng,
  municipalityName,
  municipalityNameEn,
  demographicData,
}) => {
  // Extract data with proper fallbacks
  const totalArea = demographicData?.areaSqKm
    ? parseFloat(demographicData.areaSqKm)
    : 356.57;

  // Get ward count data for Khajura Rural Municipality
  const wardCount = 8;

  // Calculate stats to display
  const population = demographicData?.totalPopulation || 35055;
  const households = demographicData?.totalHouseholds || 7562;

  // SEO description with actual data
  const seoDescription = `${municipalityName} (${municipalityNameEn}) - ${localizeNumber(totalArea.toString(), "ne")} वर्ग कि.मि. क्षेत्रफल, ${localizeNumber(wardCount.toString(), "ne")} प्रशासनिक वडाहरू, ${localizeNumber(population.toString(), "ne")} जनसंख्या। दाङ जिल्लाको प्राकृतिक सुन्दरता र समृद्ध संस्कृति। सम्पूर्ण जानकारी र नक्सा यहाँ उपलब्ध छ।`;

  return (
    <>
      {/* SEO Structured Data */}
      <Head>
        <meta name="description" content={seoDescription} />
        <meta
          property="og:title"
          content={`${municipalityName} | आधिकारिक वेबसाइट`}
        />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "GovernmentOrganization",
            name: municipalityName,
            alternateName: municipalityNameEn,
            url: `https://${lng === "en" ? "en." : ""}digital.khajuramun.gov.np`,
            logo: "https://digital.khajuramun.gov.np/logo.png",
            areaServed: {
              "@type": "AdministrativeArea",
              name: "Khajura",
              containedIn: "Banke District, Nepal",
              description: seoDescription,
              additionalProperty: [
                {
                  "@type": "PropertyValue",
                  name: "population",
                  value: population,
                },
                {
                  "@type": "PropertyValue",
                  name: "numberOfWards",
                  value: wardCount,
                },
                {
                  "@type": "PropertyValue",
                  name: "totalArea",
                  value: totalArea,
                  unitCode: "KMQ",
                },
              ],
            },
          })}
        </script>
      </Head>

      {/* Background Container with SVG Pattern */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/gadhawa.jpg"
            alt="Gadhawa Municipality Background"
            fill
            priority={true}
            className="object-cover"
          />
          {/* Enhanced overlay with better contrast and gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1f42]/60 via-[#123772]/50 to-[#1a4894]/40 z-10 backdrop-blur-[6px]"></div>

          {/* Additional subtle texture */}
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5 mix-blend-overlay z-10"></div>
        </div>

        {/* Content Section */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pt-16">
          {/* Hero Content Container with improved text readability */}

          {/* Logos Section - Coat of Arms and Municipality Logo */}
          <motion.div
            className="flex justify-center items-center w-full max-w-4xl mx-auto mb-8 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            {/* Coat of Arms of Nepal - Left */}
            <div className="flex-shrink-0">
              <Image
                src="/images/coat_of_arms.png"
                alt="Coat of Arms of Nepal"
                width={160}
                height={160}
                className="w-40 h-40 sm:w-40 sm:h-40 object-contain drop-shadow-lg"
              />
            </div>
          </motion.div>
          <motion.div
            className="w-full max-w-4xl mx-auto rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Municipality Name with text shadow for better contrast */}
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2 text-center text-white drop-shadow-md"
              itemProp="name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {municipalityName}
            </motion.h1>

            {/* Location with subtle text shadow */}
            <motion.div
              className="text-base sm:text-lg leading-relaxed mb-6 text-gray-100 max-w-2xl mx-auto text-center drop-shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              दाङ जिल्ला, लुम्बिनी प्रदेश
              <div className="text-sm block"> </div>
            </motion.div>

            {/* Key Metrics Cards with enhanced contrast */}
            <motion.div
              className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center mb-8 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Area Card - improved with stronger background */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894] text-xs sm:text-sm">
                <TreePalm className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span
                  className="font-medium whitespace-nowrap"
                  itemProp="areaServed"
                  itemScope
                  itemType="https://schema.org/AdministrativeArea"
                >
                  <span itemProp="size">
                    {localizeNumber(totalArea.toString(), "ne")}
                  </span>{" "}
                  वर्ग कि.मि.
                </span>
              </div>

              {/* Ward Count Card */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894] text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {localizeNumber(wardCount.toString(), "ne")} वडा
                </span>
              </div>

              {/* Population Card */}
              {demographicData?.totalPopulation && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894] text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {localizeNumber(
                      demographicData.totalPopulation.toString(),
                      "ne",
                    )}{" "}
                    जनसंख्या
                  </span>
                </div>
              )}

              {/* Households Card */}
              {demographicData?.totalHouseholds && (
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-md px-2 sm:px-3 py-1.5 rounded-full shadow-md text-[#123772] border border-[#123772]/20 border-l-4 border-l-[#1a4894] text-xs sm:text-sm">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">
                    {localizeNumber(
                      demographicData.totalHouseholds.toString(),
                      "ne",
                    )}{" "}
                    घरधुरी
                  </span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons with improved visibility */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Profile Button - enhanced with deeper shadow */}
              <Link href={`/profile`}>
                <motion.button
                  className="group px-8 py-4 bg-gradient-to-r from-[#0b1f42] to-[#1a4894] text-white rounded-xl shadow-xl flex items-center gap-2 relative overflow-hidden"
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10"></span>
                  <span className="relative">प्रोफाइल हेर्नुहोस्</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative" />
                </motion.button>
              </Link>

              {/* Map Button */}
              <Link href={`/profile`}>
                <motion.button
                  className="px-8 py-4 border-2 border-white text-white rounded-xl transition-all flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  नक्सा हेर्नुहोस्
                  <MapPin className="w-4 h-4 group-hover:animate-bounce" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Hero;
