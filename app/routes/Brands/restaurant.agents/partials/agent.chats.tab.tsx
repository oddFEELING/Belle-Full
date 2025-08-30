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
import { api } from "convex/_generated/api";
import { useCachedQuery } from "~/hooks/use-app-query";

interface AgentChatsTabProps {
  agent: Doc<"restaurant_agents">;
}

export const AgentChatsTab: React.FC<AgentChatsTabProps> = ({ agent }) => {
  const { data: threads, isPending: threadsIsPending } = useCachedQuery(
    api.features.agents.functions.getAgentThreads,
    { agent: agent._id },
  );

  return (
    <TabsContent value="chats" className="space-y-6">
      <div className="h-max w-full">
        {threadsIsPending && <div>Loading...</div>}
        {threads && threads.page.length > 0 && (
          <div className="grid w-full gap-4">
            {threads.page.map((thread) => (
              <Card key={thread._id} className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    <span>+{thread.title?.split("_x_")[0].split("@")[0]}</span>
                  </CardTitle>
                  <CardDescription>{thread.summary}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TabsContent>
  );
};
