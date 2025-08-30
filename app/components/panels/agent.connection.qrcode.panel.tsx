import type { Doc } from "convex/_generated/dataModel";
import React, { useEffect } from "react";
import type { PanelProps } from "./panel.types";
import {
  Panel,
  PanelCancelButton,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../ui/panel";
import { QRCodeCanvas } from "qrcode.react";

interface AgentConnectionQRCodePanelProps extends PanelProps {
  agent: Doc<"restaurant_agents">;
}

const AgentConnectionQRCodePanel: React.FC<AgentConnectionQRCodePanelProps> = ({
  agent,
  open,
  onOpenChange,
}) => {
  useEffect(() => {
    if (agent.connection_status === "CONNECTED") {
      onOpenChange(false);
    }
  }, [agent.connection_status]);

  return (
    <Panel open={open} onOpenChange={onOpenChange}>
      <PanelContent className="">
        <PanelHeader>
          <PanelTitle>Agent Connection QR Code</PanelTitle>
          <PanelDescription>
            Connect your agent to your whatsapp account
          </PanelDescription>
        </PanelHeader>
        <div className="flex items-center justify-center">
          {agent.auth_code && (
            <div className="flex h-max w-full items-center justify-center">
              <QRCodeCanvas
                value={agent.auth_code}
                level="H"
                size={300}
                title={`Agent: ${agent.name}`}
                marginSize={2}
                className="rounded-lg border"
              />
            </div>
          )}
        </div>
        <PanelFooter>
          <PanelCancelButton onClick={() => onOpenChange(false)}>
            Close
          </PanelCancelButton>
        </PanelFooter>
      </PanelContent>
    </Panel>
  );
};

export default AgentConnectionQRCodePanel;
