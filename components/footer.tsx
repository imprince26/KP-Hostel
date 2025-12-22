"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

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
    <footer className="bg-background border-t border-border shadow-sm">
      <div className="container px-4 py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-xl shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground leading-none">KP Vidhyarthi Bhavan</span>
                <span className="text-xs text-primary uppercase tracking-wider mt-1 font-semibold">Est. 1930</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("aboutText")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">{t("quickLinks")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">{t("contact")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  KP Vidhyarthi Bhavan,<br />
                  Near Patidar Society,<br />
                  Ellisbridge, Ahmedabad,<br />
                  Gujarat 380006
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaPhone className="size-4 text-primary shrink-0" />
                <p>+91 79 2644 1234</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaEnvelope className="size-4 text-primary shrink-0" />
                <p>info@kpbhavan.org</p>
              </div>
            </div>
          </div>

          {/* Map or Extra Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Location</h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted relative transition-all duration-500 shadow-sm border border-border">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1054.575977372256!2d72.55586447755975!3d23.02678737328067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84e35da82901%3A0x5fe86d572d73a348!2sK.P.%20Vidhyarthi%20Bhavan!5e1!3m2!1sen!2sin!4v1766303650845!5m2!1sen!2sin"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} KP Vidhyarthi Bhavan. {t("rights")}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border text-center">
            <p className="text-xs text-muted">
              Developed with <span className="text-destructive">♥</span> by{" "}
              <span className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Prince Patel
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
