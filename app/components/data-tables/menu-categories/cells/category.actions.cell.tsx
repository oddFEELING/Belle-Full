import { IconList } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ArchiveBox, TextalignLeft, Trash } from "iconsax-reactjs";
import { Download, MoreVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type ActionCellProps = {
  rowCategory: Doc<"categories">;
};

export const ActionCell: React.FC<ActionCellProps> = ({ rowCategory }) => {
  const deleteCategory = useMutation(
    api.menus.categories.functions.deleteCategory,
  );

  return (
    <span className="w-max items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="group-hover:opacity-0">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem>
            <TextalignLeft
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground mr-1"
            />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArchiveBox
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground mr-1"
            />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteCategory({ id: rowCategory._id })}
          >
            <Trash
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground mr-1"
            />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
};
