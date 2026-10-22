import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardSize = "sm" | "md" | "lg";

/** Any icon component that accepts a `className`, from lucide or react-icons. */
type IconComponent = React.ComponentType<{ className?: string }>;

const SIZE_CLASSES: Record<StatCardSize, { content: string; value: string; icon: string }> = {
  sm: { content: "p-4", value: "text-xl", icon: "size-9 rounded-lg" },
  md: { content: "p-4 sm:p-5", value: "text-2xl", icon: "size-10 rounded-xl" },
  lg: { content: "p-4 sm:p-6", value: "text-2xl sm:text-3xl", icon: "size-10 sm:size-12 rounded-xl" },
};

/**
 * A single metric tile.
 *
 * The admin and student dashboards all rendered the same card markup inline,
 * which meant a change to the visual language had to be repeated in six
 * places. Keeping one component makes the tiles consistent and lets the
 * pages stay focused on their own data.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  size = "md",
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: IconComponent;
  hint?: string;
  size?: StatCardSize;
  className?: string;
}) {
  const sizes = SIZE_CLASSES[size];

  return (
    <Card
      className={cn(
        "border-0 shadow-xs bg-card hover:shadow-md transition-shadow",
        className
      )}
    >
      <CardContent className={sizes.content}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p
              className={cn(
                "font-bold font-display text-foreground mt-0.5 tabular-nums",
                sizes.value
              )}
            >
              {value}
            </p>
            {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
          </div>
          <div
            className={cn(
              "flex items-center justify-center shrink-0 bg-primary/10 text-primary",
              sizes.icon
            )}
          >
            <Icon className="size-4 sm:size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** Responsive grid for a row of {@link StatCard}s. */
export function StatCardGrid({
  children,
  columns = 4,
  className,
}: {
  children: React.ReactNode;
  columns?: 3 | 4 | 5;
  className?: string;
}) {
  const gridClass = {
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  }[columns];

  return (
    <div className={cn("grid gap-3 sm:gap-4", gridClass, className)}>{children}</div>
  );
}
