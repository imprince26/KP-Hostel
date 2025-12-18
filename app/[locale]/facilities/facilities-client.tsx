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

      <div className="container px-4 py-12 md:py-16">
        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {facilities.map((facility, index) => (
            <motion.div
              key={facility.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white group hover:scale-105">
                <CardContent className="p-5 md:p-6 flex flex-col items-center text-center h-full">
                  <div className="mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <facility.icon className="size-7 md:size-8 text-primary" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-gray-900">
                    {t(facility.key)}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
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
          <Card className="overflow-hidden border-none shadow-lg bg-white">
            <CardContent className="p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">{t("infrastructureTitle")}</h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
              </div>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {infrastructure.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <FaCheckCircle className="mt-1 text-primary shrink-0 size-4" />
                    <span className="text-base md:text-lg text-muted-foreground">{t(item)}</span>
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
