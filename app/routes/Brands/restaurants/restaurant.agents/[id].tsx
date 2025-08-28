import {
  IconArrowBackUp,
  IconError404,
  IconPencilMinus,
  IconRecharging,
  IconRobotOff,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useAction, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import AgentConnectionQRCodePanel from "~/components/panels/agent.connection.qrcode.panel";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useCachedQuery } from "~/hooks/use-app-query";

const RestaurantAgentPage = () => {
  const navigate = useNavigate();
  const agentId = useParams().agentId as Id<"restaurant_agents">;

  // ~ ======= States ======= ~
  const [showConnectionQRCode, setShowConnectionQRCode] =
    useState<boolean>(false);
  const [loadingConnectionQRCode, setLoadingConnectionQRCode] =
    useState<boolean>(false);

  // ~ ======= Queries ======= ~
  const generateWhatsappAgentCode = useAction(
    api.restaurants.agents.functions.generateWhatsappAgentCode,
  );
  const { data: agent, isPending: agentIsPending } = useCachedQuery(
    api.restaurants.agents.functions.getSingleAgent,
    { agent: agentId },
  );
  const deleteAgent = useAction(
    api.restaurants.agents.functions.disconnectAgent,
  );

  // ~ ======= Handle connect agent ======= ~
  const handleConnectAgent = async () => {
    if (!agent) return toast.error("Agent not found");
    setLoadingConnectionQRCode(true);
    await generateWhatsappAgentCode({
      agent: agentId,
      restaurant: agent?.restaurant,
    });
    setLoadingConnectionQRCode(false);
    setShowConnectionQRCode(true);
  };

  // ~ ======= Loading state ======= ~
  if (agentIsPending) return <div>Loading...</div>;

  // ~ ======= Empty state ======= ~
  if (!agent)
    return (
      <div className="restaurant-dashboard--page">
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-20">
          <IconRobotOff
            size={40}
            strokeWidth={1.5}
            className="text-muted-foreground"
          />

          <span className="text-muted-foreground">Agent not found</span>
          <Button
            variant="ghost"
            size="sm"
            className="mt-5"
            onClick={() => navigate(-1)}
          >
            <IconArrowBackUp size={16} strokeWidth={1.5} />
            Back to safety
          </Button>
        </div>
      </div>
    );

  return (
    <div className="restaurant-dashboard--page">
      {/* ~ =================================== ~ */}
      {/* -- Header Section -- */}
      {/* ~ =================================== ~ */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">{agent.name}</h2>
            <Badge variant="outline">{agent.type}</Badge>
          </div>
          <p className="text-muted-foreground line-clamp-3 max-w-2xl">
            {agent.persona || "No persona available"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="lg">
            <IconPencilMinus size={16} strokeWidth={1.5} />
            <span>Edit Agent</span>
          </Button>

          {
            {
              CONNECTED: (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await deleteAgent({ agent: agentId });
                  }}
                >
                  Disconnect
                </Button>
              ),
              PENDING: (
                <Button size="sm" onClick={handleConnectAgent}>
                  {loadingConnectionQRCode ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <IconRecharging />
                  )}
                  <span>Connect</span>
                </Button>
              ),
              DISCONNECTED: (
                <Button size="sm" onClick={handleConnectAgent}>
                  {loadingConnectionQRCode ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Re-connecting...</span>
                    </>
                  ) : (
                    "Re-connect"
                  )}
                </Button>
              ),
            }[agent.connection_status]
          }
        </div>
      </div>

      <Separator />

      <AgentConnectionQRCodePanel
        agent={agent}
        open={showConnectionQRCode}
        onOpenChange={setShowConnectionQRCode}
      />
    </div>
  );
};

export default RestaurantAgentPage;
