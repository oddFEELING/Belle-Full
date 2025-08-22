import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { type Table } from "@tanstack/react-table";
import { ArchiveBox, SearchStatus, Trash } from "iconsax-reactjs";
import { ChevronDown, Download, LayoutList, Search, Share } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Doc } from "convex/_generated/dataModel";
import { useUser } from "~/hooks/use-user/use-user";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import UploadRestaurantDocumentsPanel from "~/components/panels/upload.restaurant.documents.panel";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useIsMobile } from "~/hooks/use-mobile";

type FileDataTableFilterProps = {
  table: Table<Doc<"restaurant_documents">>;
};

const FileDataTableFilter = ({ table }: FileDataTableFilterProps) => {
  const isMobile = useIsMobile();
  const { user } = useUser();
  const [openUploadPanel, setOpenUploadPanel] = useState<boolean>(false);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const deleteDocument = useMutation(api.restaurants.documents.deleteDocument);

  // ~ ======= Handle delete documents ======= ~
  const handleDeleteDocuments = async () => {
    table.getSelectedRowModel().rows.forEach(async (row) => {
      await deleteDocument({
        document: row.original._id,
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
              <Download size={15} strokeWidth={1.5} />
              <span>Download</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share size={15} strokeWidth={1.5} />
              <span>Share</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ArchiveBox size={15} strokeWidth={1.5} />
              <span>Archive</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteDocuments}>
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

        <Button size="sm" onClick={() => setOpenUploadPanel(true)}>
          <IconPlus strokeWidth={1.5} />
          {isMobile ? <span>Upload</span> : <span>Upload Documents</span>}
        </Button>
      </div>
      <UploadRestaurantDocumentsPanel
        open={openUploadPanel}
        onOpenChange={setOpenUploadPanel}
      />
    </div>
  );
};

export default FileDataTableFilter;
