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
import { OverviewTab } from "./partials/overview.tab";
import { MenusTab } from "./partials/menus.tab";
import { MenuItemsTab } from "./partials/menu.items.tab";
import { CategoriesTab } from "./partials/category.tab";

const RestaurantMenu = () => {
  const brandId = useParams().brandId as Id<"brands">;
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const [activeTab, setActiveTab] = useQueryState("activeTab", {
    defaultValue: "overview",
  });
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  return (
    <div className="restaurant-dashboard--page">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Menus</h2>
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
        <div className="mt-2 mb-3 w-full max-w-2xl">
          <TabsList className="bg-muted h-max w-full">
            <TabsTrigger
              value="overview"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconChefHat
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Overview
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="menus"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconClipboardText
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Menus
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="categories"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconCategoryPlus
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Categories
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="menu-items"
              className="dark:data-[state=active]:bg-accent"
            >
              <IconSoup
                size={16}
                strokeWidth={1.5}
                className="dark:text-foreground/60"
              />
              <span className="dark:text-foreground/60 hidden sm:block">
                Menu Items
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <OverviewTab restaurantId={restaurantId} />
        <MenusTab restaurantId={restaurantId} brandId={brandId} />
        <CategoriesTab restaurantId={restaurantId} />
        <MenuItemsTab restaurantId={restaurantId} />
      </Tabs>
    </div>
  );
};

export default RestaurantMenu;
