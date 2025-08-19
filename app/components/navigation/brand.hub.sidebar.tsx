import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  IconBuildingStore,
  IconBurger,
  IconChefHat,
  IconLayoutDashboard,
  IconPlus,
  IconSettings,
  IconSofa,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

const BrandHubSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandId } = useParams();
  const { data: brand, isPending: brandIsPending } = useCachedQuery(
    api.brands.functions.getBrand,
    brandId ? { id: brandId as Id<"brands"> } : "skip",
  );

  const paths = {
    hub: `/brands/${brandId}/hub`,
    restaurants: `/brands/${brandId}/hub/restaurants`,
    people: `/brands/${brandId}/hub/people`,
    manage: `/brands/${brandId}/hub/manage`,
    aiDescription: `/brands/${brandId}/hub/ai-description`,
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <IconLayoutDashboard strokeWidth={2} size={20} />
                  {brandIsPending ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{brand?.name}</span>
                  )}

                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconPlus size={18} strokeWidth={1.5} />
                  <span>Create Brand</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ~ =================================== ~ */}
      {/* -- Content -- */}
      {/* ~ =================================== ~ */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* ~ ======= Hub ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === paths.hub}
                  onClick={() => navigate(paths.hub)}
                >
                  <IconSofa size={20} strokeWidth={1.5} />
                  <span>Hub</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Restaurants ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.restaurants)}
                  onClick={() => navigate(paths.restaurants)}
                >
                  <IconBuildingStore size={20} strokeWidth={1.5} />
                  <span>Restaurants</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= People  ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.people)}
                  onClick={() => navigate(paths.people)}
                >
                  <IconUsers size={20} strokeWidth={1.5} />
                  <span>People</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* ~ ======= Manage ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.manage)}
                  onClick={() => navigate(paths.manage)}
                >
                  <IconSettings size={20} strokeWidth={1.5} />
                  <span>Manage</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= AI description ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.aiDescription)}
                  onClick={() => navigate(paths.aiDescription)}
                >
                  <IconSparkles />
                  <span>AI Description</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <span className="bg-destructive h-2 w-2 rounded-full" />
                </SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default BrandHubSidebar;
