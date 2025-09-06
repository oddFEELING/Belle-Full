import {
  IconArrowLeft,
  IconBasket,
  IconBowlChopsticks,
  IconBuildingStore,
  IconCheck,
  IconClipboardText,
  IconGavel,
  IconGhost2,
  IconLayoutDashboard,
  IconMapCheck,
  IconPlus,
  IconRobot,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { CardCoin } from "iconsax-reactjs";
import { ChevronDown } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCachedQuery } from "~/hooks/use-app-query";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "../ui/sidebar";

const RestaurantSidebar = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { brandId, restaurantId } = useParams();
  const { toggleSidebar } = useSidebar();

  // ~ ======= Queries ======= ~
  const { data: brandRestaurants } = useCachedQuery(
    api.features.restaurants.functions.getBrandRestaurants,
    brandId ? { brandId: brandId as Id<"brands"> } : "skip"
  );
  const { data: restaurant, isPending: restaurantIsPending } = useCachedQuery(
    api.features.restaurants.functions.getRestaurant,
    restaurantId ? { id: restaurantId as Id<"restaurants"> } : "skip"
  );

  const handleToggleSidebar = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  // ~ ======= Nav paths ======= ~
  const paths = {
    overview: `/brands/${brandId}/restaurants/${restaurantId}`,
    orders: `/brands/${brandId}/restaurants/${restaurantId}/orders`,
    staff: `/brands/${brandId}/restaurants/${restaurantId}/staff`,
    menu: `/brands/${brandId}/restaurants/${restaurantId}/menu`,
    bellebot: `/brands/${brandId}/restaurants/${restaurantId}/bellebot`,
    agents: `/brands/${brandId}/restaurants/${restaurantId}/agents`,
    billing: `/brands/${brandId}/restaurants/${restaurantId}/billing`,
    legalDocuments: `/brands/${brandId}/restaurants/${restaurantId}/legal-documents`,
    transactions: `/brands/${brandId}/restaurants/${restaurantId}/transactions`,
  };

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* ~ =================================== ~ */}
      {/* -- Header -- */}
      {/* ~ =================================== ~ */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <IconBuildingStore size={20} strokeWidth={1.5} />
                  {restaurantIsPending ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{restaurant?.name}</span>
                  )}

                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)] ring-1 ring-muted/50">
                {brandRestaurants?.map((restaurant) => (
                  <DropdownMenuItem
                    key={restaurant._id}
                    onClick={() =>
                      navigate(
                        `/brands/${brandId}/restaurants/${restaurant._id}`
                      )
                    }
                  >
                    <span>{restaurant.name}</span>
                    {restaurant._id === restaurantId && (
                      <IconCheck
                        className="ml-auto"
                        size={18}
                        strokeWidth={1.5}
                      />
                    )}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconPlus size={18} strokeWidth={1.5} />
                  <span>Create Restaurant</span>
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
              {/* ~ ======= Overview ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === paths.overview}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.overview);
                  }}
                >
                  <IconLayoutDashboard size={20} strokeWidth={1.5} />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Orders ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.orders)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.orders);
                  }}
                >
                  <IconClipboardText size={20} strokeWidth={1.5} />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Transactions ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.transactions)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.transactions);
                  }}
                >
                  <CardCoin size={20} strokeWidth={1.5} />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Staff  ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.staff)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.staff);
                  }}
                >
                  <IconUsers size={20} strokeWidth={1.5} />
                  <span>Staff</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Bellebot ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.bellebot)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.bellebot);
                  }}
                >
                  <IconGhost2 />
                  <span>Belle bot</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                </SidebarMenuBadge>
              </SidebarMenuItem>

              {/* ~ ======= Agents ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.agents)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.agents);
                  }}
                >
                  <IconRobot />
                  <span>Agents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Restaurant</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* ~ ======= Menu ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.menu)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.menu);
                  }}
                >
                  <IconBowlChopsticks size={20} strokeWidth={1.5} />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Transactions ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.transactions)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.transactions);
                  }}
                >
                  <IconBasket size={20} strokeWidth={1.5} />
                  <span>Meal prep</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* ~ ======= Manage ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.billing)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.billing);
                  }}
                >
                  <IconWallet size={20} strokeWidth={1.5} />
                  <span>Billing</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Delivery zones ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IconMapCheck size={20} strokeWidth={1.5} />
                  <span>Delivery Zones</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Legal documents ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.legalDocuments)}
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(paths.legalDocuments);
                  }}
                >
                  <IconGavel size={20} strokeWidth={1.5} />
                  <span>Legal Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Brand</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    handleToggleSidebar();
                    navigate(`/brands/${brandId}/hub`);
                  }}
                >
                  <IconArrowLeft size={20} strokeWidth={1.5} />
                  <span>Brand Hub</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ~ =================================== ~ */}
      {/* -- Footer -- */}
      {/* ~ =================================== ~ */}
      <SidebarFooter />
    </Sidebar>
  );
};

export default RestaurantSidebar;
