import React from "react";
import { motion } from "framer-motion";
import {
  Flag,
  Users,
  Building,
  FileText,
  Award,
  MapPin,
  Sparkles,
  InfoIcon,
  Milestone,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const HistoryTimeline = () => {
  const events = [
    {
      year: 2015,
      title: "Constitutional Milestone",
      description:
        "Promulgation of the new Constitution of Nepal, establishing federal democratic republic",
      icon: Flag,
      color: "from-green-500 to-emerald-600",
      location: "Kathmandu",
      category: "Governance",
      stats: [
        { label: "Provinces", value: "7" },
        { label: "Local Units", value: "753" },
      ],
    },
    {
      year: 2017,
      title: "Municipality Formation",
      description:
        "Official establishment of Likhu Pike Rural Municipality under the new federal structure",
      icon: Building,
      color: "from-emerald-500 to-green-600",
      stats: [
        { label: "Area Coverage", value: "124.38 km²" },
        { label: "Initial Wards", value: "5" },
      ],
    },
    {
      year: 2018,
      title: "First Local Government",
      description:
        "Formation of first elected local government and administrative setup",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      year: 2021,
      title: "National Census",
      description:
        "Population: 5,334 | Households: 1,268 | Average Family Size: 5",
      icon: FileText,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      year: 2023,
      title: "Digital Transformation",
      description: "Launch of digital profile and e-governance initiatives",
      icon: Award,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white/80" />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="w-4 h-4 mr-1" />
            Historical Journey
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Our Journey Through Time
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Key milestones in the development of khajura Rural Municipality
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-green-200 via-green-400 to-green-200 md:transform md:-translate-x-1/2" />

          {events.map((event, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={event.year}
              className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-12 mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Enhanced Timeline Point */}
              <motion.div
                className="absolute left-[8px] md:left-1/2 z-10 top-[32px] md:top-1/2 transform -translate-y-1/2 md:-translate-x-1/2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex items-center justify-center text-white">
                    <span className="text-base font-bold">{event.year}</span>
                  </div>
                  {/* Year Label for desktop */}
                  <div className="hidden md:block mt-2 px-3 py-1 rounded-md bg-white/90 shadow-sm border border-green-100">
                    <span className="text-sm font-medium text-green-600">
                      {event.category || "Milestone"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content Container */}
              <div
                className={`pl-24 md:pl-0 w-full md:w-[calc(50%-3rem)] ${
                  index % 2 === 0 ? "md:pr-16" : "md:pl-16"
                }`}
              >
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative h-full">
                    {/* Enhanced gradient background */}
                    <div
                      className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-br ${event.color} opacity-10 group-hover:opacity-15 transition-opacity`}
                    />

                    <CardContent className="relative p-6">
                      <div className="flex flex-col gap-6">
                        {/* Header with Icon and Category */}
                        <div className="flex items-start justify-between">
                          <div
                            className={`p-3 w-fit rounded-xl bg-gradient-to-br ${event.color} text-white group-hover:scale-105 transition-transform`}
                          >
                            <event.icon className="w-5 h-5" />
                          </div>
                          <Badge
                            variant="outline"
                            className="font-medium flex items-center gap-1.5"
                          >
                            <Milestone className="w-3.5 h-3.5" />
                            {event.category || "Milestone"}
                          </Badge>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {event.description}
                          </p>

                          {/* Stats Grid */}
                          {event.stats && (
                            <div className="grid grid-cols-2 gap-4 pt-4">
                              {event.stats.map((stat, i) => (
                                <div
                                  key={i}
                                  className="bg-gray-50/50 rounded-lg p-3 hover:bg-gray-50/80 transition-colors"
                                >
                                  <p className="text-sm text-gray-500 mb-1">
                                    {stat.label}
                                  </p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {stat.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Enhanced Footer */}
                        {event.location && (
                          <div className="flex items-center justify-between pt-4 mt-2 border-t">
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">
                                  {event.location}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;
