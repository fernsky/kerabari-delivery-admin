"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import OlRoadMap from "./ol-road-map";
import { ImageGallery } from "./image-gallery";
import {
  CalendarIcon,
  CheckIcon,
  XIcon,
  InfoIcon,
  HelpCircleIcon,
} from "lucide-react";

interface ClientRoadDetailDisplayProps {
  road: any;
  roadTypeNepali: string;
  roadConditionNepali: string;
  drainageSystemNepali: string;
}

export function ClientRoadDetailDisplay({
  road,
  roadTypeNepali,
  roadConditionNepali,
  drainageSystemNepali,
}: ClientRoadDetailDisplayProps) {
  const [activeTab, setActiveTab] = useState<string>("map");

  const hasImages = road.media && road.media.length > 0;

  // Process image metadata for better SEO
  const enhanceMediaMetadata = () => {
    if (!hasImages) return [];

    return road.media.map((img: any, index: number) => ({
      ...img,
      // Use existing title or generate one if not present
      title:
        img.title ||
        `${road.name} - ${roadTypeNepali}${road.condition ? " (" + roadConditionNepali + ")" : ""} तस्वीर ${index + 1}`,
      // Use existing description or generate one if not present
      description:
        img.description ||
        `${road.name} ${roadTypeNepali} सडक${road.startPoint && road.endPoint ? ", " + road.startPoint + " देखि " + road.endPoint + " सम्म" : ""}${road.condition ? ", " + roadConditionNepali + " अवस्थामा" : ""}`,
    }));
  };

  const enhancedMedia = enhanceMediaMetadata();

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ne-NP").format(date);
  };

  return (
    <div>
      <Tabs
        defaultValue="map"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">नक्शा</TabsTrigger>
          <TabsTrigger value="images" disabled={!hasImages}>
            तस्वीरहरू {hasImages && `(${road.media.length})`}
          </TabsTrigger>
          <TabsTrigger value="details">थप विवरण</TabsTrigger>
        </TabsList>

        {/* Map Tab */}
        <TabsContent value="map" id="location-and-map">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>सडक नक्शा</CardTitle>
              <CardDescription>सडकको स्थान र मार्ग</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[500px] p-0 overflow-hidden rounded-b-lg">
              <OlRoadMap road={road} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab - Enhanced Gallery with SEO */}
        <TabsContent value="images" id="images">
          {hasImages ? (
            <ImageGallery
              images={enhancedMedia}
              alt={road.name}
              roadName={road.name}
              roadType={roadTypeNepali}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>तस्वीरहरू उपलब्ध छैनन्</CardTitle>
                <CardDescription>
                  यस सडकको कुनै तस्वीर हालसम्म अपलोड गरिएको छैन
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>

        {/* Details Tab - Comprehensive information about the road */}
        <TabsContent value="details" id="additional-details">
          <Card>
            <CardHeader>
              <CardTitle>सडक विवरण - विस्तृत जानकारी</CardTitle>
              <CardDescription>
                {road.name} सम्बन्धी सम्पूर्ण जानकारी
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">सडक नाम</TableCell>
                    <TableCell>{road.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सडक प्रकार</TableCell>
                    <TableCell>{roadTypeNepali}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सुरु बिन्दु</TableCell>
                    <TableCell>{road.startPoint || "उल्लेख नगरिएको"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">अन्तिम बिन्दु</TableCell>
                    <TableCell>{road.endPoint || "उल्लेख नगरिएको"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सडक लम्बाई</TableCell>
                    <TableCell>
                      {road.length
                        ? `${road.length.toLocaleString()} मिटर`
                        : "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सडक चौडाई</TableCell>
                    <TableCell>
                      {road.widthInMeters
                        ? `${road.widthInMeters} मिटर`
                        : "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सडक अवस्था</TableCell>
                    <TableCell>
                      {roadConditionNepali || "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      पानी निकास प्रणाली
                    </TableCell>
                    <TableCell>
                      {drainageSystemNepali || "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      अन्तिम मर्मत वर्ष
                    </TableCell>
                    <TableCell>
                      {road.maintenanceYear || "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">सडक बत्ती</TableCell>
                    <TableCell>
                      {road.hasStreetLights ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" /> छ
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <XIcon className="h-3.5 w-3.5 mr-1" /> छैन
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">डिभाइडर</TableCell>
                    <TableCell>
                      {road.hasDivider ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" /> छ
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <XIcon className="h-3.5 w-3.5 mr-1" /> छैन
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">पैदल मार्ग</TableCell>
                    <TableCell>
                      {road.hasPedestrian ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" /> छ
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <XIcon className="h-3.5 w-3.5 mr-1" /> छैन
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">साइकल लेन</TableCell>
                    <TableCell>
                      {road.hasBicycleLane ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" /> छ
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-muted-foreground"
                        >
                          <XIcon className="h-3.5 w-3.5 mr-1" /> छैन
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">अपडेट मिति</TableCell>
                    <TableCell>
                      {formatDate(road.updatedAt) || "उल्लेख नगरिएको"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {road.description && (
                <div className="mt-6">
                  <h4 className="text-base font-medium mb-2 flex items-center gap-2">
                    <InfoIcon className="h-4 w-4" /> विस्तृत विवरण
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {road.description}
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-muted rounded-md">
                <div className="flex items-start gap-2">
                  <HelpCircleIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    नोट: माथि प्रस्तुत गरिएका तथ्याङ्कहरू पालिकाको पूर्वाधार
                    विकास शाखा र प्राविधिक कार्यालयबाट संकलन गरिएका हुन्।
                    तथ्याङ्क अद्यावधिक गरिएको मिति:{" "}
                    {formatDate(road.updatedAt) || "अज्ञात"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
