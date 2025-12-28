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
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/001.png"
            alt="KP Vidhyarthi Bhavan"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container relative z-10 px-4">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-gray-900">
              {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium">
              {t("subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container px-4 pb-24">
        <div className="space-y-16 md:space-y-24">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden border-none shadow-lg">
                <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`relative min-h-75 md:min-h-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
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
                  
                  <CardContent className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="hidden md:flex items-center gap-3 mb-6">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                        <section.icon className="size-6 text-primary" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                    
                    <div className="prose prose-lg text-muted-foreground max-w-none">
                      <p className="leading-relaxed whitespace-pre-line">{section.content}</p>
                      
                      {section.subSections && section.subSections.map((sub, idx) => (
                        <div key={idx} className="mt-8 pt-8 border-t border-border">
                          <h3 className="text-xl font-semibold text-foreground mb-3">{sub.title}</h3>
                          <p className="leading-relaxed whitespace-pre-line">{sub.content}</p>
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
