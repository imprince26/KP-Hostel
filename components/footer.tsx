"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { Info } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const quickLinks = [
    { name: tNav("home"), href: "/" },
    { name: tNav("about"), href: "/about" },
    { name: tNav("vision"), href: "/vision" },
    { name: tNav("facilities"), href: "/facilities" },
    { name: tNav("admission"), href: "/admission" },
    { name: tNav("gallery"), href: "/gallery" },
    { name: tNav("announcements"), href: "/announcements" },
    { name: tNav("contact"), href: "/contact" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">
      <div className="container px-4 py-16 md:py-20 relative z-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-xs">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none">
                  KP Vidhyarthi Bhavan
                </span>
                <span className="text-xs text-primary uppercase tracking-wider mt-1 font-semibold">
                  Est. 1932 &bull; Student Project
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("aboutText")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {t("contact")}
            </h3>
            <div className="space-y-3.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="size-4 text-primary shrink-0 mt-1" />
                <p className="leading-relaxed">
                  KP Vidhyarthi Bhavan,
                  <br />
                  Near Patidar Society, Ellisbridge,
                  <br />
                  Ahmedabad, Gujarat 380006
                </p>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="size-3.5 text-primary shrink-0" />
                <p className="font-mono text-xs">+91 XXXXX XXXXX</p>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="size-3.5 text-primary shrink-0" />
                <p className="font-mono text-xs">demo.project@XXXXX.org</p>
              </div>
            </div>
          </div>

          {/* Map Location */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Hostel Premises
            </h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted relative border border-border shadow-xs">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1054.575977372256!2d72.55586447755975!3d23.02678737328067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84e35da82901%3A0x5fe86d572d73a348!2sK.P.%20Vidhyarthi%20Bhavan!5e1!3m2!1sen!2sin!4v1766303650845!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="KP Vidhyarthi Bhavan Location"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Background Typographic Watermark (similar to Grok on x.ai) */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none border-t border-border/40 bg-muted/20 py-4 sm:py-6"
        aria-hidden="true"
      >
        <div className="whitespace-nowrap text-center px-4">
          <span className="text-[12vw] sm:text-[10.5vw] font-black tracking-tighter uppercase text-foreground/4 dark:text-foreground/3 leading-none block font-sans ">
            K.P BHAVAN
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/60">
        <div className="container px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} KP Hostel Project. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <span>Independent Student Portfolio</span>
              <span>&bull;</span>
              <span>
                Engineered by{" "}
                <Link
                  href="https://www.princepatel.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Prince Patel
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
