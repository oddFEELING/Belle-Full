import type { ColumnDef } from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { format } from "date-fns";
import { Checkbox } from "~/components/ui/checkbox";
import { ActionCell } from "./cells/category.actions.cell";

export const MenusCategoriesTableColumns: ColumnDef<Doc<"categories">>[] = [
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
      <span className="cursor-pointer underline-offset-4 transition-all duration-150 ease-out hover:text-primary hover:underline">
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
        <span className="line-clamp-1 cursor-default truncate">
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

  // ~ ======= Actions ======= ~
  {
    id: "actions",
    cell: ({ row }) => {
      return <ActionCell rowCategory={row.original} />;
    },
  },
];
