import {
  IconAlertCircle,
  IconPhoto,
  IconPlus,
  IconSoup,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type React from "react";
import { useNavigate, useParams } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";
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
    { restaurant: restaurantId }
  );

  // Loading skeleton component
  const MenuItemSkeleton = () => (
    <div className="overflow-hidden rounded-lg border bg-card">
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
    <TabsContent className="space-y-6" value="menu-items">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">All Menu Items</h3>
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
            className="mb-4 text-muted-foreground"
            size={40}
            strokeWidth={1.5}
          />
          <h3 className="mb-2 font-medium text-lg">No menu items yet</h3>
          <p className="mb-6 max-w-sm text-center text-muted-foreground">
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
              className={cn(
                "group cursor-pointer overflow-hidden rounded-lg border bg-card transition-all duration-300 ease-out hover:shadow-md",
                !menuItem.isAvailable && "opacity-60"
              )}
              key={menuItem._id}
              onClick={() => navigate(`add-menu-item?id=${menuItem._id}`)}
            >
              {/* ~ ======= Compact image section - flush with top ======= ~ */}
              <div className="relative h-24 overflow-hidden bg-muted">
                {menuItem.image ? (
                  <img
                    alt={menuItem.name}
                    className="h-full w-full object-cover"
                    src={menuItem.image}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <IconSoup className="text-muted-foreground" size={24} />
                  </div>
                )}
                {!menuItem.isAvailable && (
                  <Badge
                    className="absolute top-2 right-2"
                    variant="destructive"
                  >
                    Unavailable
                  </Badge>
                )}
              </div>

              {/* ~ =================================== ~ */}
              {/* -- Content Section -- */}
              {/* ~ =================================== ~ */}
              <div className="space-y-2 p-4">
                <h4 className="line-clamp-1 font-semibold text-sm">
                  {menuItem.name}
                </h4>
                <p className="line-clamp-2 text-muted-foreground text-xs">
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
                    className="h-auto p-0 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`add-menu-item?id=${menuItem._id}`);
                    }}
                    size="sm"
                    variant="link"
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
