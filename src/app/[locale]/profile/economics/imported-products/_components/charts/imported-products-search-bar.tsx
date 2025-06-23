"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImportedProductsSearchBarProps {
  importedProductsData: Array<{
    id?: string;
    productName: string;
  }>;
}

export default function ImportedProductsSearchBar({
  importedProductsData,
}: ImportedProductsSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    typeof importedProductsData
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Filter products based on search term
    const results = importedProductsData.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResults(results);
    setIsSearching(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Input
            type="search"
            placeholder="उत्पादनको नाम खोज्नुहोस्..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button onClick={handleSearch}>खोज्नुहोस्</Button>
        {isSearching && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm("");
              setSearchResults([]);
              setIsSearching(false);
            }}
          >
            रद्द गर्नुहोस्
          </Button>
        )}
      </div>

      {isSearching && (
        <div className="border rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">
            खोज नतिजाहरू: {searchResults.length} उत्पादनहरू फेला परे
          </h4>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {searchResults.map((product) => (
                <div key={product.id} className="p-2 hover:bg-muted/50 rounded">
                  {product.productName}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              कुनै उत्पादन फेला परेन। कृपया फरक शब्दावली प्रयोग गरेर पुनः
              खोज्नुहोस्।
            </p>
          )}
        </div>
      )}
    </div>
  );
}
