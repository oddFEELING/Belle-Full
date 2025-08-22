import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { MenusCategoriesTableColumns } from "./category.columns";
import DataTablePagination from "~/components/data-tables/pagination.datatables";
import { useState } from "react";
import type { Doc } from "convex/_generated/dataModel";
import MenuCategoryDataTableFilter from "./category.filter";
import { IconCategoryMinus } from "@tabler/icons-react";

interface DataTableProps {
  columns: ColumnDef<Doc<"categories">, unknown>[];
  data: Doc<"categories">[];
}

const MenuCategoryDataTable = ({ columns, data }: DataTableProps) => {
  // ~ ======= states  -->
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    _id: false,
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
      <MenuCategoryDataTableFilter table={table} />

      <div className="rounded-md border">
        <Table>
          {/* ~ =================================== ~ */}
          {/* -- Header -- */}
          {/* ~ =================================== ~ */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3 py-5">
                    <IconCategoryMinus
                      size={26}
                      strokeWidth={1.5}
                      className="text-muted-foreground"
                    />
                    <span className="text-muted-foreground text-lg font-medium">
                      No Categories Found
                    </span>
                    <span className="text-muted-foreground w-full max-w-sm text-center text-sm text-wrap">
                      Adjust your search or filter to find what you need. or
                      create a new category.
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

export { MenuCategoryDataTable, MenusCategoriesTableColumns };
