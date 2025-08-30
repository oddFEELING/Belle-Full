import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  IconClipboardText,
  IconSoup,
  IconPennant,
  IconSquareRoundedPercentage,
  IconBubbleText,
  IconShoppingCart,
  IconMessageChatbot,
  IconMushroom,
  IconGrain,
} from "@tabler/icons-react";
import { TabsContent } from "~/components/ui/tabs";
import type { Id } from "convex/_generated/dataModel";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";

interface RestaurantAgentsOverviewTabProps {
  restaurantId: Id<"restaurants">;
}

export const RestaurantAgentsOverviewTab: React.FC<
  RestaurantAgentsOverviewTabProps
> = ({ restaurantId }) => {
  const { data: menuAnalytics, isPending: menuAnalyticsIsPending } =
    useCachedQuery(api.features.menus.functions.menuAnalytics, {
      restaurant: restaurantId,
    });

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <IconGrain
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuAnalytics?.menuCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Total agents in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Total Menu Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <IconMushroom
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {menuAnalytics?.menuItemCount || 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Total active agents in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Active Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Chats</CardTitle>
            <IconMessageChatbot
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-muted-foreground text-xs">
              Total chats with agents.
            </p>
          </CardContent>
        </Card>

        {/* Average Items per Menu Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agent Orders</CardTitle>
            <IconShoppingCart
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-muted-foreground text-xs">
              Total orders placed by agents.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
