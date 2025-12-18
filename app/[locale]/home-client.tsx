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
    { label: t("statsStudents"), value: "150+", icon: FaGraduationCap },
    { label: t("statsRooms"), value: "60+", icon: FaBed },
    { label: t("statsBlocks"), value: "4", icon: FaBuilding },
    { label: t("statsYears"), value: "90+", icon: FaUsers },
  ];

  const galleryImages = ["/001.png", "/002.png", "/003.png", "/004.png"];

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-0">
        <div className="absolute inset-0 z-0">
          <Image
            src="/2.png"
            alt="KP Vidhyarthi Bhavan"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/80 via-slate-900/50 to-slate-900/80" />
        </div>

        <motion.div
          className="container relative z-10 px-4 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 backdrop-blur-md border border-white/20"
          >
            {/* <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" /> */}
            <span className="text-sm font-medium tracking-wider uppercase text-white/90">
              {t("heroSubtitle")}
            </span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6 md:mb-8 leading-tight px-4">
            {t("heroTitle")} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-200 to-amber-100">
              KP Vidhyarthi Bhavan
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-base md:text-lg lg:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed font-light px-4">
            {t("heroDescription")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center items-center px-4">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-full shadow-2xl transition-all hover:scale-105 font-semibold w-full sm:w-auto"
              asChild
            >
              <Link href={`/${locale}/admission`}>
                {t("applyNow")} <FaArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent hover:bg-white/10 text-white border-white/30 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-full backdrop-blur-sm transition-all hover:scale-105 w-full sm:w-auto"
              asChild
            >
              <Link href={`/${locale}/about`}>
                {t("about")}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Clean & Minimal */}
      <section className="py-12 md:py-16 bg-white border-b border-gray-100">
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
                <div className="mb-3 md:mb-4 inline-flex p-3 md:p-4 rounded-full bg-slate-50 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                  <stat.icon className="text-2xl md:text-3xl" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-1 md:mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm font-medium text-slate-500 uppercase tracking-widest px-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome / Human Touch Section */}
      <section className="py-16 md:py-24 bg-slate-50">
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
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-200/50 rounded-full -z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">
                Welcome to KP Bhavan
              </h2>
              <h3 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                More Than Just a <br />
                <span className="text-slate-400">Place to Stay.</span>
              </h3>
              <p className="text-base md:text-lg text-slate-600 mb-4 md:mb-6 leading-relaxed">
                At KP Vidhyarthi Bhavan, we believe in fostering an environment that nurtures both academic excellence and personal growth. Our heritage spans over 90 years of shaping young minds.
              </p>
              <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8 leading-relaxed">
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 md:mb-6 text-slate-900">
              {t("facilitiesTitle")}
            </h2>
            <p className="text-slate-500 text-base md:text-lg">
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
                <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-white text-slate-900 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-slate-500 leading-relaxed">
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
                className="group flex flex-col items-center justify-center w-full h-full min-h-50 rounded-3xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FaArrowRight />
                </div>
                <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {tCommon("viewAll")}
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blocks / Campus Section */}
      <section className="py-16 md:py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4 md:gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 md:mb-4">
                {t("blockTitle")}
              </h2>
              <p className="text-slate-400 text-sm md:text-base lg:text-lg max-w-xl">
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
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container px-4 mb-8 md:mb-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Life at Campus</h2>
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
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 md:mb-8">
            {t("admissionProcessTitle")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
            Ready to start your journey with us? Applications are now open for the upcoming academic year.
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 md:px-10 py-6 md:py-7 text-base md:text-lg font-bold shadow-xl" asChild>
            <Link href={`/${locale}/admission`}>
              {t("applyNow")}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}