"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdAccessTime,
  MdSend,
} from "react-icons/md";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactClient() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Restore draft from localStorage on mount (preserves input if browser tab was suspended or switched)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kp_contact_msg_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormFields((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Could not read draft", e);
    }
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormFields((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem("kp_contact_msg_draft", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formFields),
      });

      if (response.ok) {
        toast.success(t("successMessage") || "Message sent successfully!");
        try {
          localStorage.removeItem("kp_contact_msg_draft");
        } catch (e) {}
        setFormFields({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MdLocationOn,
      title: t("address"),
      content: t("addressValue"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MdPhone,
      title: t("phoneLabel"),
      content: t("phoneValue"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MdEmail,
      title: t("emailLabel"),
      content: t("emailValue"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: MdAccessTime,
      title: t("hours"),
      content: t("hoursValue"),
      color: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-background">
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
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              {t("subtitle")}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="py-4 sm:py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full border-0 shadow-sm bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">{t("formTitle")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("name")}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formFields.name}
                          onChange={(e) => handleFieldChange("name", e.target.value)}
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
                            name="email"
                            type="email"
                            value={formFields.email}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            placeholder={t("emailPlaceholder")}
                            required
                            className="bg-muted/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formFields.phone}
                            onChange={(e) => handleFieldChange("phone", e.target.value)}
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
                          name="subject"
                          value={formFields.subject}
                          onChange={(e) => handleFieldChange("subject", e.target.value)}
                          placeholder={t("subjectPlaceholder")}
                          required
                          className="bg-muted/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">{t("message")}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formFields.message}
                          onChange={(e) => handleFieldChange("message", e.target.value)}
                          placeholder={t("messagePlaceholder")}
                          required
                          className="min-h-32 bg-muted/50"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Your text is automatically saved as a draft so you can switch apps without losing what you write.
                      </p>
                      <Button
                        type="submit"
                        className="w-full text-lg h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          t("sending")
                        ) : (
                          <>
                            <MdSend className="mr-2" />
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
                    <Card key={index} className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <div className={`flex size-12 items-center justify-center rounded-xl ${info.color}`}>
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
                  <Card className="overflow-hidden border-0 shadow-sm bg-card">
                    <CardContent className="p-0">
                      <div className="aspect-video w-full bg-muted relative">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1054.575977372256!2d72.55586447755975!3d23.02678737328067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84e35da82901%3A0x5fe86d572d73a348!2sK.P.%20Vidhyarthi%20Bhavan!5e1!3m2!1sen!2sin!4v1766303650845!5m2!1sen!2sin"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="absolute inset-0"
                        ></iframe>
                      </div>
                      <div className="p-6">
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
      </div>
  );
}
