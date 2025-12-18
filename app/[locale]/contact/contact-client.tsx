"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactClient() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Message sent successfully!"); // Replace with proper toast/notification
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: t("address"),
      content: t("addressValue"),
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: FaPhone,
      title: t("phoneLabel"),
      content: t("phoneValue"),
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: FaEnvelope,
      title: t("emailLabel"),
      content: t("emailValue"),
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: FaClock,
      title: t("hours"),
      content: t("hoursValue"),
      color: "bg-orange-500/10 text-orange-600",
    },
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

      <section className="py-4 md:py-6">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t("formTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input
                          id="name"
                          placeholder={t("namePlaceholder")}
                          required
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder={t("emailPlaceholder")}
                            required
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder={t("phonePlaceholder")}
                            required
                            className="bg-muted/50"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t("subject")}</Label>
                        <Input
                          id="subject"
                          placeholder={t("subjectPlaceholder")}
                          required
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t("message")}</Label>
                        <Textarea
                          id="message"
                          placeholder={t("messagePlaceholder")}
                          required
                          className="min-h-37.5 bg-muted/50"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full text-lg h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          t("sending")
                        ) : (
                          <>
                            <FaPaperPlane className="mr-2" />
                            {t("send")}
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Info & Map */}
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className={`flex size-12 items-center justify-center rounded-full ${info.color}`}>
                          <info.icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          <p className="text-sm text-muted-foreground">{info.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>

                {/* Map */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="aspect-video w-full bg-muted relative">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.949944854684!2d72.5597!3d23.0258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAxJzMyLjkiTiA3MsKwMzMnMzQuOSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0"
                        ></iframe>
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="font-semibold text-lg mb-2">{t("visitTitle")}</h3>
                        <p className="text-muted-foreground">{t("visitDesc")}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
