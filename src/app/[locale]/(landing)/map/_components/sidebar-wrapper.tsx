"use client";
import React from "react";
import useStore from "../../_store/app-store";
import Sidebar from "./sidebar";
import FloatingSidebar from "./floating-sidebar";

interface SidebarWrapperProps {
  lng: string;
}

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ lng }) => {
  const isMapSidebarOpen = useStore((state) => state.isMapSidebarOpen);

  return (
    <>
      {isMapSidebarOpen ? (
        <div className="fixed top-0 right-0 z-[400] h-screen max-h-screen">
          <Sidebar lng={lng} />
        </div>
      ) : (
        <div className="fixed top-[90px] right-5">
          <FloatingSidebar lng={lng} />
        </div>
      )}
    </>
  );
};

export default SidebarWrapper;
