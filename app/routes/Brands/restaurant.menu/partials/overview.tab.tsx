import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  IconClipboardText,
  IconSoup,
  IconPennant,
  IconSquareRoundedPercentage,
} from "@tabler/icons-react";
import { TabsContent } from "~/components/ui/tabs";
import type { Id } from "convex/_generated/dataModel";
import { useCachedQuery } from "~/hooks/use-app-query";
import { api } from "convex/_generated/api";

interface OverviewTabProps {
  restaurantId: Id<"restaurants">;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ restaurantId }) => {
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
            <CardTitle className="text-sm font-medium">Total Menus</CardTitle>
            <IconClipboardText
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
              Total menus in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Total Menu Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
            <IconSoup
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
              Total menu items in this restaurant
            </p>
          </CardContent>
        </Card>

        {/* Active Menus Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Menus</CardTitle>
            <IconPennant
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-muted-foreground text-xs">
              Currently published menus
            </p>
          </CardContent>
        </Card>

        {/* Average Items per Menu Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Items/Menu
            </CardTitle>
            <IconSquareRoundedPercentage
              size={18}
              className="text-muted-foreground"
              strokeWidth={1.5}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-muted-foreground text-xs">
              Average items per menu
            </p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};
