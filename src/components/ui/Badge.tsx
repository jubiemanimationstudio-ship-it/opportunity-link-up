import { cn } from "@/lib/utils";

type Tone = "brand" | "accent" | "success" | "warn" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  brand: "chip-brand",
  accent: "chip-accent",
  success: "chip-success",
  warn: "chip-warn",
  danger: "chip-danger",
  muted: "chip-muted"
};

export function Badge({
  children,
  tone = "muted",
  icon,
  className
}: {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn(toneClass[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
