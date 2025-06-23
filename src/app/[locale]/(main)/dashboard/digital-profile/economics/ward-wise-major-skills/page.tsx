"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Loader2,
  SlidersHorizontal,
  BarChart3,
  WrenchIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import WardWiseMajorSkillsTable from "./_components/ward-wise-major-skills-table";
import WardWiseMajorSkillsForm from "./_components/ward-wise-major-skills-form";
import WardWiseMajorSkillsChart from "./_components/ward-wise-major-skills-chart";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardWiseMajorSkillsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("table");

  const {
    data: wardWiseMajorSkillsData,
    isLoading,
    error,
  } = api.profile.economics.wardWiseMajorSkills.getAll.useQuery();

  const handleEdit = (id: string) => {
    setEditId(id);
    setIsFormOpen(true);
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditId(null);
  };

  return (
    <ContentLayout
      title="वडा अनुसार प्रमुख सीप विवरण"
      subtitle="वडा अनुसार प्रमुख सीप सम्बन्धी विवरण"
      icon={<WrenchIcon className="h-6 w-6 text-primary" />}
      actions={
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> नयाँ डाटा थप्नुहोस्
        </Button>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="table" className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            डाटा तालिका
          </TabsTrigger>
          <TabsTrigger value="chart" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            विश्लेषण र चार्टहरू
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {isLoading ? (
            <Card className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2">डाटा लोड गर्दै...</span>
            </Card>
          ) : error ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <p className="text-red-500">
                  {error instanceof Error
                    ? error.message
                    : "डाटा प्राप्त गर्दा त्रुटि"}
                </p>
              </CardContent>
            </Card>
          ) : !wardWiseMajorSkillsData ||
            wardWiseMajorSkillsData.length === 0 ? (
            <Card className="py-16">
              <CardContent className="text-center">
                <p className="text-muted-foreground text-lg">
                  कुनै पनि वडा अनुसार प्रमुख सीप डाटा उपलब्ध छैन।
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsFormOpen(true)}
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" /> डाटा थप्नुहोस्
                </Button>
              </CardContent>
            </Card>
          ) : (
            <WardWiseMajorSkillsTable
              data={wardWiseMajorSkillsData}
              onEdit={handleEdit}
            />
          )}
        </TabsContent>

        <TabsContent value="chart" className="space-y-4">
          {isLoading ? (
            <Card className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-2">डाटा लोड गर्दै...</span>
            </Card>
          ) : (
            <WardWiseMajorSkillsChart data={wardWiseMajorSkillsData || []} />
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editId
                ? "वडा अनुसार प्रमुख सीप अपडेट गर्नुहोस्"
                : "नयाँ वडा अनुसार प्रमुख सीप थप्नुहोस्"}
            </DialogTitle>
          </DialogHeader>
          <WardWiseMajorSkillsForm
            editId={editId}
            onClose={handleClose}
            existingData={wardWiseMajorSkillsData || []}
          />
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}
