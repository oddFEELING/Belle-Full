import { type ColumnDef } from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { Checkbox } from "~/components/ui/checkbox";
import { format } from "date-fns";
import { formatFileSize } from "~/helpers/format-file-size";

export const RestaurantDocumentTableColumns: ColumnDef<
  Doc<"restaurant_documents">
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
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
    header: "File ref",
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

  // ~ ======= File type ======= ~
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs">
          {row.original.type}
        </span>
      );
    },
  },

  // ~ ======= Category ======= ~
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs">
          {row.original.category.replaceAll("_", " ")}
        </span>
      );
    },
  },

  // ~ ======= Status ======= ~
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs">
          {row.original.status}
        </span>
      );
    },
  },

  // ~ ======= Size ======= ~
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const size = formatFileSize(row.original.size);
      return <span>{size}</span>;
    },
  },

  // ~ ======= creation Time ======= ~
  {
    accessorKey: "_creationTime",
    header: "Uploaded on",
    cell: ({ row }) => (
      <span>{format(row.original._creationTime, "MMM d, yyyy")}</span>
    ),
  },
];
