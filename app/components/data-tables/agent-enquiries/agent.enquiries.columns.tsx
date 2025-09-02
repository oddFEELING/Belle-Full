import { type ColumnDef } from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { Checkbox } from "~/components/ui/checkbox";
import { format } from "date-fns";
import type { AgentEnquiriesDatatableDto } from "./agent.enquiries.datable.dto";
import { ActionCell } from "./cells/agent.enquiries.action.cell";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const AgentEnquiriesTableColumns: ColumnDef<AgentEnquiriesDatatableDto>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="border-muted-foreground"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          aria-label="select all"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border-muted-foreground"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // ~ ======= File _id ======= ~
    {
      accessorKey: "agent.name",
      header: "Agent",
      enableHiding: true,
      cell: ({ row }) => <span>{row.original.agent?.name}</span>,
    },

    // ~ ======= File name ======= ~
    {
      accessorKey: "enquiry",
      header: "Enquiry",
      enableHiding: false,
      cell: ({ row }) => (
        <span className="hover:text-primary cursor-pointer underline-offset-4 transition-all duration-150 ease-out hover:underline">
          <Button variant="outline" size="xs">
            View content
          </Button>
        </span>
      ),
    },

    // ~ ======= Description ======= ~
    {
      accessorKey: "status",
      header: "Status",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="w-max max-w-44">
          <span
            className={cn("line-clamp-1 cursor-default truncate text-sm", {
              "text-muted-foreground": row.original.status === "RESOLVED",
              "text-red-500": row.original.status === "CLOSED",
              "text-yellow-500": row.original.status === "PENDING",
            })}
          >
            {row.original.status}
          </span>
        </div>
      ),
    },

    // ~ ======= DescriChat id  ======= ~
    {
      accessorKey: "chatId",
      header: "Chat id",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="w-max max-w-44">
          <span className="text-muted-foreground line-clamp-1 cursor-default truncate text-sm">
            {row.original.chatId}
          </span>
        </div>
      ),
    },

    // ~ ======= Creation Time ======= ~
    {
      accessorKey: "_creationTime",
      header: "Created on",
      cell: ({ row }) => (
        <span>{format(row.original._creationTime, "MMM d, yyyy")}</span>
      ),
    },

    // ~ ======= Actions ======= ~
    {
      id: "actions",
      cell: ({ row }) => {
        return <ActionCell rowEnquiry={row.original} />;
      },
    },
  ];
