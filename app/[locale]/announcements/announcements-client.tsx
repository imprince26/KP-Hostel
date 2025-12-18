"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FaBullhorn, FaCalendarAlt, FaExclamationCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Announcement {
  id: number;
  title: string;
  date: string;
  content: string;
  priority: "high" | "normal";
}

export default function AnnouncementsClient() {
  const t = useTranslations("announcements");

  // Sample announcements
  const announcements: Announcement[] = [
    {
      id: 1,
      title: "Admission Open for 2024-25",
      date: "2024-05-15",
      content: "Applications are now invited for the upcoming academic year. Please visit the office or apply online.",
      priority: "high",
    },
    {
      id: 2,
      title: "Annual Sports Day",
      date: "2024-06-10",
      content: "The annual sports meet will be held on June 20th. Interested students can register with the sports secretary.",
      priority: "normal",
    },
    {
      id: 3,
      title: "Maintenance Schedule",
      date: "2024-06-01",
      content: "Routine maintenance of Block A will be conducted this weekend. Please cooperate with the staff.",
      priority: "normal",
    },
    {
      id: 4,
      title: "Guest Lecture on Career Guidance",
      date: "2024-06-15",
      content: "A special session by industry experts will be organized in the common hall at 4 PM.",
      priority: "normal",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-white">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground"
            >
              {t("subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="py-6 md:py-8">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl">
            {announcements.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {announcements.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Card className={`border-l-4 ${item.priority === 'high' ? 'border-l-red-500' : 'border-l-primary'} hover:shadow-lg transition-all duration-300 bg-white group hover:scale-[1.02]`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${item.priority === 'high' ? 'bg-red-500/10' : 'bg-primary/10'}`}>
                                {item.priority === 'high' ? (
                                  <FaExclamationCircle className="text-red-500 size-4" />
                                ) : (
                                  <FaBullhorn className="text-primary size-4" />
                                )}
                              </div>
                              <CardTitle className="text-lg md:text-xl">{item.title}</CardTitle>
                            </div>
                            <div className="flex items-center text-xs md:text-sm text-muted-foreground gap-2 ml-11">
                              <FaCalendarAlt className="size-3" />
                              <span>{item.date}</span>
                            </div>
                          </div>
                          {item.priority === 'high' && (
                            <Badge variant="destructive" className="shrink-0">Important</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed ml-11">{item.content}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <FaBullhorn className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t("noAnnouncements")}</h3>
                <p className="text-muted-foreground">Check back later for updates</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
