import { Inter } from "next/font/google";
import Navbar from "./_components/navbar";
import React from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}

const RootLayout: React.FC<RootLayoutProps> = async ({ children, params }) => {
  const { lng } = await params;
  return (
    <React.Fragment>
      <Navbar lng={lng} />
      {children}
    </React.Fragment>
  );
};

export default RootLayout;
