"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaSearchPlus, FaTimes } from "react-icons/fa";

export default function GalleryClient() {
  const t = useTranslations("gallery");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ["All", "Exterior", "Rooms", "Mess", "Common Areas", "Facilities"];

  // Using the actual images found in the public folder
  const galleryImages = [
    { src: "/intro/1.png", category: "Exterior", alt: "Hostel Entrance" },
    { src: "/intro/2.png", category: "Common Areas", alt: "Lobby Area" },
    { src: "/intro/3.png", category: "Facilities", alt: "Student Facilities" },
    { src: "/gallery/image.png", category: "Rooms", alt: "Student Room" },
    { src: "/gallery/image copy.png", category: "Mess", alt: "Dining Hall" },
    { src: "/gallery/image copy 2.png", category: "Common Areas", alt: "Study Hall" },
    { src: "/gallery/image copy 3.png", category: "Exterior", alt: "Building View" },
    { src: "/gallery/image copy 4.png", category: "Facilities", alt: "Gym Area" },
    { src: "/gallery/image copy 5.png", category: "Rooms", alt: "Double Room" },
    { src: "/gallery/image copy 6.png", category: "Mess", alt: "Kitchen" },
    { src: "/gallery/image copy 7.png", category: "Common Areas", alt: "Recreation Room" },
  ];

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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

      {/* Filter Buttons */}
      <section className="pb-12">
        <div className="container px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6"
              >
                {category === "All" ? "All" : t(category.toLowerCase().split(' ')[0].toLowerCase() as any) || category}
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  key={image.src}
                  className="group cursor-pointer"
                  onClick={() => setSelectedImage(image.src)}
                >
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-0 relative aspect-square">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <FaSearchPlus className="text-white text-3xl drop-shadow-lg" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full size-12"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes className="size-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-5xl aspect-video md:aspect-auto md:h-[80vh] rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Gallery Image"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
