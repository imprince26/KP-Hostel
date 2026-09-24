"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FaEye,
  FaBullseye,
  FaCheckCircle,
  FaHandHoldingHeart,
  FaTrophy,
  FaUsers,
  FaShieldAlt,
  FaSeedling,
  FaGlobeAmericas,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

export function VisionClient() {
  const t = useTranslations("vision");

  const missions = [
    "mission1",
    "mission2",
    "mission3",
    "mission4",
    "mission5",
  ];

  const values = [
    {
      icon: FaHandHoldingHeart,
      title: "value1Title",
      desc: "value1Desc",
    },
    {
      icon: FaTrophy,
      title: "value2Title",
      desc: "value2Desc",
    },
    {
      icon: FaUsers,
      title: "value3Title",
      desc: "value3Desc",
    },
    {
      icon: FaShieldAlt,
      title: "value4Title",
      desc: "value4Desc",
    },
    {
      icon: FaSeedling,
      title: "value5Title",
      desc: "value5Desc",
    },
    {
      icon: FaGlobeAmericas,
      title: "value6Title",
      desc: "value6Desc",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background border-b border-border">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <FaBullseye className="h-3.5 w-3.5" />
            <span>Ethos &amp; Guiding Principles</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground"
          >
            {t("title")} <span className="text-primary font-serif italic">{t("titleHighlight")}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t("subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="container px-4 py-12 md:py-20 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-shadow duration-300 bg-card rounded-2xl">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
                    <FaEye className="size-7 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("visionTitle")}</h2>
                </div>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {t("visionContent")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-shadow duration-300 bg-card rounded-2xl">
              <CardContent className="p-6 sm:p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3.5 bg-primary/10 text-primary rounded-2xl">
                    <FaBullseye className="size-7 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{t("missionTitle")}</h2>
                </div>
                <ul className="space-y-3.5">
                  {missions.map((mission, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <FaCheckCircle className="mt-1 text-primary shrink-0 size-4" />
                      <span className="text-muted-foreground text-sm sm:text-base leading-relaxed">{t(mission)}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            {t("valuesTitle")}
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full border border-border/80 shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-card group rounded-2xl">
                <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center">
                  <div className="mb-4 p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <value.icon className="size-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {t(value.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(value.desc)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
