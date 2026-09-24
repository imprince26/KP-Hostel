"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaHistory,
  FaBuilding,
  FaUserTie,
  FaAward,
  FaLandmark,
} from "react-icons/fa";

export function AboutClient() {
  const t = useTranslations("about");

  const sections = [
    {
      id: "establishment",
      icon: FaHistory,
      title: t("establishmentTitle"),
      content: t("establishmentContent"),
      image: "/001.png",
    },
    {
      id: "building",
      icon: FaBuilding,
      title: t("ownBuildingTitle"),
      content: t("ownBuildingContent"),
      subSections: [
        {
          title: t("constructionTitle"),
          content: t("constructionContent"),
        },
      ],
      image: "/002.png",
    },
    {
      id: "inauguration",
      icon: FaLandmark,
      title: t("inaugurationTitle"),
      content: t("inaugurationContent"),
      subSections: [
        {
          title: t("historicalTitle"),
          content: t("historicalContent"),
        },
      ],
      image: "/003.png",
    },
    {
      id: "progress",
      icon: FaAward,
      title: t("progressTitle"),
      content: t("progressContent"),
      image: "/004.png",
    },
    {
      id: "milestones",
      icon: FaAward,
      title: t("goldenJubileeTitle"),
      content: t("goldenJubileeContent"),
      subSections: [
        {
          title: t("diamondJubileeTitle"),
          content: t("diamondJubileeContent"),
        },
      ],
      image: "/1.png",
    },
    {
      id: "leadership",
      icon: FaUserTie,
      title: t("administratorsTitle"),
      content: t("administratorsContent"),
      subSections: [
        {
          title: t("otherCommunitiesTitle"),
          content: t("otherCommunitiesContent"),
        },
      ],
      image: "/2.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background border-b border-border overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <FaHistory className="h-3.5 w-3.5" />
            <span>Heritage &amp; History Since 1930</span>
          </div>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("title")}{" "}
            <span className="text-primary font-serif italic">
              {t("titleHighlight")}
            </span>
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container px-4 py-12 md:py-20 mx-auto max-w-6xl">
        <div className="space-y-12 md:space-y-16">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`relative min-h-72 md:min-h-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 text-white md:hidden">
                      <div className="flex items-center gap-2">
                        <section.icon className="size-5" />
                        <h3 className="font-bold text-lg">{section.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className={`p-6 sm:p-8 md:p-10 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="hidden md:flex items-center gap-3 mb-5">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <section.icon className="size-5 text-primary" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">{section.title}</h2>
                    </div>
                    
                    <div className="text-muted-foreground text-sm sm:text-base leading-relaxed space-y-4">
                      <p className="whitespace-pre-line">{section.content}</p>
                      
                      {section.subSections && section.subSections.map((sub, idx) => (
                        <div key={idx} className="mt-6 pt-6 border-t border-border">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{sub.title}</h3>
                          <p className="whitespace-pre-line text-sm text-muted-foreground">{sub.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
