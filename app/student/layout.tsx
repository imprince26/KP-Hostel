"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  ChevronLeft,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDialog from "@/components/NotificationDialog";
import { useRequireLegalConsent } from "@/hooks/use-consent-gate";
import { queryKeys, useApiQuery } from "@/hooks/use-data";
import type { NotificationRecord } from "@/lib/api-types";

type NavItem = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const studentNavigation: NavItem[] = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "Applications", href: "/student/applications", icon: FileText },
  { name: "Notifications", href: "/student/notifications", icon: Bell },
  { name: "Settings", href: "/student/settings", icon: Settings },
];

function initialsOf(name?: string | null) {
  return (
    name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "S"
  );
}

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isStudent = session?.user?.role === "student";
  const needsConsent = useRequireLegalConsent();

  const notificationsQuery = useApiQuery<{ notifications: NotificationRecord[] }>(
    queryKeys.notifications,
    "/api/notifications",
    Boolean(session?.user?.id)
  );

  const unreadCount = (notificationsQuery.data?.notifications ?? []).filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && !isStudent) {
      router.push("/");
    }
  }, [status, isStudent, router]);

  if (status === "loading" || needsConsent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!isStudent) {
    return null;
  }

  const userInitials = initialsOf(session?.user?.name);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-2 border-b border-border bg-card px-3 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        <Link href="/student/dashboard" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center overflow-hidden rounded-md bg-primary">
            <Image
              src="/logo.jpg"
              alt=""
              width={32}
              height={32}
              className="size-full object-cover"
            />
          </span>
          <span className="text-sm font-semibold text-foreground">
            KP Hostel
          </span>
        </Link>

        <NotificationDialog />
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed bottom-0 left-0 top-14 z-40 flex flex-col border-r border-border bg-card transition-[width,transform] duration-300 ease-in-out lg:top-0 lg:h-screen",
          collapsed ? "lg:w-20" : "lg:w-60",
          "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-4 z-10 hidden size-6 rounded-full border-border bg-card text-muted-foreground shadow-sm hover:bg-muted hover:text-foreground lg:inline-flex"
        >
          <ChevronLeft
            className={cn(
              "size-3.5 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </Button>

        {/* Branding */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-3 border-b border-border px-3",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          <Link
            href="/student/dashboard"
            title={collapsed ? "KP Vidhyarthi Bhavan" : undefined}
            className="flex min-w-0 items-center gap-3 rounded-lg"
          >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary">
              <Image
                src="/logo.jpg"
                alt="KP Vidhyarthi Bhavan"
                width={36}
                height={36}
                className="size-full object-cover"
              />
            </span>
            {!collapsed && (
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-sm font-bold leading-tight text-foreground">
                  KP Vidhyarthi Bhavan
                </span>
                <span className="block whitespace-nowrap text-xs text-muted-foreground">
                  Student portal
                </span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2.5">
          {studentNavigation.map((item) => {
            const active = isActive(item.href);
            const showBadge = item.href === "/student/notifications" && unreadCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "lg:justify-center lg:px-0"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.name}</span>}

                {showBadge &&
                  (collapsed ? (
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card lg:right-3 lg:top-2.5" />
                  ) : (
                    <span
                      className={cn(
                        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold leading-5",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ))}
              </Link>
            );
          })}

          <div className="my-2 border-t border-border" />

          <Link
            href="/"
            title={collapsed ? "Back to website" : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <ExternalLink className="size-5 shrink-0" />
            {!collapsed && <span className="flex-1 truncate">Back to website</span>}
          </Link>
        </nav>

        {/* Account */}
        <div className="shrink-0 border-t border-border p-2.5">
          <Link
            href="/student/settings"
            title={collapsed ? session?.user?.name ?? "Account" : undefined}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted",
              collapsed && "lg:justify-center"
            )}
          >
            <Avatar className="size-9 shrink-0 border border-border">
              <AvatarImage
                src={session?.user?.avatar || undefined}
                alt={session?.user?.name ?? "Profile picture"}
              />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">
                  {session?.user?.name ?? "Student"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {session?.user?.email}
                </span>
              </span>
            )}
          </Link>

          <Button
            asChild
            variant="ghost"
            className={cn(
              "mt-1 w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <Link href="/auth/signout">
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </Link>
          </Button>
        </div>
      </aside>

      <main
        className={cn(
          "min-h-screen pt-14 transition-[margin] duration-300 ease-in-out lg:pt-0",
          collapsed ? "lg:ml-20" : "lg:ml-72"
        )}
      >
        {children}
      </main>
    </div>
  );
}
