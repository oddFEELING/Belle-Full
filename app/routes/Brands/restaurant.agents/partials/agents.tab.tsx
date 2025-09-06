import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconIdBadge2,
  IconPlus,
  IconRobotOff,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { useState } from "react";
import { useNavigate } from "react-router";
import StatusBadge from "~/components/custom-ui/status.badge";
import { CreateAgentPanel } from "~/components/panels/create.agent.panel";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

// Loading skeleton card used while agents are being fetched
const MenuItemSkeleton: React.FC = () => (
  <div className="overflow-hidden rounded-lg border bg-card">
    <Skeleton className="h-24 w-full" />
    <div className="space-y-2 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  </div>
);

interface RestaurantAgentsTabProps {
  restaurantId: Id<"restaurants">;
}

export const RestaurantAgentsTab: React.FC<RestaurantAgentsTabProps> = ({
  restaurantId,
}) => {
  // ~ ======= Queries ======= ~
  const { data: agents, isPending: agentsIsPending } = useCachedQuery(
    api.features.agents.functions.getRestaurantAgents,
    { restaurant: restaurantId }
  );

  // ~ ======= States ======= ~
  const [showCreateAgentPanel, setShowCreateAgentPanel] =
    useState<boolean>(false);

  return (
    <TabsContent className="space-y-6" value="agents">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">All Agents</h3>
          <p className="text-muted-foreground text-sm">
            {" "}
            {agentsIsPending
              ? "Loading..."
              : `${agents?.length || 0} agent${
                  agents?.length === 1 ? "" : "s"
                }`}
          </p>
        </div>
        {agents && agents.length > 0 && (
          <Button onClick={() => setShowCreateAgentPanel(true)}>
            <IconPlus size={16} />
            Add Agent
          </Button>
        )}
        <CreateAgentPanel
          onOpenChange={setShowCreateAgentPanel}
          open={showCreateAgentPanel}
          restaurantId={restaurantId}
        />
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Loading State -- */}
      {/* ~ =================================== ~ */}
      {agentsIsPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Eppty State -- */}
      {/* ~ =================================== ~ */}
      {!agentsIsPending && agents?.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
          <IconRobotOff
            className="mb-4 text-muted-foreground"
            size={40}
            strokeWidth={1.5}
          />
          <h3 className="mb-2 font-medium text-lg">No Agents found</h3>
          <p className="mb-6 max-w-sm text-center text-muted-foreground">
            Get started by creating your first agent.
          </p>
          <Button onClick={() => setShowCreateAgentPanel(true)}>
            <IconPlus size={16} />
            Add Agent
          </Button>
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Agents Grid -- */}
      {/* ~ =================================== ~ */}
      {agents && agents.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard agent={agent} key={agent._id} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};

// ~ =============================================>
// ~ ======= Agent Card
// ~ =============================================>
const AgentCard: React.FC<{ agent: Doc<"restaurant_agents"> }> = ({
  agent,
}) => {
  const navigate = useNavigate();

  // Determine badge status from the agent's connection status without nested ternaries
  let badgeStatus: "warning" | "success" | "inactive";
  if (agent.connection_status === "PENDING") {
    badgeStatus = "warning";
  } else if (agent.connection_status === "CONNECTED") {
    badgeStatus = "success";
  } else {
    badgeStatus = "inactive";
  }

  return (
    <Card className="group ring-primary/30 transition-all duration-300 ease-out hover:ring-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {
                {
                  whatsapp: (
                    <IconBrandWhatsapp
                      className="text-emerald-600"
                      size={18}
                      strokeWidth={1.5}
                    />
                  ),
                  instagram: (
                    <IconBrandInstagram
                      className="text-rose-600"
                      size={18}
                      strokeWidth={1.5}
                    />
                  ),
                }[agent.type]
              }
              <span>{agent.name}</span>
            </CardTitle>
            <CardDescription className="mt-2 line-clamp-2">
              {agent.persona || "No persona available"}
            </CardDescription>
          </div>

          <StatusBadge status={badgeStatus} text={agent.connection_status} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <IconIdBadge2 size={14} strokeWidth={1.5} />
              <span>{agent.agent_id}</span>
            </div>
          </div>

          {agent.connection_status === "CONNECTED" && (
            <Button
              className="h-auto p-0"
              onClick={() => navigate(`${agent._id}`)}
              size="sm"
              variant="link"
            >
              Manage →
            </Button>
          )}
          {agent.connection_status === "PENDING" && (
            <Button
              className="h-auto p-0 text-amber-600 hover:text-amber-700"
              onClick={() => navigate(`${agent._id}`)}
              size="sm"
              variant="link"
            >
              Setup →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
