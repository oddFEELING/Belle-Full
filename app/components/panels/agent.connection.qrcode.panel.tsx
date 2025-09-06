import type { Doc } from "convex/_generated/dataModel";
import { QRCodeCanvas } from "qrcode.react";
import type React from "react";
import { useEffect } from "react";
import {
  Panel,
  PanelCancelButton,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
} from "../ui/panel";
import type { PanelProps } from "./panel.types";

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
    <Panel onOpenChange={onOpenChange} open={open}>
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
                className="rounded-lg border"
                level="H"
                marginSize={2}
                size={300}
                title={`Agent: ${agent.name}`}
                value={agent.auth_code}
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
