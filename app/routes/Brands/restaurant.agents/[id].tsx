import {
  IconArrowBackUp,
  IconChartLine,
  IconMessage,
  IconPencilMinus,
  IconPhoneSpark,
  IconRecharging,
  IconRobot,
  IconRobotOff,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useAction } from "convex/react";
import { Loader2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import StatusBadge from "~/components/custom-ui/status.badge";
import AgentConnectionQRCodePanel from "~/components/panels/agent.connection.qrcode.panel";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";
import { AgentChatsTab } from "./partials/agent.chats.tab";
import { AgentProfileTab } from "./partials/agent.profile.tab";

const RestaurantAgentPage = () => {
  const navigate = useNavigate();
  const agentId = useParams().agentId as Id<"restaurant_agents">;
  const [activeTab, setActiveTab] = useQueryState(
    "activeTab",
    parseAsString.withDefault("stats")
  );

  // ~ ======= States ======= ~
  const [showConnectionQRCode, setShowConnectionQRCode] =
    useState<boolean>(false);
  const [loadingConnectionQRCode, setLoadingConnectionQRCode] =
    useState<boolean>(false);

  // ~ ======= Queries ======= ~
  const generateWhatsappAgentCode = useAction(
    api.features.agents.functions.generateWhatsappAgentCode
  );
  const { data: agent, isPending: agentIsPending } = useCachedQuery(
    api.features.agents.functions.getSingleAgent,
    { agent: agentId }
  );
  const deleteAgent = useAction(api.features.agents.functions.disconnectAgent);

  // ~ ======= Handle connect agent ======= ~
  const handleConnectAgent = async () => {
    if (!agent) {
      return toast.error("Agent not found");
    }
    setLoadingConnectionQRCode(true);
    try {
      await generateWhatsappAgentCode({
        agent: agentId,
        restaurant: agent?.restaurant,
      });
      setShowConnectionQRCode(true);
    } catch {
      toast.error("Failed to connect agent");
    } finally {
      setLoadingConnectionQRCode(false);
    }
  };

  // ~ ======= Loading state ======= ~
  if (agentIsPending) {
    return <div>Loading...</div>;
  }

  // ~ ======= Empty state ======= ~
  if (!agent) {
    return (
      <div className="restaurant-dashboard--page">
        <div className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-20">
          <IconRobotOff
            className="text-muted-foreground"
            size={40}
            strokeWidth={1.5}
          />

          <span className="text-muted-foreground">Agent not found</span>
          <Button
            className="mt-5"
            onClick={() => navigate(-1)}
            size="sm"
            variant="ghost"
          >
            <IconArrowBackUp size={16} strokeWidth={1.5} />
            Back to safety
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-dashboard--page">
      {/* ~ =================================== ~ */}
      {/* -- Header Section -- */}
      {/* ~ =================================== ~ */}
      <div className="mb-6 flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Agent name: prominent, subtle gradient for modern emphasis */}
            <h2 className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text font-semibold text-2xl text-transparent tracking-tight">
              {agent.name}
            </h2>
            {
              {
                CONNECTED: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      className="ml-1"
                      status="success"
                      text={agent.connection_status}
                    />
                  </>
                ),
                PENDING: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      className="ml-1"
                      status="warning"
                      text={agent.connection_status}
                    />
                  </>
                ),
                DISCONNECTED: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      className="ml-1"
                      status="error"
                      text={agent.connection_status}
                    />
                  </>
                ),
              }[agent.connection_status]
            }
            {/* Agent type: soft rounded pill for low-contrast emphasis */}
            <Badge
              className="rounded-full px-2.5 py-0.5 text-foreground/70 text-xs"
              variant="secondary"
            >
              {agent.type}
            </Badge>
          </div>

          {/* Agent traits: compact, quiet chips to reduce visual noise */}
          <p className="mt-1 line-clamp-3 flex max-w-2xl flex-wrap items-center gap-1 text-muted-foreground/80 text-xs">
            {agent.traits?.map((trait: string, idx: number) => (
              <Badge
                className="h-6 rounded-full px-2.5 font-normal text-foreground/70"
                key={idx}
                title={trait}
                variant="secondary"
              >
                {trait}
              </Badge>
            )) || "Agent has no traits"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => navigate("editor")} size="sm" variant="ghost">
            <IconPencilMinus size={16} strokeWidth={1.5} />
            <span>Edit Agent</span>
          </Button>

          {
            {
              CONNECTED: (
                <Button
                  onClick={async () => {
                    await deleteAgent({ agent: agentId });
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Disconnect
                </Button>
              ),
              PENDING: (
                <Button onClick={handleConnectAgent} size="sm">
                  {loadingConnectionQRCode ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <IconRecharging />
                  )}
                  <span>Connect</span>
                </Button>
              ),
              DISCONNECTED: (
                <Button onClick={handleConnectAgent} size="sm">
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

      {/* ~ =================================== ~ */}
      {/* -- Agent tabs -- */}
      {/* ~ =================================== ~ */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="mt-4 mb-3 w-full max-w-xl">
          <TabsList className="h-max w-full bg-muted">
            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="stats"
            >
              <IconChartLine
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Stats
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="profile"
            >
              <IconRobot
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Profile
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="chats"
            >
              <IconMessage
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Chats
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="numbers"
            >
              <IconPhoneSpark
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Numbers
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <AgentProfileTab agent={agent} />
        <AgentChatsTab agent={agent} />
      </Tabs>

      <AgentConnectionQRCodePanel
        agent={agent}
        onOpenChange={setShowConnectionQRCode}
        open={showConnectionQRCode}
      />
    </div>
  );
};

export default RestaurantAgentPage;
