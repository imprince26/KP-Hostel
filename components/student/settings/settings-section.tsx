import type { ComponentType } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * A titled block inside a settings tab.
 *
 * Every settings tab is a stack of these, so the icon, heading and spacing stay
 * identical across Profile, Security, Notifications and Account.
 */
export function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  footer,
  tone = "default",
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: "default" | "destructive";
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border-0 bg-card py-0 shadow-xs",
        tone === "destructive" && "ring-1 ring-destructive/25",
        className
      )}
    >
      <CardHeader className="border-b border-border px-5 py-4">
        <CardTitle className="flex items-center gap-2.5 text-base">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              tone === "destructive"
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="size-4" />
          </span>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-5 py-5">{children}</CardContent>

      {footer && (
        <div className="border-t border-border bg-muted/20 px-5 py-3">
          {footer}
        </div>
      )}
    </Card>
  );
}
