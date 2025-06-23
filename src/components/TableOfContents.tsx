"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  level: number;
  text: string;
  slug: string;
}

interface TableOfContentsProps {
  toc: TocItem[];
  className?: string;
}

export function TableOfContents({ toc, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    toc.forEach(({ slug }) => {
      const element = document.getElementById(slug);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const handleClick = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <h4 className="font-medium text-sm text-[#123772] mb-3">विषयसूची</h4>
      <div className="space-y-1">
        {toc.map(({ level, text, slug }) => (
          <button
            key={slug}
            onClick={() => handleClick(slug)}
            className={cn(
              "block w-full text-left text-sm transition-colors hover:text-[#123772]",
              level === 2 && "pl-0",
              level === 3 && "pl-4",
              level === 4 && "pl-8",
              activeId === slug
                ? "text-[#123772] font-medium"
                : "text-gray-600",
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
