import {
  IconCategoryPlus,
  IconChefHat,
  IconChevronDown,
  IconClipboardText,
  IconFolders,
  IconSoup,
  IconTransitionRight,
} from "@tabler/icons-react";
import type { Id } from "convex/_generated/dataModel";
import { useQueryState } from "nuqs";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { CategoriesTab } from "./partials/category.tab";
import { MenuItemsTab } from "./partials/menu.items.tab";
import { MenusTab } from "./partials/menus.tab";
import { OverviewTab } from "./partials/overview.tab";

const RestaurantMenu = () => {
  const brandId = useParams().brandId as Id<"brands">;
  const restaurantId = useParams().restaurantId as Id<"restaurants">;
  const [activeTab, setActiveTab] = useQueryState("activeTab", {
    defaultValue: "overview",
  });

  return (
    <div className="restaurant-dashboard--page">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl">My Menus</h2>
          <p className="max-w-2xl text-muted-foreground">
            Manage the menus for your restaurant. Create, edit, and organize
            your menu offerings.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              <span className="hidden sm:block">Actions</span>
              <IconChevronDown size={16} strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <IconFolders
                className="text-muted-foreground"
                size={18}
                strokeWidth={1.5}
              />
              <span>Copy Menu</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconTransitionRight
                className="text-muted-foreground"
                size={18}
                strokeWidth={1.5}
              />
              <span>Make Active</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="mt-2 mb-3 w-full max-w-2xl">
          <TabsList className="h-max w-full bg-muted">
            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="overview"
            >
              <IconChefHat
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Overview
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="menus"
            >
              <IconClipboardText
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Menus
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="categories"
            >
              <IconCategoryPlus
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Categories
              </span>
            </TabsTrigger>

            <TabsTrigger
              className="dark:data-[state=active]:bg-accent"
              value="menu-items"
            >
              <IconSoup
                className="dark:text-foreground/60"
                size={16}
                strokeWidth={1.5}
              />
              <span className="hidden sm:block dark:text-foreground/60">
                Menu Items
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <OverviewTab restaurantId={restaurantId} />
        <MenusTab brandId={brandId} restaurantId={restaurantId} />
        <CategoriesTab restaurantId={restaurantId} />
        <MenuItemsTab restaurantId={restaurantId} />
      </Tabs>
    </div>
  );
};

export default RestaurantMenu;
