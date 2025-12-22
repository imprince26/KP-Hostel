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
    <div className="min-h-screen bg-muted overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background">
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

      <div className="container px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FaEye className="size-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t("visionTitle")}</h2>
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
            <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <FaBullseye className="size-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t("missionTitle")}</h2>
                </div>
                <ul className="space-y-3">
                  {missions.map((mission, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <FaCheckCircle className="mt-1 text-primary shrink-0 size-4" />
                      <span className="text-muted-foreground">{t(mission)}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {t("valuesTitle")}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white group hover:scale-105">
                <CardContent className="p-6 md:p-8 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <value.icon className="size-7 md:size-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">
                    {t(value.title)}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
