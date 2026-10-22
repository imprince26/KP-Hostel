import Link from "next/link";
import { ReactNode } from "react";

export const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/credits", label: "Image & Content Credits" },
] as const;

interface LegalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Shared layout for the standalone legal pages.
 *
 * These pages are intentionally English-only and live outside the `[locale]`
 * segment, so legal wording is never machine-translated.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-4 pt-32 pb-12 md:pt-40 md:pb-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {description}
          </p>
          <p className="mt-6 text-xs uppercase tracking-wider text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
          <div className="max-w-3xl space-y-12 text-sm md:text-[0.95rem] leading-relaxed text-muted-foreground">
            {children}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground">
              Legal &amp; Credits
            </p>
            <nav aria-label="Legal pages" className="mt-4 flex flex-col gap-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      </section>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold text-foreground tracking-tight">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5 pl-1">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3">
          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 px-5 py-4 text-sm text-foreground">
      {children}
    </div>
  );
}
