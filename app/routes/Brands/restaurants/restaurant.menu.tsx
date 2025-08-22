import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import {
  IconAdjustmentsBolt,
  IconCategoryPlus,
  IconChefHat,
  IconChevronDown,
  IconClipboardText,
  IconFolders,
  IconMenu4,
  IconPencilMinus,
  IconPennant,
  IconPercentage,
  IconPlus,
  IconSoup,
  IconSquareRoundedPercentage,
  IconTransitionRight,
  IconTrash,
} from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useQueryState } from "nuqs";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import { useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import CreateMenuPanel from "~/components/panels/create.menu.panel";

const RestaurantMenu = () => {
  const brandId = useParams().brandId as Id<"brands">;
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const [activeTab, setActiveTab] = useQueryState("activeTab", {
    defaultValue: "overview",
  });
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  // ~ ======= QUeries ======= ~
  const { data: menus, isPending: menusIsPending } = useCachedQuery(
    api.menus.functions.getMenuByRestaurant,
    { restaurant: restaurantId },
  );
  const { data: menuAnalytics, isPending: menuAnalyticsIsPending } =
    useCachedQuery(api.menus.functions.menuAnalytics, {
      restaurant: restaurantId,
    });

  return (
    <div className="restaurant-dashboard--page">
      <CreateMenuPanel
        open={createMenuOpen}
        onOpenChange={setCreateMenuOpen}
        brand={brandId}
        restaurant={restaurantId}
      />
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Restaurant Menus</h2>
          <p className="text-muted-foreground max-w-2xl">
            Manage the menus for your restaurant. Create, edit, and organize
            your menu offerings.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <span className="hidden sm:block">Actions</span>
              <IconChevronDown size={16} strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <IconFolders
                size={18}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
              <span>Copy Menu</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconTransitionRight
                size={18}
                strokeWidth={1.5}
                className="text-muted-foreground"
              />
              <span>Make Active</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="mt-2 mb-3 w-full max-w-lg">
          <TabsList className="bg-muted h-max w-full px-2">
            <TabsTrigger
              value="overview"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconChefHat size={16} strokeWidth={1.5} />
              <span className="hidden sm:block">Overview</span>
            </TabsTrigger>

            <TabsTrigger
              value="menus"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconClipboardText size={16} strokeWidth={1.5} />
              <span className="hidden sm:block">Menus</span>
            </TabsTrigger>

            <TabsTrigger
              value="categories"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconCategoryPlus size={16} strokeWidth={1.5} />
              <span className="hidden sm:block">Categories</span>
            </TabsTrigger>

            <TabsTrigger
              value="menu-items"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconSoup size={16} strokeWidth={1.5} />
              <span className="hidden sm:block">Menu Items</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Menus Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Menus
                </CardTitle>
                <IconClipboardText
                  size={18}
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {menuAnalytics?.menuCount || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Total menus in this restaurant
                </p>
              </CardContent>
            </Card>

            {/* Total Menu Items Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Menu Items
                </CardTitle>
                <IconSoup
                  size={18}
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {menuAnalytics?.menuItemCount || 0}
                </div>
                <p className="text-muted-foreground text-xs">
                  Total menu items in this restaurant
                </p>
              </CardContent>
            </Card>

            {/* Active Menus Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Menus
                </CardTitle>
                <IconPennant
                  size={18}
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-muted-foreground text-xs">
                  Currently published menus
                </p>
              </CardContent>
            </Card>

            {/* Average Items per Menu Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Items/Menu
                </CardTitle>
                <IconSquareRoundedPercentage
                  size={18}
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21</div>
                <p className="text-muted-foreground text-xs">
                  Average items per menu
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menus">
          {/* Menu Cards Grid */}
          {menus && menus.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {menus.map((menu) => (
                <Card
                  key={menu._id}
                  className="ring-primary/30 group transition-all duration-300 ease-out hover:ring-1"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        <span> {menu.name}</span>
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <IconMenu4 size={16} strokeWidth={1.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <IconPennant
                              size={16}
                              strokeWidth={1.5}
                              className="mr-2"
                            />
                            <span>Make active</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <IconPencilMinus
                              size={16}
                              strokeWidth={1.5}
                              className="mr-2"
                            />
                            <span> Edit Menu</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive dark:text-foreground">
                            <IconTrash
                              size={16}
                              strokeWidth={1.5}
                              className="mr-2"
                            />
                            <span> Delete Menu</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <CardDescription className="mt-2 line-clamp-2">
                      {menu.description || "No description available"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="justify-between">
                    <div className="text-muted-foreground flex items-center justify-between text-sm">
                      <span>0 items</span>
                      <Button variant="link" size="sm" className="h-auto p-0">
                        View Items →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div
                onClick={() => setCreateMenuOpen(true)}
                className="text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/40 flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all duration-200 ease-out hover:cursor-pointer"
              >
                <span className="bg-muted/50 rounded-md p-1.5">
                  <IconPlus size={25} strokeWidth={1.5} />
                </span>

                <span className="mb-6 max-w-sm cursor-auto text-center select-none">
                  Add new menu
                </span>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
              <IconSoup
                size={40}
                strokeWidth={1.5}
                className="mb-b text-muted-foreground"
              />
              <h3 className="mb-2 text-lg font-medium">No menus created yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Get started by creating your first menu. You can add and
                customise menu items, and add images to your menu.
              </p>
              <Button size="lg" onClick={() => setCreateMenuOpen(true)}>
                <Plus size={16} />
                Create Your First Menu
              </Button>
            </div>
          )}
        </TabsContent>

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
      </Tabs>
    </div>
  );
};

export default RestaurantMenu;
