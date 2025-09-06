import {
  IconAdjustmentsBolt,
  IconChecks,
  IconMessageReply,
  IconProgressX,
} from "@tabler/icons-react";

import type { Id } from "convex/_generated/dataModel";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { AgentEnquiryResponsePanel } from "~/components/panels/agent.enquiry.response.panel";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AgentEnquiriesDatatableDto } from "../agent.enquiries.datable.dto";

type ActionCellProps = {
  rowEnquiry: AgentEnquiriesDatatableDto;
};

export const ActionCell: React.FC<ActionCellProps> = ({ rowEnquiry }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="w-max items-center justify-center gap-2">
      {rowEnquiry.status === "PENDING" && (
        <Button onClick={() => setOpen(true)} size="xs" variant="ghost">
          <IconMessageReply />
          <span>Respond</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group-hover:opacity-0" size="icon" variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconAdjustmentsBolt
              className="mr-1 text-muted-foreground"
              size={16}
              strokeWidth={1.5}
            />
            <span>Manage enquiry</span>
          </DropdownMenuItem>
          {rowEnquiry.status === "PENDING" && (
            <DropdownMenuItem>
              <IconChecks
                className="mr-1 text-muted-foreground"
                size={16}
                strokeWidth={1.5}
              />
              <span>Mark as resolved</span>
            </DropdownMenuItem>
          )}

          {rowEnquiry.status !== "CLOSED" && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                <IconProgressX
                  className="mr-1 text-muted-foreground"
                  size={16}
                  strokeWidth={1.5}
                />
                <span>Mark as closed</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {rowEnquiry._id && (
        <AgentEnquiryResponsePanel
          enquiryId={rowEnquiry._id as Id<"agent_enquiries">}
          onOpenChange={setOpen}
          open={open}
        />
      )}
    </span>
  );
};
