"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Building2,
  CreditCard,
  MessageSquare,
  Megaphone,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Shield,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NotificationDialog from "@/components/NotificationDialog";
import Image from "next/image";

const adminNavigation = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    name: "Blocks & Rooms",
    href: "/admin/blocks",
    icon: Building2,
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    name: "Messaging",
    href: "/admin/messaging",
    icon: MessageSquare,
  },
  {
    name: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user && "role" in session.user && session.user.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session || !session.user || !("role" in session.user) || session.user.role !== "admin") {
    return null;
  }

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src="/logo.jpg"
              alt="KP Hostel Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <span className="hidden text-primary-foreground font-bold text-sm">KP</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">KP Hostel</h1>
        </div>
        <NotificationDialog />
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-border bg-card",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="p-4 border-b border-border bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="KP Hostel Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-primary leading-tight">
                    KP Vidhyarthi Bhavan
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Admin Portal
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Admin</h1>
              </div>
            ) : (
              <Shield className="h-6 w-6 text-primary mx-auto" />
            )}
            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden lg:block">
                <NotificationDialog />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex"
              >
                <ChevronLeft
                  className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    !sidebarOpen && "rotate-180"
                  )}
                />
              </Button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={session.user && "avatar" in session.user ? (session.user.avatar as string) : undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {session.user?.name}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                      Admin
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Stats (Collapsed sidebar) */}
          {!sidebarOpen && (
            <div className="hidden lg:block p-4 border-t border-border">
              <div className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className={cn(
                "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                !sidebarOpen && "justify-center px-0"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-16 lg:pt-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}
