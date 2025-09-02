import {
  IconMenu4,
  IconNotesOff,
  IconPencilMinus,
  IconPennant,
  IconPlus,
  IconSoup,
  IconTrash,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import CreateMenuPanel from "~/components/panels/create.menu.panel";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface MenusTabProps {
  restaurantId: Id<"restaurants">;
  brandId: Id<"brands">;
}

export const MenusTab: React.FC<MenusTabProps> = ({
  restaurantId,
  brandId,
}) => {
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: menus, isPending: menusIsPending } = useCachedQuery(
    api.features.menus.functions.getMenuByRestaurant,
    { restaurant: restaurantId }
  );

  return (
    <>
      <CreateMenuPanel
        brand={brandId}
        onOpenChange={setCreateMenuOpen}
        open={createMenuOpen}
        restaurant={restaurantId}
      />
      <TabsContent value="menus">
        {/* Menu Cards Grid */}
        {menus && menus.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menus.map((menu) => (
              <Card
                className="group ring-primary/30 transition-all duration-300 ease-out hover:ring-1"
                key={menu._id}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      <span> {menu.name}</span>
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="h-8 w-8" size="icon" variant="ghost">
                          <IconMenu4 size={16} strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          disabled={menu.approvalStatus !== "APPROVED"}
                        >
                          <IconPennant
                            className="mr-2"
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span>Make active</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPencilMinus
                            className="mr-2"
                            size={16}
                            strokeWidth={1.5}
                          />
                          <span> Edit Menu</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive dark:text-foreground">
                          <IconTrash
                            className="mr-2"
                            size={16}
                            strokeWidth={1.5}
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
                  <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <span>0 items</span>
                    <Button className="h-auto p-0" size="sm" variant="link">
                      View Items →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div
              className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-muted-foreground transition-all duration-200 ease-out hover:cursor-pointer hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              onClick={() => setCreateMenuOpen(true)}
            >
              <span className="rounded-md bg-muted/50 p-1.5">
                <IconPlus size={25} strokeWidth={1.5} />
              </span>

              <span className="mb-6 max-w-sm cursor-auto select-none text-center">
                Add new menu
              </span>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center rounded-xl border-2 border-dashed px-4 py-10">
            <IconNotesOff
              className="mb-b text-muted-foreground"
              size={40}
              strokeWidth={1.5}
            />
            <h3 className="mb-2 font-medium text-lg">No menus created yet</h3>
            <p className="mb-6 max-w-sm text-center text-muted-foreground">
              Get started by creating your first menu. You can add menu items
              after creating a menu.
            </p>
            <Button onClick={() => setCreateMenuOpen(true)} size="lg">
              <IconPlus size={16} />
              Create Your First Menu
            </Button>
          </div>
        )}
      </TabsContent>
    </>
  );
};
