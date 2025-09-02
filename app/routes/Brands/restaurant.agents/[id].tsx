import {
  IconArrowBackUp,
  IconChartLine,
  IconError404,
  IconMessage,
  IconPencilMinus,
  IconPhoneSpark,
  IconRecharging,
  IconRobot,
  IconRobotOff,
  IconSofa,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useAction, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import StatusBadge from "~/components/custom-ui/status.badge";
import AgentConnectionQRCodePanel from "~/components/panels/agent.connection.qrcode.panel";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";
import { AgentProfileTab } from "./partials/agent.profile.tab";
import { AgentChatsTab } from "./partials/agent.chats.tab";

const RestaurantAgentPage = () => {
  const navigate = useNavigate();
  const agentId = useParams().agentId as Id<"restaurant_agents">;
  const [activeTab, setActiveTab] = useQueryState(
    "activeTab",
    parseAsString.withDefault("stats"),
  );

  // ~ ======= States ======= ~
  const [showConnectionQRCode, setShowConnectionQRCode] =
    useState<boolean>(false);
  const [loadingConnectionQRCode, setLoadingConnectionQRCode] =
    useState<boolean>(false);

  // ~ ======= Queries ======= ~
  const generateWhatsappAgentCode = useAction(
    api.features.agents.functions.generateWhatsappAgentCode,
  );
  const { data: agent, isPending: agentIsPending } = useCachedQuery(
    api.features.agents.functions.getSingleAgent,
    { agent: agentId },
  );
  const deleteAgent = useAction(api.features.agents.functions.disconnectAgent);

  // ~ ======= Handle connect agent ======= ~
  const handleConnectAgent = async () => {
    if (!agent) return toast.error("Agent not found");
    setLoadingConnectionQRCode(true);
    try {
      await generateWhatsappAgentCode({
        agent: agentId,
        restaurant: agent?.restaurant,
      });
      setShowConnectionQRCode(true);
    } catch (error) {
      toast.error("Failed to connect agent");
    } finally {
      setLoadingConnectionQRCode(false);
    }
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Agent name: prominent, subtle gradient for modern emphasis */}
            <h2 className="from-foreground via-foreground to-foreground/60 bg-gradient-to-r bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
              {agent.name}
            </h2>
            {
              {
                CONNECTED: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      text={agent.connection_status}
                      status="success"
                      className="ml-1"
                    />
                  </>
                ),
                PENDING: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      text={agent.connection_status}
                      status="warning"
                      className="ml-1"
                    />
                  </>
                ),
                DISCONNECTED: (
                  <>
                    {/* Status dot: quick visual cue for connection state */}
                    <StatusBadge
                      text={agent.connection_status}
                      status="error"
                      className="ml-1"
                    />
                  </>
                ),
              }[agent.connection_status]
            }
            {/* Agent type: soft rounded pill for low-contrast emphasis */}
            <Badge
              variant="secondary"
              className="text-foreground/70 rounded-full px-2.5 py-0.5 text-xs"
            >
              {agent.type}
            </Badge>
          </div>

          {/* Agent traits: compact, quiet chips to reduce visual noise */}
          <p className="text-muted-foreground/80 mt-1 line-clamp-3 flex max-w-2xl flex-wrap items-center gap-1 text-xs">
            {agent.traits?.map((trait: string, idx: number) => (
              <Badge
                variant="secondary"
                key={idx}
                className="text-foreground/70 h-6 rounded-full px-2.5 font-normal"
                title={trait}
              >
                {trait}
              </Badge>
            )) || "Agent has no traits"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`editor`)}>
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

      {/* ~ =================================== ~ */}
      {/* -- Agent tabs -- */}
      {/* ~ =================================== ~ */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="mt-4 mb-3 w-full max-w-xl">
          <TabsList className="bg-muted h-max w-full">
            <TabsTrigger
              value="stats"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconChartLine
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Stats
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconRobot
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Profile
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="chats"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconMessage
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Chats
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="numbers"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconPhoneSpark
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
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
        open={showConnectionQRCode}
        onOpenChange={setShowConnectionQRCode}
      />
    </div>
  );
};

export default RestaurantAgentPage;
