"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { FaBullhorn, FaCalendarAlt, FaExclamationCircle, FaUser, FaClock } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Announcement {
  announcement: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    targetAudience: string | null;
    isPinned: boolean;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  author: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

export default function AnnouncementsClient() {
  const t = useTranslations("announcements");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/announcements/public");
      const data = await response.json();

      if (response.ok) {
        setAnnouncements(data.announcements || []);
      } else {
        setError(data.error || "Failed to fetch announcements");
      }
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPriorityLevel = (announcement: Announcement['announcement']) => {
    if (announcement.isPinned) return 'high';
    const content = announcement.title.toLowerCase() + announcement.content.toLowerCase();
    if (content.includes('urgent') || content.includes('important') || content.includes('critical')) return 'urgent';
    if (announcement.expiresAt && new Date(announcement.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) return 'medium';
    return 'normal';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-white">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl text-center">
              <Skeleton className="h-12 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-80 mx-auto" />
            </div>
          </div>
        </section>

        {/* Loading Announcements */}
        <section className="py-6 md:py-8">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl space-y-4 md:space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

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
            {error ? (
              <Alert className="mb-6">
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAnnouncements}
                    className="ml-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : null}

            {announcements.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {announcements.map((item, index) => {
                  const priority = getPriorityLevel(item.announcement);
                  return (
                    <motion.div
                      key={item.announcement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Card className="h-full bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:scale-[1.02]">
                        {/* Priority indicator stripe */}
                        <div className={`h-1 w-full ${
                          priority === 'urgent' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                          priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-yellow-500' :
                          priority === 'medium' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                          'bg-gradient-to-r from-gray-400 to-gray-500'
                        }`} />

                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${
                                  priority === 'urgent' ? 'bg-red-100 text-red-600' :
                                  priority === 'high' ? 'bg-orange-100 text-orange-600' :
                                  priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {priority === 'urgent' ? <FaExclamationCircle className="size-4" /> :
                                   priority === 'high' ? <FaExclamationCircle className="size-4" /> :
                                   <FaBullhorn className="size-4" />}
                                </div>
                                <CardTitle className="text-lg md:text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                  {item.announcement.title}
                                </CardTitle>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                  <FaCalendarAlt className="size-3.5 text-primary" />
                                  <span>{formatDate(item.announcement.createdAt)}</span>
                                </div>
                                {item.author?.name && (
                                  <div className="flex items-center gap-1.5">
                                    <FaUser className="size-3.5 text-primary" />
                                    <span className="truncate max-w-32">{item.author.name}</span>
                                  </div>
                                )}
                                {item.announcement.expiresAt && (
                                  <div className="flex items-center gap-1.5">
                                    <FaClock className="size-3.5 text-primary" />
                                    <span>Expires: {formatDate(item.announcement.expiresAt)}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                              {item.announcement.isPinned && (
                                <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-3 py-1">
                                  📌 Pinned
                                </Badge>
                              )}
                              {priority === 'high' && (
                                <Badge variant="destructive" className="font-medium px-3 py-1">
                                  ⚠️ Important
                                </Badge>
                              )}
                              {priority === 'urgent' && (
                                <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-3 py-1">
                                  🚨 Urgent
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="relative">
                            <div
                              className="text-sm md:text-base text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-primary hover:prose-a:text-primary/80"
                              dangerouslySetInnerHTML={{
                                __html: item.announcement.content.length > 300
                                  ? `${item.announcement.content.substring(0, 300)}...`
                                  : item.announcement.content
                              }}
                            />
                            {item.announcement.content.length > 300 && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 p-0 h-auto font-medium">
                                  Read More →
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : !loading && !error ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-md">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <FaBullhorn className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{t("noAnnouncements") || "No Announcements"}</h3>
                <p className="text-muted-foreground">Check back later for updates</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
