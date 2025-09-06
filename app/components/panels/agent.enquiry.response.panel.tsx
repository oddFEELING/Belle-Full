import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useAction } from "convex/react";
import { useState } from "react";
import { useCachedQuery } from "~/hooks/use-app-query";
import { Button } from "../ui/button";
import { Panel, PanelContent, PanelHeader, PanelTitle } from "../ui/panel";
import { Textarea } from "../ui/textarea";
import type { PanelProps } from "./panel.types";

interface AgentEnquiryResponsePanelProps extends PanelProps {
  enquiryId: Id<"agent_enquiries">;
}

export const AgentEnquiryResponsePanel: React.FC<
  AgentEnquiryResponsePanelProps
> = ({ enquiryId, open, onOpenChange }) => {
  const [response, setResponse] = useState("");

  // ~ ======= Queries ======= ~
  const { data: enquiry } = useCachedQuery(
    api.features.agent_enquiries.functions.getAgentEnquiryById,
    { enquiryId }
  );
  const respondToAgentEnquiry = useAction(
    api.features.agent_enquiries.functions.respondToAgentEnquiry
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
    <Panel onOpenChange={onOpenChange} open={open}>
      <PanelContent>
        <PanelHeader>
          <PanelTitle>Respond to enquiry</PanelTitle>
        </PanelHeader>

        <div>
          <p>{enquiry?.enquiry}</p>

          <Textarea
            className="mt-4"
            onChange={(e) => setResponse(e.target.value)}
            value={response}
          />

          <Button className="mt-4" onClick={handleRespond}>
            Respond
          </Button>
        </div>
      </PanelContent>
    </Panel>
  );
};
