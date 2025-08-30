import {
  IconPlus,
  IconSoup,
  IconPhoto,
  IconAlertCircle,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface MenuItemsTabProps {
  restaurantId: Id<"restaurants">;
}

// Helper function to format price
const formatPrice = (price: { amount: number; currency: string }) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
  }).format(price.amount / 100); // Assuming price is stored in cents
};

export const MenuItemsTab: React.FC<MenuItemsTabProps> = ({ restaurantId }) => {
  const navigate = useNavigate();

  const { data: menuItems, isPending: menuItemsIsPending } = useCachedQuery(
    api.features.menu_items.functions.getMenuItemsByRestaurant,
    { restaurant: restaurantId },
  );

  // Loading skeleton component
  const MenuItemSkeleton = () => (
    <div className="bg-card overflow-hidden rounded-lg border">
      <Skeleton className="h-24 w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );

  // ~ ======= Render ======= ~
  return (
    <TabsContent value="menu-items" className="space-y-6">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Menu Items</h3>
          <p className="text-muted-foreground text-sm">
            {menuItemsIsPending
              ? "Loading..."
              : `${menuItems?.length || 0} items`}
          </p>
        </div>
        <Button onClick={() => navigate("add-menu-item")}>
          <IconPlus size={16} />
          Add Menu Item
        </Button>
      </div>

      {/* ~ ======= Loading state ======= ~ */}
      {menuItemsIsPending && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <MenuItemSkeleton key={i} />
          ))}
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Empty State -- */}
      {/* ~ =================================== ~ */}
      {!menuItemsIsPending && menuItems?.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
          <IconSoup
            size={40}
            strokeWidth={1.5}
            className="text-muted-foreground mb-4"
          />
          <h3 className="mb-2 text-lg font-medium">No menu items yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm text-center">
            Get started by creating your first menu item. You can add menu items
            to menus after creating them here.
          </p>
        </div>
      )}

      {/* ~ =================================== ~ */}
      {/* -- Menu Items Grid -- */}
      {/* ~ =================================== ~ */}
      {!menuItemsIsPending && menuItems && menuItems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {menuItems.map((menuItem) => (
            <div
              key={menuItem._id}
              className={cn(
                "group bg-card cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 ease-out hover:shadow-md",
                !menuItem.isAvailable && "opacity-60",
              )}
              onClick={() => navigate(`add-menu-item?id=${menuItem._id}`)}
            >
              {/* ~ ======= Compact image section - flush with top ======= ~ */}
              <div className="bg-muted relative h-24 overflow-hidden">
                {menuItem.image ? (
                  <img
                    src={menuItem.image}
                    alt={menuItem.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <IconSoup size={24} className="text-muted-foreground" />
                  </div>
                )}
                {!menuItem.isAvailable && (
                  <Badge
                    variant="destructive"
                    className="absolute top-2 right-2"
                  >
                    Unavailable
                  </Badge>
                )}
              </div>

              {/* ~ =================================== ~ */}
              {/* -- Content Section -- */}
              {/* ~ =================================== ~ */}
              <div className="space-y-2 p-4">
                <h4 className="line-clamp-1 text-sm font-semibold">
                  {menuItem.name}
                </h4>
                <p className="text-muted-foreground line-clamp-2 text-xs">
                  {menuItem.description || "No description"}
                </p>

                {/* Price section */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-1.5 text-sm">
                    {menuItem.promotionalPrice.amount > 0 ? (
                      <>
                        <span className="font-medium">
                          {formatPrice(menuItem.promotionalPrice)}
                        </span>
                        <span className="text-muted-foreground text-xs line-through">
                          {formatPrice(menuItem.basePrice)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        {formatPrice(menuItem.basePrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`add-menu-item?id=${menuItem._id}`);
                    }}
                  >
                    Edit →
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
