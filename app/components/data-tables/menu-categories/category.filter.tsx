import React, { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { ArchiveBox, Trash } from "iconsax-reactjs";
import { ChevronDown, LayoutList, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "~/lib/utils";
import { toSentenceCase } from "~/helpers/to-sentence-case";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Doc, Id } from "convex/_generated/dataModel";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useIsMobile } from "~/hooks/use-mobile";
import { CreateMenuCategoryPanel } from "~/components/panels/create.menu.category.panel";
import { useParams } from "react-router";

type FileDataTableFilterProps = {
  table: Table<Doc<"categories">>;
};

const MenuCategoryDataTableFilter = ({ table }: FileDataTableFilterProps) => {
  const isMobile = useIsMobile();
  const { restaurantId, brandId } = useParams();
  const [openCreatePanel, setOpenCreatePanel] = useState<boolean>(false);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const deleteCategory = useMutation(
    api.menus.categories.functions.deleteCategory,
  );

  // ~ ======= Handle delete documents ======= ~
  const handleDeleteCategories = async () => {
    table.getSelectedRowModel().rows.forEach(async (row) => {
      await deleteCategory({
        id: row.original._id,
      });
    });
  };

  return (
    <div
      className={cn(
        "mt-2 flex w-full items-center justify-between px-0.5 py-2",
        isMobile ? "flex-col" : "flex-row",
      )}
    >
      <div className={cn("flex w-full items-center gap-2")}>
        <div className="relative flex w-full max-w-sm items-center">
          <Search size={16} className="text-muted-foreground absolute left-2" />
          <Input
            placeholder="Search by name..."
            className="w-full pl-7"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
          />
        </div>

        {/* ~ =================================== ~ */}
        {/* -- Manage selected items -- */}
        {/* ~ =================================== ~ */}
        <DropdownMenu>
          {selectedCount > 0 && (
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <span>{selectedCount} Selected</span>
                <ChevronDown size={15} strokeWidth={1.5} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent className="w-44" align="start" side="bottom">
            <DropdownMenuItem>
              <ArchiveBox size={15} strokeWidth={1.5} />
              <span>Archive</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteCategories}>
              <Trash size={15} strokeWidth={1.5} />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center justify-between space-x-4",
          isMobile ? "w-full" : "w-max",
        )}
      >
        {/* ~ =================================== ~ */}
        {/* -- Column visibility -- */}
        {/* ~ =================================== ~ */}
        <Popover>
          <PopoverTrigger asChild>
            <Button role="combobox" variant="ghost" size="sm">
              <LayoutList size={15} strokeWidth={1.5} />
              {!isMobile && <span>View</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-48 p-0"
            align={isMobile ? "start" : "end"}
          >
            <Command>
              <CommandInput placeholder="Search columns..." />
              <CommandList>
                <CommandEmpty>No Fields on this table.</CommandEmpty>
                <CommandGroup>
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" &&
                        column.getCanHide(),
                    )
                    .map((column) => {
                      return (
                        <CommandItem
                          key={column.id}
                          onSelect={() =>
                            column.toggleVisibility(!column.getIsVisible())
                          }
                        >
                          <span className="truncate">
                            {toSentenceCase(column.id)}
                          </span>
                          <Check
                            size={14}
                            strokeWidth={1.3}
                            className={cn(
                              "ml-auto shrink-0",
                              column.getIsVisible()
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button size="sm" onClick={() => setOpenCreatePanel(true)}>
          <IconPlus strokeWidth={1.5} />
          {isMobile ? <span>New</span> : <span>New Category</span>}
        </Button>
      </div>

      <CreateMenuCategoryPanel
        open={openCreatePanel}
        onOpenChange={setOpenCreatePanel}
        restaurant={restaurantId as Id<"restaurants">}
        brand={brandId as Id<"brands">}
      />
    </div>
  );
};

export default MenuCategoryDataTableFilter;
