import type { Id } from "convex/_generated/dataModel";
import { Panel, PanelTitle, PanelHeader, PanelContent } from "../ui/panel";
import type { PanelProps } from "./panel.types";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useAction } from "convex/react";

interface AgentEnquiryResponsePanelProps extends PanelProps {
  enquiryId: Id<"agent_enquiries">;
}

export const AgentEnquiryResponsePanel: React.FC<
  AgentEnquiryResponsePanelProps
> = ({ enquiryId, open, onOpenChange }) => {
  const [response, setResponse] = useState("");

  // ~ ======= Queries ======= ~
  const { data: enquiry, isPending: enquiryIsPending } = useCachedQuery(
    api.features.agent_enquiries.functions.getAgentEnquiryById,
    { enquiryId },
  );
  const respondToAgentEnquiry = useAction(
    api.features.agent_enquiries.functions.respondToAgentEnquiry,
  );

  const handleRespond = async () => {
    await respondToAgentEnquiry({
      enquiryId,
      response,
    });
    setResponse("");
    onOpenChange(false);
  };

  return (
    <Panel open={open} onOpenChange={onOpenChange}>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>Respond to enquiry</PanelTitle>
        </PanelHeader>

        <div>
          <p>{enquiry?.enquiry}</p>

          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="mt-4"
          />

          <Button className="mt-4" onClick={handleRespond}>
            Respond
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
};
