import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "../providers/theme.provider";
import {
  IconMoon,
  IconDeviceFloppy,
  IconSun,
  IconDeviceLaptop,
  IconBug,
  IconMessage,
} from "@tabler/icons-react";

const BrandHubNavbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-[var(--header-height)] w-full items-center justify-between border-b px-4 md:px-6">
      <div>
        <SidebarTrigger className="text-muted-foreground" />
      </div>

      <div className="flex w-max items-center gap-2">
        <Button variant="ghost" size="xs">
          <IconMessage stroke={1.5} />
          <span>Brand Support</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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
      </div>
    </div>
  );
};

export default BrandHubNavbar;
