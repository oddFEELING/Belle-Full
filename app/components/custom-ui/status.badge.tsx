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
    <Badge className={cn("gap-1.5", className)} variant="outline">
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", {
          "bg-emerald-500": status === "success",
          "bg-amber-500": status === "warning",
          "bg-red-500": status === "error",
          "bg-muted-foreground": status === "inactive",
        })}
      />
      {text}
    </Badge>
  );
}
