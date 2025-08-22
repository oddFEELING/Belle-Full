import { type ColumnDef } from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { Checkbox } from "~/components/ui/checkbox";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  CursorFollow,
  CursorProvider,
} from "~/components/custom-ui/animated.cursor";

export const MenusCategoriesTableColumns: ColumnDef<Doc<"categories">>[] = [
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
    accessorKey: "_id",
    header: "Category ref",
    enableHiding: true,
    cell: ({ row }) => <span>{row.original._id}</span>,
  },

  // ~ ======= File name ======= ~
  {
    accessorKey: "name",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <span className="hover:text-primary cursor-pointer underline-offset-4 transition-all duration-150 ease-out hover:underline">
        {row.original.name}
      </span>
    ),
  },

  // ~ ======= Description ======= ~
  {
    accessorKey: "description",
    header: "Description",
    enableHiding: true,
    cell: ({ row }) => (
      <div className="w-max max-w-44">
        <span className="line-clamp-1 truncate underline-offset-4 hover:underline">
          {row.original.description}
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
];
