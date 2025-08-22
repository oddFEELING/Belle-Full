import React, { useState } from "react";
import { TabsContent } from "~/components/ui/tabs";
import type { Id } from "convex/_generated/dataModel";
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
import {
  IconMenu4,
  IconPencilMinus,
  IconPennant,
  IconPlus,
  IconSoup,
  IconTrash,
} from "@tabler/icons-react";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import CreateMenuPanel from "~/components/panels/create.menu.panel";

interface MenusTabProps {
  restaurantId: Id<"restaurants">;
  brandId: Id<"brands">;
}

export const MenusTab: React.FC<MenusTabProps> = ({
  restaurantId,
  brandId,
}) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  const { data: menus, isPending: menusIsPending } = useCachedQuery(
    api.menus.functions.getMenuByRestaurant,
    { restaurant: restaurantId },
  );

  return (
    <>
      <CreateMenuPanel
        open={createMenuOpen}
        onOpenChange={setCreateMenuOpen}
        brand={brandId}
        restaurant={restaurantId}
      />
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
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
              Get started by creating your first menu. You can add and customise
              menu items, and add images to your menu.
            </p>
            <Button size="lg" onClick={() => setCreateMenuOpen(true)}>
              <IconPlus size={16} />
              Create Your First Menu
            </Button>
          </div>
        )}
      </TabsContent>
    </>
  );
};
