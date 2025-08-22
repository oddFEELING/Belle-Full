import { IconPlus, IconSoup } from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface MenuItemsTabProps {
  restaurantId: Id<"restaurants">;
}

export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({ restaurantId }) => {
  const navigate = useNavigate();

  const { data: menuItems, isPending: menuItemsIsPending } = useCachedQuery(
    api.menus.items.functions.getMenuItemsByRestaurant,
    { restaurant: restaurantId },
  );
  return (
    <TabsContent value="menu-items">
      {/* Menu Items content - placeholder for now */}
      {!menuItemsIsPending && menuItems?.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
          <IconSoup
            size={40}
            strokeWidth={1.5}
            className="mb-b text-muted-foreground"
          />
          <h3 className="mb-2 text-lg font-medium">No menu items yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            Get started by creating your first menu item. You can add menu items
            to menus after creating them here.
          </p>

          <Button size="lg" onClick={() => navigate("add-menu-item")}>
            <IconPlus size={16} />
            Add Menu Item
          </Button>
        </div>
      )}
    </TabsContent>
  );
};
