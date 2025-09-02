import {
  IconBug,
  IconDeviceFloppy,
  IconDeviceLaptop,
  IconMessage,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import React from "react";
import { useTheme } from "../providers/theme.provider";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarTrigger } from "../ui/sidebar";

const BrandHubNavbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-[var(--header-height)] w-full items-center justify-between border-b px-4 md:px-6">
      <div>
        <SidebarTrigger className="text-muted-foreground" />
      </div>

      <div className="flex w-max items-center gap-2">
        <Button size="xs" variant="ghost">
          <IconMessage stroke={1.5} />
          <span>Brand Support</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              {theme === "light" && <IconSun />}
              {theme === "dark" && <IconMoon />}
              {theme === "system" && <IconDeviceLaptop />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-28" side="bottom">
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
      </div>
    </div>
  );
};

export default BrandHubNavbar;
