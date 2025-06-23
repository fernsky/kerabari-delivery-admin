"use client";
import React, { useState, useEffect } from "react";
import ChangeLanguage from "./change-language";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Book,
  Download,
  User,
  MapPin,
  Sparkles,
  Mountain,
  ChevronRight,
  Info,
  FileText,
  Map,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  lng: string;
}

const Navbar: React.FC<NavbarProps> = ({ lng }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      href: `/profile`,
      label: "प्रोफाइल",
      icon: Book,
      color: "from-[#123772] to-[#1a4894]",
      description: "इन्टर्याक्टिभ प्रोफाइल हेर्नुहोस्",
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div
        className={`transition-all duration-300 ${scrolled ? "py-3" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <Link
              href={`/profile`}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              {/* <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white group-hover:shadow-lg group-hover:shadow-[#123772]/25 transition-all duration-300">
                <Mountain className="w-5 h-5" />
              </div> */}
              <div className="flex items-center">
                <Image
                  src="/images/Gadhawa_transparent.png"
                  alt="Gadhawa Municipality Logo"
                  width={80}
                  height={80}
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  onError={(e) => {
                    console.log("Image failed to load:", e);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-bold sm:text-3xl md:text-4xl tracking-tight ${
                    scrolled ? "text-gray-800" : "text-white"
                  }`}
                >
                  गढवा
                </span>
              </div>
            </Link>

            {/* Simplified Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-2"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        scrolled
                          ? "border border-[#123772]/20"
                          : "bg-white/20 backdrop-blur-sm border border-white/30"
                      } transition-all`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${
                          scrolled ? "text-[#123772]" : "text-white"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium tracking-tight ${
                        scrolled ? "text-gray-600" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`md:hidden p-2 rounded-xl transition-all ${
                scrolled
                  ? "bg-gradient-to-br from-[#123772]/10 to-[#0b1f42]/10 text-[#123772]"
                  : "bg-white/20 text-white backdrop-blur-sm"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-[#123772]/10 z-[500]"
            >
              <div
                className={`px-4 pt-2 pb-3 z-[500] ${
                  scrolled
                    ? "bg-gradient-to-b from-white to-[#123772]/5"
                    : "bg-gradient-to-b from-[#0b1f42]/90 to-[#123772]/80 backdrop-blur-sm"
                }`}
              >
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        scrolled ? "" : ""
                      } transition-all duration-300`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          scrolled
                            ? "bg-gradient-to-br from-[#123772] to-[#0b1f42] text-white"
                            : "border border-white/30 bg-white/20 text-white"
                        } shadow-sm transition-all`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`text-sm font-medium ${
                            scrolled ? "text-gray-900" : "text-white"
                          } transition-colors`}
                        >
                          {item.label}
                        </h4>
                        <p
                          className={`text-xs ${
                            scrolled ? "text-gray-500" : "text-white/70"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
