import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

export default function StatusBadge({
  status,
  text,
}: {
  text: string;
  status: "success" | "warning" | "error" | "inactive";
}) {
  return (
    <Badge variant="outline" className="gap-1.5">
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
