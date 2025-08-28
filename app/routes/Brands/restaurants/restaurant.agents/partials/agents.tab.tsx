import { TabsContent } from "~/components/ui/tabs";
import type { Id } from "convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconIdBadge,
  IconIdBadge2,
  IconPlus,
  IconRobot,
  IconRobotOff,
} from "@tabler/icons-react";
import { useState } from "react";
import { CreateAgentPanel } from "~/components/panels/create.agent.panel";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import type { Doc } from "convex/_generated/dataModel";
import { Badge } from "~/components/ui/badge";
import StatusBadge from "~/components/custom-ui/status.badge";
import { useNavigate } from "react-router";

interface RestaurantAgentsTabProps {
  restaurantId: Id<"restaurants">;
}

export const RestaurantAgentsTab: React.FC<RestaurantAgentsTabProps> = ({
  restaurantId,
}) => {
  // ~ ======= Queries ======= ~
  const { data: agents, isPending: agentsIsPending } = useCachedQuery(
    api.restaurants.agents.functions.getRestaurantAgents,
    { restaurant: restaurantId },
  );

  // ~ ======= States ======= ~
  const [showCreateAgentPanel, setShowCreateAgentPanel] =
    useState<boolean>(false);

  // Loading skeleton component
  const MenuItemSkeleton = () => (
    <div className="bg-card overflow-hidden rounded-lg border">
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

  return (
    <TabsContent value="agents" className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Agents</h3>
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
          open={showCreateAgentPanel}
          onOpenChange={setShowCreateAgentPanel}
          restaurantId={restaurantId}
        />
      </div>

      {/* ~ =================================== ~ */}
      {/* -- Loading State -- */}
      {/* ~ =================================== ~ */}
      {agentsIsPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
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
            size={40}
            strokeWidth={1.5}
            className="text-muted-foreground mb-4"
          />
          <h3 className="mb-2 text-lg font-medium">No Agents found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
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
            <AgentCard key={agent._id} agent={agent} />
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
  // Format creation date
  const creationDate = new Date(agent._creationTime).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <Card className="ring-primary/30 group transition-all duration-300 ease-out hover:ring-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              {
                {
                  whatsapp: (
                    <IconBrandWhatsapp
                      size={18}
                      strokeWidth={1.5}
                      className="text-emerald-600"
                    />
                  ),
                  instagram: (
                    <IconBrandInstagram
                      size={18}
                      strokeWidth={1.5}
                      className="text-rose-600"
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

          <StatusBadge
            status={
              agent.connection_status === "PENDING"
                ? "warning"
                : agent.connection_status === "CONNECTED"
                  ? "success"
                  : "inactive"
            }
            text={agent.connection_status}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <IconIdBadge2 size={14} strokeWidth={1.5} />
              <span>{agent.agent_id}</span>
            </div>
          </div>

          {agent.connection_status === "CONNECTED" && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => navigate(`${agent._id}`)}
            >
              Manage →
            </Button>
          )}
          {agent.connection_status === "PENDING" && (
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate(`${agent._id}`)}
              className="h-auto p-0 text-amber-600 hover:text-amber-700"
            >
              Setup →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
