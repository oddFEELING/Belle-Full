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
    api.features.menu_categories.functions.deleteCategory
  );

  return (
    <span className="w-max items-center justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group-hover:opacity-0" size="icon" variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem>
            <TextalignLeft
              className="mr-1 text-muted-foreground"
              size={16}
              strokeWidth={1.5}
            />
            <span>Details</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ArchiveBox
              className="mr-1 text-muted-foreground"
              size={16}
              strokeWidth={1.5}
            />
            <span>Archive</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => deleteCategory({ id: rowCategory._id })}
          >
            <Trash
              className="mr-1 text-muted-foreground"
              size={16}
              strokeWidth={1.5}
            />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
};
