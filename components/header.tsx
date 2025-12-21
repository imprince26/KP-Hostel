"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { FaBars, FaTimes, FaGlobe, FaChevronDown, FaHome, FaInfoCircle, FaEye, FaConciergeBell, FaImages, FaPhoneAlt, FaBullhorn, FaUserGraduate, FaUser, FaSignOutAlt, FaUserShield, FaCog } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  // Public navigation
  const publicNavigation = [
    { name: t("home"), href: `/${locale}`, icon: FaHome },
    { name: t("about"), href: `/${locale}/about`, icon: FaInfoCircle },
    { name: t("vision"), href: `/${locale}/vision`, icon: FaEye },
    { name: t("facilities"), href: `/${locale}/facilities`, icon: FaConciergeBell },
    { name: t("gallery"), href: `/${locale}/gallery`, icon: FaImages },
    { name: t("contact"), href: `/${locale}/contact`, icon: FaPhoneAlt },
    { name: t("announcements"), href: `/${locale}/announcements`, icon: FaBullhorn },
    { name: t("admission"), href: `/${locale}/admission`, icon: FaUserGraduate },
  ];

  // Get navigation based on role
  const getNavigation = () => {
    if (!session) return publicNavigation;
    
    if (session.user.role === "admin") {
      return [
        { name: "Dashboard", href: "/admin/dashboard", icon: FaHome },
        { name: "Applications", href: "/admin/applications", icon: FaUserGraduate },
        { name: "Payments", href: "/admin/payments", icon: FaConciergeBell },
        { name: "Announcements", href: "/admin/announcements", icon: FaBullhorn },
        { name: "Messaging", href: "/admin/messaging", icon: FaPhoneAlt },
        { name: "Blocks", href: "/admin/blocks", icon: FaHome },
      ];
    }
    
    if (session.user.role === "student") {
      return [
        { name: "Dashboard", href: "/student/dashboard", icon: FaHome },
        { name: "My Applications", href: "/student/applications", icon: FaUserGraduate },
        { name: "Apply", href: `/${locale}/admission`, icon: FaUserGraduate },
        { name: t("announcements"), href: `/${locale}/announcements`, icon: FaBullhorn },
        { name: t("facilities"), href: `/${locale}/facilities`, icon: FaConciergeBell },
        { name: t("gallery"), href: `/${locale}/gallery`, icon: FaImages },
      ];
    }
    
    return publicNavigation;
  };

  const navigation = getNavigation();

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
            <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-full max-w-2xl">
              {navigation.slice(0, 6).map((item) => {
                const isActive = item.href === `/${locale}` 
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 relative whitespace-nowrap",
                      isActive 
                        ? "text-white bg-primary shadow-sm" 
                        : "text-gray-700 hover:text-primary hover:bg-white"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {navigation.length > 6 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-white"
                      suppressHydrationWarning={true}
                    >
                      More <FaChevronDown className="size-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100">
                    {navigation.slice(6).map((item) => {
                      const isActive = item.href === `/${locale}` 
                        ? pathname === `/${locale}` || pathname === `/${locale}/`
                        : pathname.startsWith(item.href);
                      return (
                        <DropdownMenuItem key={item.href} asChild className="rounded-lg cursor-pointer">
                          <Link href={item.href} className="flex items-center gap-2 w-full">
                            <item.icon className="size-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-primary"
                    suppressHydrationWarning={true}
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

              {/* User Menu or Auth Buttons */}
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full gap-2 px-3 text-gray-700 hover:bg-gray-100 hover:text-primary hidden xl:flex"
                      suppressHydrationWarning={true}
                    >
                      {session.user.role === 'admin' ? <FaUserShield className="size-4" /> : <FaUser className="size-4" />}
                      <span className="text-xs font-medium">{session.user.name || session.user.email}</span>
                      <FaChevronDown className="size-3 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1 rounded-xl shadow-xl border-gray-100">
                    <div className="px-3 py-2 text-xs text-gray-500">
                      <div className="font-medium text-gray-900">{session.user.name}</div>
                      <div className="truncate">{session.user.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    {session.user.role === 'student' && (
                      <>
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                          <Link href="/student/dashboard" className="flex items-center gap-2 w-full">
                            <FaHome className="size-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                          <Link href="/student/settings" className="flex items-center gap-2 w-full">
                            <FaCog className="size-4" />
                            Settings
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {session.user.role === 'admin' && (
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 w-full">
                          <FaUserShield className="size-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="rounded-lg cursor-pointer text-red-600"
                    >
                      <FaSignOutAlt className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden xl:flex items-center gap-2">
                  <Button 
                    asChild
                    variant="ghost" 
                    size="sm"
                    className="rounded-full text-gray-700 hover:bg-gray-100 hover:text-primary"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button 
                    asChild
                    size="sm"
                    className="rounded-full bg-primary hover:bg-primary/90"
                  >
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              )}

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
                  // Check if route needs locale prefix (public routes) or not (admin/student routes)
                  const needsLocale = item.href.startsWith(`/${locale}`);
                  const isActive = needsLocale
                    ? (item.href === `/${locale}` 
                        ? pathname === `/${locale}` || pathname === `/${locale}/`
                        : pathname.startsWith(item.href))
                    : pathname.startsWith(item.href);
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
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
                {session ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3 mb-3">
                        {session.user.role === 'admin' ? <FaUserShield className="size-5 text-primary" /> : <FaUser className="size-5 text-primary" />}
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{session.user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{session.user.email}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          signOut({ callbackUrl: `/${locale}` });
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="mr-2 size-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      asChild 
                      className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/auth/login">
                        <FaUser className="mr-2 size-4" />
                        Login
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full rounded-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href="/auth/register">
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
