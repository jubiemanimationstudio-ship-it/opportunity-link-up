import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div"
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return <Tag className={cn("container-page", className)}>{children}</Tag>;
}
