"use client";

import React from "react";
import Hero from "./hero";
import Statistics from "./statistics";
import WardInfo from "./ward-info";
import Footer from "./footer";
import { ParallaxProvider } from "react-scroll-parallax";
import TeraiLandscape from "./terai-landscape";

interface HomeProps {
  lng: string;
  municipalityName: string;
  municipalityNameEn: string;
  districtName: string;
  provinceName: string;
  demographicData: any;
  wardData: any;
}

export default function Home({
  lng,
  municipalityName,
  municipalityNameEn,
  districtName,
  provinceName,
  demographicData,
  wardData,
}: HomeProps) {
  return (
    <ParallaxProvider>
      <main className="min-h-screen bg-white relative">
        {/* Main content */}
        <div className="relative z-10">
          <Hero
            lng={lng}
            municipalityName={municipalityName}
            municipalityNameEn={municipalityNameEn}
            demographicData={demographicData}
          />
          <div className="space-y-12 sm:space-y-20">
            <Statistics
              demographicData={demographicData}
              isLoading={!demographicData}
              municipalityName={municipalityName}
            />

            <WardInfo
              wardData={wardData}
              isLoading={!wardData}
              lng={lng}
              municipalityName={municipalityName}
            />

            {/* <InteractiveMap />
            <NewsUpdates />
            <PhotoGallery /> */}
          </div>
          <Footer lng={lng} />
        </div>
      </main>
    </ParallaxProvider>
  );
}
