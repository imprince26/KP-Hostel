"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FaBed,
  FaUtensils,
  FaShieldAlt,
  FaTshirt,
  FaCouch,
  FaParking,
  FaWifi,
  FaTools,
  FaCheckCircle,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FacilitiesClient() {
  const t = useTranslations("facilities");

  const facilities = [
    {
      icon: FaBed,
      key: "accommodation",
    },
    {
      icon: FaUtensils,
      key: "mess",
    },
    {
      icon: FaShieldAlt,
      key: "security",
    },
    {
      icon: FaTshirt,
      key: "laundry",
    },
    {
      icon: FaCouch,
      key: "common",
    },
    {
      icon: FaParking,
      key: "parking",
    },
    {
      icon: FaWifi,
      key: "internet",
    },
    {
      icon: FaTools,
      key: "maintenance",
    },
  ];

  const infrastructure = [
    "infrastructure1",
    "infrastructure2",
    "infrastructure3",
    "infrastructure4",
    "infrastructure5",
    "infrastructure6",
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background border-b border-border">
        <div className="container px-4 mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <FaTools className="h-3.5 w-3.5" />
            <span>Campus Amenities &amp; Services</span>
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
        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 mb-16">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Card className="h-full border border-border/80 shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-300 bg-card group rounded-2xl">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="mb-4 p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <facility.icon className="size-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {t(facility.key)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${facility.key}Desc`)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Infrastructure Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="overflow-hidden border border-border/80 shadow-sm bg-card rounded-2xl">
            <CardContent className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">{t("infrastructureTitle")}</h2>
                <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {infrastructure.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/50 border border-border/50"
                  >
                    <FaCheckCircle className="size-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base text-foreground font-medium">{t(item)}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
