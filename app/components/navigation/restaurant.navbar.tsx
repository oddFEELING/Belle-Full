import {
  IconDeviceLaptop,
  IconMessage,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { useTheme } from "../providers/theme.provider";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";
import { UserBubble } from "../popovers/user.bubble.popover";
import { RestaurantHubBreadcrumb } from "./restaurant.hub.breadcrumb";

const RestaurantNavbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex h-[var(--header-height)] w-full items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground" />

        <RestaurantHubBreadcrumb />
      </div>

      <div className="flex w-max items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {theme === "light" && <IconSun />}
              {theme === "dark" && <IconMoon />}
              {theme === "system" && <IconDeviceLaptop />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-28">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <IconSun />
              <span>Light</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <IconMoon />
              <span>Dark</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setTheme("system")}>
              <IconDeviceLaptop />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserBubble />
      </div>
    </div>
  );
};

export default RestaurantNavbar;
