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
    { name: tNav("facilities"), href: "/facilities" },
    { name: tNav("admission"), href: "/admission" },
    { name: tNav("contact"), href: "/contact" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "#", label: "Facebook" },
    { icon: FaTwitter, href: "#", label: "Twitter" },
    { icon: FaInstagram, href: "#", label: "Instagram" },
    { icon: FaYoutube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container px-4 py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg">
                <Image
                  src="/logo.jpg"
                  alt="KP Vidhyarthi Bhavan"
                  width={48}
                  height={48}
                  className="rounded"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">KP Vidhyarthi Bhavan</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Est. 1930</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t("aboutText")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex size-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-primary hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">{t("quickLinks")}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-sm text-slate-400 hover:text-primary hover:translate-x-1 transition-all inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">{t("contact")}</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-slate-400">
                <FaMapMarkerAlt className="size-5 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  KP Vidhyarthi Bhavan,<br />
                  Near Patidar Society,<br />
                  Ellisbridge, Ahmedabad,<br />
                  Gujarat 380006
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <FaPhone className="size-4 text-primary shrink-0" />
                <p>+91 79 2644 1234</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <FaEnvelope className="size-4 text-primary shrink-0" />
                <p>info@kpbhavan.org</p>
              </div>
            </div>
          </div>

          {/* Map or Extra Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Location</h3>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-800 relative grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.949944854684!2d72.5597!3d23.0258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzMyLjkiTiA3MsKwMzMnMzQuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
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
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} KP Vidhyarthi Bhavan. {t("rights")}
            </p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400">
              Developed with <span className="text-red-500">♥</span> by{" "}
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
