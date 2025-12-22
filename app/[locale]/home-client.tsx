"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FaUtensils,
  FaBook,
  FaShieldAlt,
  FaUsers,
  FaBed,
  FaArrowRight,
  FaGraduationCap,
  FaBuilding,
  FaQuoteLeft,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface HomeClientProps {
  locale: string;
}

export function HomeClient({ locale }: HomeClientProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  // Consistent styling: Primary color for all icons
  const features = [
    {
      icon: FaUtensils,
      key: "meals",
    },
    {
      icon: FaBook,
      key: "study",
    },
    {
      icon: FaShieldAlt,
      key: "security",
    },
    {
      icon: FaUsers,
      key: "common",
    },
    {
      icon: FaBed,
      key: "rooms",
    },
  ];

  // Elegant, understated block colors (Slate/Dark theme)
  const blocks = [
    { key: "a", letter: "A", image: "/1.png" },
    { key: "b", letter: "B", image: "/2.png" },
    { key: "c", letter: "C", image: "/3.png" },
    { key: "d", letter: "D", image: "/4.png" },
  ];

  const stats = [
    { label: t("statsStudents"), value: "1000+", icon: FaGraduationCap },
    { label: t("statsRooms"), value: "500+", icon: FaBed },
    { label: t("statsBlocks"), value: "4", icon: FaBuilding },
    { label: t("statsYears"), value: "90+", icon: FaUsers },
  ];

  const galleryImages = ["/001.png", "/002.png", "/003.png", "/004.png"];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 w-full h-full bg-background">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,hsl(var(--foreground)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 mb-6 sm:mb-8 lg:mb-12"
            >
              <span className="text-sm font-medium tracking-wide text-primary uppercase">
                {t("heroSubtitle")}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground mb-6 sm:mb-8 leading-tight tracking-tight"
            >
              {t("heroTitle")}
              <br />
              <span className="bg-linear-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                KP Vidhyarthi Bhavan
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-light px-4"
            >
              {t("heroDescription")}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base sm:text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-xl w-full sm:w-auto"
                asChild
              >
                <Link href={`/${locale}/admission`} className="flex items-center justify-center gap-2">
                  {t("applyNow")}
                  <FaArrowRight className="text-sm sm:text-base" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-background/50 hover:bg-accent/10 text-foreground border-border/50 backdrop-blur-sm font-semibold text-base sm:text-lg px-8 py-6 rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                asChild
              >
                <Link href={`/${locale}/about`}>
                  {t("about")}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Clean & Minimal */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="mb-3 md:mb-4 inline-flex p-3 md:p-4 rounded-full bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                  <stat.icon className="text-2xl md:text-3xl" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1 md:mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-widest px-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome / Human Touch Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/003.png" 
                  alt="Student Life" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <FaQuoteLeft className="text-4xl text-white/80 mb-4" />
                  <p className="text-lg font-light italic opacity-90">
                    &ldquo;A home away from home where tradition meets modern living.&rdquo;
                  </p>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-muted/50 rounded-full -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
                Welcome to KP Bhavan
              </h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
                More Than Just a <br />
                <span className="text-muted-foreground">Place to Stay.</span>
              </h3>
              <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                At KP Vidhyarthi Bhavan, we believe in fostering an environment that nurtures both academic excellence and personal growth. Our heritage spans over 90 years of shaping young minds.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                We provide a safe, inclusive, and vibrant community where students from diverse backgrounds come together to learn, share, and grow.
              </p>
              <Button variant="default" size="lg" className="rounded-full px-6 md:px-8" asChild>
                <Link href={`/${locale}/about`}>
                  Read Our Story
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Facilities Section - Clean & Consistent */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 text-foreground">
              {t("facilitiesTitle")}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg">
              Everything you need for a comfortable and productive student life.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group p-8 rounded-3xl bg-muted hover:bg-card hover:shadow-xl transition-all duration-300 border border-border hover:border-primary">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-card text-card-foreground shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-card-foreground">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`features.${feature.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {/* View All Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center"
            >
              <Link 
                href={`/${locale}/facilities`}
                className="group flex flex-col items-center justify-center w-full h-full min-h-50 rounded-3xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FaArrowRight />
                </div>
                <span className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                  {tCommon("viewAll")}
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blocks / Campus Section */}
      <section className="py-16 md:py-24 bg-card text-card-foreground overflow-hidden">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4 md:gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
                {t("blockTitle")}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-xl">
                Our campus consists of four main residential blocks, each designed to provide a comfortable living space.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {blocks.map((block, index) => (
              <motion.div
                key={block.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl aspect-3/4"
              >
                <Image
                  src={block.image}
                  alt={`Block ${block.letter}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-6xl font-black text-white/10 absolute top-4 right-4">
                      {block.letter}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{t(`blocks.${block.key}.name`)}</h3>
                    <div className="space-y-1 text-sm text-slate-300">
                      <div className="flex items-center gap-2">
                        <FaUsers className="size-3" />
                        <span>{t(`blocks.${block.key}.type`)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaBed className="size-3" />
                        <span>{t(`blocks.${block.key}.capacity`)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="container px-4 mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Life at Campus</h2>
        </div>
        <div className="w-full overflow-hidden">
          <div className="flex animate-scroll gap-3 md:gap-4">
            {[...galleryImages, ...galleryImages].map((src, i) => (
              <div key={i} className="relative w-64 h-48 md:w-96 md:h-72 shrink-0 rounded-lg md:rounded-xl overflow-hidden shadow-md">
                <Image src={src} alt="Gallery" fill className="object-cover hover:scale-110 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
        <div className="container px-4 relative z-10 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-6 md:mb-8">
            {t("admissionProcessTitle")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-primary-foreground/90 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Ready to start your journey with us? Applications are now open for the upcoming academic year.
          </p>
          <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-bold shadow-xl" asChild>
            <Link href={`/${locale}/admission`}>
              {t("applyNow")}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}