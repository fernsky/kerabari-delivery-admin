"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Search, MapPin, Route } from "lucide-react";
import Image from "next/image";

interface RoadsListDisplayProps {
  roadsData: any;
  ROAD_TYPE_NAMES: Record<string, string>;
}

export default function RoadsListDisplay({
  roadsData,
  ROAD_TYPE_NAMES,
}: RoadsListDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter roads based on search query and active tab
  const filteredRoads = roadsData.items.filter((road: any) => {
    const matchesSearch =
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (road.description &&
        road.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (road.startPoint &&
        road.startPoint.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (road.endPoint &&
        road.endPoint.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = activeTab === "all" || road.type === activeTab;

    return matchesSearch && matchesTab;
  });

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "HIGHWAY":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "URBAN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "RURAL":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "GRAVEL":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "EARTHEN":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "AGRICULTURAL":
        return "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200";
      case "ALLEY":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      case "BRIDGE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <>
      <div className="mt-8" id="major-roads">
        <h2 className="text-2xl font-semibold mb-4">प्रमुख सडकहरू</h2>

        <div className="mb-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <TabsList className="h-9 overflow-x-auto">
                <TabsTrigger value="all" className="px-3">
                  सबै सडकहरू
                </TabsTrigger>
                {Object.entries(ROAD_TYPE_NAMES).map(([key, value]) => (
                  <TabsTrigger key={key} value={key} className="px-3">
                    {value}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="सडक खोज्नुहोस्..."
                  className="w-full md:w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRoads.length > 0 ? (
                  filteredRoads.map((road: any) => (
                    <Link
                      href={`/profile/transportation/roads/${road.slug}`}
                      key={road.id}
                    >
                      <Card className="h-full overflow-hidden hover:border-primary transition-colors">
                        <div className="aspect-video relative bg-muted">
                          {road.primaryMedia ? (
                            <Image
                              src={road.primaryMedia.url}
                              alt={road.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Route className="h-12 w-12 text-muted-foreground/60" />
                            </div>
                          )}
                          <Badge
                            className={`absolute top-2 right-2 ${getBadgeColor(road.type)}`}
                            variant="outline"
                          >
                            {ROAD_TYPE_NAMES[road.type] || road.type}
                          </Badge>
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="text-lg">{road.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          {road.startPoint && road.endPoint && (
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                              <span className="truncate">
                                {road.startPoint} - {road.endPoint}
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {road.description ||
                              "यस सडकको विवरण हेर्न क्लिक गर्नुहोस्।"}
                          </p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-sm">
                              {road.length &&
                                `${road.length.toLocaleString()} मिटर`}
                            </div>
                            <Button variant="ghost" size="sm" className="gap-1">
                              विवरण <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-muted-foreground">कुनै सडक फेला परेन</p>
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        className="mt-2"
                        onClick={() => setSearchQuery("")}
                      >
                        खोज खाली गर्नुहोस्
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {roadsData.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline">थप सडकहरू हेर्नुहोस्</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
