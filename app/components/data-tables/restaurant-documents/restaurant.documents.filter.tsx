import { IconPlus } from "@tabler/icons-react";
import type { Table } from "@tanstack/react-table";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArchiveBox, Trash } from "iconsax-reactjs";
import {
  Check,
  ChevronDown,
  Download,
  LayoutList,
  Search,
  Share,
} from "lucide-react";
import { useState } from "react";
import UploadRestaurantDocumentsPanel from "~/components/panels/upload.restaurant.documents.panel";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toSentenceCase } from "~/helpers/to-sentence-case";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

type FileDataTableFilterProps = {
  table: Table<Doc<"restaurant_documents">>;
};

const RestaurantDocumentDataTableFilter = ({
  table,
}: FileDataTableFilterProps) => {
  const isMobile = useIsMobile();
  const [openUploadPanel, setOpenUploadPanel] = useState<boolean>(false);
  const selectedCount = table.getSelectedRowModel().rows.length;
  const deleteDocument = useMutation(
    api.features.restaurants.documents.deleteDocument
  );

  // ~ ======= Handle delete documents ======= ~
  const handleDeleteDocuments = () => {
    for (const row of table.getSelectedRowModel().rows) {
      deleteDocument({
        document: row.original._id,
      });
    }
  };

  return (
    <div
      className={cn(
        "mt-2 flex w-full items-center justify-between px-0.5 py-2",
        isMobile ? "flex-col" : "flex-row"
      )}
    >
      <div className={cn("flex w-full items-center gap-2")}>
        <div className="relative flex w-full max-w-sm items-center">
          <Search className="absolute left-2 text-muted-foreground" size={16} />
          <Input
            className="w-full pl-7"
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            placeholder="Search by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
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
                <ChevronDown className="ml-2" size={15} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent align="start" className="w-44" side="bottom">
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
          isMobile ? "w-full" : "w-max"
        )}
      >
        {/* ~ =================================== ~ */}
        {/* -- Column visibility -- */}
        {/* ~ =================================== ~ */}
        <Popover>
          <PopoverTrigger asChild>
            <Button role="combobox" size="sm" variant="ghost">
              <LayoutList size={15} strokeWidth={1.5} />
              {!isMobile && <span>View</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align={isMobile ? "start" : "end"}
            className="w-48 p-0"
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
                        column.getCanHide()
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
                            className={cn(
                              "ml-auto shrink-0",
                              column.getIsVisible()
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                            size={14}
                            strokeWidth={1.3}
                          />
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={() => setOpenUploadPanel(true)} size="sm">
          <IconPlus strokeWidth={1.5} />
          {isMobile ? <span>Upload</span> : <span>Upload Documents</span>}
        </Button>
      </div>
      <UploadRestaurantDocumentsPanel
        onOpenChange={setOpenUploadPanel}
        open={openUploadPanel}
      />
    </div>
  );
};

export default RestaurantDocumentDataTableFilter;
