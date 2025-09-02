import {
  IconAdjustmentsBolt,
  IconChecks,
  IconList,
  IconMessageReply,
  IconProgressX,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Doc, Id } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArchiveBox, TextalignLeft, Trash } from "iconsax-reactjs";
import { Download, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AgentEnquiriesDatatableDto } from "../agent.enquiries.datable.dto";
import { AgentEnquiryResponsePanel } from "~/components/panels/agent.enquiry.response.panel";

type ActionCellProps = {
  rowEnquiry: AgentEnquiriesDatatableDto;
};

export const ActionCell: React.FC<ActionCellProps> = ({ rowEnquiry }) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="w-max items-center justify-center gap-2">
      {rowEnquiry.status === "PENDING" && (
        <Button size="xs" variant="ghost" onClick={() => setOpen(true)}>
          <IconMessageReply />
          <span>Respond</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="group-hover:opacity-0">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconAdjustmentsBolt
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground mr-1"
            />
            <span>Manage enquiry</span>
          </DropdownMenuItem>
          {rowEnquiry.status === "PENDING" && (
            <DropdownMenuItem>
              <IconChecks
                size={16}
                strokeWidth={1.5}
                className="text-muted-foreground mr-1"
              />
              <span>Mark as resolved</span>
            </DropdownMenuItem>
          )}

          {rowEnquiry.status !== "CLOSED" && (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                <IconProgressX
                  size={16}
                  strokeWidth={1.5}
                  className="text-muted-foreground mr-1"
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
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </span>
  );
};
