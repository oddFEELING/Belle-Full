import {
  IconCopy,
  IconGhost2,
  IconPencilMinus,
  IconProgressBolt,
} from "@tabler/icons-react";
import type { Doc } from "convex/_generated/dataModel";
import { formatDate } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TabsContent } from "~/components/ui/tabs";

interface AgentProfileTabProps {
  agent: Doc<"restaurant_agents">;
}

export const AgentProfileTab: React.FC<AgentProfileTabProps> = ({ agent }) => {
  return (
    <TabsContent value="profile" className="space-y-6">
      {/* ~ =================================== ~ */}
      {/* -- Profile Info -- */}
      {/* ~ =================================== ~ */}
      <section className="grid w-full grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-1.5">
              <CardDescription>Identifier</CardDescription>
              <IconCopy
                size={12}
                strokeWidth={1.2}
                className="text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200 ease-out"
              />
            </div>
            <div className="h-max w-full max-w-full overflow-x-auto overflow-y-hidden">
              <CardTitle className="line-clamp-2 w-full max-w-full break-words whitespace-normal">
                {agent.unipile_id}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Supervisor</CardDescription>
            <CardTitle>{agent.supervisor_number}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Last Sync</CardDescription>
            <CardTitle>
              {agent.lastSync ? (
                <div className="items flex">
                  <span>
                    {formatDate(agent?.lastSync?.timestamp, "MMM d, yyyy")}
                  </span>

                  <span className="text-muted-foreground ml-2 text-xs font-normal">
                    {agent.lastSync?.status === "SUCCESS"
                      ? "success"
                      : "Failed"}
                  </span>
                </div>
              ) : (
                <span>Never</span>
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
      {/* -- Persona -- */}
      {/* ~ =================================== ~ */}
      <section className="prose flex w-full flex-col gap-1 rounded-lg p-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-lg font-medium">Persona</h3>
        </div>

        {agent.persona ? (
          <p className="prose">{agent.persona}</p>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border py-16 text-center">
            <p className="text-lg font-medium"> No persona specified</p>

            <span className="text-muted-foreground w-full max-w-2xl text-sm">
              Setting a persona gives your agent its own carefully crafted
              identity. This is what makes it different from other agents.
            </span>
          </div>
        )}
      </section>

      {/* ~ =================================== ~ */}
      {/* -- goals -- */}
      {/* ~ =================================== ~ */}
      <section className="prose flex w-full flex-col gap-1 rounded-lg p-4">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-lg font-medium">Goals</h3>
        </div>

        {agent.goals ? (
          <p className="prose">{agent.goals}</p>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border py-16 text-center">
            <p className="text-lg font-medium"> No goals specified</p>

            <span className="text-muted-foreground w-full max-w-2xl text-sm">
              Setting a goal gives your agent a clear purpose. This helps it
              understand what it should do and how to do it.
            </span>
          </div>
        )}
      </section>
    </TabsContent>
  );
};
