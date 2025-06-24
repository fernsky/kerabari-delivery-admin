import Link from "next/link";
import React from "react";
import FacebookIcon from "./logos/facebook";
import InstagramIcon from "./logos/instagram";
import TwitterIcon from "./logos/twitter";
import YoutubeIcon from "./logos/youtube";
import {
  Copyright,
  MapPin,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import { localizeNumber } from "@/lib/utils/localize-number";

interface FooterProps {
  lng: string;
}

const Footer: React.FC<FooterProps> = ({ lng }) => {
  const resources = [{ label: "प्रोफाइल", icon: FileText, href: "/profile" }];

  const socials = [
    {
      icon: FacebookIcon,
      href: "https://www.facebook.com/",
      label: "फेसबुक",
    },
    {
      icon: InstagramIcon,
      href: "https://www.instagram.com/",
      label: "इन्स्टाग्राम",
    },
    { icon: TwitterIcon, href: "https://www.twitter.com/", label: "ट्विटर" },
    { icon: YoutubeIcon, href: "https://www.youtube.com/", label: "युट्युब" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-green-50/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">गढवा</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              शिक्षा,स्वास्थ्य,कृषि र रोजगार ,समृद् गढवा गाउँपालिकाको आधार
            </p>
            <div className="pt-2">
              <Link
                href="https://gadhawamun.gov.np/"
                className="inline-flex items-center gap-2 text-sm text-[#123772] hover:text-green-700 transition-colors"
              >
                वेबसाइट हेर्नुहोस् <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Resources Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">स्रोतहरू</h3>
            <ul className="space-y-3">
              {resources.map((resource) => (
                <li key={resource.label}>
                  <Link
                    href={resource.href}
                    className="group flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <resource.icon className="w-4 h-4" />
                    <span className="text-sm">{resource.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">सम्पर्क</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>गढवा, दाङ</p>
              <p>नेपाल</p>
            </div>
          </div>

          {/* Social Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              हामीलाई फलो गर्नुहोस्
            </h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-white hover:bg-green-50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Copyright className="w-4 h-4" />
              <span>
                {localizeNumber(new Date().getFullYear(), "ne")} गढवा गाउँपालिका
                । सर्वाधिकार सुरक्षित
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-green-600 transition-colors"
              >
                गोपनीयता नीति
              </Link>
              <Link
                href="/terms"
                className="hover:text-green-600 transition-colors"
              >
                नियम र शर्तहरू
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
