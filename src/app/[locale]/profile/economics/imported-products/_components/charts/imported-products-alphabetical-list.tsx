"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ImportedProductsAlphabeticalListProps {
  sortedGroups: Array<[string, Array<{ id?: string; productName: string }>]>;
}

export default function ImportedProductsAlphabeticalList({
  sortedGroups,
}: ImportedProductsAlphabeticalListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(
      sortedGroups.slice(0, 3).map(([letter]) => [letter, true]),
    ),
  );

  const toggleGroup = (letter: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <>
      {/* Alphabet quick navigation */}
      <div className="flex flex-wrap gap-1 mb-6 justify-center">
        {alphabet.split("").map((letter) => {
          const hasItems = sortedGroups.some(
            ([groupLetter]) => groupLetter === letter,
          );
          return (
            <Button
              key={letter}
              variant={hasItems ? "outline" : "ghost"}
              size="sm"
              className={`w-8 h-8 p-0 ${!hasItems && "text-muted-foreground opacity-50"}`}
              disabled={!hasItems}
              onClick={() => {
                if (hasItems) {
                  const element = document.getElementById(
                    `product-group-${letter}`,
                  );
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    // Also expand the group if it's collapsed
                    if (!expandedGroups[letter]) {
                      toggleGroup(letter);
                    }
                  }
                }
              }}
            >
              {letter}
            </Button>
          );
        })}
      </div>

      {/* Product groups */}
      <div className="space-y-6">
        {sortedGroups.map(([letter, products]) => (
          <div
            key={letter}
            id={`product-group-${letter}`}
            className="border rounded-lg"
          >
            <div
              className="bg-muted p-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleGroup(letter)}
            >
              <h4 className="font-semibold text-lg">{letter}</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {products.length} उत्पादन
                </span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {expandedGroups[letter] ? "−" : "+"}
                </Button>
              </div>
            </div>

            {expandedGroups[letter] && (
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-muted/50 rounded"
                    >
                      {product.productName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
