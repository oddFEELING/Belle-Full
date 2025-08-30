import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export default function StatusBadge({
  status,
  text,
  className,
}: {
  text: string;
  status: "success" | "warning" | "error" | "inactive";
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("gap-1.5", className)}>
      <span
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500": status === "success",
          "bg-amber-500": status === "warning",
          "bg-red-500": status === "error",
          "bg-muted-foreground": status === "inactive",
        })}
        aria-hidden="true"
      ></span>
      {text}
    </Badge>
  );
}
