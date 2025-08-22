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
  IconArrowLeft,
  IconBasket,
  IconBowlChopsticks,
  IconBuildingArch,
  IconBuildingStore,
  IconCheck,
  IconClipboardText,
  IconCoinPound,
  IconCooker,
  IconGavel,
  IconGhost2,
  IconHome,
  IconLayoutDashboard,
  IconMapCheck,
  IconPlus,
  IconSettings,
  IconTransactionPound,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { CardCoin } from "iconsax-reactjs";

const RestaurantSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brandId, restaurantId } = useParams();

  // ~ ======= Queries ======= ~
  const { data: brandRestaurants, isPending: brandRestaurantsIsPending } =
    useCachedQuery(
      api.restaurants.functions.getBrandRestaurants,
      brandId ? { brandId: brandId as Id<"brands"> } : "skip",
    );
  const { data: restaurant, isPending: restaurantIsPending } = useCachedQuery(
    api.restaurants.functions.getRestaurant,
    restaurantId ? { id: restaurantId as Id<"restaurants"> } : "skip",
  );

  // ~ ======= Nav paths ======= ~
  const paths = {
    overview: `/brands/${brandId}/restaurants/${restaurantId}`,
    orders: `/brands/${brandId}/restaurants/${restaurantId}/orders`,
    staff: `/brands/${brandId}/restaurants/${restaurantId}/staff`,
    menu: `/brands/${brandId}/restaurants/${restaurantId}/menu`,
    bellebot: `/brands/${brandId}/restaurants/${restaurantId}/bellebot`,
    billing: `/brands/${brandId}/restaurants/${restaurantId}/billing`,
    legalDocuments: `/brands/${brandId}/restaurants/${restaurantId}/legal-documents`,
    transactions: `/brands/${brandId}/restaurants/${restaurantId}/transactions`,
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
                  <IconBuildingStore size={20} strokeWidth={1.5} />
                  {restaurantIsPending ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{restaurant?.name}</span>
                  )}

                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="ring-muted/50 w-[var(--radix-popper-anchor-width)] ring-1">
                {brandRestaurants?.map((restaurant) => (
                  <DropdownMenuItem
                    key={restaurant._id}
                    onClick={() =>
                      navigate(
                        `/brands/${brandId}/restaurants/${restaurant._id}`,
                      )
                    }
                  >
                    <span>{restaurant.name}</span>
                    {restaurant._id === restaurantId && (
                      <IconCheck
                        size={18}
                        strokeWidth={1.5}
                        className="ml-auto"
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
                  onClick={() => navigate(paths.overview)}
                >
                  <IconLayoutDashboard size={20} strokeWidth={1.5} />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Orders ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.orders)}
                  onClick={() => navigate(paths.orders)}
                >
                  <IconClipboardText size={20} strokeWidth={1.5} />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Transactions ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.transactions)}
                  onClick={() => navigate(paths.transactions)}
                >
                  <CardCoin size={20} strokeWidth={1.5} />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Staff  ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.staff)}
                  onClick={() => navigate(paths.staff)}
                >
                  <IconUsers size={20} strokeWidth={1.5} />
                  <span>Staff</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Bellebot ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.bellebot)}
                  onClick={() => navigate(paths.bellebot)}
                >
                  <IconGhost2 />
                  <span>Belle bot</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <span className="bg-destructive h-2 w-2 rounded-full" />
                </SidebarMenuBadge>
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
                  onClick={() => navigate(paths.menu)}
                >
                  <IconBowlChopsticks size={20} strokeWidth={1.5} />
                  <span>Menu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* ~ ======= Transactions ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.transactions)}
                  onClick={() => navigate(paths.transactions)}
                >
                  <IconBasket size={20} strokeWidth={1.5} />
                  <span>Meal prep</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* ~ ======= Manage ======= ~ */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname.includes(paths.billing)}
                  onClick={() => navigate(paths.billing)}
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
                  onClick={() => navigate(paths.legalDocuments)}
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
                  onClick={() => navigate(`/brands/${brandId}/hub`)}
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
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default RestaurantSidebar;
