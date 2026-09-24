"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Megaphone,
  Calendar,
  User,
  Clock,
  Pin,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createExcerpt } from "@/lib/announcement-utils";

interface Announcement {
  announcement: {
    id: string;
    title: string;
    content: string;
    isPublic: boolean;
    targetAudience: string | null;
    isPinned: boolean;
    expiresAt: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pinned" | "important">("all");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityLevel = (announcement: Announcement["announcement"]) => {
    if (announcement.isPinned) return "high";
    const content = (announcement.title + " " + announcement.content).toLowerCase();
    if (content.includes("urgent") || content.includes("important") || content.includes("critical")) {
      return "urgent";
    }
    return "normal";
  };

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((item) => {
      const { title, content, isPinned } = item.announcement;
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.author?.name && item.author.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeTab === "pinned") {
        return isPinned;
      }
      if (activeTab === "important") {
        const priority = getPriorityLevel(item.announcement);
        return priority === "urgent" || priority === "high";
      }

      return true;
    });
  }, [announcements, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Header Banner */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background border-b border-border">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Official Notices & Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("title")}{" "}
            <span className="text-primary font-serif italic">
              {t("titleHighlight") || "Announcements"}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("subtitle") || "Stay informed with the latest notifications, schedules, and important hostel updates."}
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search announcements by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex gap-1.5 p-1 bg-muted rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "all"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({announcements.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pinned")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "pinned"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pinned
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("important")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === "important"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Important
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Content */}
      <section className="py-8 md:py-12">
        <div className="container px-4 mx-auto max-w-5xl">
          {error && (
            <Alert className="mb-6 border-destructive/20 bg-destructive/10 text-destructive">
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAnnouncements}
                  className="ml-4 h-8"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 border-border/80">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredAnnouncements.length > 0 ? (
            <div className="grid gap-4 sm:gap-6">
              {filteredAnnouncements.map((item, index) => {
                const priority = getPriorityLevel(item.announcement);
                const excerpt = createExcerpt(item.announcement.content, 220);

                return (
                  <motion.div
                    key={item.announcement.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                  >
                    <Card
                      onClick={() => setSelectedAnnouncement(item)}
                      className="group cursor-pointer border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden text-left"
                    >
                      {/* Priority accent bar */}
                      <div
                        className={`h-1 w-full ${
                          priority === "urgent"
                            ? "bg-amber-600"
                            : item.announcement.isPinned
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      />

                      <CardHeader className="p-5 pb-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.announcement.isPinned && (
                              <Badge
                                variant="secondary"
                                className="bg-primary/10 text-primary border-primary/20 text-xs font-medium gap-1 px-2.5 py-0.5"
                              >
                                <Pin className="h-3 w-3" />
                                Pinned
                              </Badge>
                            )}
                            {priority === "urgent" && (
                              <Badge
                                variant="outline"
                                className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 text-xs font-medium gap-1 px-2.5 py-0.5"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Important Notice
                              </Badge>
                            )}
                            {item.announcement.targetAudience && item.announcement.targetAudience !== "all" && (
                              <Badge variant="outline" className="text-xs capitalize text-muted-foreground">
                                {item.announcement.targetAudience.replace("_", " ")}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-primary/70" />
                              {formatDate(item.announcement.createdAt)}
                            </span>
                            {item.announcement.expiresAt && (
                              <span className="hidden sm:flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                                Valid until {formatDate(item.announcement.expiresAt)}
                              </span>
                            )}
                          </div>
                        </div>

                        <CardTitle className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                          {item.announcement.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-5 py-2">
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                      </CardContent>

                      <CardFooter className="px-5 py-3 border-t border-border/40 bg-muted/20 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          {item.author?.name ? (
                            <>
                              <User className="h-3.5 w-3.5" />
                              <span>{item.author.name}</span>
                            </>
                          ) : (
                            <span>Notice Desk</span>
                          )}
                        </span>

                        <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          Read announcement
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Info className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                No announcements match your search
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                Try searching with different terms or reset your active filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Full Announcement Detail Dialog */}
      <Dialog
        open={!!selectedAnnouncement}
        onOpenChange={(isOpen) => !isOpen && setSelectedAnnouncement(null)}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
          {selectedAnnouncement && (
            <>
              <DialogHeader className="p-6 pb-4 border-b border-border bg-muted/30 shrink-0 text-left">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {selectedAnnouncement.announcement.isPinned && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                  {selectedAnnouncement.announcement.targetAudience && (
                    <Badge variant="outline" className="text-xs capitalize">
                      Audience: {selectedAnnouncement.announcement.targetAudience.replace("_", " ")}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                    <Calendar className="h-3.5 w-3.5" />
                    Published: {formatDate(selectedAnnouncement.announcement.createdAt)}
                  </span>
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {selectedAnnouncement.announcement.title}
                </DialogTitle>

                {selectedAnnouncement.author?.name && (
                  <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" />
                    Issued by {selectedAnnouncement.author.name}
                  </DialogDescription>
                )}
              </DialogHeader>

              <ScrollArea className="flex-1 p-6 max-h-[calc(85vh-12rem)]">
                <div
                  className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedAnnouncement.announcement.content }}
                />

                {selectedAnnouncement.announcement.expiresAt && (
                  <div className="mt-8 p-3 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      Notice active until:{" "}
                      <strong>{formatDate(selectedAnnouncement.announcement.expiresAt)}</strong>
                    </span>
                  </div>
                )}
              </ScrollArea>

              <DialogFooter className="px-6 py-3 border-t border-border bg-muted/20 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
