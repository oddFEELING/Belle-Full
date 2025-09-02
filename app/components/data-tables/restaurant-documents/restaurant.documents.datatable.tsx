import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import type { Doc } from "convex/_generated/dataModel";
import { FileMinus2 } from "lucide-react";
import { useState } from "react";
import DataTablePagination from "~/components/data-tables/pagination.datatables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { RestaurantDocumentTableColumns } from "./restaurant.documents.columns";
import RestaurantDocumentDataTableFilter from "./restaurant.documents.filter";

interface DataTableProps {
  columns: ColumnDef<Doc<"restaurant_documents">, unknown>[];
  data: Doc<"restaurant_documents">[];
}

const RestaurantDocumentDataTable = ({ columns, data }: DataTableProps) => {
  // ~ ======= states  -->
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
    size: false,
  });

  // ~ ======= table instance -->
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <RestaurantDocumentDataTableFilter table={table} />

      <div className="rounded-md border">
        <Table>
          {/* ~ =================================== ~ */}
          {/* -- Header -- */}
          {/* ~ =================================== ~ */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/50" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* ~ =================================== ~ */}
          {/* -- Body -- */}
          {/* ~ =================================== ~ */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  <div className="flex flex-col items-center justify-center space-y-3 py-5">
                    <FileMinus2
                      className="text-muted-foreground"
                      size={26}
                      strokeWidth={1.5}
                    />
                    <span className="font-medium text-lg text-muted-foreground">
                      No Results Found
                    </span>
                    <span className="text-muted-foreground text-sm">
                      Adjust your search or filter to find what you need.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* ~ =================================== ~ */}
      {/* -- Pagination -- */}
      {/* ~ =================================== ~ */}
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
};

export { RestaurantDocumentDataTable, RestaurantDocumentTableColumns };
