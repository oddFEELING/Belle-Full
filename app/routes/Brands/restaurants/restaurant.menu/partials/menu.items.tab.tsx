import { IconSoup } from "@tabler/icons-react";
import type { Id } from "convex/_generated/dataModel";
import React from "react";
import { TabsContent } from "~/components/ui/tabs";

interface MenuItemsTabProps {
  restaurantId: Id<"restaurants">;
}

export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({ restaurantId }) => {
  return (
    <TabsContent value="menu-items">
      {/* Menu Items content - placeholder for now */}
      <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
        <IconSoup
          size={40}
          strokeWidth={1.5}
          className="mb-b text-muted-foreground"
        />
        <h3 className="mb-2 text-lg font-medium">Menu Items</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-center">
          View and manage all menu items across your restaurant menus.
        </p>
      </div>
    </TabsContent>
  );
};
