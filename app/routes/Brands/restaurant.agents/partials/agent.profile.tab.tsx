import {
  IconCopy,
  IconGhost2,
  IconPencilMinus,
  IconProgressBolt,
} from "@tabler/icons-react";
import { useCallback, useState } from "react";
import type { Doc } from "convex/_generated/dataModel";
import { formatDate } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardAction,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { TabsContent } from "~/components/ui/tabs";

interface AgentProfileTabProps {
  agent: Doc<"restaurant_agents">;
}

export const AgentProfileTab: React.FC<AgentProfileTabProps> = ({ agent }) => {
  // Local UI state for copy feedback and expand/collapse controls
  const [copiedField, setCopiedField] = useState<
    null | "persona" | "goals" | "identifier" | "supervisor"
  >(null);
  const [personaExpanded, setPersonaExpanded] = useState(false);
  const [goalsExpanded, setGoalsExpanded] = useState(false);

  // Copies provided text to clipboard and sets transient visual feedback
  const handleCopy = useCallback(
    async (
      value: string,
      key: "persona" | "goals" | "identifier" | "supervisor",
    ) => {
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        setCopiedField(key);
        window.setTimeout(() => setCopiedField(null), 1200);
      } catch {
        // Silently ignore copy failures to keep UI minimal and unobtrusive
      }
    },
    [],
  );

  return (
    <TabsContent value="profile" className="space-y-6">
      {/* ~ =================================== ~ */}
      {/* -- Profile Info -- */}
      {/* ~ =================================== ~ */}
      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Identifier</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label={
                  copiedField === "identifier" ? "Copied" : "Copy identifier"
                }
                onClick={() => handleCopy(agent.unipile_id ?? "", "identifier")}
              >
                <IconCopy
                  size={14}
                  strokeWidth={1.6}
                  className={
                    copiedField === "identifier"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                />
              </Button>
            </CardAction>
            <CardTitle
              className="line-clamp-2 w-full max-w-full font-mono text-sm break-words whitespace-normal"
              title={agent.unipile_id ?? ""}
            >
              {agent.unipile_id}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Supervisor</CardDescription>
            <CardAction>
              {agent.supervisor_number ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label={
                    copiedField === "supervisor" ? "Copied" : "Copy supervisor"
                  }
                  onClick={() =>
                    handleCopy(agent.supervisor_number ?? "", "supervisor")
                  }
                >
                  <IconCopy
                    size={14}
                    strokeWidth={1.6}
                    className={
                      copiedField === "supervisor"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  />
                </Button>
              ) : null}
            </CardAction>
            <CardTitle className="font-mono text-sm">
              {agent.supervisor_number || "—"}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Last Sync</CardDescription>
            <CardTitle>
              {agent.lastSync ? (
                <div className="flex items-center gap-2">
                  <span>
                    {formatDate(agent?.lastSync?.timestamp, "MMM d, yyyy")}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      agent.lastSync?.status === "SUCCESS"
                        ? "border-emerald-200 bg-emerald-500/10 text-emerald-600 dark:border-emerald-900 dark:text-emerald-400"
                        : "border-rose-200 bg-rose-500/10 text-rose-600 dark:border-rose-900 dark:text-rose-400"
                    }
                  >
                    {agent.lastSync?.status === "SUCCESS"
                      ? "Success"
                      : "Failed"}
                  </Badge>
                </div>
              ) : (
                <span className="text-muted-foreground">Never</span>
              )}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Created At</CardDescription>
            <CardTitle>
              {formatDate(agent._creationTime, "MMM d, yyyy")}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      {/* ~ =================================== ~ */}
      {/* -- Persona (minimal callout with copy + expand) -- */}
      {/* ~ =================================== ~ */}
      <section className="bg-muted/20 flex w-full flex-col gap-2 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium">Persona</h3>
          {agent.persona ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label={
                  copiedField === "persona" ? "Copied" : "Copy persona"
                }
                onClick={() => handleCopy(agent.persona ?? "", "persona")}
              >
                <IconCopy
                  size={14}
                  strokeWidth={1.6}
                  className={
                    copiedField === "persona"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setPersonaExpanded((v) => !v)}
              >
                {personaExpanded ? "Show less" : "Show more"}
              </Button>
            </div>
          ) : null}
        </div>

        {agent.persona ? (
          <div
            className={`text-muted-foreground text-sm leading-6 ${
              personaExpanded ? "" : "line-clamp-4"
            }`}
          >
            {agent.persona}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg py-14 text-center">
            <IconGhost2 size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium">No persona specified</p>
            <span className="text-muted-foreground w-full max-w-2xl text-xs">
              Setting a persona gives your agent a distinct, human-friendly
              identity used to guide tone and behavior.
            </span>
          </div>
        )}
      </section>

      {/* ~ =================================== ~ */}
      {/* -- Goals (minimal callout with copy + expand) -- */}
      {/* ~ =================================== ~ */}
      <section className="bg-muted/20 flex w-full flex-col gap-2 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium">Goals</h3>
          {agent.goals ? (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                aria-label={copiedField === "goals" ? "Copied" : "Copy goals"}
                onClick={() => handleCopy(agent.goals ?? "", "goals")}
              >
                <IconCopy
                  size={14}
                  strokeWidth={1.6}
                  className={
                    copiedField === "goals"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setGoalsExpanded((v) => !v)}
              >
                {goalsExpanded ? "Show less" : "Show more"}
              </Button>
            </div>
          ) : null}
        </div>

        {agent.goals ? (
          <div
            className={`text-muted-foreground text-sm leading-6 ${
              goalsExpanded ? "" : "line-clamp-4"
            }`}
          >
            {agent.goals}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg py-14 text-center">
            <IconGhost2 size={18} className="text-muted-foreground" />
            <p className="text-sm font-medium">No goals specified</p>
            <span className="text-muted-foreground w-full max-w-2xl text-xs">
              Setting goals gives your agent a clear purpose and concrete
              outcomes to optimize for.
            </span>
          </div>
        )}
      </section>
    </TabsContent>
  );
};
