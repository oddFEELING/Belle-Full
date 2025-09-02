import type { ColumnDef } from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { format } from "date-fns";
import { Checkbox } from "~/components/ui/checkbox";
import { formatFileSize } from "~/helpers/format-file-size";

export const RestaurantDocumentTableColumns: ColumnDef<
  Doc<"restaurant_documents">
>[] = [
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
      <span className="cursor-pointer underline-offset-4 transition-all duration-150 ease-out hover:text-primary hover:underline">
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
