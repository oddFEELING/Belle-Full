import {
  IconGrain,
  IconMessageChatbot,
  IconMushroom,
  IconShoppingCart,
} from "@tabler/icons-react";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TabsContent } from "~/components/ui/tabs";
import { useCachedQuery } from "~/hooks/use-app-query";

interface RestaurantAgentsOverviewTabProps {
  restaurantId: Id<"restaurants">;
}

export const RestaurantAgentsOverviewTab: React.FC<
  RestaurantAgentsOverviewTabProps
> = ({ restaurantId }) => {
  const { data: menuAnalytics } = useCachedQuery(
    api.features.menus.functions.menuAnalytics,
    {
      restaurant: restaurantId,
    }
  );

  return (
    <TabsContent value="overview">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Agents</CardTitle>
            <IconGrain
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
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
            <CardTitle className="font-medium text-sm">Active Agents</CardTitle>
            <IconMushroom
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
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
            <CardTitle className="font-medium text-sm">Agent Chats</CardTitle>
            <IconMessageChatbot
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">4</div>
            <p className="text-muted-foreground text-xs">
              Total chats with agents.
            </p>
          </CardContent>
        </Card>

        {/* Average Items per Menu Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Agent Orders</CardTitle>
            <IconShoppingCart
              className="text-muted-foreground"
              size={18}
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">21</div>
            <p className="text-muted-foreground text-xs">
              Total orders placed by agents.
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
