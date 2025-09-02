import {
  IconCopy,
  IconGhost2,
  IconPencilMinus,
  IconProgressBolt,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { formatDate } from "date-fns";
import { useCallback, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface AgentChatsTabProps {
  agent: Doc<"restaurant_agents">;
}

export const AgentChatsTab: React.FC<AgentChatsTabProps> = ({ agent }) => {
  const { data: threads, isPending: threadsIsPending } = useCachedQuery(
    api.features.agents.functions.getAgentThreads,
    { agent: agent._id }
  );

  return (
    <TabsContent className="space-y-6" value="chats">
      <div className="h-max w-full">
        {threadsIsPending && <div>Loading...</div>}
        {threads && threads.page.length > 0 && (
          <div className="grid w-full gap-4">
            {threads.page.map((thread) => (
              <Card className="col-span-1" key={thread._id}>
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
