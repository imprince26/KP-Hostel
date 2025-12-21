"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: "orange" | "blue" | "purple" | "green" | "pink" | "indigo";
  children?: ReactNode;
}

const gradients = {
  orange: "from-orange-500 via-red-500 to-pink-500",
  blue: "from-blue-500 via-cyan-500 to-teal-500",
  purple: "from-purple-500 via-pink-500 to-rose-500",
  green: "from-green-500 via-emerald-500 to-teal-500",
  pink: "from-pink-500 via-rose-500 to-red-500",
  indigo: "from-indigo-500 via-purple-500 to-pink-500",
};

export function PageHeader({
  title,
  description,
  icon: Icon,
  gradient = "blue",
  children,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-b border-slate-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Orb */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl">
        <div className={`w-full h-full bg-gradient-to-br ${gradients[gradient]}`} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon */}
            {Icon && (
              <div className="mb-6">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[gradient]} shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}

            {/* Optional children (buttons, breadcrumbs, etc.) */}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
