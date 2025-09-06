import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";
import type { AgentEnquiriesDatatableDto } from "./agent.enquiries.datable.dto";
import { ActionCell } from "./cells/agent.enquiries.action.cell";

export const AgentEnquiriesTableColumns: ColumnDef<AgentEnquiriesDatatableDto>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          className="border-muted-foreground"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="border-muted-foreground"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
        <span className="cursor-pointer underline-offset-4 transition-all duration-150 ease-out hover:text-primary hover:underline">
          <Button size="xs" variant="outline">
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
          <span className="line-clamp-1 cursor-default truncate text-muted-foreground text-sm">
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
