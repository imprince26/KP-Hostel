"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { FaBars, FaTimes, FaGlobe, FaChevronDown, FaHome, FaInfoCircle, FaEye, FaConciergeBell, FaImages, FaPhoneAlt, FaBullhorn, FaUserGraduate } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const navigation = [
    { name: t("home"), href: "/", icon: FaHome },
    { name: t("about"), href: "/about", icon: FaInfoCircle },
    { name: t("vision"), href: "/vision", icon: FaEye },
    { name: t("facilities"), href: "/facilities", icon: FaConciergeBell },
    { name: t("gallery"), href: "/gallery", icon: FaImages },
    { name: t("contact"), href: "/contact", icon: FaPhoneAlt },
    { name: t("announcements"), href: "/announcements", icon: FaBullhorn },
    { name: t("admission"), href: "/admission", icon: FaUserGraduate },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  };

  // Prevent body scroll when sidebar is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          // Always white background with shadow for visibility on all pages
          "bg-white/95 backdrop-blur-md shadow-md"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 md:gap-3 group shrink-0">
              <div className="relative overflow-hidden rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={48}
                  height={48}
                  className="object-cover size-10 md:size-12"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm md:text-base xl:text-xl leading-none tracking-tight text-gray-900">
                  KP Vidhyarthi Bhavan
                </span>
                <span className="text-xs font-medium tracking-wider uppercase text-primary">
                  Est. 1930
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-50 p-1.5 rounded-full">
              {navigation.map((item) => {
                const isActive = item.href === "/" 
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(`/${locale}${item.href}`);
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 relative",
                      isActive 
                        ? "text-white bg-primary shadow-sm" 
                        : "text-gray-700 hover:text-primary hover:bg-white"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    <FaGlobe className="size-4" />
                    <span className="hidden sm:inline uppercase text-xs font-bold">{locale}</span>
                    <FaChevronDown className="size-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 p-1 rounded-xl shadow-xl border-gray-100">
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={switchLocale("en")} className="flex items-center justify-between w-full">
                      English {locale === 'en' && <span className="size-1.5 rounded-full bg-primary" />}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href={switchLocale("gu")} className="flex items-center justify-between w-full">
                      ગુજરાતી {locale === 'gu' && <span className="size-1.5 rounded-full bg-primary" />}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden rounded-full text-gray-900 hover:bg-gray-100 hover:text-primary"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <FaBars className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60 xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-70 xl:hidden flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="bg-slate-50 text-gray-900 p-6 border-b border-gray-100 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <Image
                        src="/logo.jpg"
                        alt="KP Vidhyarthi Bhavan"
                        width={40}
                        height={40}
                        className="object-cover size-10"
                      />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight text-gray-900">KP Bhavan</h2>
                      <p className="text-xs text-gray-600">Est. 1930</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 shrink-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaTimes className="size-5" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your home away from home for over 90 years
                </p>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {navigation.map((item, index) => {
                  const isActive = item.href === "/" 
                    ? pathname === `/${locale}` || pathname === `/${locale}/`
                    : pathname.startsWith(`/${locale}${item.href}`);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/${locale}${item.href}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                          isActive
                            ? "bg-primary/5 text-primary border border-primary/10"
                            : "text-gray-700 hover:bg-slate-50 hover:text-primary"
                        )}
                      >
                        <item.icon className={cn(
                          "size-5 transition-transform group-hover:scale-110",
                          isActive ? "text-primary" : "text-gray-500 group-hover:text-primary"
                        )} />
                        <span className="font-medium text-base">{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 rounded-full bg-primary"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <div className="bg-slate-50 p-6 border-t border-gray-100 shrink-0">
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">Need assistance?</p>
                  <Button 
                    asChild 
                    className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={`/${locale}/contact`}>
                      <FaPhoneAlt className="mr-2 size-4" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
